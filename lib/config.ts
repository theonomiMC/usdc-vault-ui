import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "USDC Vault",
  projectId: "548f35b0da4ceb949929097b71bc55c0",
  chains: [sepolia],
});
