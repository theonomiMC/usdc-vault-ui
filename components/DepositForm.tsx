"use client";

import { useState, useEffect } from "react";
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  VAULT_ADDRESS,
  VAULT_ABI,
  USDC_ADDRESS,
  USDC_ABI,
} from "@/lib/contract";
import { TxFeedback } from "@/components/TxFeedback";
import { parseUnits, BaseError } from "viem";

export function DepositForm() {
  const {
    writeContract,
    data: hash,
    isPending,
    error: contractError,
    reset,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState<"approve" | "deposit">("approve");

  useEffect(() => {
    if (isSuccess) {
      if (step === "approve") {
        setStep("deposit");
      } else {
        setShowSuccess(true);
        setStep("approve");
        setAmount("");
        setTimeout(() => setShowSuccess(false), 7000);
      }
    } else {
      setShowError(true);
    }

    if (contractError && step == "deposit") {
      setStep("approve");
      setAmount("");
      reset();
    }
  }, [isSuccess, hash, contractError, reset]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (contractError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [contractError]);

  const handleApprove = () => {
    // call approve on USDC contract
    writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "approve",
      args: [VAULT_ADDRESS, parseUnits(amount, 6)],
    });
    // amount is in USDC — convert to 6 decimals
  };

  const handleDeposit = () => {
    // call deposit on vault
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "deposit",
      args: [parseUnits(amount, 6), address ?? "0x000000000000000000"],
    });
  };

  return (
    <div
      className="w-full bg-white rounded-xl border
       border-gray-200 p-5 md:p-6 flex flex-col gap-3
       transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">
          Amount in USDC
        </label>
        <input
          type="number"
          value={amount}
          inputMode="decimal"
          disabled={isConfirming}
          onFocus={() => {
            setShowError(false);
            reset();
          }}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border-0 border-b-2 border-gray-200 
            focus:border-indigo-500 focus:outline-none 
            py-2 text-gray-900 text-sm md:text-base transition-colors
            bg-transparent"
          placeholder="0.00"
        />
      </div>
      <button
        disabled={isPending || isConfirming || !amount || Number(amount) <= 0}
        onClick={step === "approve" ? handleApprove : handleDeposit}
        className={`w-full font-medium py-2 px-4 rounded-lg transition-all
           duration-300 transform active:scale-[0.98] disabled:cursor-not-allowed
    ${
      step === "approve"
        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
    } 
    text-white shadow-md active:scale-95 disabled:opacity-50`}
      >
        <span className="flex items-center justify-center gap-2">
          {isConfirming || isPending ? (
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {isConfirming
            ? "Confirming..."
            : isPending
              ? "Check Wallet..."
              : step === "approve"
                ? "1. Approve USDC"
                : "2. Deposit to Vault"}
        </span>
      </button>
      {/* Error Message */}
      {showError && contractError && (
        <p className="text-[10px] text-red-500 mt-2 bg-red-50 p-2 rounded border border-red-100">
          {(contractError as BaseError).shortMessage || "Transaction failed"}
        </p>
      )}
      {/* Success Link */}
        <TxFeedback
          showSuccess={showSuccess}
          showError={showError}
          hash={hash}
          contractError={contractError as any}
        />
    </div>
  );
}
