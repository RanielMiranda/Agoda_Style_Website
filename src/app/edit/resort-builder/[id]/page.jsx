"use client";

import ResortBuilder from "@/app/edit/resort-builder/[id]/ResortBuilder";

export default function AdminBuilderPage({ params }) {
  return <ResortBuilder resortId={params?.id} />;
}
