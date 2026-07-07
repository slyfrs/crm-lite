"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createQueryString } from "@/lib/url";
import { Input, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function SearchBar({ placeholder, className }: { placeholder: string; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") || "";
  const [value, setValue] = useState(qFromUrl);
  const [prevQ, setPrevQ] = useState(qFromUrl);

  if (qFromUrl !== prevQ) {
    setPrevQ(qFromUrl);
    setValue(qFromUrl);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get("q") || "";
      if (value !== current) {
        router.push(pathname + "?" + createQueryString(searchParams, "q", value));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={cn("w-64", className)}
    />
  );
}

export function FilterSelect({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (value: string) => {
      router.push(pathname + "?" + createQueryString(searchParams, name, value));
    },
    [router, pathname, searchParams, name]
  );

  return (
    <Select
      className="w-44 shrink-0"
      defaultValue={searchParams.get(name) || ""}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
