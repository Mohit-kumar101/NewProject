"use client";

import { useMemo, useState } from "react";
import type { Hex } from "viem";
import {
  CHAIN_META,
  connectMetaMask,
  deployErc20Scaffold,
  type TokenWizardDraft,
  type WizardChain,
} from "@/lib/monetization/tokenDeploy";

const STEPS = ["Details", "Chain", "Review", "Deploy"] as const;

const initial: TokenWizardDraft = {
  name: "Demo Token",
  symbol: "DEMO",
  totalSupply: "1000000000",
  decimals: 18,
  chain: "base",
};

export function TokenCreatorWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<TokenWizardDraft>(initial);
  const [address, setAddress] = useState<Hex | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const validDetails = useMemo(() => {
    return (
      draft.name.trim().length >= 2 &&
      /^[A-Z0-9]{2,11}$/i.test(draft.symbol.trim()) &&
      Number(draft.totalSupply) > 0 &&
      draft.decimals >= 0 &&
      draft.decimals <= 18
    );
  }, [draft]);

  const connect = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const res = await connectMetaMask();
      setAddress(res.address);
      setChainId(res.chainId);
      setStatus(`Connected ${res.address.slice(0, 6)}…${res.address.slice(-4)}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Wallet connect failed.");
    } finally {
      setBusy(false);
    }
  };

  const deploy = async () => {
    if (!address) {
      setStatus("Connect a wallet first.");
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const result = await deployErc20Scaffold(draft, address);
      setStatus(
        result.mode === "demo"
          ? result.detail
          : `${result.detail}${result.txHash ? ` (${result.txHash})` : ""}`
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Deploy failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ol className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                i === step
                  ? "bg-[var(--accent)] text-[#041018]"
                  : "border border-[var(--border)] text-[var(--muted)]"
              }`}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {step === 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Token details</h2>
            <label className="block text-sm">
              <span className="text-[var(--muted)]">Token name</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[var(--muted)]">Symbol</span>
              <input
                value={draft.symbol}
                onChange={(e) =>
                  setDraft({ ...draft, symbol: e.target.value.toUpperCase() })
                }
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[var(--muted)]">Total supply</span>
              <input
                value={draft.totalSupply}
                onChange={(e) =>
                  setDraft({ ...draft, totalSupply: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[var(--muted)]">Decimals</span>
              <input
                type="number"
                min={0}
                max={18}
                value={draft.decimals}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    decimals: Math.min(18, Math.max(0, Number(e.target.value) || 0)),
                  })
                }
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              />
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Target blockchain</h2>
            <div className="grid gap-3">
              {(Object.keys(CHAIN_META) as WizardChain[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDraft({ ...draft, chain: key })}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    draft.chain === key
                      ? "border-[var(--accent)] bg-[var(--background)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <div className="font-semibold">{CHAIN_META[key].label}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {CHAIN_META[key].hint}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Review</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
                <dt className="text-[var(--muted)]">Name</dt>
                <dd className="font-semibold">{draft.name}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
                <dt className="text-[var(--muted)]">Symbol</dt>
                <dd className="font-semibold">{draft.symbol}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
                <dt className="text-[var(--muted)]">Supply</dt>
                <dd className="font-semibold">{draft.totalSupply}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
                <dt className="text-[var(--muted)]">Decimals</dt>
                <dd className="font-semibold">{draft.decimals}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-[var(--muted)]">Chain</dt>
                <dd className="font-semibold">{CHAIN_META[draft.chain].label}</dd>
              </div>
            </dl>
            <p className="text-sm text-[var(--accent)]">
              Ready to deploy — continue to connect a wallet.
            </p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Wallet & deploy</h2>
            <p className="text-sm text-[var(--muted)]">
              Uses MetaMask / injected wallets via viem. Live deploy is off
              unless you set env flags.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void connect()}
                className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
              >
                {address ? "Reconnect wallet" : "Connect MetaMask"}
              </button>
              <button
                type="button"
                disabled={busy || !address}
                onClick={() => void deploy()}
                className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#041018] disabled:opacity-50"
              >
                {busy ? "Working…" : "Prepare / deploy ERC-20"}
              </button>
            </div>
            {address ? (
              <p className="text-xs text-[var(--muted)]">
                Account {address}
                {chainId != null ? ` · chainId ${chainId}` : ""}
              </p>
            ) : null}
            {status ? (
              <p className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs leading-relaxed">
                {status}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            disabled={step === STEPS.length - 1 || (step === 0 && !validDetails)}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041018] disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--muted)]">
        Smart contract deployment involves irreversible on-chain risk. This
        wizard is a scaffolding UI—audit your own bytecode before live use. Not
        financial or legal advice.
      </p>
    </div>
  );
}
