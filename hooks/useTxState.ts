"use client"

import { useEffect, useState } from "react";

export function useTxState(
  isSuccess: boolean,
  contractError: Error | null,
  hash?: string,
  onSuccess?: () => void
) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setShowError(false);
      onSuccess?.();
      const timer = setTimeout(() => setShowSuccess(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, onSuccess]);

  useEffect(() => {
    if (contractError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 7000);
      return () => clearTimeout(timer);
    }
  },[contractError]);

  return { showSuccess, showError };
}
