import fs from 'fs';

let src = fs.readFileSync('app/portfolio/page.tsx', 'utf-8');

// ============================================================
// 1. Main wrapper: white → dark
// ============================================================
src = src.replace(
  'min-h-screen bg-white text-gray-900 font-sans',
  'min-h-screen bg-[#111] text-white font-sans'
);

// 2. Loading state
src = src.replace(
  'min-h-screen bg-white flex items-center justify-center</div><div className="flex flex-col items-center gap-3">',
  'min-h-screen bg-[#111] flex items-center justify-center</div><div className="flex flex-col items-center gap-3">'
);

// 3. Filter bar sticky header: white/90 → dark
src = src.replace(
  'className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100"',
  'className="sticky top-0 z-40 bg-[#111]/90 backdrop-blur-md border-b border-white/[0.06]"'
);

// 4. Filter button "all" inactive: text-gray-500 hover:text-gray-800 hover:bg-gray-100
src = src.replace(
  '"shrink-0 px-3.5 py-1.5 text-sm rounded-md font-medium transition-colors whitespace-nowrap ',
  '"shrink-0 px-3.5 py-1.5 text-sm rounded-md font-medium transition-colors whitespace-nowrap '
);
// Need to be more specific - the "all" button class
src = src.replace(
  'activeFilter === "all" ? "bg-gold-500 text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"',
  'activeFilter === "all" ? "bg-gold-500 text-white" : "text-white/50 hover:text-white hover:bg-white/[0.06]"'
);

// 5. Category filter buttons (inactive): text-gray-500 hover:text-gray-800 hover:bg-gray-100
src = src.replace(
  'activeFilter === key ? "bg-gold-500/10 text-gold-600" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"',
  'activeFilter === key ? "bg-gold-500/10 text-gold-500" : "text-white/50 hover:text-white hover:bg-white/[0.06]"')

// 6. More button: text-gray-400 hover:text-gray-700 hover:bg-gray-100
src = src.replace(
  'showPop ? "bg-gold-500/10 text-gold-600" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"',
  'showPop ? "bg-gold-500/10 text-gold-500" : "text-white/40 hover:text-white hover:bg-white/[0.06]"'
);

// 7. Dropdown panel: bg-white border border-gray-100 → dark
src = src.replace(
  'className="absolute left-5 top-full mt-1 z-50 min-w-[200px] bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden"',
  'className="absolute left-5 top-full mt-1 z-50 min-w-[200px] bg-[#1a1a1a] border border-white/[0.08] rounded-lg shadow-lg overflow-hidden shadow-black/50"'
);

// 8. Dropdown items inactive: text-gray-600 hover:bg-gray-50
src = src.replace(
  'text-gray-600 hover:bg-gray-50"',
  'text-white/60 hover:bg-white/[0.05]"'
);

// 9. Active dropdown item: bg-gold-50 text-gold-600 → dark
src = src.replace(
  'isActive ? "bg-gold-50 text-gold-600 font-medium"',
  'isActive ? "bg-gold-500/10 text-gold-500 font-medium"'
);

// 10. Dropdown item count: text-gray-300 → white/30
src = src.replace(
  '<span className="text-xs text-gray-300">{count}</span>',
  '<span className="text-xs text-white/30">{count}</span>'
);

// 11. Section count: text-xs text-gray-300 font-mono (category headers)
src = src.replace(
  'text-xs text-gray-300 font-mono">{images.length}</span>',
  'text-xs text-white/30 font-mono">{images.length}</span>'
);

// 12. "Others" count
src = src.replace(
  'text-xs text-gray-300 font-mono">{othersGroup.length}</span>',
  'text-xs text-white/30 font-mono">{othersGroup.length}</span>'
);

// 13. FigureCard: bg-gray-50 border border-gray-100 → dark glass
src = src.replace(
  'className="group cursor-pointer overflow-hidden rounded-lg bg-gray-50 border border-gray-100 transition-all duration-300 hover:shadow-md hover:shadow-black/5 hover:-translate-y-0.5 aspect-[4/3]"',
  'className="group cursor-pointer overflow-hidden rounded-lg bg-white/[0.03] border border-white/[0.06] transition-all duration-300 hover:shadow-md hover:shadow-gold-500/5 hover:-translate-y-0.5 aspect-[4/3]"'
);

// 14. FigureCard image container: bg-gray-50
src = src.replace(
  '<div className="relative overflow-hidden bg-gray-50 w-full h-full">',
  '<div className="relative overflow-hidden bg-white/[0.02] w-full h-full">'
);

// 15. Error placeholder in FigureCard: text-gray-300 → white/30
src = src.replace(
  '<div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">',
  '<div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-2">'
);

// 16. Footer: light → dark mode
src = src.replace(
  '<Footer />',
  '<Footer dark={true} />'
);

fs.writeFileSync('app/portfolio/page.tsx', src, 'utf-8');
console.log('✅ Portfolio page dark mode applied.');
