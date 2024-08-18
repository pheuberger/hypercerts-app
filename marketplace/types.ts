import { Database } from "@/types/hypercerts-data-database";

export type MarketplaceOrder =
  Database["public"]["Tables"]["marketplace_orders"]["Row"] & {
    hypercert_id: string;
  };

export interface CreateFractionalOfferFormValues {
  fractionId: string;
  minUnitAmount: string;
  maxUnitAmount: string;
  minUnitsToKeep: string;
  unitsForSale: string;
  price: string;
  sellLeftoverFraction: boolean;
  currency?: string;
  startDateTime: number;
  endDateTime: number;
}