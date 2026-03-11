"use client";

import { useEffect, useState } from "react";
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/contract";
import { BaseError, parseUnits } from "viem";

const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const USDC_ABI = [
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

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
        setTimeout(()=>setShowSuccess(false),7000)
      }
    } else {
      setShowError(true);
    }

    if(contractError && step == "deposit"){
      setStep("approve")
      reset()
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
      className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3 
                transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">
          Amount in USDC
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border-0 border-b-2 border-gray-200 
            focus:border-indigo-500 focus:outline-none 
            py-2 text-gray-900 text-sm transition-colors
            bg-transparent"
          placeholder="0.00"
        />
      </div>
      <button
        disabled={isPending || isConfirming || !amount}
        onClick={step === "approve" ? handleApprove : handleDeposit}
        className={`w-full font-medium py-2 px-4 rounded-lg transition-all
           duration-500 transform disabled:cursor-not-allowed
    ${
      step === "approve"
        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
    } 
    text-white shadow-md active:scale-95 disabled:opacity-50`}
      >
        {isConfirming
          ? "Confirming..."
          : isPending
            ? "Wait..."
            : step === "approve"
              ? "1. Approve USDC"
              : "2. Deposit to Vault"}
      </button>
      {/* Error Message */}
      {showError && contractError && (
        <p className="text-[10px] text-red-500 mt-2 bg-red-50 p-2 rounded border border-red-100">
          {(contractError as BaseError).shortMessage || "Transaction failed"}
        </p>
      )}
      {/* Success Link */}
      {showSuccess && hash && (
        <div className="mt-2 text-left">
          <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">
            Transaction Success!
          </p>
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-indigo-500 hover:underline block truncate"
          >
            View Hash: {hash?.slice(0, 24)}...
          </a>
        </div>
      )}
    </div>
  );
}
