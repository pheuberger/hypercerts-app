import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  celo,
  filecoinCalibration,
  optimism,
  sepolia,
} from "viem/chains";
import { Chain } from "viem";

import { ENVIRONMENT } from "./constants";

const testNetChains = [
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  filecoinCalibration,
] as const;

const prodNetChains = [optimism, celo, base, arbitrum] as const;

export const SUPPORTED_CHAINS = (
  ENVIRONMENT === "production" ? prodNetChains : testNetChains
) as readonly [Chain, ...Chain[]];

const allChainIds = [
  ...testNetChains.map((x) => x.id),
  ...prodNetChains.map((x) => x.id),
] as const;
export type SupportedChainIdType = (typeof allChainIds)[number];
