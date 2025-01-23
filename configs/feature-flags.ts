import { Chain } from "viem";
import { Environment } from "@hypercerts-org/sdk";

import { SUPPORTED_CHAINS, CHAIN_IDS, ENVIRONMENT } from "./constants";

export type FeatureId = "safe" | "marketplace" | "eas" | "evaluations";

type SupportedChainSelector =
  | { type: "all" }
  | { type: "some"; chains: Chain[] };

interface FeatureConfig {
  enabled: boolean;
  supportedChains: SupportedChainSelector;
  // If production, feature is enabled everywhere
  supportedEnv: Environment;
  description?: string;
}

const FEATURES: Record<FeatureId, FeatureConfig> = {
  safe: {
    enabled: true,
    supportedChains: getSupportedChainsExcept([
      CHAIN_IDS.filecoin_mainnet,
      CHAIN_IDS.filecoin_calibration,
    ]),
    supportedEnv: "test",
    description: "Safe wallet integration",
  },
  marketplace: {
    enabled: true,
    supportedChains: getSupportedChainsExcept([
      CHAIN_IDS.filecoin_mainnet,
      CHAIN_IDS.filecoin_calibration,
    ]),
    supportedEnv: "production",
    description: "Marketplace features",
  },
  eas: {
    enabled: true,
    supportedChains: getSupportedChainsExcept([
      CHAIN_IDS.filecoin_mainnet,
      CHAIN_IDS.filecoin_calibration,
    ]),
    supportedEnv: "production",
    description: "Ethereum Attestation Service integration",
  },
  evaluations: {
    enabled: true,
    supportedChains: getSupportedChainsExcept([
      CHAIN_IDS.filecoin_mainnet,
      CHAIN_IDS.filecoin_calibration,
    ]),
    supportedEnv: "production",
    description: "Hypercert evaluation features",
  },
};

function getSupportedChainsExcept(
  excludedChains: number[],
): SupportedChainSelector {
  if (excludedChains.length === 0) {
    return {
      type: "all",
    };
  }
  return {
    type: "some",
    chains: SUPPORTED_CHAINS.filter(
      (chain) => !excludedChains.includes(chain.id),
    ),
  };
}

export class FeatureFlags {
  private readonly features: Record<FeatureId, FeatureConfig>;

  constructor(overrideFeatures?: Record<FeatureId, FeatureConfig>) {
    this.features = overrideFeatures ?? FEATURES;
  }

  enabled(featureId: FeatureId, chainId?: number): boolean {
    const feature = this.features[featureId];
    const currentEnv = ENVIRONMENT;

    if (!feature.enabled) return false;

    if (feature.supportedEnv === "test" && currentEnv === "production") {
      return false;
    }

    if (feature.supportedChains.type === "all") {
      return true;
    }

    return feature.supportedChains.chains.some((chain) => chain.id === chainId);
  }
}
