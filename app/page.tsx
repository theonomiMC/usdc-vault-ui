import { DepositForm } from "@/components/DepositForm";
import { VaultStats } from "@/components/VaultStats";
import { WithdrawForm } from "@/components/WithdrawForm";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div
      className="flex min-h-screen justify-center
       bg-zinc-50 font-sans p-4 md:p-8"
    >
      <main
        className="w-full max-w-4xl bg-white rounded-2xl
         shadow-sm border border-zinc-100 flex flex-col
          gap-6 md:gap-8 p-6 md:p-10 h-fit my-auto"
      >
        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4">
          <h1 className="text-gray-900 text-xl md:text-2xl font-bold tracking-tight">
            USDC Vault Protocol
          </h1>
          <div className="w-full md:w-auto flex justify-end">
            <ConnectButton accountStatus="avatar" showBalance={false} />
          </div>
        </div>
        {/* Stats Section */}
        <div className="w-full">
          <VaultStats />
        </div>
        {/* Forms Section*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          <div className="w-full">
            <DepositForm />
          </div>
          <div className="w-full">
            <WithdrawForm />
          </div>
        </div>
        
      </main>
    </div>
  );
}
