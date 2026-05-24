import { Suspense } from "react";
import { DocumentsPage } from "@/components/documents/DocumentsPage";

export default function DocumentsRoute() {
  return (
    <Suspense fallback={null}>
      <DocumentsPage />
    </Suspense>
  );
}
