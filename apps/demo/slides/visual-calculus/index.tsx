import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { PptxBox, PptxEquation, PptxGroup, PptxShape, PptxText } from '@open-slide/core';
import coverImg from './assets/cover.png';

export const design: DesignSystem = {
  palette: {
    bg: '#FAF8F5',
    text: '#1E293B',
    accent: '#4F46E5',
  },
  fonts: {
    display: 'Georgia, "Times New Roman", serif',
    body: 'system-ui, -apple-system, "Inter", sans-serif',
  },
  typeScale: {
    hero: 148,
    body: 34,
  },
  radius: 12,
};

const palette = {
  bg: '#FAF8F5',
  text: '#1E293B',
  accent: '#4F46E5',
  secondary: '#E11D48',
  muted: '#64748B',
  faint: '#E2E8F0',
  surface: '#FFFFFF',
  grid: '#EAE6E1',
};

const fonts = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'system-ui, -apple-system, "Inter", sans-serif',
  mono: '"Cascadia Mono", Menlo, Monaco, Consolas, monospace',
};

const fill = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: fonts.sans,
} as const;

const PadX = 120;
const PadY = 100;

const GridBg = () => (
  <svg
    width="100%"
    height="100%"
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45 }}
    aria-hidden="true"
    role="presentation"
  >
    <defs>
      <pattern id="calc-grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke={palette.grid} strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#calc-grid)" />
  </svg>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <PptxText
    style={{
      fontFamily: fonts.sans,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
    }}
  >
    {children}
  </PptxText>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: fonts.serif,
      fontSize: 76,
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '-0.025em',
      color: 'var(--osd-text)',
      margin: '24px 0 0',
    }}
  >
    {children}
  </h1>
);

const Footer = ({ pageNum, total, topic }: { pageNum: number; total: number; topic?: string }) => (
  <PptxGroup
    style={{
      position: 'absolute',
      left: PadX,
      right: PadX,
      bottom: 50,
    }}
  >
    <PptxShape
      shape="line"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 1,
        borderTop: `1px solid ${palette.faint}`,
      }}
    />
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 18,
        fontFamily: fonts.sans,
        fontSize: 18,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: palette.muted,
      }}
    >
      <span>Visualizing Calculus {topic ? `· ${topic}` : ''}</span>
      <span>
        {String(pageNum).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  </PptxGroup>
);

const TOTAL_PAGES = 7;

/* ─────────────── 1. Cover Slide ─────────────── */
const Cover: Page = () => (
  <div style={{ ...fill, padding: `${PadY}px ${PadX}px` }}>
    <GridBg />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 64,
        height: '100%',
        alignItems: 'center',
      }}
    >
      <div
        style={{ zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Eyebrow>A Geometric Journey</Eyebrow>
        <h1
          style={{
            fontFamily: fonts.serif,
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: '36px 0 28px',
            color: 'var(--osd-text)',
          }}
        >
          Calculus
          <br />
          <span
            style={{ color: 'var(--osd-accent)', fontStyle: 'italic', fontFamily: fonts.serif }}
          >
            Visualized.
          </span>
        </h1>
        <div
          style={{
            height: 2,
            width: 320,
            background: 'var(--osd-accent)',
            margin: '12px 0 36px',
          }}
        />
        <p
          style={{
            fontSize: 34,
            lineHeight: 1.5,
            color: palette.muted,
            fontWeight: 300,
            margin: 0,
            maxWidth: 720,
          }}
        >
          Taming the infinite, measuring continuous change, and uncovering the deep connection
          between rates and areas.
        </p>
      </div>

      <PptxBox
        style={{
          height: 620,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(79, 70, 229, 0.12)',
          border: `1px solid ${palette.faint}`,
          background: palette.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={coverImg}
          alt="Calculus visualization"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </PptxBox>
    </div>
    <Footer pageNum={1} total={TOTAL_PAGES} topic="Introduction" />
  </div>
);

/* ─────────────── 2. Core Intuition Slide ─────────────── */
const CoreIntuition: Page = () => (
  <div style={{ ...fill, padding: `${PadY}px ${PadX}px` }}>
    <GridBg />
    <div>
      <Eyebrow>The Big Shift</Eyebrow>
      <Title>Static Algebra vs. Dynamic Calculus</Title>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 54 }}>
        {/* Left Column: Algebra */}
        <PptxBox
          style={{
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 16,
            padding: 44,
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 44 }}>📐</span>
            <h3 style={{ fontFamily: fonts.serif, fontSize: 38, fontWeight: 700, margin: 0 }}>
              Classical Geometry & Algebra
            </h3>
          </div>
          <p
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              color: palette.muted,
              marginTop: 24,
              marginBottom: 36,
            }}
          >
            Models a world frozen in time. Objects move at constant speeds, lines are straight, and
            shapes have flat, rigid borders.
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'center', height: 200, alignItems: 'center' }}
          >
            <svg width="360" height="160" viewBox="0 0 360 160">
              {/* Straight line graph */}
              <line x1="20" y1="140" x2="340" y2="140" stroke={palette.faint} strokeWidth="3" />
              <line x1="40" y1="150" x2="40" y2="20" stroke={palette.faint} strokeWidth="3" />

              {/* Linear Function */}
              <line x1="40" y1="130" x2="300" y2="40" stroke={palette.muted} strokeWidth="4" />
              <circle cx="170" cy="85" r="8" fill={palette.muted} />

              {/* Constant slope label */}
              <text
                x="185"
                y="80"
                fontFamily={fonts.sans}
                fontSize="20"
                fill={palette.muted}
                fontWeight="600"
              >
                Constant Slope (m)
              </text>
            </svg>
          </div>
        </PptxBox>

        {/* Right Column: Calculus */}
        <PptxBox
          style={{
            background: palette.surface,
            border: `1px solid ${palette.accent}`,
            borderRadius: 16,
            padding: 44,
            boxShadow: '0 15px 35px rgba(79, 70, 229, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 44, color: 'var(--osd-accent)' }}>⚡</span>
            <h3
              style={{
                fontFamily: fonts.serif,
                fontSize: 38,
                fontWeight: 700,
                margin: 0,
                color: 'var(--osd-accent)',
              }}
            >
              The Calculus Paradigm
            </h3>
          </div>
          <p
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              color: palette.muted,
              marginTop: 24,
              marginBottom: 36,
            }}
          >
            Models a fluid, organic universe. Systems accelerate, curves bend, populations expand,
            and change is continuous.
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'center', height: 200, alignItems: 'center' }}
          >
            <svg width="360" height="160" viewBox="0 0 360 160">
              {/* Curved function */}
              <line x1="20" y1="140" x2="340" y2="140" stroke={palette.faint} strokeWidth="3" />
              <line x1="40" y1="150" x2="40" y2="20" stroke={palette.faint} strokeWidth="3" />

              {/* Parabolic curve */}
              <path
                d="M 40,130 Q 180,130 300,30"
                fill="none"
                stroke="var(--osd-accent)"
                strokeWidth="4"
              />

              {/* Tangent line at a point */}
              <circle cx="210" cy="90" r="8" fill={palette.secondary} />
              <line x1="140" y1="125" x2="280" y2="55" stroke={palette.secondary} strokeWidth="3" />

              <text
                x="225"
                y="115"
                fontFamily={fonts.sans}
                fontSize="20"
                fill={palette.secondary}
                fontWeight="600"
              >
                Changing Tangent
              </text>
            </svg>
          </div>
        </PptxBox>
      </div>
    </div>
    <Footer pageNum={2} total={TOTAL_PAGES} topic="Core Paradigm" />
  </div>
);

/* ─────────────── 3. The Limit Slide ─────────────── */
const Limit: Page = () => (
  <div style={{ ...fill, padding: `${PadY}px ${PadX}px` }}>
    <GridBg />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        height: '100%',
        alignItems: 'center',
      }}
    >
      <div>
        <Eyebrow>Foundation</Eyebrow>
        <Title>The Limit: Gateway to the Infinite</Title>
        <p
          style={{
            fontSize: 26,
            lineHeight: 1.55,
            color: palette.muted,
            marginTop: 32,
            marginBottom: 44,
          }}
        >
          How do we find the slope of a curve at a single, instantaneous point? Geometry requires
          two points to draw a line.
          <br />
          <br />
          Calculus solves this by placing a second point $h$ distance away, then taking the limit as
          $h$ collapses to zero.
        </p>

        <PptxBox
          style={{
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 12,
            padding: '28px 36px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
            display: 'inline-block',
          }}
        >
          <PptxEquation
            latex="\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}"
            style={{
              fontFamily: fonts.serif,
              fontSize: 42,
              color: 'var(--osd-accent)',
            }}
          />
        </PptxBox>
      </div>

      {/* Static Diagram of Secant lines merging to Tangent */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PptxBox
          style={{
            width: 580,
            height: 520,
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 16,
            padding: 30,
            boxShadow: '0 20px 48px rgba(0,0,0,0.03)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 30,
              fontFamily: fonts.sans,
              fontSize: 20,
              color: palette.muted,
              fontWeight: 500,
            }}
          >
            Visualizing: Secants approaching Tangent
          </div>

          <svg width="520" height="440" viewBox="0 0 520 440" style={{ marginTop: 24 }}>
            {/* Coordinate System Grid lines */}
            <line x1="50" y1="380" x2="480" y2="380" stroke={palette.faint} strokeWidth="2" />
            <line x1="70" y1="400" x2="70" y2="40" stroke={palette.faint} strokeWidth="2" />

            {/* Function Curve */}
            <path
              d="M 70,350 Q 240,330 430,90"
              fill="none"
              stroke="var(--osd-text)"
              strokeWidth="3"
              opacity="0.4"
            />

            {/* Static Point P (x, f(x)) */}
            <circle cx="210" cy="300" r="7" fill="var(--osd-text)" />
            <text
              x="210"
              y="328"
              fontFamily={fonts.sans}
              fontSize="18"
              fill="var(--osd-text)"
              textAnchor="middle"
              fontWeight="600"
            >
              P(x)
            </text>

            {/* Secant line (Far, h = large) */}
            <line
              x1="90"
              y1="365"
              x2="450"
              y2="135"
              stroke={palette.muted}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.4"
            />
            <circle cx="370" cy="180" r="6" fill={palette.muted} opacity="0.4" />
            <text
              x="370"
              y="150"
              fontFamily={fonts.sans}
              fontSize="16"
              fill={palette.muted}
              textAnchor="middle"
              opacity="0.4"
            >
              Q₁ (h large)
            </text>

            {/* Secant line (Closer, h = medium) */}
            <line
              x1="110"
              y1="347"
              x2="450"
              y2="185"
              stroke={palette.muted}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.7"
            />
            <circle cx="290" cy="250" r="6" fill={palette.muted} opacity="0.7" />
            <text
              x="290"
              y="220"
              fontFamily={fonts.sans}
              fontSize="16"
              fill={palette.muted}
              textAnchor="middle"
              opacity="0.7"
            >
              Q₂
            </text>

            {/* Secant line (Very close, h = small) */}
            <line
              x1="120"
              y1="337"
              x2="450"
              y2="202"
              stroke={palette.muted}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <circle cx="240" cy="280" r="6" fill={palette.muted} />
            <text
              x="248"
              y="255"
              fontFamily={fonts.sans}
              fontSize="16"
              fill={palette.muted}
              textAnchor="middle"
            >
              Q₃
            </text>

            {/* Tangent line (h -> 0, instantaneous slope) */}
            <line x1="130" y1="332" x2="450" y2="208" stroke={palette.secondary} strokeWidth="4" />
            <text
              x="390"
              y="250"
              fontFamily={fonts.sans}
              fontSize="20"
              fill={palette.secondary}
              fontWeight="700"
            >
              Tangent (Limit)
            </text>
          </svg>
        </PptxBox>
      </div>
    </div>
    <Footer pageNum={3} total={TOTAL_PAGES} topic="The Limit" />
  </div>
);

/* ─────────────── 4. The Derivative Slide ─────────────── */
const Derivative: Page = () => (
  <div style={{ ...fill, padding: `${PadY}px ${PadX}px` }}>
    <GridBg />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 64,
        height: '100%',
        alignItems: 'center',
      }}
    >
      <div>
        <Eyebrow>Differential Calculus</Eyebrow>
        <Title>The Derivative: Instancy Labeled</Title>
        <p
          style={{
            fontSize: 26,
            lineHeight: 1.55,
            color: palette.muted,
            marginTop: 32,
            marginBottom: 44,
          }}
        >
          The derivative measures the slope or rate of change at any point along a function. It
          converts a curved graph into a map of trajectories.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ fontSize: 28, color: 'var(--osd-accent)', fontWeight: 'bold' }}>
              Slope formula:
            </span>
            <PptxEquation
              latex="m = \frac{\Delta y}{\Delta x}"
              style={{ fontSize: 32, fontFamily: fonts.serif, color: palette.muted }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ fontSize: 28, color: palette.secondary, fontWeight: 'bold' }}>
              Derivative:
            </span>
            <PptxEquation
              latex="f'(x) = \frac{dy}{dx}"
              style={{ fontSize: 32, fontFamily: fonts.serif, color: palette.secondary }}
            />
          </div>
        </div>
      </div>

      {/* Derivative graph showing run/rise */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PptxBox
          style={{
            width: 580,
            height: 520,
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 16,
            padding: 30,
            boxShadow: '0 20px 48px rgba(0,0,0,0.03)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 30,
              fontFamily: fonts.sans,
              fontSize: 20,
              color: palette.muted,
              fontWeight: 500,
            }}
          >
            Graphing: Slope Triangle ($\Delta x, \Delta y$)
          </div>

          <svg width="520" height="440" viewBox="0 0 520 440" style={{ marginTop: 24 }}>
            {/* Grid Lines */}
            <line x1="50" y1="360" x2="480" y2="360" stroke={palette.faint} strokeWidth="2" />
            <line x1="80" y1="390" x2="80" y2="40" stroke={palette.faint} strokeWidth="2" />

            {/* Parabola: f(x) = x^2 style */}
            <path
              d="M 80,360 Q 230,360 400,100"
              fill="none"
              stroke="var(--osd-accent)"
              strokeWidth="4"
            />

            {/* Point (x, y) */}
            <circle cx="240" cy="303" r="7" fill="var(--osd-text)" />
            <text
              x="220"
              y="325"
              fontFamily={fonts.sans}
              fontSize="18"
              fill="var(--osd-text)"
              fontWeight="600"
            >
              (x, y)
            </text>

            {/* Point (x + dx, y + dy) */}
            <circle cx="360" cy="160" r="7" fill="var(--osd-text)" />

            {/* Slope Triangle lines */}
            <line
              x1="240"
              y1="303"
              x2="360"
              y2="303"
              stroke={palette.secondary}
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
            <line
              x1="360"
              y1="303"
              x2="360"
              y2="160"
              stroke={palette.secondary}
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />

            {/* Labels */}
            <text
              x="300"
              y="335"
              fontFamily={fonts.sans}
              fontSize="18"
              fill={palette.secondary}
              textAnchor="middle"
              fontWeight="600"
            >
              Run: dx
            </text>
            <text
              x="395"
              y="235"
              fontFamily={fonts.sans}
              fontSize="18"
              fill={palette.secondary}
              textAnchor="middle"
              fontWeight="600"
            >
              Rise: dy
            </text>

            {/* Tangent line at (x,y) */}
            <line x1="150" y1="390" x2="390" y2="150" stroke={palette.secondary} strokeWidth="3" />
          </svg>
        </PptxBox>
      </div>
    </div>
    <Footer pageNum={4} total={TOTAL_PAGES} topic="The Derivative" />
  </div>
);

/* ─────────────── 5. The Integral Slide ─────────────── */
const Integral: Page = () => (
  <div style={{ ...fill, padding: `${PadY}px ${PadX}px` }}>
    <GridBg />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 64,
        height: '100%',
        alignItems: 'center',
      }}
    >
      <div>
        <Eyebrow>Integral Calculus</Eyebrow>
        <Title>The Integral: Accumulation of Area</Title>
        <p
          style={{
            fontSize: 26,
            lineHeight: 1.55,
            color: palette.muted,
            marginTop: 32,
            marginBottom: 44,
          }}
        >
          Integration sums up infinite infinitely thin pieces to calculate a whole. Visually, it is
          the exact area nested underneath a curve.
          <br />
          <br />
          We start by placing rectangles (Riemann Sums). As the widths of these rectangles shrink
          toward zero, their sum converges on the precise area.
        </p>

        <PptxBox
          style={{
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 12,
            padding: '24px 32px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
            display: 'inline-block',
          }}
        >
          <PptxEquation
            latex="\int_{a}^{b} f(x) \, dx = \lim_{\Delta x \to 0} \sum_{i=1}^{n} f(x_i) \Delta x"
            style={{
              fontFamily: fonts.serif,
              fontSize: 34,
              color: 'var(--osd-accent)',
            }}
          />
        </PptxBox>
      </div>

      {/* Riemann sums static side */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PptxBox
          style={{
            width: 580,
            height: 520,
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 16,
            padding: 30,
            boxShadow: '0 20px 48px rgba(0,0,0,0.03)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 30,
              fontFamily: fonts.sans,
              fontSize: 20,
              color: palette.muted,
              fontWeight: 500,
            }}
          >
            Visualizing: Riemann Sum Partition (n = 12)
          </div>

          <svg width="520" height="440" viewBox="0 0 520 440" style={{ marginTop: 24 }}>
            {/* Grid Axes */}
            <line x1="50" y1="360" x2="480" y2="360" stroke={palette.faint} strokeWidth="2" />
            <line x1="80" y1="390" x2="80" y2="40" stroke={palette.faint} strokeWidth="2" />

            {/* Area rectangles under curve (Static layout) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const width = 26;
              const x = 100 + i * width;
              // quadratic/sine model curve height
              const curveY = 240 + Math.sin(i * 0.45) * 50 - i * i * 0.45;
              const height = 360 - Math.max(70, Math.min(320, curveY));
              const y = 360 - height;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="rgba(79, 70, 229, 0.25)"
                  stroke="var(--osd-accent)"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Continuous Curve */}
            <path
              d="M 80,240 C 150,120 280,280 440,80"
              fill="none"
              stroke="var(--osd-text)"
              strokeWidth="3"
            />

            <text
              x="260"
              y="60"
              fontFamily={fonts.sans}
              fontSize="18"
              fill="var(--osd-accent)"
              textAnchor="middle"
              fontWeight="700"
            >
              Area under curve ≈ ∑ f(xᵢ)·Δx
            </text>
          </svg>
        </PptxBox>
      </div>
    </div>
    <Footer pageNum={5} total={TOTAL_PAGES} topic="The Integral" />
  </div>
);

/* ─────────────── 6. The Fundamental Theorem Slide ─────────────── */
const FundamentalTheorem: Page = () => (
  <div style={{ ...fill, padding: `${PadY}px ${PadX}px` }}>
    <GridBg />
    <div>
      <Eyebrow>The Twin Pillars</Eyebrow>
      <Title>The Fundamental Theorem of Calculus</Title>

      <p
        style={{
          fontSize: 26,
          lineHeight: 1.5,
          color: palette.muted,
          marginTop: 24,
          marginBottom: 40,
          maxWidth: 1400,
        }}
      >
        The peak of calculus is the realization that **differentiation** and **integration** are
        inverse operations. One tears a function apart into rates; the other glues it back together
        to accumulate areas.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* Part 1 */}
        <PptxBox
          style={{
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 16,
            padding: 40,
            boxShadow: '0 12px 30px rgba(0,0,0,0.02)',
          }}
        >
          <span
            style={{
              fontSize: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--osd-accent)',
              fontWeight: 600,
            }}
          >
            Part 1: The Rate of Accumulation
          </span>
          <div style={{ margin: '28px 0' }}>
            <PptxEquation
              latex="\frac{d}{dx} \int_{a}^{x} f(t) \, dt = f(x)"
              style={{ fontSize: 38, fontFamily: fonts.serif, color: 'var(--osd-text)' }}
            />
          </div>
          <p style={{ fontSize: 22, lineHeight: 1.5, color: palette.muted, margin: 0 }}>
            Shows that the rate of change of an accumulation function is the original function
            itself. Differentiation cancels out integration.
          </p>
        </PptxBox>

        {/* Part 2 */}
        <PptxBox
          style={{
            background: palette.surface,
            border: `1px solid ${palette.faint}`,
            borderRadius: 16,
            padding: 40,
            boxShadow: '0 12px 30px rgba(0,0,0,0.02)',
          }}
        >
          <span
            style={{
              fontSize: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: palette.secondary,
              fontWeight: 600,
            }}
          >
            Part 2: Evaluation of Net Change
          </span>
          <div style={{ margin: '28px 0' }}>
            <PptxEquation
              latex="\int_{a}^{b} f(x) \, dx = F(b) - F(a)"
              style={{ fontSize: 38, fontFamily: fonts.serif, color: 'var(--osd-text)' }}
            />
          </div>
          <p style={{ fontSize: 22, lineHeight: 1.5, color: palette.muted, margin: 0 }}>
            Allows us to evaluate the total accumulated area under a curve easily by calculating the
            anti-derivative $F$ at the boundaries.
          </p>
        </PptxBox>
      </div>
    </div>
    <Footer pageNum={6} total={TOTAL_PAGES} topic="Fundamental Theorem" />
  </div>
);

/* ─────────────── 7. Closing Slide ─────────────── */
const Closing: Page = () => (
  <div
    style={{
      ...fill,
      padding: `${PadY}px ${PadX}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <GridBg />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Eyebrow>Summary</Eyebrow>
      <h2
        style={{
          fontFamily: fonts.serif,
          fontSize: 104,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          margin: '36px 0 32px',
        }}
      >
        The Language of the
        <br />
        <span style={{ color: 'var(--osd-accent)' }}>Dynamic Universe.</span>
      </h2>
      <div
        style={{
          height: 2,
          width: 480,
          background: 'var(--osd-accent)',
          margin: '32px 0',
        }}
      />
      <p
        style={{
          fontSize: 32,
          lineHeight: 1.55,
          color: palette.muted,
          maxWidth: 1100,
          margin: 0,
          fontWeight: 300,
        }}
      >
        Calculus is not just a branch of math — it is the scaffolding on which we construct models
        for planetary orbits, epidemiology curves, economic fluctuations, and deep learning
        algorithms. It gives us a finite handle on the infinite process of change.
      </p>
    </div>
    <Footer pageNum={7} total={TOTAL_PAGES} topic="Conclusion" />
  </div>
);

export const meta: SlideMeta = { title: 'Calculus Visualized' };
export default [
  Cover,
  CoreIntuition,
  Limit,
  Derivative,
  Integral,
  FundamentalTheorem,
  Closing,
] satisfies Page[];
