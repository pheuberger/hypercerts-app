import { Environment } from "@hypercerts-org/sdk";

export const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;

export type ApiSigningDomain = {
  name: string;
  version: string;
  chainId: number;
};

export type SafeApiSigningDomain = ApiSigningDomain & {
  verifyingContract: string;
};

export const hypercertApiSigningDomain = (
  chainId: number,
): ApiSigningDomain => ({
  name: "Hypercerts",
  version: "1",
  chainId,
});

export const hypercertApiSigningDomainSafe = (
  chainId: number,
  verifyingContract: string,
): SafeApiSigningDomain => ({
  ...hypercertApiSigningDomain(chainId),
  verifyingContract,
});

export const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
export const drpcApiPkey = process.env.NEXT_PUBLIC_DRPC_API_PKEY;
export const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;
export const filecoinApiKey = process.env.NEXT_PUBLIC_FILECOIN_API_KEY;

export * from "./chains";
