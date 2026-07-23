"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/* The client's editing interface lives at /studio.
   Editorial control only — layout and styling stay in code. */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
