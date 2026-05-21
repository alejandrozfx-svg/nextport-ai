import { OperationDetail } from "@/components/operation-detail/OperationDetail";
import { getDemoOperation, DEMO_OPERATIONS } from "@/lib/demo-data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return DEMO_OPERATIONS.map((op) => ({ id: op.id }));
}

export default async function OperationDetailPage({ params }: Props) {
  const { id } = await params;
  const op = getDemoOperation(id);
  if (!op) notFound();
  return <OperationDetail op={op} />;
}
