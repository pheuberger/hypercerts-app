import WorkScope from "../../../components/hypercert/Scope";
import WorkTimeFrame from "../../../components/hypercert/TimeFrame";
import { getHypercert } from "../../../hypercerts/getHypercert";

export default async function HypercertPage({
  params,
}: {
  params: { hypercertId: string };
}) {
  const { hypercertId } = params;
  const hypercert = await getHypercert(hypercertId);

  if (!hypercert) {
    return <div>Hypercert not found</div>;
  }

  return (
    <main className="flex flex-col p-8 md:p-24 pb-24 space-y-4">
      <section className="flex flex-col space-y-4">
        <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
          {hypercert?.metadata?.name}
        </h1>
        <p className="md:text-lg">{hypercert?.metadata?.description}</p>
        <div className="flex">
          <WorkTimeFrame hypercert={hypercert} />
          <WorkScope hypercert={hypercert} />
        </div>
      </section>
    </main>
  );
}
