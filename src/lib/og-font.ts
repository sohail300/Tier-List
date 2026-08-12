let cached: ArrayBuffer | null | undefined;

/** Fetches the Anton display font for use inside next/og ImageResponse renders. */
export async function loadAntonFont(): Promise<ArrayBuffer | null> {
  if (cached !== undefined) {
    return cached;
  }
  const result = await fetchAntonFont();
  cached = result;
  return result;
}

async function fetchAntonFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Anton&display=swap",
    ).then((res) => res.text());
    const fontUrl = css.match(
      /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/,
    )?.[1];
    if (!fontUrl) {
      return null;
    }
    return await fetch(fontUrl).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}
