import { Suspense } from "react";
import { OperationsInbox } from "@/components/operations/OperationsInbox";

export default function OperationsPage() {
  return (
    <Suspense fallback={null}>
      <OperationsInbox />
    </Suspense>
  );
}
