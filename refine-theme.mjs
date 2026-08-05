import fs from 'fs';

let src = fs.readFileSync('app/page.tsx', 'utf-8');

// ============================================================
// 1. Change all dark section backgrounds from #0a0a0a to #111
//    (more premium charcoal, less harsh than pure near-black)
//    Skip line ~851 (CTA section) — that one becomes white
// ============================================================

src = src.replaceAll(
  'bg-[#0a0a0a]/95',
  'bg-black/95'
);

// First pass: bg-[#0a0a0a] but NOT the CTA section (line ~851)
// We need to handle these carefully since line 851 is the CTA wrapper
const ctaMatch = 'snap-section relative snap-start h-screen bg-[#0a0a0a] flex flex-col items-center';

// Replace all dark section backgrounds
src = src.replaceAll(
  'className="snap-section relative snap-start h-screen flex flex-col items-center justify-center px-6 bg-[#0a0a0a] overflow-hidden"',
  'className="snap-section relative snap-start h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#111] to-[#0d0d0d] overflow-hidden"'
);

src = src.replaceAll(
  'className="snap-section relative snap-start h-screen overflow-hidden flex flex-col bg-[#0a0a0a] py-12 md:py-0"',
  'className="snap-section relative snap-start h-screen overflow-hidden flex flex-col bg-gradient-to-b from-[#111] to-[#0d0d0d] py-12 md:py-0"'
);

src = src.replaceAll(
  'className="snap-section relative snap-start h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"',
  'className="snap-section relative snap-start h-screen bg-gradient-to-b from-[#111] to-[#0d0d0d] flex flex-col items-center justify-center overflow-hidden"'
);

// CTA section: change to white/light to match portfolio page
src = src.replace(
  ctaMatch,
  'snap-section relative snap-start h-screen bg-white flex flex-col items-center'
);

// ============================================================
// 2. CTA section text colors (white → gray for light bg)
// ============================================================

// The CTA section spans from "Section 7: CTA + Footer" to the closing </section>
// We need to convert text colors inside that section

// Get the opening tag for the wrapper div inside CTA
src = src.replace(
  '<span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-semibold">',
  '<span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-semibold">'
);
// Keep gold accent as-is

// Title: text-white → text-gray-900
src = src.replace(
  'text-4xl md:text-6xl font-bold text-white mt-4 mb-6 tracking-tight leading-tight',
  'text-4xl md:text-6xl font-bold text-gray-900 mt-4 mb-6 tracking-tight leading-tight'
);

// Subtitle: text-white/70 → text-gray-500
src = src.replace(
  'text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed',
  'text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed'
);

// Secondary button: border-gold-500/30 text-white → border-gold-500/30 text-gray-900
src = src.replace(
  'border border-gold-500/30 text-white px-10 py-4 rounded-full font-medium hover:bg-gold-500/5 hover:border-gold-500 transition-all duration-300',
  'border border-gold-500/30 text-gray-900 px-10 py-4 rounded-full font-medium hover:bg-gold-500/5 hover:border-gold-500 transition-all duration-300'
);

// Primary button: text-surface-base → text-white (more readable on white bg with gold button)
src = src.replace(
  'className="bg-gold-500 text-surface-base px-10 py-4 rounded-full font-semibold hover:bg-gold-400 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 flex items-center gap-2"',
  'className="bg-gold-500 text-white px-10 py-4 rounded-full font-semibold hover:bg-gold-400 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 flex items-center gap-2"'
);

// ============================================================
// 3. Glass cards: slightly more visible on the new dark bg
// ============================================================
src = src.replaceAll('bg-white/[0.02]', 'bg-white/[0.03]');
src = src.replaceAll('border-white/[0.05]', 'border-white/[0.06]');

// ============================================================
// 4. Navigation dots: tooltip text needs to work on white bg too
// ============================================================
src = src.replace(
  'text-[10px] uppercase tracking-widest font-medium text-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
  'text-[10px] uppercase tracking-widest font-medium text-gold-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/30 backdrop-blur-sm px-2 py-1 rounded'
);

// Active dot ring: white/60 → gold-500/60 (works on both backgrounds)
src = src.replace(
  'bg-gold-500 scale-125 shadow-[0_0_10px_rgba(212,168,75,0.6)] ring-2 ring-white/60',
  'bg-gold-500 scale-125 shadow-[0_0_10px_rgba(212,168,75,0.6)] ring-2 ring-gold-500/60'
);

// ============================================================
// 5. Process card overlay: bg-[#0a0a0a]/95 → bg-black/95
//    (already replaced via replaceAll above)
// ============================================================

// ============================================================
// 6. Hero section: keep its existing bg classes (it already uses gradient overlays)
//    But the wrapper div (#378) was bg-[#0a0a0a]. Change it.
// ============================================================
// The wrapper at line 378 uses bg-[#0a0a0a] — we need to handle it
// It's the main <div> wrapper. Let's find and replace it.
src = src.replace(
  'className="bg-[#0a0a0a] text-white font-sans selection:bg-gold-500 selection:text-surface-base"',
  'className="bg-[#111] text-white font-sans selection:bg-gold-500 selection:text-surface-base"'
);

fs.writeFileSync('app/page.tsx', src, 'utf-8');
console.log('✅ Homepage color refinement applied.');
console.log('Changes:');
console.log('  - Dark sections: bg-gradient-to-b from-[#111] to-[#0d0d0d]');
console.log('  - CTA section: bg-white (matching portfolio)');
console.log('  - CTA text: white titles → gray-900, white/70 subs → gray-500');
console.log('  - Glass cards: slightly more visible borders');
console.log('  - Nav dots: visible on both dark & light backgrounds');
