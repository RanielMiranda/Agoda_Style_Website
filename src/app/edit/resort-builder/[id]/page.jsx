"use client";

import React from "react";
import ResortBuilder from "@/app/edit/resort-builder/[id]/ResortBuilder";

export default function AdminBuilderPage({ params }) {
  const unwrappedParams = React.use(params);
  
  return <ResortBuilder resortId={unwrappedParams.id} />;
}