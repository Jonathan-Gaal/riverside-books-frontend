import type { MarketingContent } from "@/types";

// A staff-generated promotional blurb for a book (Product D, mediated through
// apps/backend). Shown as a sticky sidebar panel beside the title; the caller
// only renders this when marketingContent exists, so `content` is required.
export function MarketingContentSidebar({ content }: { content: MarketingContent }) {
  return (
    <aside className="rounded-2xl border border-brand-200 bg-brand-50 p-6 md:sticky md:top-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Featured</p>
      <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
        {content.headline}
      </h2>
      <p className="mt-2 text-stone-700">{content.bodyCopy}</p>
    </aside>
  );
}
