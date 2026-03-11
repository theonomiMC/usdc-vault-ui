"use client";

import { useState, useEffect } from "react";
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/contract";
import { parseUnits, BaseError } from "viem";

export function WithdrawFrom() {
  const { address } = useAccount();
  const {
    writeContract,
    data: hash,
    isPending,
    error: contractError,
  } = useWriteContract();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleWithdraw = () => {
    if (!amount || !address) return;
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "withdraw",
      args: [parseUnits(amount, 6), address, address],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setAmount("");
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
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
        disabled={isPending || isConfirming || !amount || !address || Number(amount) <= 0}
        onClick={handleWithdraw}
        className="w-full bg-indigo-600 hover:bg-indigo-700
         text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConfirming ? "Confirming..." : isPending ? "Wait..." : "Withdraw"}
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
            View Hash: {hash.slice(0, 24)}...
          </a>
        </div>
      )}
    </div>
  );
}
