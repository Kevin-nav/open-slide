# PPTX Export Architecture

The open-slide PPTX export system is a hybrid export engine designed to provide high visual fidelity while maximizing editability in the resulting PowerPoint presentation. It bridges the gap between web-native React components and native PowerPoint objects.

## Architecture Flow

The export process is conceptually a pipeline:
**React Slide → Offscreen DOM → DOM Collector → Scene Model (IR) → PPTX Writer → Blob Download**

1. **Offscreen Render:** The React slide component is rendered into an offscreen DOM element at a fixed 1920×1080 resolution.
2. **DOM Collection:** The exporter walks the offscreen DOM and builds a structured Scene Model (Intermediate Representation).
3. **PPTX Writing:** The Scene Model is serialized into a `.pptx` file.

---

## Core Components

### 1. Export Entry Point (`packages/core/src/app/lib/export-pptx.ts`)

The orchestrator of the export process:
- Creates a hidden `div` container in the DOM (scaled to 1920×1080).
- For each slide page, it renders the React component using `createRoot`.
- Applies slide design CSS variables.
- Waits for the browser to stabilize (paints, `waitForFonts`, `waitForDataWaitfor`).
- Triggers the DOM Collector to generate a Scene Model.
- Cleans up the React root and DOM element.
- Summarizes the diagnostics into an export report.
- Invokes the Writer to generate the `.pptx` Blob and downloads it.

### 2. Scene Model (`packages/core/src/app/lib/pptx/scene.ts`)

This is the Intermediate Representation (IR) that decouples React/DOM from PowerPoint's file format. It defines strongly-typed nodes corresponding to PPTX features:
- `PptxTextNode` & `PptxRichTextNode`: Represents editable text, optionally holding explicit text runs or explicit browser-measured text lines (`PptxTextLine`).
- `PptxShapeNode`: Maps to native shapes like `rect`, `roundRect`, `ellipse`, or `line`.
- `PptxImageNode`: Represents standard images.
- `PptxTableNode` & `PptxChartNode`: High-fidelity data representations.
- `PptxEquationNode`: Contains fallback text or OfficeMath (OMML).
- `PptxRasterNode`: Rasterized fallback layers for unsupported web effects.

Each node contains spatial coordinates (`x`, `y`, `w`, `h`) normalized to the canvas, and specific style attributes.

### 3. DOM Collector (`packages/core/src/app/lib/pptx/dom-collector.ts`)

The collector traverses the rendered offscreen DOM and attempts to infer the correct `PptxSceneNode`.
- **Primitive Detection:** It first looks for specific data attributes (`data-osd-pptx-kind`) injected by export-aware React components to explicitly map complex elements (like tables or equations) without guessing.
- **Inference:** For standard HTML elements, it reads computed styles (borders, backgrounds, fonts). For instance, simple text becomes a `PptxTextNode`, and a background div becomes a `PptxShapeNode`.
- **Text Measurement:** It calculates text layout coordinates to resolve coordinate mismatches between the browser and PowerPoint. It can preserve browser-measured line boxes (to ensure exact line-wrapping matching the web view) or allow PowerPoint's default text auto-wrapping, based on the `lineBreakPolicy`.
- **Coordinate Normalization:** Uses `getBoundingClientRect()` relative to the canvas origin.

### 4. PPTX Writer (`packages/core/src/app/lib/pptx/write-pptx.ts`)

Takes the populated `PptxSlideScene` and writes it to a `.pptx` file structure.
- Generally relies on the `pptxgenjs` library to construct the slide XML files.
- Maps internal models to `pptxgenjs` commands (`addText`, `addShape`, `addImage`, etc.).
- Converts pixel measurements to inches for PowerPoint (`pxToIn`).
- **Equation XML Patching:** Since full mathematical equations require specialized XML (OMML), the writer inserts placeholder tokens in the `pptxgenjs` text, unzips the resulting `.pptx` Blob, manually patches in the `<a14:m>` OfficeMath XML via regex/string replacement, and zips the file back together.

---

## Export-Aware Primitives

For standard HTML, the DOM Collector makes its best guess. However, for maximum fidelity, open-slide provides export-aware React primitives (e.g., in `components/pptx/`):
- `PptxText`, `PptxBox`, `PptxShape`, `PptxImage`
- `PptxChart`, `PptxTable`
- `PptxEquation`
- `PptxRasterLayer`

These primitives render normal HTML in the browser but attach structural metadata (like `data-osd-pptx-kind`). This allows the collector to bypass error-prone DOM inference and correctly export complex structures directly into their native PPTX equivalents.

---

## Fallback Mechanisms

Web rendering supports many features PowerPoint does not (complex CSS masks, custom blend modes, complex SVG filters).
- **Diagnostics:** The collector emits a diagnostic warning for loss of fidelity.
- **Rasterization:** When a complex effect is encountered (e.g., via `PptxRasterLayer` or SVG evaluation), the system rasterizes that specific DOM element into a data URL (`rasterizeSvgDataUrl`) and embeds it as a `PptxRasterNode`.
- **Font Fallbacks:** Evaluates font stacks (e.g., converting "Iowan Old Style" to a PowerPoint-safe "Times New Roman").

---

## Testing Strategy

The system is highly tested through focused unit and integration tests:

1. **Collector Tests (`dom-collector.test.ts`):**
   - Render small DOM snippets.
   - Assert the collector correctly maps them to the expected `PptxSceneNode` properties and coordinate rects.
   - Verifies handling of `preserve-browser-lines` to fix text layout drift.

2. **Writer Tests (`write-pptx.test.ts`):**
   - Takes a static IR node (e.g., a `PptxChartNode` or `PptxEquationNode`).
   - Generates the actual `Blob`.
   - Uses `unzipSync` to extract the underlying XML files (`ppt/slides/slide1.xml`).
   - Asserts using string matching/regex that the correct PowerPoint XML tags (e.g., `prst="roundRect"`, `<m:oMathPara>`) and string contents exist. This effectively structural-tests the `.pptx` file.

3. **Gauntlet Deck:**
   - Located at `apps/demo/slides/pptx-export-gauntlet`.
   - A dedicated test deck utilized during development to manually verify edge cases and visual regressions in PowerPoint Desktop (Windows/Mac), containing instances of equations, charts, complex layouts, and fallbacks.
