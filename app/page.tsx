import { DepositForm } from "@/components/DepositForm";
import { VaultStats } from "@/components/VaultStats";
import { WithdrawFrom } from "@/components/WithdrawForm";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div
      className="flex min-h-screen items-center 
    justify-center bg-zinc-50 font-sans"
    >
      <main
        className="flex min-h-screen w-full
      text-black
      max-w-3xl flex-col items-center 
      gap-8 py-32 px-16
      bg-white rounded-lg shadow p-6"
      >
        <div className="flex w-full justify-between items-center ">
          <h1 className="text-gray-900 text-2xl font-bold">Usdc Vault Contract</h1>
          <ConnectButton />
        </div>

        <div className="w-full">
          <VaultStats />
        </div>
        <div className="flex w-full gap-4">
          <div className="w-1/2">
            <DepositForm />
          </div>
          <div className="w-1/2">
            <WithdrawFrom />
          </div>
        </div>
      </main>
    </div>
  );
}
