import { MarketplaceItemDetail } from "@/components/marketplace/MarketplaceItemDetail";
import { SECTIONS } from "@/lib/marketplace-data";

/* SSG: pre-render every marketplace item id (we know them all at build time). */
export function generateStaticParams() {
  return SECTIONS.flatMap((s) => s.items.map((it) => ({ id: it.id })));
}

export default async function MarketplaceItemRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MarketplaceItemDetail id={id} />;
}
