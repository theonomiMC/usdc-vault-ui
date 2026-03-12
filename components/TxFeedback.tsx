import { BaseError } from "viem";

interface TxFeedbackProps {
  showSuccess: boolean;
  showError: boolean;
  hash?: string;
  contractError: BaseError | null;
}

export function TxFeedback({
  showSuccess,
  showError,
  hash,
  contractError,
}: TxFeedbackProps) {
  return (
    <>
      {showError && contractError && (
        <p className="text-[10px] text-red-500 mt-2 bg-red-50 p-2 rounded border border-red-100">
          {(contractError as BaseError).shortMessage || "Transaction failed"}
        </p>
      )}
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
    </>
  );
}
