import createDOMPurify from 'dompurify';
import type { HTMLAttributes, ImgHTMLAttributes } from 'react';
import Temml from 'temml';

export type PptxPrimitiveKind =
  | 'text'
  | 'box'
  | 'image'
  | 'shape'
  | 'group'
  | 'raster'
  | 'equation'
  | 'table'
  | 'chart';

export type PptxShapeKind = 'rect' | 'roundRect' | 'ellipse' | 'line';
export type PptxChartType = 'bar' | 'line' | 'pie' | 'doughnut';

export type PptxTextProps = HTMLAttributes<HTMLDivElement>;

export type PptxBoxProps = HTMLAttributes<HTMLDivElement>;

export type PptxImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
};

export type PptxRasterLayerProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  alt: string;
  dataUrl: string;
  reason: string;
};

export type PptxEquationProps = HTMLAttributes<HTMLDivElement> & {
  fallbackText?: string;
  inline?: boolean;
  latex?: string;
  mathml?: string;
};

export type PptxTableProps = HTMLAttributes<HTMLTableElement> & {
  columns: string[];
  rows: string[][];
};

export type PptxChartSeries = {
  color?: string;
  name: string;
  values: number[];
};

export type PptxChartProps = HTMLAttributes<HTMLDivElement> & {
  chartType?: PptxChartType;
  labels: string[];
  series: PptxChartSeries[];
  title?: string;
};

export type PptxShapeProps = HTMLAttributes<HTMLDivElement> & {
  shape?: PptxShapeKind;
};

export type PptxGroupProps = HTMLAttributes<HTMLDivElement>;

export function PptxText({ children, ...props }: PptxTextProps) {
  return (
    <div {...props} data-osd-pptx-kind="text">
      {children}
    </div>
  );
}

export function PptxBox({ children, ...props }: PptxBoxProps) {
  return (
    <div {...props} data-osd-pptx-kind="box">
      {children}
    </div>
  );
}

export function PptxImage({ alt, ...props }: PptxImageProps) {
  return <img {...props} alt={alt} data-osd-pptx-kind="image" />;
}

export function PptxRasterLayer({ alt, dataUrl, reason, ...props }: PptxRasterLayerProps) {
  return (
    <img
      {...props}
      alt={alt}
      src={dataUrl}
      data-osd-pptx-kind="raster"
      data-osd-pptx-reason={reason}
    />
  );
}

export function PptxEquation({
  fallbackText,
  inline = false,
  latex,
  mathml,
  children,
  ...props
}: PptxEquationProps) {
  const text = fallbackText ?? latex ?? mathml ?? children;
  const sanitizedMathml = mathml ? sanitizeMathHtml(mathml) : undefined;
  const preview = latex
    ? renderLatexPreview(latex, !inline)
    : sanitizedMathml
      ? sanitizedMathml
      : null;
  return (
    <div
      {...props}
      role="img"
      aria-label={typeof text === 'string' ? text : props['aria-label']}
      data-osd-pptx-kind="equation"
      data-osd-pptx-latex={latex}
      data-osd-pptx-mathml={sanitizedMathml}
      data-osd-pptx-inline={inline ? 'true' : undefined}
      data-osd-pptx-fallback={fallbackText}
      {...(preview ? { dangerouslySetInnerHTML: { __html: preview } } : {})}
    >
      {preview ? undefined : text}
    </div>
  );
}

function renderLatexPreview(source: string, displayMode: boolean): string | null {
  try {
    return sanitizeMathHtml(
      Temml.renderToString(normalizeLatexSource(source), {
        displayMode,
        throwOnError: false,
        trust: false,
      }),
    );
  } catch {
    return null;
  }
}

function sanitizeMathHtml(html: string): string {
  const sanitizer = createDOMPurify as unknown as {
    sanitize?: (dirty: string, config?: Record<string, unknown>) => string;
  };
  if (typeof sanitizer.sanitize === 'function') {
    return sanitizer.sanitize(html, {
      ADD_ATTR: [
        'class',
        'display',
        'fence',
        'form',
        'linethickness',
        'mathvariant',
        'movablelimits',
        'separator',
        'stretchy',
        'style',
        'width',
      ],
      USE_PROFILES: { html: true, mathMl: true },
    });
  }

  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:href|src|xlink:href)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '');
}

function normalizeLatexSource(source: string): string {
  if (!/\\\\[A-Za-z]/.test(source)) {
    return source;
  }

  return source.replace(/\\\\\\\\/g, '\\\\').replace(/\\\\([A-Za-z,;!])/g, '\\$1');
}

export function PptxTable({ columns, rows, ...props }: PptxTableProps) {
  return (
    <table
      {...props}
      data-osd-pptx-kind="table"
      data-osd-pptx-table={JSON.stringify({ columns, rows })}
    >
      <thead>
        <tr>
          {columns.map((column, columnIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: PPTX tables render static export metadata.
            <th key={`${column}-${columnIndex}`}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: PPTX tables render static export metadata.
          <tr key={`${row.join('|')}-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: PPTX tables render static export metadata.
              <td key={`${row.join('|')}-${cell}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function PptxChart({
  chartType = 'bar',
  labels,
  series,
  title,
  children,
  ...props
}: PptxChartProps) {
  return (
    <div
      {...props}
      data-osd-pptx-kind="chart"
      data-osd-pptx-chart={JSON.stringify({ chartType, labels, series, title })}
    >
      {children}
    </div>
  );
}

export function PptxShape({ children, shape = 'rect', ...props }: PptxShapeProps) {
  return (
    <div {...props} data-osd-pptx-kind="shape" data-osd-pptx-shape={shape}>
      {children}
    </div>
  );
}

export function PptxGroup({ children, ...props }: PptxGroupProps) {
  return (
    <div {...props} data-osd-pptx-kind="group">
      {children}
    </div>
  );
}
