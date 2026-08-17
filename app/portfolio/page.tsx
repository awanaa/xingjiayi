"use client";

import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  X, ChevronRight, ChevronLeft, DollarSign,
  Image as ImageIcon, Play, BookOpen, BookText, Gift, Sparkles,
  Hand, Volume2, Puzzle, Settings2, Gem,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import QuoteForm from "../../components/QuoteForm";
import ScrollToTop from "../../components/ScrollToTop";
import { useLang } from "../../hooks/useLang";

// =============================================================================
// TYPES
// =============================================================================

interface GalleryImage { src: string; name: string; sizeKB: number; category: string; }
interface FolderData { key: string; images: GalleryImage[]; }

const TYPE_ORDER = ["yo","custom","soundlight","paperback","boardbook","cards","toys","hardcover","stickers"];

const typeMeta: Record<string, { icon: React.ReactNode; label: Record<string,string>; desc: Record<string,string> }> = {
  yo: { icon: <Gift className="w-5 h-5" />, label: { en:"YO Series", zh:"YO类", ja:"YOシリーズ", ko:"YO 시리즈" }, desc: { en:"Signature YO series products.", zh:"特色 YO 系列产品。", ja:"特徴的なYOシリーズ製品。", ko:"시그니처 YO 시리즈 제품." } },
  custom: { icon: <Settings2 className="w-5 h-5" />, label: { en:"Custom Special Binding", zh:"匠心特装定制", ja:"匠の特装カスタム", ko:"장인 맞춤 특장" }, desc: { en:"Custom special binding crafted to your specifications.", zh:"匠心特装，精工细作，满足个性化定制需求。", ja:"匠の技による特装・オーダーメイド製品。", ko:"고객 요구에 맞춰 장인 정신으로 제작하는 맞춤 특장 제품." } },
  soundlight: { icon: <Volume2 className="w-5 h-5" />, label: { en:"Sound & Light Books", zh:"声光互动书册", ja:"サウンド＆ライト絵本", ko:"음성·조명 인터랙티브 북" }, desc: { en:"Interactive books with built-in sound & light modules.", zh:"内置声光模块的互动书册，点亮阅读乐趣。", ja:"サウンド＆ライトモジュール内蔵のインタラクティブ絵本。", ko:"사운드·라이트 모듈을 내장한 인터랙티브 북으로 독서의 즐거움을 더합니다." } },
  paperback: { icon: <BookOpen className="w-5 h-5" />, label: { en:"Paperback Books", zh:"平装书刊书籍", ja:"並製本・書籍", ko:"무선제본 서적" }, desc: { en:"Paperback books with integrated printing & binding.", zh:"平装书刊书籍，印刷装订一体化。", ja:"印刷・製本を一貫生産する並製本。", ko:"인쇄·제본 일관 생산하는 무선제본 서적." } },
  boardbook: { icon: <BookText className="w-5 h-5" />, label: { en:"Board Books", zh:"板纸对裱童书", ja:"ボードブック", ko:"보드북" }, desc: { en:"Durable board books made with laminated paperboard.", zh:"厚纸板对裱工艺，耐翻耐玩。", ja:"厚紙ラミネート製の丈夫なボードブック。", ko:"두꺼운 판지 접합 공법으로 오래 사용해도 튼튼한 보드북." } },
  cards: { icon: <Puzzle className="w-5 h-5" />, label: { en:"Educational Cards", zh:"益智卡牌卡册", ja:"知育カード", ko:"교육용 카드·카드북" }, desc: { en:"Educational cards & card books for learning through play.", zh:"益智卡牌卡册，寓教于乐。", ja:"遊びながら学べる知育カード＆カードブック。", ko:"놀이로 배우는 교육용 카드 및 카드북." } },
  toys: { icon: <Hand className="w-5 h-5" />, label: { en:"Educational Toys", zh:"益智玩具类", ja:"知育玩具", ko:"교육용 장난감" }, desc: { en:"Educational toys that spark creativity.", zh:"益智玩具，启发思维。", ja:"創造力を育む知育玩具。", ko:"창의력을 키우는 교육용 장난감." } },
  hardcover: { icon: <Gem className="w-5 h-5" />, label: { en:"Hardcover Books", zh:"精装图书画册", ja:"ハードカバー図書", ko:"양장 도서·화집" }, desc: { en:"Premium hardcover books with exquisite binding.", zh:"精装图书画册，装帧考究。", ja:"装丁にこだわった上質なハードカバー図書。", ko:"정교한 제본의 프리미엄 양장 도서·화집." } },
  stickers: { icon: <Sparkles className="w-5 h-5" />, label: { en:"Sticker Books", zh:"趣味贴纸书系", ja:"シール絵本", ko:"스티커 북" }, desc: { en:"Fun sticker books full of playful activities.", zh:"趣味贴纸书系，玩趣十足。", ja:"楽しいシール遊びがいっぱいのシール絵本。", ko:"재미 가득한 스티커 놀이 북." } },
};

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function PortfolioPage() {
  const { lang, setLang } = useLang();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCatKey, setSelectedCatKey] = useState<string | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [catNames, setCatNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 优先从 CMS 读图库(后台可编辑)，fallback 到静态 JSON
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.gallery && Array.isArray(data.gallery.folders)) {
          setFolders(data.gallery.folders);
          if (Array.isArray(data.gallery.categories)) {
            const names: Record<string, string> = {};
            data.gallery.categories.forEach((c: { key: string; name: string }) => { if (c?.key) names[c.key] = c.name || c.key; });
            setCatNames(names);
          }
          setLoading(false);
        } else {
          return fetch("/gallery-index.json").then((r2) => r2.json());
        }
      })
      .then((data2) => {
        if (data2 && Array.isArray(data2)) {
          setFolders(data2);
          setLoading(false);
        }
      })
      .catch(() => {
        fetch("/gallery-index.json")
          .then((r) => r.json())
          .then((data: FolderData[]) => { setFolders(data); setLoading(false); })
          .catch(() => setLoading(false));
      });
  }, []);

  const typeGroups = React.useMemo(() => {
    const groups: Record<string, GalleryImage[]> = {};
    for (const f of folders) for (const img of f.images) {
      const cat = img.category || "uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(img);
    }
    return groups;
  }, [folders]);

  const allImages = React.useMemo(() => folders.flatMap((f) => f.images), [folders]);

  const MIN_STANDALONE = 1;

  const displayTypes = React.useMemo(() => {
    if (activeFilter === "all") {
      return TYPE_ORDER.filter((t) => (typeGroups[t]?.length ?? 0) >= MIN_STANDALONE);
    }
    return [activeFilter];
  }, [activeFilter, typeGroups]);

  const computeOthers = (groups: Record<string, GalleryImage[]>) => {
    const others: GalleryImage[] = [];
    for (const key of Object.keys(groups)) {
      if (key === "uncategorized" || (groups[key]?.length ?? 0) < MIN_STANDALONE) {
        others.push(...(groups[key] ?? []));
      }
    }
    return others.length > 0 ? others : null;
  };

  const othersGroup = React.useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "__others__") return null;
    return computeOthers(typeGroups);
  }, [typeGroups, activeFilter]);

  const hasOthers = React.useMemo(() => computeOthers(typeGroups) !== null, [typeGroups]);

  useEffect(() => { document.body.style.overflow = selectedImage ? "hidden" : "unset"; }, [selectedImage]);

  const handleImgError = useCallback((src: string) => setImageErrors((p) => new Set(p).add(src)), []);

  const t = (m: Record<string, string>) => m[lang] ?? m.en ?? "";

  const labels: Record<string, Record<string, string>> = {
    title: { en: "Product Gallery", zh: "产品展示", ja: "製品カタログ", ko: "제품 카탈로그" },
    all: { en: "All Products", zh: "全部产品", ja: "全製品", ko: "전체 제품" },
    quote: { en: "Request Quote", zh: "获取报价", ja: "見積り依頼", ko: "견적 문의" },
  };

  // 标题分两段渲染(后半段金色高亮)，随语言切换
  const titleParts: Record<string, [string, string]> = {
    en: ["Product", "Gallery"],
    zh: ["产品", "展示"],
    ja: ["製品", "カタログ"],
    ko: ["제품", "카탈로그"],
  };
  const titleNow = titleParts[lang] || titleParts.en;

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans">
      <Navbar lang={lang} onLangChange={setLang} showBackButton />

      {/* ===== HERO ===== */}
      <div className="max-w-7xl mx-auto px-5 pt-36 pb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {titleNow[0]} <span className="text-gold-500">{titleNow[1]}</span>
        </h1>
      </div>

      {/* ===== FILTER ===== */}
      <CategoryFilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        lang={lang}
        t={t}
        labels={labels}
        allImages={allImages}
        typeGroups={typeGroups}
        catNames={catNames}
        hasOthers={hasOthers}
        othersCount={othersGroup?.length ?? 0}
      />

      {/* ===== GALLERY ===== */}
      <div className="max-w-7xl mx-auto px-5 py-8 space-y-14">
        {displayTypes.map((type) => {
          if (type === "__others__") {
            if (!othersGroup) return null;
            return (
              <div key="__others__" id="cat-others">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-gold-400 w-5 h-5 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg></span>
                  <h2 className="text-lg font-semibold">{lang === "zh" ? "其他" : lang === "ja" ? "その他" : lang === "ko" ? "기타" : "Other"}</h2>
                  <span className="text-xs text-white/30 font-mono">{othersGroup.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {othersGroup.map((img, i) => (
                    <FigureCard
                      key={`others-${i}`}
                      img={img}
                      isError={imageErrors.has(img.src)}
                      onSelect={() => { setSelectedImage(img); setSelectedCatKey(img.category); }}
                      onError={() => handleImgError(img.src)}
                    />
                  ))}
                </div>
              </div>
            );
          }
          const images = typeGroups[type];
          if (!images?.length) return null;
          const meta = typeMeta[type];
          return (
            <div key={type} id={`cat-${type}`}>
              <div className="flex items-center gap-2 mb-5">
                {meta && <span className="text-gold-400 w-5 h-5 flex items-center justify-center">{meta.icon}</span>}
                <h2 className="text-lg font-semibold">{meta ? t(meta.label) : catNames[type] || type}</h2>
                <span className="text-xs text-white/30 font-mono">{images.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <FigureCard
                    key={`${type}-${i}`}
                    img={img}
                    isError={imageErrors.has(img.src)}
                    onSelect={() => { setSelectedImage(img); setSelectedCatKey(type); }}
                    onError={() => handleImgError(img.src)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-16" />

      {/* ===== LIGHTBOX ===== */}
      <Lightbox
        image={selectedImage}
        catKey={selectedCatKey}
        images={selectedCatKey ? typeGroups[selectedCatKey] ?? [] : []}
        lang={lang} t={t} labels={labels}
        onClose={() => { setSelectedImage(null); setSelectedCatKey(null); }}
        onQuote={() => setShowQuoteForm(true)}
        onNavigate={(img: GalleryImage) => setSelectedImage(img)}
      />

      {showQuoteForm && selectedImage && (
        <QuoteForm productName={selectedImage.name} lang={lang as "zh"|"en"|"ja"} onClose={() => setShowQuoteForm(false)} />
      )}

      <Footer dark={true} />
    </div>
  );
}

// =============================================================================
// FIGURE CARD
// =============================================================================

function FigureCard({ img, isError, onSelect, onError }: {
  img: GalleryImage; isError: boolean; onSelect: () => void; onError: () => void;
}) {
  return (
    <div
      role="button" tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(); }}
      className="group cursor-pointer overflow-hidden rounded-lg bg-white/[0.03] border border-white/[0.06] transition-all duration-300 hover:shadow-md hover:shadow-gold-500/5 hover:-translate-y-0.5 aspect-[4/3]"
    >
      <div className="relative overflow-hidden bg-white/[0.02] w-full h-full">
        {isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-2">
            <ImageIcon className="w-8 h-8" />
            <span className="text-[10px] px-2 text-center">{img.name}</span>
          </div>
        ) : (
          <img
            src={img.src}
            alt={img.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={onError}
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        {img.src.toLowerCase().endsWith(".gif") && (
          <div className="absolute top-2 left-2 bg-black/50 rounded-full px-2 py-0.5 text-[10px] text-white flex items-center gap-1">
            <Play className="w-2.5 h-2.5" /> GIF
          </div>
        )}
      </div>
    </div>
  );
}


// =============================================================================
// LIGHTBOX
// =============================================================================

function Lightbox({ image, catKey, images, lang, t, labels, onClose, onQuote, onNavigate }: {
  image: GalleryImage | null; catKey: string | null; images: GalleryImage[];
  lang: string; t: (m: Record<string,string>) => string; labels: Record<string,Record<string,string>>;
  onClose: () => void; onQuote: () => void; onNavigate: (img: GalleryImage) => void;
}) {
  if (!image || !catKey) return null;
  const meta = typeMeta[catKey];
  const currentIdx = images.findIndex((i) => i.src === image.src);

  const goPrev = useCallback(() => { if (currentIdx > 0) onNavigate(images[currentIdx - 1]); }, [currentIdx, images, onNavigate]);
  const goNext = useCallback(() => { if (currentIdx < images.length - 1) onNavigate(images[currentIdx + 1]); }, [currentIdx, images, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      <button onClick={onClose} className="absolute top-5 right-5 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
      <div className="absolute top-5 left-5 z-20 text-xs text-white/40 font-mono bg-white/10 px-3 py-1.5 rounded-full">
        {currentIdx + 1} / {images.length}
      </div>
      {currentIdx > 0 && (
        <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentIdx < images.length - 1 && (
        <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row items-center gap-6 z-10 px-6">
        <div className="w-full md:w-3/5 flex items-center justify-center">
          <img src={image.src} alt={image.name} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
        </div>
        <div className="w-full md:w-2/5 space-y-5">
          {meta && (
            <>
              <div>
                <div className="flex items-center gap-1.5 text-gold-400 text-xs uppercase tracking-wider mb-1">
                  <span className="w-4 h-4 flex items-center">{meta.icon}</span>
                  <span>{t(meta.label)}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{image.name}</h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{t(meta.desc)}</p>
            </>
          )}
          {!meta && <h3 className="text-xl font-semibold text-white">{image.name}</h3>}
          <div className="flex gap-2 text-xs text-white/30 font-mono">
            {image.sizeKB > 0 && <span className="bg-white/5 px-2.5 py-1 rounded">{Number(image.sizeKB).toLocaleString()} KB</span>}
            <span className="bg-white/5 px-2.5 py-1 rounded">{image.src.split(".").pop()?.toUpperCase() || "—"}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onQuote(); }} className="w-full bg-gold-500 hover:bg-gold-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <DollarSign className="w-4 h-4" />
            {labels.quote[lang]}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FILTER BAR
// =============================================================================

function CategoryFilterBar({ activeFilter, setActiveFilter, lang, t, labels, allImages, typeGroups, catNames, hasOthers, othersCount }: {
  activeFilter: string; setActiveFilter: (f: string) => void; lang: string;
  t: (m: Record<string,string>) => string; labels: Record<string,Record<string,string>>;
  allImages: any[]; typeGroups: Record<string,any[]>; catNames: Record<string,string>; hasOthers: boolean; othersCount: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const [showPop, setShowPop] = useState(false);
  const [measured, setMeasured] = useState(false);

  const allKeys = React.useMemo(() => {
    const k: string[] = ["all"];
    for (const t of TYPE_ORDER) if ((typeGroups[t]?.length ?? 0) > 0) k.push(t);
    if (hasOthers) k.push("__others__");
    return k;
  }, [typeGroups, hasOthers]);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const chips = Array.from(row.querySelectorAll("[data-chip]")) as HTMLElement[];
    const more = row.querySelector("[data-more]") as HTMLElement;
    if (!chips.length || !more) return;
    const gap = 8;
    const moreW = more.offsetWidth || 48;
    const containerW = row.clientWidth;
    const maxW = containerW - moreW - gap - 4;
    const h: string[] = [];
    let used = 0;
    let overflow = false;
    for (const chip of chips) {
      const w = chip.offsetWidth;
      const total = used + w + (used > 0 ? gap : 0);
      if (total > maxW) overflow = true;
      if (overflow) { const key = chip.getAttribute("data-chip") || ""; if (key) h.push(key); }
      else used = total;
    }
    setHiddenKeys(h);
    setMeasured(true);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!showPop) return;
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node) && moreRef.current && !moreRef.current.contains(e.target as Node))
        setShowPop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPop]);

  return (
    <div className="sticky top-0 z-40 bg-[#111]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center gap-2" style={{ visibility: measured ? "visible" : "hidden" }}>
        <div ref={rowRef} className="flex items-center gap-1.5 overflow-hidden flex-1">
          <button data-chip="all" onClick={() => setActiveFilter("all")} className={`shrink-0 px-3.5 py-1.5 text-sm rounded-md font-medium transition-colors whitespace-nowrap ${activeFilter === "all" ? "bg-gold-500 text-white" : "text-white/50 hover:text-white hover:bg-white/[0.06]"}`}>
            {labels.all[lang]}
            <span className="ml-1 text-xs opacity-50">{allImages.length}</span>
          </button>
          {allKeys.filter(k => k !== "all").map((key) => {
            const meta = key === "__others__" ? null : typeMeta[key];
            const isHidden = hiddenKeys.includes(key);
            const count = key === "__others__" ? othersCount : typeGroups[key]?.length ?? 0;
            return (
              <button key={key} data-chip={key} onClick={() => setActiveFilter(key)} className={`shrink-0 px-3 py-1.5 text-sm rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${isHidden ? "sr-only focus:not-sr-only focus:absolute" : ""} ${activeFilter === key ? "bg-gold-500/10 text-gold-500" : "text-white/50 hover:text-white hover:bg-white/[0.06]"}`}>
                {meta && <span className="w-3.5 h-3.5 flex items-center">{meta.icon}</span>}
                <span className="hidden sm:inline">{meta ? t(meta.label).split(" ")[0] : catNames[key] || (lang === "zh" ? "其他" : lang === "ja" ? "その他" : lang === "ko" ? "기타" : "Other")}</span>
                <span className="text-xs opacity-40">{count}</span>
              </button>
            );
          })}
          <button data-more ref={moreRef} onClick={() => setShowPop(!showPop)} className={`shrink-0 px-2.5 py-1.5 text-sm rounded-md font-mono font-bold transition-colors ${hiddenKeys.length === 0 ? "opacity-0 pointer-events-none" : ""} ${showPop ? "bg-gold-500/10 text-gold-500" : "text-white/40 hover:text-white hover:bg-white/[0.06]"}`}>
            +{hiddenKeys.length}
          </button>
        </div>
      </div>
      {/* Dropdown */}
      {showPop && (
        <div ref={popRef} className="absolute left-5 top-full mt-1 z-50 min-w-[200px] bg-[#1a1a1a] border border-white/[0.08] rounded-lg shadow-lg overflow-hidden shadow-black/50">
          <div className="p-1 space-y-0.5">
            {allKeys.filter(k => k !== "all").map((key) => {
              const meta = key === "__others__" ? null : typeMeta[key];
              const isActive = activeFilter === key;
              const count = key === "__others__" ? othersCount : typeGroups[key]?.length ?? 0;
              return (
                <button key={key} onClick={() => { setActiveFilter(key); setShowPop(false); }} className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${isActive ? "bg-gold-500/10 text-gold-500 font-medium" : "text-white/60 hover:bg-white/[0.05]"}`}>
                  {meta && <span className="w-4 h-4 flex items-center text-inherit">{meta.icon}</span>}
                  <span className="flex-1">{meta ? t(meta.label) : catNames[key] || (lang === "zh" ? "其他" : lang === "ja" ? "その他" : lang === "ko" ? "기타" : "Other")}</span>
                  <span className="text-xs text-white/30">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


