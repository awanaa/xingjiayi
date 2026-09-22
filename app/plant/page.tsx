"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Cpu, ThermometerSnowflake, Layers, Factory,
  PenTool, Printer, Scissors, Wind, Thermometer, Droplets, Activity,
  ShieldCheck, Truck, ChevronDown, ArrowUpRight, Sparkles, Target
} from "lucide-react";
import Navbar from "../../components/Navbar";
import OptimizedImage from "../../components/OptimizedImage";
import Footer from "../../components/Footer";
import { useLang } from "../../hooks/useLang";
import type { SiteContent, LocaleString } from "../../lib/cms";

/* ── Scroll Reveal ── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ── Animated Counter ── */
function CountUp({ end, suffix = "", duration = 2000, started }: { end: number; suffix?: string; duration?: number; started: boolean }) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!started || done.current) return;
    done.current = true;
    let start: number | null = null;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.floor(ease * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);
  return <>{val}{suffix}</>;
}

// ── CMS 数据接入 ──
const LS = (ls: LocaleString | undefined, lang: string, fallback: string) => {
  if (!ls) return fallback;
  const v = ls[lang as keyof LocaleString];
  return v || ls.en || fallback;
};

function useCmsPlant() {
  const [plant, setPlant] = useState<SiteContent["plant"] | null>(null);
  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.plant) {
          setPlant(data.plant as SiteContent["plant"]);
        }
      })
      .catch(() => {});
  }, []);
  return plant;
}

export default function IntelligentPlant() {
  const { lang, setLang } = useLang();
  const cmsPlant = useCmsPlant();

  const [statsRef, statsIn] = useInView(0.3);
  const [processRef, processIn] = useInView(0.15);

  const t0 = {
    en: {
      heroOver: "Since 2001",
      heroTitle: "Where Precision",
      heroAccent: "Meets Production",
      heroDesc: "Step inside our 20,000m² smart facility — 50%+ automation rate, 24/7 climate control, and a team of 250+ master craftsmen turning raw sheets into award-winning books.",
      scroll: "Scroll to explore",
      stats: [
        { end: 50, suffix: "%+", label: "Automation" },
        { end: 24, suffix: "/7", label: "Climate Control" },
        { end: 20, suffix: "k m²", label: "Production Area" },
        { end: 250, suffix: "+", label: "Team Members" },
      ],
      processTitle: "Production Process",
      processSub: "From raw material to finished book — every step quality-controlled",
      steps: [
        { subTitle: "Prepress & Proofing", title: "Design & Prepress", desc: "Structural design, file prep, CTP plate-making", img: "/process-illustrations/process-01.webp" },
        { subTitle: "Precision Printing", title: "Printing", desc: "Heidelberg offset / UV / digital on premium stock", img: "/process-illustrations/process-02.webp" },
        { subTitle: "Premium Finishing", title: "Die-Cutting", desc: "High-precision automated cutting & creasing", img: "/process-illustrations/process-03.webp" },
        { subTitle: "Die-Cutting & Binding", title: "Surface & Binding", desc: "Foil stamping, lamination, hand-assembly", img: "/process-illustrations/process-04.webp" },
        { subTitle: "Manual Assembly & QC", title: "QC Inspection", desc: "EN71 / ASTM / ISO — full quality gate checks", img: "/process-illustrations/process-05.webp" },
        { subTitle: "Packaging & Global Delivery", title: "Warehouse & Dispatch", desc: "Stereo warehouse, global logistics", img: "/process-illustrations/process-06.webp" },
      ],
      equipTitle: "Our Equipment",
      equipSub: "German precision, Japanese efficiency — the tools behind the craft",
      equipItems: [
        { title: "Automated Laminating Machines", desc: "High-precision lamination and gluing for smooth, durable finishes", img: "/real-factory/IMG_5121.webp" },
        { title: "Automated Die-Cutting Lines", desc: "CNC-controlled cutting, creasing, and embossing in one pass", img: "/real-factory/IMG_5271.webp" },
      ],
      certTitle: "Certifications",
      ctaTitle: "See It in Action",
      ctaDesc: "Schedule a virtual tour or visit our Shenzhen facility",
      ctaBtn: "Get in Touch",
    },
    zh: {
      heroOver: "始于2001",
      heroTitle: "精密与效率",
      heroAccent: "在此交汇",
      heroDesc: "走进星嘉艺20,000平方米智慧工厂——50%+自动化率、24小时恒温恒湿、250+工匠团队，每一本好书的诞生，都从这里开始。",
      scroll: "向下探索",
      stats: [
        { end: 50, suffix: "%+", label: "自动化率" },
        { end: 24, suffix: "小时", label: "恒温控制" },
        { end: 20, suffix: "k m²", label: "生产面积" },
        { end: 250, suffix: "+", label: "工匠团队" },
      ],
      processTitle: "生产流程",
      processSub: "从原材料到成品书——每一步严格品控",
      steps: [
        { subTitle: "印前和打样", title: "设计与制版", desc: "结构设计、文件处理、CTP制版", img: "/process-illustrations/process-01.webp" },
        { subTitle: "精密印刷", title: "印刷", desc: "海德堡胶印/UV/数码印刷", img: "/process-illustrations/process-02.webp" },
        { subTitle: "高端表面处理", title: "模切", desc: "高精度自动模切压痕", img: "/process-illustrations/process-03.webp" },
        { subTitle: "模切和装订", title: "表面与装订", desc: "烫金、裱糊、手工组装", img: "/process-illustrations/process-04.webp" },
        { subTitle: "手工组装和质检", title: "质检", desc: "EN71 / ASTM / ISO 全检", img: "/process-illustrations/process-05.webp" },
        { subTitle: "包装仓储和全球交付", title: "仓储与发货", desc: "立体仓管理，全球物流", img: "/process-illustrations/process-06.webp" },
      ],
      equipTitle: "核心设备",
      equipSub: "德国精度、日本效率——匠艺背后的硬实力",
      equipItems: [
        { title: "全自动过胶机", desc: "高精度覆膜与过胶工艺，确保表面平整耐用", img: "/real-factory/IMG_5121.webp" },
        { title: "自动模切生产线", desc: "CNC数控裁切、压痕、压凸一次完成", img: "/real-factory/IMG_5271.webp" },
      ],
      certTitle: "资质认证",
      ctaTitle: "实地探访",
      ctaDesc: "预约参观深圳工厂，亲眼见证自动化的力量",
      ctaBtn: "联系我们",
    },
    ja: {
      heroOver: "2001年創業",
      heroTitle: "精密と効率が",
      heroAccent: "交差する場所",
      heroDesc: "20,000m²のスマート工場——50%超の自動化率、24時間温度管理、250+の熟練職人。すべての良書はここから始まります。",
      scroll: "スクロール",
      stats: [
        { end: 50, suffix: "%+", label: "自動化率" },
        { end: 24, suffix: "時間", label: "温度管理" },
        { end: 20, suffix: "k m²", label: "生産面積" },
        { end: 250, suffix: "+", label: "熟練職人" },
      ],
      processTitle: "生産フロー",
      processSub: "原材料から完成品まで——すべての工程を厳格に品質管理",
      steps: [
        { subTitle: "プリプレス＆校正", title: "設計・製版", desc: "構造設計、ファイル処理、CTP製版", img: "/process-illustrations/process-01.webp" },
        { subTitle: "精密印刷", title: "印刷", desc: "ハイデルベルグ オフセット/UV/デジタル印刷", img: "/process-illustrations/process-02.webp" },
        { subTitle: "高級表面加工", title: "抜き加工", desc: "高精度自動抜型加工", img: "/process-illustrations/process-03.webp" },
        { subTitle: "抜型＆製本", title: "表面・製本", desc: "箔押し、ラミネート、手組み", img: "/process-illustrations/process-04.webp" },
        { subTitle: "インタラクティブ組立＆品質管理", title: "品質検査", desc: "EN71 / ASTM / ISO 全数検査", img: "/process-illustrations/process-05.webp" },
        { subTitle: "梱包＆グローバル納品", title: "保管・出荷", desc: "立体倉庫、グローバル物流", img: "/process-illustrations/process-06.webp" },
      ],
      equipTitle: "主要設備",
      equipSub: "ドイツの精度、日本の効率——ものづくりを支える力",
      equipItems: [
        { title: "自動ラミネート・糊付け機", desc: "高精度な表面加工と接着により、滑らかで耐久性のある仕上がりを実現", img: "/real-factory/IMG_5121.webp" },
        { title: "自動抜型ライン", desc: "CNC裁断、罫線、エンボスを一貫処理", img: "/real-factory/IMG_5271.webp" },
      ],
      certTitle: "認証資格",
      ctaTitle: "工場見学",
      ctaDesc: "スマート工場をぜひご覧ください",
      ctaBtn: "お問い合わせ",
    },
    ko: {
      heroOver: "2001년 설립",
      heroTitle: "정밀함과 효율성이",
      heroAccent: "교차하는 곳",
      heroDesc: "20,000m² 규모의 스마트 공장——50% 이상의 자동화율, 24시간 온도 제어, 250명 이상의 숙련된 장인. 모든 훌륭한 책은 이곳에서 시작됩니다.",
      scroll: "스크롤하여 탐색",
      stats: [
        { end: 50, suffix: "%+", label: "자동화율" },
        { end: 24, suffix: "시간", label: "온도 제어" },
        { end: 20, suffix: "k m²", label: "생산 면적" },
        { end: 250, suffix: "+", label: "숙련된 장인" },
      ],
      processTitle: "생산 공정",
      processSub: "원자재부터 완제품까지——모든 공정을 엄격하게 품질 관리합니다.",
      steps: [
        { subTitle: "인쇄 전 및 교정", title: "설계 및 제판", desc: "구조 설계, 파일 처리, CTP 제판", img: "/process-illustrations/process-01.webp" },
        { subTitle: "정밀 인쇄", title: "인쇄", desc: "하이델베르그 오프셋/UV/디지털 인쇄", img: "/process-illustrations/process-02.webp" },
        { subTitle: "고급 표면 처리", title: "다이 커팅", desc: "고정밀 자동 다이 커팅", img: "/process-illustrations/process-03.webp" },
        { subTitle: "다이 커팅 및 제본", title: "표면 및 제본", desc: "금박, 라미네이팅, 수작업 조립", img: "/process-illustrations/process-04.webp" },
        { subTitle: "수작업 조립 및 품질 검사", title: "품질 검사", desc: "EN71 / ASTM / ISO 전수 검사", img: "/process-illustrations/process-05.webp" },
        { subTitle: "포장 및 글로벌 배송", title: "창고 및 배송", desc: "입체 창고 관리, 글로벌 물류", img: "/process-illustrations/process-06.webp" },
      ],
      equipTitle: "핵심 설비",
      equipSub: "독일의 정밀함, 일본의 효율성——장인 정신을 뒷받침하는 힘",
      equipItems: [
        { title: "자동 라미네이팅 기계", desc: "고정밀 표면 처리 및 접착으로 매끄럽고 내구성 있는 마감 보장", img: "/real-factory/IMG_5121.webp" },
        { title: "자동 다이 커팅 라인", desc: "CNC 절단, 크리징, 엠보싱 원스톱 처리", img: "/real-factory/IMG_5271.webp" },
      ],
      certTitle: "인증 및 자격",
      ctaTitle: "공장 견학",
      ctaDesc: "스마트 공장을 방문하여 자동화의 힘을 직접 확인하십시오",
      ctaBtn: "문의하기",
    },
  }[lang as "en" | "zh" | "ja" | "ko"] || {
    /* Fallback to EN if undefined */
    heroOver: "Since 2001", heroTitle: "Where Precision", heroAccent: "Meets Efficiency", heroDesc: "", scroll: "Scroll", stats: [], processTitle: "", processSub: "", steps: [], equipTitle: "", equipSub: "", equipItems: [], certTitle: "", ctaTitle: "", ctaDesc: "", ctaBtn: ""
  };

  // ── CMS 数据优先，硬编码为 fallback ──
  const cms = cmsPlant;
  const L = (ls: LocaleString | undefined, fallback: string) => LS(ls, lang, fallback);
  const fallbackCertifications = [
    { src: "/certificate/ISO_9001-2015.png", name: "ISO 9001" },
    { src: "/certificate/iso14001.png", name: "ISO 14001" },
    { src: "/certificate/Disney_logo.png", name: "Disney FAMA", invert: true },
    { src: "/certificate/Walmart.png", name: "Walmart" },
    { src: "/certificate/Target.png", name: "Target" },
    { src: "/certificate/Costco.png", name: "Costco" },
  ];

  const t = cms
    ? {
        heroOver: L(cms.heroOver, ""),
        heroTitle: L(cms.heroTitle, ""),
        heroAccent: L(cms.heroAccent, ""),
        heroDesc: L(cms.heroDesc, ""),
        scroll: L(cms.scroll, ""),
        stats: (cms.stats || []).map((s) => ({ end: Number(s.value) || 0, suffix: s.suffix || "", label: L(s.label, "") })),
        processTitle: L(cms.processTitle, ""),
        processSub: L(cms.processSub, ""),
        steps: (cms.steps || []).map((s) => ({ subTitle: (s as any).subTitle ? L((s as any).subTitle, "") : "", title: L(s.title, ""), desc: L(s.desc, ""), img: s.img || "" })),
        equipTitle: L(cms.equipTitle, ""),
        equipSub: L(cms.equipSub, ""),
        equipItems: (cms.equipItems || []).map((e) => ({ title: L(e.title, ""), desc: L(e.desc, ""), img: e.img || "" })),
        certTitle: L(cms.certTitle, ""),
        ctaTitle: L(cms.ctaTitle, ""),
        ctaDesc: L(cms.ctaDesc, ""),
        ctaBtn: L(cms.ctaBtn, ""),
        certifications: cms.certifications?.length
          ? cms.certifications.map((c) => ({ src: c.src, name: L(c.name, c.src), invert: c.invert }))
          : fallbackCertifications,
      }
    : {
        ...t0,
        certifications: fallbackCertifications,
      };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white font-sans selection:bg-gold-500/40 selection:text-white overflow-x-hidden overflow-y-scroll snap-y snap-mandatory">
      <div className="fixed top-0 left-0 w-full z-[100] opacity-0 hover:opacity-100 transition-opacity duration-300">
        <Navbar showBackButton lang={lang} onLangChange={setLang} />
      </div>

      <style>{`
        /* Global Origins */
        .machine-img {
          transform-origin: right center;
        }
        .machine-img-left {
          transform-origin: left center;
        }

        /* ---------------------------------
           Dynamic Height-Based Scaling (All Screens)
        --------------------------------- */
        /* Dynamic Text Scaling using clamp to scale with vh */
        .equip-card-content h3 {
          font-size: clamp(12px, 2.2vh, 24px) !important;
          margin-bottom: clamp(2px, 0.5vh, 6px) !important;
          line-height: 1.1 !important;
        }
        .equip-card-content p {
          font-size: clamp(8px, 1.3vh, 14px) !important;
          margin-bottom: clamp(2px, 0.5vh, 6px) !important;
          line-height: 1.3 !important;
        }
        .equip-card-content > div:first-child {
          margin-bottom: clamp(1px, 0.3vh, 4px) !important;
          font-size: clamp(8px, 1.2vh, 13px) !important;
        }
        .icon-label {
          font-size: clamp(8px, 1.2vh, 13px) !important;
          margin-bottom: clamp(1px, 0.4vh, 4px) !important;
        }
        .icon-sub {
          font-size: clamp(7px, 1vh, 11px) !important;
        }
        .equip-card-content > .flex-row.mt-1 {
          margin-top: clamp(2px, 0.6vh, 8px) !important;
        }
        
        /* Top Banner Text Scaling */
        .banner-title {
          font-size: clamp(20px, 4.5vh, 48px) !important;
          margin-bottom: clamp(2px, 0.8vh, 12px) !important;
        }
        .banner-sub {
          font-size: clamp(11px, 2vh, 20px) !important;
          margin-bottom: clamp(2px, 0.8vh, 10px) !important;
          line-height: 1.25 !important;
        }
        .banner-icons-wrap {
          gap: clamp(6px, 1.5vh, 24px) !important;
          margin-top: 0 !important;
          padding-top: clamp(4px, 1vh, 12px) !important;
        }
        .banner-icons-wrap .w-6, .banner-icons-wrap .w-8 {
          width: clamp(20px, 3.5vh, 32px) !important;
          height: clamp(20px, 3.5vh, 32px) !important;
        }
        .banner-icon-title {
          font-size: clamp(9px, 1.3vh, 14px) !important;
        }
        .banner-icon-sub {
          font-size: clamp(8px, 1.1vh, 12px) !important;
        }

        /* ---------------------------------
           Short Screens (< 800px)
        --------------------------------- */
        @media (max-height: 800px) {
          /* Image Scaling */
          .machine-img, .machine-img-left {
            --tw-scale-x: 0.75 !important;
            --tw-scale-y: 0.75 !important;
          }
        }

        /* ---------------------------------
           Extremely Short Screens (< 650px)
        --------------------------------- */
        @media (max-height: 650px) {
          .icon-sub {
            display: none !important; /* Hide tiny subtext completely on very short screens to save space */
          }
          
          /* Image Scaling */
          .machine-img, .machine-img-left {
            --tw-scale-x: 0.6 !important;
            --tw-scale-y: 0.6 !important;
          }
        }
      `}</style>

      
      
      {/* ═══ HERO — full-screen video ═══ */}
      <section className="snap-start relative h-screen w-full flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/Premium_Children_s_Book_Factory_Video_opt.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0a]" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[50%] aspect-square rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] aspect-square rounded-full bg-gold-500/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
            <span className="inline-block text-xs tracking-[0.25em] text-gold-400 font-semibold uppercase bg-black/60 border border-gold-500/40 rounded-full px-5 py-2 backdrop-blur-md mb-8 shadow-lg">
              {t.heroOver}
            </span>
          </div>
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 ${lang === 'en' ? 'tracking-tight leading-[0.9]' : 'tracking-normal leading-[1.1]'}`}>
            <span className="block animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.15s forwards' }}>{t.heroTitle}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600 animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards' }}>{t.heroAccent}</span>
          </h1>
          <p className="text-white max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-normal animate-fade-in-up opacity-0 font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ animation: 'fadeInUp 0.8s ease-out 0.45s forwards' }}>
            {t.heroDesc}
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white animate-bounce cursor-pointer group">
          <span className="text-xs md:text-sm tracking-widest uppercase font-medium text-white group-hover:text-gold-400 transition-colors drop-shadow-md">{t.scroll}</span>
          <ChevronDown className="w-5 h-5 text-gold-400 group-hover:translate-y-0.5 transition-transform drop-shadow-md" />
        </div>
      </section>

      {/* ═══ STATS — parallax with video frame ═══ */}
      <section ref={statsRef} className="snap-start relative min-h-screen flex flex-col justify-center py-32 px-6 overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0">
          <OptimizedImage src="/real-factory/IMG_5141.webp" alt="" wrapperClassName="absolute inset-0" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {t.stats.map((stat, i) => (
              <div key={i} className={`transition-all duration-1000 ease-out ${statsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600 mb-2 tracking-tighter">
                  <CountUp end={stat.end} suffix={stat.suffix} started={statsIn} />
                </div>
                <div className="text-white/40 text-sm tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTION PROCESS — 6 photo cards ═══ */}
      <section ref={processRef} className="snap-start relative min-h-screen flex flex-col justify-center py-32 px-6 border-t border-white/[0.04] bg-black">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-gold-500/8 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square rounded-full bg-gold-500/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.3em] text-gold-400/60 uppercase font-medium mb-4 block">
              {lang === "zh" ? "生产流程" : lang === "ja" ? "生産フロー" : "Process"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{t.processTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.steps.map((step, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-700 ease-out bg-[#0a0a0a] ${
                  processIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Image naturally dictates the height of the card */}
                <OptimizedImage 
                  src={step.img} 
                  alt={step.subTitle || step.title} 
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Subtle gradient behind text for readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                
                {/* Text Layout - Only the main title */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col justify-end pointer-events-none">
                  <div className="text-white font-bold text-lg md:text-xl tracking-wider drop-shadow-md">
                    {step.subTitle || t0.steps[i]?.subTitle || step.title}
                  </div>
                </div>

                {/* Number Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] tracking-[0.2em] text-gold-400/70 uppercase bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      
      
      
      
      
      
      
      
      
      {/* ═══ EQUIPMENT SHOWCASE — Exact UI Match with Refined (Smaller) Fonts ═══ */}
      <section className="snap-start relative h-screen w-full flex flex-col bg-[#f8f9fa] text-[#111] overflow-hidden">
        
        {/* Top Banner - Exactly 20% height */}
        <div className="relative w-full h-[20vh] flex-shrink-0 flex flex-col justify-center overflow-hidden bg-[#051119]">
          
          {/* Background Factory Image - Scaled down by limiting width, positioned right */}
          <div className="absolute right-0 top-0 w-[100%] md:w-[60%] h-[120%] -top-[10%]">
            <img 
              src="/equipment/页首顶部图片.webp" 
              alt="Smart Factory" 
              className="w-full h-full object-cover object-[100%_45%] opacity-90" 
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)', maskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)' }} 
            />
          </div>
          
          {/* Solid background on the left side to completely mask the image behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#051119] from-0% via-[#051119] via-[40%] to-transparent z-10 pointer-events-none" />
          
          <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-10">
            <h1 className="banner-title text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-3 tracking-tight drop-shadow-lg">
              SMART FACTORY
            </h1>
            <h2 className="banner-sub text-[#0a9396] font-medium text-base md:text-lg lg:text-xl tracking-wide mb-2 leading-snug drop-shadow-md">
              {lang === "zh" ? <>面向儿童出版物的<br/>先进制造能力</> : <>Advanced Manufacturing<br/>Built for Children's Publishing</>}
            </h2>
            
            <div className="banner-icons-wrap flex flex-row gap-6 md:gap-10 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center text-[#0a9396] bg-black/40 backdrop-blur-sm shadow-lg">
                  <Cpu className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="banner-icon-title text-white font-bold text-[10px] md:text-xs">{lang === "zh" ? "自动化" : "Automation"}</div>
                  <div className="banner-icon-sub text-white/50 font-medium text-[8px] md:text-[9px] mt-0.5">{lang === "zh" ? "智能生产" : "Smart production"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center text-[#0a9396] bg-black/40 backdrop-blur-sm shadow-lg">
                  <Target className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="banner-icon-title text-white font-bold text-[10px] md:text-xs">{lang === "zh" ? "精准" : "Precision"}</div>
                  <div className="banner-icon-sub text-white/50 font-medium text-[8px] md:text-[9px] mt-0.5">{lang === "zh" ? "高品质输出" : "High-quality output"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center text-[#0a9396] bg-black/40 backdrop-blur-sm shadow-lg">
                  <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="banner-icon-title text-white font-bold text-[10px] md:text-xs">{lang === "zh" ? "一致性" : "Consistency"}</div>
                  <div className="banner-icon-sub text-white/50 font-medium text-[8px] md:text-[9px] mt-0.5">{lang === "zh" ? "可靠交付" : "Reliable delivery"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Content - Exactly 80% height */}
        <div className="h-[80vh] w-full max-w-[1600px] mx-auto px-6 md:px-10 py-4 flex flex-col bg-[#f8f9fa]">
          
          <div className="mb-3 flex flex-row items-center gap-3 flex-shrink-0">
            <div className="w-1 h-3.5 bg-[#0a9396]"></div>
            <h2 className="text-xs md:text-sm font-black tracking-tight text-[#0a9396] uppercase">
              {lang === "zh" ? "MANUFACTURING TECHNOLOGY" : "MANUFACTURING TECHNOLOGY"}
            </h2>
            <span className="text-[10px] text-gray-500 ml-3 hidden md:block border-l border-gray-300 pl-3">
              {lang === "zh" ? "集成化先进设备，为高效率、高品质的儿童图书制造提供稳定支撑。" : "Integrated advanced equipment for high-efficiency, high-quality production."}
            </span>
          </div>

          {/* Cards Grid Container */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 relative">
            
            {/* 01 Card - Row 1 */}
            <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-row px-6 py-2.5 items-center min-h-0 relative z-10">
               <div className="w-[50%] flex flex-col justify-center h-full relative z-20 equip-card-content">
                 <div className="text-[#0a9396] font-bold text-[9px] md:text-[10px] tracking-widest mb-1 uppercase">01 / {lang === "zh" ? "印刷" : "PRINTING"}</div>
                 <h3 className="text-base md:text-xl font-black text-[#111] mb-1.5 leading-tight whitespace-pre-line">
                   {lang === "zh" ? "5色 LED-UV 胶印机" : "5-Color LED-UV\nOffset Printing"}
                 </h3>
                 <p className="text-gray-500 text-[9px] md:text-[11px] mb-2 leading-snug whitespace-pre-line">
                   {lang === "zh" ? "高性能五色 LED-UV 印刷，提供稳定的色彩还原\n与高效批量生产能力。" : "High-performance five-color printing with LED-UV\ncuring delivers stable color reproduction and efficient\nproduction."}
                 </p>
                 <div className="flex flex-row gap-8 mt-1">
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><PenTool className="w-3.5 h-3.5" /></div>
                     <div>
                       <div className="text-[10px] md:text-xs font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "五色印刷" : "5-Color Printing"}</div>
                       <div className="text-[8px] md:text-[9px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "一致的色彩还原" : "Consistent color reproduction"}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Wind className="w-3.5 h-3.5" /></div>
                     <div>
                       <div className="text-[10px] md:text-xs font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "LED-UV 固化" : "LED-UV Curing"}</div>
                       <div className="text-[8px] md:text-[9px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "快速后续加工" : "Fast downstream processing"}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 hidden lg:flex">
                     <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Activity className="w-3.5 h-3.5" /></div>
                     <div>
                       <div className="text-[10px] md:text-xs font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "生产稳定" : "Production Stability"}</div>
                       <div className="text-[8px] md:text-[9px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "可靠长单输出" : "Reliable long-run output"}</div>
                     </div>
                   </div>
                 </div>
               </div>
               {/* Image */}
               <img src="/equipment/01.webp" alt="01" className="absolute right-[-4%] top-[55%] -translate-y-1/2 w-[55%] h-[155%] object-contain drop-shadow-2xl z-30 pointer-events-none machine-img origin-right" />
            </div>

            {/* 02 Card - Row 2 */}
            <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-row px-6 py-2.5 items-center min-h-0 relative z-20">
               {/* Left aligned image */}
               <img src="/equipment/02.webp" alt="02" className="absolute left-[-2%] top-[55%] -translate-y-1/2 w-[55%] h-[155%] object-contain drop-shadow-2xl z-30 pointer-events-none machine-img origin-left" />
               <div className="w-[50%] flex flex-col justify-center h-full relative z-20 equip-card-content ml-auto pl-8">
                 <div className="text-[#0a9396] font-bold text-[9px] md:text-[10px] tracking-widest mb-1 uppercase">02 / {lang === "zh" ? "表面处理" : "FINISHING"}</div>
                 <h3 className="text-base md:text-xl font-black text-[#111] mb-1.5 leading-tight whitespace-pre-line">
                   {lang === "zh" ? "全自动 UV 上光" : "Automatic\nUV Varnishing"}
                 </h3>
                 <p className="text-gray-500 text-[9px] md:text-[11px] mb-2 leading-snug whitespace-pre-line">
                   {lang === "zh" ? "全自动 UV 上光提升表面保护与视觉质感，完美满足多种表面整饰的高端需求。" : "Fully automated UV varnishing system enhances\nsurface protection and visual appeal."}
                 </p>
                 <div className="flex flex-row gap-8 mt-1">
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Layers className="w-3.5 h-3.5" /></div>
                     <div>
                       <div className="text-[10px] md:text-xs font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "全面及局部上光" : "Full & Spot Coating"}</div>
                       <div className="text-[8px] md:text-[9px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "灵活的整饰选项" : "Flexible finishing options"}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Sparkles className="w-3.5 h-3.5" /></div>
                     <div>
                       <div className="text-[10px] md:text-xs font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "高级效果" : "Premium Effects"}</div>
                       <div className="text-[8px] md:text-[9px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "高光、哑光及触感" : "Gloss, matte and tactile"}</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* 03 & 04 Row 3 */}
            <div className="flex-1 flex flex-row gap-4 min-h-0 relative z-30">
              {/* 03 */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-row px-6 py-2.5 min-h-0 relative overflow-visible">
                 <div className="w-[65%] flex flex-col justify-center z-20 equip-card-content">
                   <div className="text-[#0a9396] font-bold text-[8px] md:text-[10px] tracking-widest mb-1 uppercase">03 / {lang === "zh" ? "模切" : "DIE-CUTTING"}</div>
                   <h3 className="text-sm md:text-lg font-black text-[#111] mb-1.5 leading-tight whitespace-pre-line">{lang === "zh" ? "自动模切机" : "Automatic\nDie-Cutting"}</h3>
                   <p className="text-gray-500 text-[8px] md:text-[10px] mb-2 leading-snug whitespace-pre-line">
                     {lang === "zh" ? "高速、高精度自动模切，实现异形结构的精准加工。" : "High-speed, high-precision\ndie-cutting for complex shapes."}
                   </p>
                   <div className="flex flex-row flex-nowrap whitespace-nowrap gap-6 mt-1 overflow-visible">
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Scissors className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "高精度" : "High Precision"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "精准模切" : "Accurate die-cutting"}</div></div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Activity className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "高效率" : "High Efficiency"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "快速生产" : "Fast production"}</div></div>
                     </div>
                   </div>
                 </div>
                 <img src="/equipment/03.webp" alt="03" className="absolute right-[-4%] top-[55%] -translate-y-1/2 w-[60%] h-[145%] object-contain drop-shadow-2xl z-30 pointer-events-none machine-img origin-right" />
              </div>
              {/* 04 */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-row px-6 py-2.5 min-h-0 relative overflow-visible">
                 <div className="w-[65%] flex flex-col justify-center z-20 equip-card-content">
                   <div className="text-[#0a9396] font-bold text-[8px] md:text-[10px] tracking-widest mb-1 uppercase">04 / {lang === "zh" ? "装订" : "BINDING"}</div>
                   <h3 className="text-sm md:text-lg font-black text-[#111] mb-1.5 leading-tight whitespace-pre-line">{lang === "zh" ? "纸板书生产线" : "Board Book\nLine"}</h3>
                   <p className="text-gray-500 text-[8px] md:text-[10px] mb-2 leading-snug whitespace-pre-line">
                     {lang === "zh" ? "全自动化生产线，整合各项工艺，实现端到端生产一致性。" : "Fully automated board book\nline integrates gluing."}
                   </p>
                   <div className="flex flex-row flex-nowrap whitespace-nowrap gap-6 mt-1 overflow-visible">
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Cpu className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "全自动化" : "Full Automation"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "端到端生产" : "End-to-end production"}</div></div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><ShieldCheck className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "强一致性" : "Strong Consistency"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "稳定质量" : "Stable quality"}</div></div>
                     </div>
                   </div>
                 </div>
                 <img src="/equipment/04.webp" alt="04" className="absolute right-[0%] top-[50%] -translate-y-1/2 w-[55%] h-[145%] object-contain drop-shadow-2xl z-30 pointer-events-none machine-img origin-right" />
              </div>
            </div>

            {/* 05 & 06 Row 4 */}
            <div className="flex-1 flex flex-row gap-4 min-h-0 relative z-40">
              {/* 05 */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-row px-6 py-2.5 min-h-0 relative overflow-visible">
                 <div className="w-[65%] flex flex-col justify-center z-20 equip-card-content">
                   <div className="text-[#0a9396] font-bold text-[8px] md:text-[10px] tracking-widest mb-1 uppercase">05 / {lang === "zh" ? "包装" : "PACKAGING"}</div>
                   <h3 className="text-sm md:text-lg font-black text-[#111] mb-1.5 leading-tight whitespace-pre-line">{lang === "zh" ? "自动包装线" : "Automatic\nPackaging"}</h3>
                   <p className="text-gray-500 text-[8px] md:text-[10px] mb-2 leading-snug whitespace-pre-line">
                     {lang === "zh" ? "塑封、贴标及包装工序自动衔接，保障出货的严谨与高效。" : "Integrated packaging solution\nwith automated labeling."}
                   </p>
                   <div className="flex flex-row flex-nowrap whitespace-nowrap gap-6 mt-1 overflow-visible">
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Layers className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "塑封" : "Shrink Wrapping"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "紧密整洁" : "Tight & clean"}</div></div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Truck className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "打包贴标" : "Strapping & Labeling"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "安全准确" : "Secure & accurate"}</div></div>
                     </div>
                   </div>
                 </div>
                 <img src="/equipment/包装设备.webp" alt="05" className="absolute right-[0%] top-[55%] -translate-y-1/2 w-[55%] h-[145%] object-contain drop-shadow-2xl z-30 pointer-events-none machine-img origin-right" />
              </div>
              {/* 06 */}
              <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-row px-6 py-2.5 min-h-0 relative overflow-visible">
                 <div className="w-[65%] flex flex-col justify-center z-20 equip-card-content">
                   <div className="text-[#0a9396] font-bold text-[8px] md:text-[10px] tracking-widest mb-1 uppercase">06 / {lang === "zh" ? "环境" : "ENVIRONMENT"}</div>
                   <h3 className="text-sm md:text-lg font-black text-[#111] mb-1.5 leading-tight whitespace-pre-line">{lang === "zh" ? "恒温恒湿车间" : "Climate-Controlled\nManufacturing"}</h3>
                   <p className="text-gray-500 text-[8px] md:text-[10px] mb-2 leading-snug whitespace-pre-line">
                     {lang === "zh" ? "中央水冷空调系统提供受控生产环境，为高端纸质品印刷保驾护航。" : "Centralized HVAC system ensures\nstable environment."}
                   </p>
                   <div className="flex flex-row flex-nowrap whitespace-nowrap gap-6 mt-1 overflow-visible">
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><Factory className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "6层车间" : "6 Floors"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "受控生产" : "Climate-controlled"}</div></div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0a9396]/10 flex items-center justify-center text-[#0a9396]"><ShieldCheck className="w-3 h-3" /></div>
                       <div><div className="text-[9px] md:text-[11px] font-bold text-[#111] leading-none mb-1 icon-label">{lang === "zh" ? "稳定环境" : "Stable Environment"}</div><div className="text-[7px] md:text-[8px] text-gray-400 leading-none icon-sub">{lang === "zh" ? "支持稳定制造" : "Consistent manufacturing"}</div></div>
                     </div>
                   </div>
                 </div>
                 <img src="/equipment/05.webp" alt="06" className="absolute right-[0%] top-[65%] -translate-y-1/2 w-[45%] h-[135%] object-contain drop-shadow-2xl z-30 pointer-events-none machine-img origin-right" />
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ═══ CTA ═══ */}
      <section className="snap-start relative min-h-screen flex flex-col justify-center py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          {/* Precise Google Maps Embed with Dark Mode CSS Filter */}
          <iframe 
            src="https://maps.google.com/maps?q=广东省深圳市宝安区石岩镇宝石南路18号星嘉艺大厦&t=m&z=15&output=embed&iwloc=near" 
            className="w-full h-full opacity-80 pointer-events-none filter invert-[90%] hue-rotate-180 grayscale-[50%] contrast-125"
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0}
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]" />
          
          {/* Precise Address Text Box (instead of coordinate beacon) */}
          <div className="absolute top-[35%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
             <div className="w-4 h-4 rounded-full bg-gold-500 shadow-[0_0_20px_#D4A84B] mb-2" />
             <div className="text-gold-400/90 font-mono text-xs tracking-widest backdrop-blur-md bg-black/60 px-5 py-2 rounded-full border border-gold-500/20 shadow-2xl text-center whitespace-nowrap">
               广东省深圳市宝安区石岩镇宝石南路18号星嘉艺大厦
             </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-20 max-w-3xl mx-auto text-center mt-56 md:mt-64">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg text-white">{t.ctaTitle}</h2>
          <p className="text-white/60 text-lg mb-10 font-light drop-shadow-md">{t.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-30">
            <a
              href={lang === 'zh' ? "https://ditu.amap.com/search?query=广东省深圳市宝安区石岩镇宝石南路18号星嘉艺大厦" : "https://www.google.com/maps/search/?api=1&query=广东省深圳市宝安区石岩镇宝石南路18号星嘉艺大厦"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-[#0a0a0a] rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-500 hover:scale-105 group w-full sm:w-auto"
            >
              {lang === 'zh' ? '在地图中打开' : lang === 'ja' ? '地図で見る' : 'View on Map'}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="mailto:peng.shao.jun@szxingjiayi.com"
              className="inline-flex items-center justify-center gap-2 bg-black/50 hover:bg-white/10 text-white border border-white/20 rounded-full px-8 py-4 text-sm tracking-widest uppercase transition-all duration-500 hover:scale-105 group backdrop-blur-md w-full sm:w-auto"
            >
              {t.ctaBtn}
            </a>
          </div>
        </div>
      </section>

      <Footer dark />
    </div>
  );
}
