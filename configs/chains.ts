import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  celo,
  filecoin,
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

const prodNetChains = [optimism, celo, base, arbitrum, filecoin] as const;

export const SUPPORTED_CHAINS = (
  ENVIRONMENT === "production" ? prodNetChains : testNetChains
) as readonly [Chain, ...Chain[]];

const allChains = [...testNetChains, ...prodNetChains] as const;
const allChainIds = allChains.map((x) => x.id);
export type SupportedChainIdType = (typeof allChainIds)[number];

/*
  The next section is to be able to get the chain id from the chain name.
  It uses the Chain objects from viem, converts the name to lowercase and replaces spaces with underscores.
  This lets us specify chain ids using their names: e.g. CHAIN_IDS.sepolia
*/
const chainNameToId = (chain: Chain) =>
  chain.name.toLowerCase().replace(/\s+/g, "_");

type ChainNames = (typeof allChains)[number]["name"];
type NormalizedChainNames = Lowercase<Replace<ChainNames, " ", "_">>;

type Replace<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer L}${From}${infer R}`
  ? `${L}${To}${Replace<R, From, To>}`
  : S;

export const CHAIN_IDS = {
  ...Object.fromEntries(
    allChains.map((chain) => [chainNameToId(chain), chain.id]),
  ),
} as Record<NormalizedChainNames, number>;
