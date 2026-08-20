const CACHE_KEY_PREFIX = "riverside_cover:";

function cacheKey(title: string, author: string): string {
  return `${CACHE_KEY_PREFIX}${title.toLowerCase()}|${author.toLowerCase()}`;
}

// localStorage stores "" for "looked up, no cover exists" (so we don't retry
// forever) and is absent entirely for "never looked up yet".
function readCache(title: string, author: string): string | null | undefined {
  const raw = localStorage.getItem(cacheKey(title, author));
  if (raw === null) {
    return undefined;
  }
  return raw === "" ? null : raw;
}

function writeCache(title: string, author: string, url: string | null): void {
  localStorage.setItem(cacheKey(title, author), url ?? "");
}

// Looks up a cover by title/author rather than ISBN, since the seeded catalog's
// ISBNs are synthetic placeholders, not real ones -- title/author search still
// resolves correctly for real book titles.
export async function fetchOpenLibraryCoverUrl(title: string, author: string): Promise<string | null> {
  const cached = readCache(title, author);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const params = new URLSearchParams({ title, author, fields: "cover_i", limit: "1" });
    const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
    if (!response.ok) {
      return null;
    }
    const body = await response.json();
    const coverId = body?.docs?.[0]?.cover_i as number | undefined;
    const url = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
    writeCache(title, author, url);
    return url;
  } catch {
    // Network failure -- don't cache, so a later render can retry.
    return null;
  }
}
