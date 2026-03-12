"use client";

import { useReadContract, useAccount } from "wagmi";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/contract";

const OWNER = "0x6b387b3891aa7D0A1Ef4Cc81415c113020C292Ee"

export function VaultStats() {
  const { address } = useAccount();
  const { data: totalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
    query: { refetchInterval: 5000 }
  });
  const { data: sharePrice } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "sharePrice",
  });
  const { data: userShares } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });
  const { data: getAccumulatedFees } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getAccumulatedFees",
    query: {enabled: address?.toLowerCase() === OWNER.toLowerCase() }
  });
  const { data: maxWithdraw } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "maxWithdraw",
    args:[address ?? "0x0000000000000000000000000000000000000000"],
    // query: { enabled: address ==ownerAddress }, // how to 
  });
  return (
    <div className="bg-white rounded-xl 
    border border-gray-200 
    shadow-sm p-6 w-full">
    <h2 className="text-sm font-semibold 
    text-gray-400 uppercase tracking-wide mb-4">
      Vault Stats
    </h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-gray-400">Total Assets</p>
        <p className="text-lg font-semibold text-gray-900">
          {totalAssets ? (Number(totalAssets) / 10**6).toFixed(2) : "0.00"} USDC
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Share Price</p>
        <p className="text-lg font-semibold text-gray-900">
          {(Number(sharePrice) / 10**18).toFixed(2)}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Your Shares</p>
        <p className="text-lg font-semibold text-gray-900">
          {userShares ? (Number(userShares) / 10**9).toFixed(2) : "0.00"}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Max Withdraw</p>
        <p className="text-lg font-semibold text-gray-900">
          {maxWithdraw ? (Number(maxWithdraw) / 10**6).toFixed(2) : "0.00"} USDC
        </p>
      </div>
      {address?.toLowerCase() === OWNER.toLowerCase() && (
        <div>
          <p className="text-xs text-gray-400">Accumulated Fees</p>
          <p className="text-lg font-semibold text-indigo-600">
            {getAccumulatedFees ? (Number(getAccumulatedFees) / 10**6).toFixed(2) : "0.00"} USDC
          </p>
        </div>
      )}
    </div>
  </div>
  );
}
