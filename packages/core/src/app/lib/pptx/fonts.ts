const POWERPOINT_SAFE_FONTS = [
  'Aptos',
  'Arial',
  'Calibri',
  'Cambria',
  'Consolas',
  'Courier New',
  'Georgia',
  'Helvetica',
  'Times New Roman',
  'Verdana',
];
const POWERPOINT_SAFE_FONT_MAP = new Map(
  POWERPOINT_SAFE_FONTS.map((fontFace) => [fontFace.toLowerCase(), fontFace]),
);

export type ResolvedPptxFont = {
  fontFace: string;
  warning?: string;
};

export function resolvePptxFontFace(fontFamily: string): ResolvedPptxFont | undefined {
  const families = parseFontFamilies(fontFamily);
  const first = families[0];
  if (!first) {
    return undefined;
  }

  const safeFont = canonicalSafeFont(first);
  if (safeFont) {
    return safeFont === first
      ? { fontFace: safeFont }
      : { fontFace: safeFont, warning: `Font fallback: ${first} -> ${safeFont}` };
  }

  const fallback =
    findFamily(families, ['Times New Roman', 'Georgia']) ??
    (hasGeneric(families, 'serif') ? 'Times New Roman' : undefined) ??
    findFamily(families, ['Aptos', 'Arial', 'Helvetica', 'Verdana']) ??
    (hasGeneric(families, 'sans-serif') ? 'Aptos' : undefined) ??
    findFamily(families, ['Consolas', 'Courier New']) ??
    (hasGeneric(families, 'monospace') || hasGeneric(families, 'ui-monospace')
      ? 'Consolas'
      : undefined);

  if (!fallback) {
    return {
      fontFace: first,
      warning: `Font may not be available in PowerPoint: ${first}`,
    };
  }

  return {
    fontFace: fallback,
    warning: `Font fallback: ${first} -> ${fallback}`,
  };
}

export function parseFontFamilies(fontFamily: string): string[] {
  return fontFamily
    .split(',')
    .map((family) => family.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function findFamily(families: string[], candidates: string[]): string | undefined {
  const normalizedFamilies = families.map((family) => family.toLowerCase());
  return candidates.find((candidate) => normalizedFamilies.includes(candidate.toLowerCase()));
}

function hasGeneric(families: string[], generic: string): boolean {
  return families.some((family) => family.toLowerCase() === generic);
}

function canonicalSafeFont(fontFace: string): string | undefined {
  return POWERPOINT_SAFE_FONT_MAP.get(fontFace.toLowerCase());
}
