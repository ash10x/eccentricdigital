"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchParamsSync({
  setFormData,
}: {
  setFormData: Function;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const service = searchParams.get("service");
    if (service) {
      setFormData((prev: any) => ({ ...prev, service }));
    }

    const pkg = searchParams.get("package");
    if (pkg) {
      setFormData((prev: any) => ({ ...prev, package: pkg }));
    }
  }, [searchParams, setFormData]);

  return null; // no UI, just syncing state
}
