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
  { label: string; chain: Chain; hint: string }
> = {
  base: { label: "Base (L2)", chain: base, hint: "Low gas fees" },
  polygon: { label: "Polygon", chain: polygon, hint: "EVM-compatible L2" },
  ethereum: { label: "Ethereum", chain: mainnet, hint: "Mainnet — higher gas" },
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function getInjectedEthereum() {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export async function connectMetaMask(): Promise<{
  address: Hex;
  chainId: number;
}> {
  const ethereum = getInjectedEthereum();
  if (!ethereum) {
    throw new Error("No wallet detected. Install MetaMask or another injected wallet.");
  }
  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts[0]) throw new Error("Wallet connection rejected.");
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

/**
 * Deploy scaffold using OpenZeppelin-style constructor args.
 * Live bytecode deploy only when NEXT_PUBLIC_ENABLE_LIVE_DEPLOY=true and bytecode is set.
 */
export async function deployErc20Scaffold(
  draft: TokenWizardDraft,
  account: Hex
): Promise<{ mode: "demo" | "live"; txHash?: Hex; detail: string }> {
  const live = process.env.NEXT_PUBLIC_ENABLE_LIVE_DEPLOY === "true";
  const bytecode = process.env.NEXT_PUBLIC_ERC20_BYTECODE as Hex | undefined;
  const supply = BigInt(
    Math.max(0, Math.floor(Number(draft.totalSupply) || 0))
  );
  const mintAmount = supply * BigInt(10) ** BigInt(draft.decimals);

  const argsSummary = [
    `name=${draft.name}`,
    `symbol=${draft.symbol}`,
    `decimals=${draft.decimals}`,
    `initialSupply=${mintAmount.toString()}`,
    `owner=${account}`,
    `chain=${draft.chain}`,
  ].join(", ");

  if (!live || !bytecode || bytecode === "0x") {
    return {
      mode: "demo",
      detail: `Demo deploy prepared (${argsSummary}). Set NEXT_PUBLIC_ENABLE_LIVE_DEPLOY=true and NEXT_PUBLIC_ERC20_BYTECODE to send a real transaction with an OpenZeppelin ERC-20 artifact.`,
    };
  }

  const ethereum = getInjectedEthereum();
  if (!ethereum) throw new Error("Wallet not available.");

  const walletClient = createWalletClient({
    account,
    chain: CHAIN_META[draft.chain].chain,
    transport: custom(ethereum),
  });

  // Minimal placeholder: expects bytecode that matches constructor (string,string) or your artifact.
  // Replace with your compiled OpenZeppelin ERC20 ABI + bytecode before enabling live mode.
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
