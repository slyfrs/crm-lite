import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchFilter";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export function EntityListLayout({
  title,
  createHref,
  createLabel,
  searchPlaceholder,
  filters,
  beforeContent,
  emptyMessage,
  isEmpty,
  children,
}: {
  title: string;
  createHref?: string;
  createLabel?: string;
  searchPlaceholder: string;
  filters?: React.ReactNode;
  beforeContent?: React.ReactNode;
  emptyMessage: string;
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader
        title={title}
        actions={
          createHref && createLabel ? (
            <Link href={createHref}>
              <Button>{createLabel}</Button>
            </Link>
          ) : undefined
        }
      />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Suspense>
          <SearchBar placeholder={searchPlaceholder} />
        </Suspense>
        {filters && <Suspense>{filters}</Suspense>}
      </div>

      {beforeContent}

      {isEmpty ? (
        <p className="text-zinc-500">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {children}
        </div>
      )}
    </div>
  );
}
