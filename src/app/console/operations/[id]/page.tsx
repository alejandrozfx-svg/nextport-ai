import { OperationDetail } from "@/components/operation-detail/OperationDetail";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

async function getOperation(id: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/operations/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function OperationDetailPage({ params }: Props) {
  const { id } = await params;
  const operation = await getOperation(id);
  if (!operation) notFound();
  return <OperationDetail operation={operation} />;
}
