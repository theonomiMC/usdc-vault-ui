"use client";

import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
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
  const format = (value: bigint | undefined, decimals: number) => 
    value ? Number(formatUnits(value, decimals)).toFixed(2) : "0.00";
  
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
          {format(totalAssets, 6)} USDC
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Share Price</p>
        <p className="text-lg font-semibold text-gray-900">
          {format(sharePrice, 18)}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Your Shares</p>
        <p className="text-lg font-semibold text-gray-900">
          {format(userShares, 9)}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Max Withdraw</p>
        <p className="text-lg font-semibold text-gray-900">
          {format(maxWithdraw, 6)} USDC
        </p>
      </div>
      {address?.toLowerCase() === OWNER.toLowerCase() && (
        <div>
          <p className="text-xs text-gray-400">Accumulated Fees</p>
          <p className="text-lg font-semibold text-indigo-600">
            {format(getAccumulatedFees, 6)} USDC
          </p>
        </div>
      )}
    </div>
  </div>
  );
}
