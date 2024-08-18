import { Separator } from "@/components/ui/separator";
import { getEvaluationStatus } from "@/hypercerts/getEvaluationStatus";
import { supportedChains, type SupportedChainIdType } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { HypercertListFragment } from "@/hypercerts/fragments/hypercert-list.fragment";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { getCurrencyByAddress } from "@/marketplace/utils";

const HypercertWindow = ({
  hypercert,
  priceDisplayCurrency = "usd",
}: {
  hypercert: HypercertListFragment;
  hasTrustedEvaluator?: boolean;
  priceDisplayCurrency?: string;
}) => {
  const hypercertId = hypercert.hypercert_id as string;
  const name = hypercert.metadata?.name as string;
  const chainId = Number(hypercert.contract?.chain_id) as SupportedChainIdType;
  const attestations = hypercert.attestations;
  const cardChain = (chainId: SupportedChainIdType) => {
    return supportedChains.find((x) => x.id === chainId)?.name;
  };

  const percentAvailable = calculateBigIntPercentage(
    hypercert.orders?.totalUnitsForSale,
    hypercert.units,
  );

  let lowestPrice: string | null = null;

  const cheapestOrder = hypercert.orders?.cheapestOrder;

  if (priceDisplayCurrency === "usd" && cheapestOrder?.pricePerPercentInUSD) {
    const price = Number(cheapestOrder.pricePerPercentInUSD);
    if (price < 0.01) {
      lowestPrice = `< $0.01`;
    } else {
      lowestPrice = `$${price.toFixed(2)}`;
    }
  }

  if (
    priceDisplayCurrency === "token" &&
    cheapestOrder?.pricePerPercentInToken
  ) {
    const currency = getCurrencyByAddress(
      Number(cheapestOrder.chainId),
      cheapestOrder.currency,
    );
    if (!currency) {
      throw new Error(`Currency not found for ${cheapestOrder.currency}`);
    }
    lowestPrice = `${cheapestOrder.pricePerPercentInToken} ${currency.symbol}`;
  }

  const evaluationStatus = getEvaluationStatus(attestations);

  return (
    <Link href={`/hypercerts/${hypercertId}`}>
      <article className="transition-transform duration-300 hover:-translate-y-2 relative group bg-black/10 rounded-lg overflow-hidden">
        <div className="h-[320px] w-full relative p-1">
          <Image
            src={`/api/hypercerts/${hypercertId}/image`}
            alt={name || "Untitled"}
            fill
            sizes="300px"
            className="object-contain object-center w-full h-full"
          />
        </div>
        <section className="absolute top-4 left-4 flex space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out">
          <div className="rounded-md px-2 py-0.5 bg-black border border-white/60 text-white text-xs shadow-sm">
            {cardChain(chainId)}
          </div>
          <div className="rounded-md px-2 py-0.5 bg-black border border-black/60 text-white text-xs shadow-sm">
            {evaluationStatus}
          </div>
        </section>
        <section className="bg-gray-200/80 backdrop-blur-md bottom-0 w-full p-4 text-black space-y-2">
          <p
            className={`flex-1 text-sm font-semibold line-clamp-2 text-ellipsis ${
              name ? "text-black" : "text-gray-700"
            }`}
          >
            {name || "[Untitled]"}
          </p>
          <Separator className="bg-black/40 my-2" />
          <section className="flex text-xs justify-between">
            <section>
              <h6 className="opacity-70">for sale</h6>
              <p> {percentAvailable ? `${percentAvailable}%` : "--"}</p>
            </section>
            <section>
              <h6 className="text-end opacity-70">lowest per %</h6>
              <p className="font-medium">
                {lowestPrice && lowestPrice !== "0" ? `${lowestPrice}` : "--"}
              </p>
            </section>
          </section>
        </section>
      </article>
    </Link>
  );
};

export { HypercertWindow as default };