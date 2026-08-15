import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  type Chain,
  type Hex,
} from "viem";
import { base, mainnet, polygon } from "viem/chains";

export type WizardChain = "base" | "polygon" | "ethereum";

export type TokenWizardDraft = {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  chain: WizardChain;
};

export const CHAIN_META: Record<
  WizardChain,
  {
    label: string;
    chain: Chain;
    hint: string;
    explorer: string;
    remixVmHint: string;
  }
> = {
  base: {
    label: "Base (L2)",
    chain: base,
    hint: "Low gas fees",
    explorer: "https://basescan.org",
    remixVmHint: "Injected Provider → Base",
  },
  polygon: {
    label: "Polygon",
    chain: polygon,
    hint: "EVM-compatible L2",
    explorer: "https://polygonscan.com",
    remixVmHint: "Injected Provider → Polygon",
  },
  ethereum: {
    label: "Ethereum",
    chain: mainnet,
    hint: "Mainnet — higher gas",
    explorer: "https://etherscan.io",
    remixVmHint: "Injected Provider → Ethereum Mainnet",
  },
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function getInjectedEthereum() {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export function isLiveDeployEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_LIVE_DEPLOY === "true";
}

export function getConfiguredBytecode(): Hex | undefined {
  const bytecode = process.env.NEXT_PUBLIC_ERC20_BYTECODE as Hex | undefined;
  if (!bytecode || bytecode === "0x") return undefined;
  return bytecode;
}

function toHexChainId(id: number): Hex {
  return `0x${id.toString(16)}` as Hex;
}

/** Ask the wallet to switch (or add) the wizard’s selected chain. */
export async function ensureWalletChain(chainKey: WizardChain): Promise<void> {
  const ethereum = getInjectedEthereum();
  if (!ethereum) {
    throw new Error(
      "No wallet detected. Install MetaMask or another injected wallet."
    );
  }
  const { chain } = CHAIN_META[chainKey];
  const hexId = toHexChainId(chain.id);
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexId }],
    });
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? Number((err as { code: number }).code)
        : 0;
    // 4902 = unrecognized chain — attempt to add
    if (code === 4902 || code === -32603) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexId,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: chain.rpcUrls.default.http,
            blockExplorerUrls: chain.blockExplorers
              ? [chain.blockExplorers.default.url]
              : undefined,
          },
        ],
      });
      return;
    }
    throw err instanceof Error
      ? err
      : new Error("Could not switch wallet network.");
  }
}

export async function connectMetaMask(preferredChain?: WizardChain): Promise<{
  address: Hex;
  chainId: number;
}> {
  const ethereum = getInjectedEthereum();
  if (!ethereum) {
    throw new Error(
      "No wallet detected. Install MetaMask or another injected wallet."
    );
  }
  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts[0]) throw new Error("Wallet connection rejected.");

  if (preferredChain) {
    await ensureWalletChain(preferredChain);
  }

  const chainIdHex = (await ethereum.request({
    method: "eth_chainId",
  })) as string;
  return {
    address: accounts[0] as Hex,
    chainId: Number.parseInt(chainIdHex, 16),
  };
}

export async function readNativeBalance(
  chain: WizardChain,
  address: Hex
): Promise<string> {
  const ethereum = getInjectedEthereum();
  if (!ethereum) return "—";
  const publicClient = createPublicClient({
    chain: CHAIN_META[chain].chain,
    transport: custom(ethereum),
  });
  const bal = await publicClient.getBalance({ address });
  return formatEther(bal);
}

/** Whole-token supply × 10^decimals as a decimal string (for Solidity). */
export function initialSupplyWei(draft: TokenWizardDraft): string {
  const whole = BigInt(
    Math.max(0, Math.floor(Number(draft.totalSupply) || 0))
  );
  return (whole * BigInt(10) ** BigInt(draft.decimals)).toString();
}

/** Remix-ready ERC-20 source generated from the wizard draft. */
export function buildErc20Solidity(draft: TokenWizardDraft): string {
  const name = draft.name.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const symbol = draft.symbol.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const supply = initialSupplyWei(draft);

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal ERC-20 generated by CalculioHub Token Creator.
/// @dev Audit before mainnet use. Prefer OpenZeppelin for production.
contract ${sanitizeContractName(draft.symbol)} {
    string public name = "${name}";
    string public symbol = "${symbol}";
    uint8 public immutable decimals;
    uint256 public immutable totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        decimals = ${draft.decimals};
        totalSupply = ${supply};
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= value, "ALLOWANCE");
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - value;
        }
        _transfer(from, to, value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0), "ZERO");
        uint256 bal = balanceOf[from];
        require(bal >= value, "BALANCE");
        unchecked {
            balanceOf[from] = bal - value;
            balanceOf[to] += value;
        }
        emit Transfer(from, to, value);
    }
}
`;
}

function sanitizeContractName(symbol: string): string {
  const cleaned = symbol.replace(/[^A-Za-z0-9_]/g, "");
  const base = cleaned.length >= 1 ? cleaned : "Token";
  return /^[A-Za-z_]/.test(base) ? `Token${base}` : `Token_${base}`;
}

export function remixIdeUrl(): string {
  return "https://remix.ethereum.org";
}

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Deploy scaffold using constructor args.
 * Live bytecode deploy only when NEXT_PUBLIC_ENABLE_LIVE_DEPLOY=true and bytecode is set.
 * Bytecode must match a constructor(string name, string symbol).
 */
export async function deployErc20Scaffold(
  draft: TokenWizardDraft,
  account: Hex
): Promise<{ mode: "demo" | "live"; txHash?: Hex; detail: string }> {
  const live = isLiveDeployEnabled();
  const bytecode = getConfiguredBytecode();
  const mintAmount = initialSupplyWei(draft);

  const argsSummary = [
    `name=${draft.name}`,
    `symbol=${draft.symbol}`,
    `decimals=${draft.decimals}`,
    `initialSupply=${mintAmount}`,
    `owner=${account}`,
    `chain=${draft.chain}`,
  ].join(", ");

  if (!live || !bytecode) {
    return {
      mode: "demo",
      detail: `Config ready (${argsSummary}). Live wallet deploy is off — download the Solidity file and deploy via Remix, or set NEXT_PUBLIC_ENABLE_LIVE_DEPLOY=true plus NEXT_PUBLIC_ERC20_BYTECODE (constructor string,string).`,
    };
  }

  const ethereum = getInjectedEthereum();
  if (!ethereum) throw new Error("Wallet not available.");

  await ensureWalletChain(draft.chain);

  const walletClient = createWalletClient({
    account,
    chain: CHAIN_META[draft.chain].chain,
    transport: custom(ethereum),
  });

  const hash = await walletClient.deployContract({
    abi: [
      {
        type: "constructor",
        inputs: [
          { name: "name_", type: "string" },
          { name: "symbol_", type: "string" },
        ],
        stateMutability: "nonpayable",
      },
    ],
    bytecode,
    args: [draft.name, draft.symbol],
  });

  return {
    mode: "live",
    txHash: hash,
    detail: `Deploy transaction submitted: ${hash}`,
  };
}
