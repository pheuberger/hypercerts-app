"use client";
import { useMemo } from "react";
import { useChainId, useWalletClient } from "wagmi";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import { supportedChains } from "@/lib/constants";

export const useHypercertExchangeClient = () => {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const client = useMemo(() => {
    if (!supportedChains.find((chain) => chain.id === walletClient?.chain.id)) {
      return null;
    }

    return new HypercertExchangeClient(
      chainId,
      // @ts-expect-error - wagmi and viem have different typing
      provider,
      signer,
      {
        apiEndpoint: process.env.NEXT_PUBLIC_HYPERCERT_API_ENDPOINT,
      },
    );
  }, [walletClient, chainId, provider, signer]);

  return { client };
};