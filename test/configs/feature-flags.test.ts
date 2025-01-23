import { describe, it, expect, vi, beforeEach } from "vitest";
import { sepolia, optimism } from "viem/chains";
import { Environment } from "@hypercerts-org/sdk";

import { CHAIN_IDS } from "@/configs/constants";
import { FeatureFlags } from "@/configs/feature-flags";

let mockEnvironment = "test";

vi.mock("@/configs/constants", () => ({
  get ENVIRONMENT() {
    return mockEnvironment;
  },
  CHAIN_IDS: {
    sepolia: sepolia.id,
    op_mainnet: optimism.id,
  },
  SUPPORTED_CHAINS: [sepolia, optimism],
}));

const mockFeatures = {
  safe: {
    enabled: true,
    supportedChains: {
      type: "some",
      chains: [sepolia],
    },
    supportedEnv: "test",
  },
  marketplace: {
    enabled: true,
    supportedChains: { type: "all" },
    supportedEnv: "production",
  },
  eas: {
    enabled: true,
    supportedChains: {
      type: "some",
      chains: [optimism],
    },
    supportedEnv: "production",
  },
  evaluations: {
    enabled: true,
    supportedChains: { type: "all" },
    supportedEnv: "production",
  },
} as any;

const setTestEnvironment = (env: Environment) => {
  mockEnvironment = env;
};

describe("Feature Flags", () => {
  const features = new FeatureFlags(mockFeatures);

  beforeEach(() => {
    vi.resetModules();
    setTestEnvironment("test");
  });

  describe("Environment-specific behavior", () => {
    it("should enable/disable safe feature based on environment", () => {
      setTestEnvironment("test");
      expect(features.enabled("safe", CHAIN_IDS.sepolia)).toBe(true);
      setTestEnvironment("production");
      expect(features.enabled("safe", CHAIN_IDS.sepolia)).toBe(false);
      setTestEnvironment("test");
      expect(features.enabled("safe", CHAIN_IDS.sepolia)).toBe(true);
    });

    it("should keep marketplace enabled across all environments", () => {
      setTestEnvironment("test");
      expect(features.enabled("marketplace", CHAIN_IDS.sepolia)).toBe(true);
      setTestEnvironment("production");
      expect(features.enabled("marketplace", CHAIN_IDS.sepolia)).toBe(true);
    });
  });

  describe("Chain-specific behavior", () => {
    setTestEnvironment("test");

    it("should enable marketplace feature on ALL supported chains", () => {
      Object.values(CHAIN_IDS).forEach((chainId) => {
        expect(features.enabled("marketplace", chainId)).toBe(true);
      });
    });

    it("should enable safe feature only on supported chains", () => {
      for (const chainId of Object.values(CHAIN_IDS)) {
        expect(features.enabled("safe", chainId)).toBe(
          CHAIN_IDS.sepolia === chainId,
        );
      }
    });

    it("should handle undefined chainId appropriately", () => {
      expect(features.enabled("marketplace", undefined)).toBe(true);
      expect(features.enabled("safe", undefined)).toBe(false);
      expect(features.enabled("eas", undefined)).toBe(false);
    });
  });
});
