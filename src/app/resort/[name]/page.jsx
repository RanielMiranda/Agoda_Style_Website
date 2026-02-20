"use client";

import ResortDetailPage from "@/components/resortpages/ResortDetailPage";

export default function Page({ params }) {
  return <ResortDetailPage name={params.name} />;
}