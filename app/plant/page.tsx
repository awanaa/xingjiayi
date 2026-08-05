"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Cpu, ThermometerSnowflake, Layers, Factory,
  PenTool, Printer, Scissors, Wind,
  ShieldCheck, Truck, ChevronDown, ArrowUpRight
} from "lucide-react";
import Navbar from "../../components/Navbar";
import OptimizedImage from "../../components/OptimizedImage";
import Footer from "../../components/Footer";
import { useLang } from "../../hooks/useLang";

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

export default function IntelligentPlant() {
  const { lang, setLang } = useLang();

  const [statsRef, statsIn] = useInView(0.3);
  const [processRef, processIn] = useInView(0.15);

  const t = {
    en: {
      heroOver: "Since 2005",
      heroTitle: "Where Precision",
      heroAccent: "Meets Production",
      heroDesc: "Step inside our 20,000m² smart facility — 50%+ automation rate, 24/7 climate control, and a team of 300+ master craftsmen turning raw sheets into award-winning books.",
      scroll: "Scroll to explore",
      stats: [
        { end: 50, suffix: "%+", label: "Automation Rate" },
        { end: 24, suffix: "/7", label: "Climate Control" },
        { end: 20, suffix: "k m²", label: "Workshop Area" },
        { end: 300, suffix: "+", label: "Team Members" },
      ],
      processTitle: "Production Process",
      processSub: "From raw material to finished book — every step quality-controlled",
      steps: [
        { title: "Design & Prepress", desc: "Structural design, file prep, CTP plate-making", img: "/real-factory/DSC00178.JPG" },
        { title: "Printing", desc: "Heidelberg offset / UV / digital on premium stock", img: "/real-factory/IMG_5121.JPG" },
        { title: "Die-Cutting", desc: "High-precision automated cutting & creasing", img: "/real-factory/IMG_5271.JPG" },
        { title: "Surface & Binding", desc: "Foil stamping, lamination, hand-assembly", img: "/real-factory/IMG_5132.JPG" },
        { title: "QC Inspection", desc: "EN71 / ASTM / ISO — full quality gate checks", img: "/real-factory/IMG_5133.JPG" },
        { title: "Warehouse & Dispatch", desc: "Stereo warehouse, global logistics", img: "/real-factory/truck-loading.jpg" },
      ],
      equipTitle: "Our Equipment",
      equipSub: "German precision, Japanese efficiency — the tools behind the craft",
      equipItems: [
        { title: "Automated Laminating Machines", desc: "High-precision lamination and gluing for smooth, durable finishes", img: "/real-factory/IMG_5121.JPG" },
        { title: "Automated Die-Cutting Lines", desc: "CNC-controlled cutting, creasing, and embossing in one pass", img: "/real-factory/IMG_5271.JPG" },
      ],
      certTitle: "Certifications",
      ctaTitle: "See It in Action",
      ctaDesc: "Schedule a virtual tour or visit our Shenzhen facility",
      ctaBtn: "Get in Touch",
    },
    zh: {
      heroOver: "始于2005",
      heroTitle: "精密与效率",
      heroAccent: "在此交汇",
      heroDesc: "走进星嘉艺20,000平方米智慧工厂——50%+自动化率、24小时恒温恒湿、300+工匠团队，每一本好书的诞生，都从这里开始。",
      scroll: "向下探索",
      stats: [
        { end: 50, suffix: "%+", label: "自动化率" },
        { end: 24, suffix: "小时", label: "恒温控制" },
        { end: 20, suffix: "k m²", label: "车间面积" },
        { end: 300, suffix: "+", label: "工匠团队" },
      ],
      processTitle: "生产流程",
      processSub: "从原材料到成品书——每一步严格品控",
      steps: [
        { title: "设计与制版", desc: "结构设计、文件处理、CTP制版", img: "/real-factory/DSC00178.JPG" },
        { title: "印刷", desc: "海德堡胶印/UV/数码印刷", img: "/real-factory/IMG_5121.JPG" },
        { title: "模切", desc: "高精度自动模切压痕", img: "/real-factory/IMG_5271.JPG" },
        { title: "表面与装订", desc: "烫金、裱糊、手工组装", img: "/real-factory/IMG_5132.JPG" },
        { title: "质检", desc: "EN71 / ASTM / ISO 全检", img: "/real-factory/IMG_5133.JPG" },
        { title: "仓储与发货", desc: "立体仓管理，全球物流", img: "/real-factory/truck-loading.jpg" },
      ],
      equipTitle: "核心设备",
      equipSub: "德国精度、日本效率——匠艺背后的硬实力",
      equipItems: [
        { title: "全自动过胶机", desc: "高精度覆膜与过胶工艺，确保表面平整耐用", img: "/real-factory/IMG_5121.JPG" },
        { title: "自动模切生产线", desc: "CNC数控裁切、压痕、压凸一次完成", img: "/real-factory/IMG_5271.JPG" },
      ],
      certTitle: "资质认证",
      ctaTitle: "实地探访",
      ctaDesc: "预约参观深圳工厂，亲眼见证自动化的力量",
      ctaBtn: "联系我们",
    },
    ja: {
      heroOver: "2005年創業",
      heroTitle: "精密と効率が",
      heroAccent: "交差する場所",
      heroDesc: "20,000m²のスマート工場——50%超の自動化率、24時間温度管理、300+の熟練職人。すべての良書はここから始まります。",
      scroll: "スクロール",
      stats: [
        { end: 50, suffix: "%+", label: "自動化率" },
        { end: 24, suffix: "時間", label: "温度管理" },
        { end: 20, suffix: "k m²", label: "工場面積" },
        { end: 300, suffix: "+", label: "熟練職人" },
      ],
      processTitle: "生産フロー",
      processSub: "原材料から完成品まで——すべての工程を厳格に品質管理",
      steps: [
        { title: "設計・製版", desc: "構造設計、ファイル処理、CTP製版", img: "/real-factory/DSC00178.JPG" },
        { title: "印刷", desc: "ハイデルベルグ オフセット/UV/デジタル印刷", img: "/real-factory/IMG_5121.JPG" },
        { title: "抜き加工", desc: "高精度自動抜型加工", img: "/real-factory/IMG_5271.JPG" },
        { title: "表面・製本", desc: "箔押し、ラミネート、手組み", img: "/real-factory/IMG_5132.JPG" },
        { title: "品質検査", desc: "EN71 / ASTM / ISO 全数検査", img: "/real-factory/IMG_5133.JPG" },
        { title: "保管・出荷", desc: "立体倉庫、グローバル物流", img: "/real-factory/truck-loading.jpg" },
      ],
      equipTitle: "主要設備",
      equipSub: "ドイツの精度、日本の効率——ものづくりを支える力",
      equipItems: [
        { title: "自動ラミネート・糊付け機", desc: "高精度な表面加工と接着により、滑らかで耐久性のある仕上がりを実現", img: "/real-factory/IMG_5121.JPG" },
        { title: "自動抜型ライン", desc: "CNC裁断、罫線、エンボスを一貫処理", img: "/real-factory/IMG_5271.JPG" },
      ],
      certTitle: "認証資格",
      ctaTitle: "工場見学",
      ctaDesc: "スマート工場をぜひご覧ください",
      ctaBtn: "お問い合わせ",
    },
    ko: {
      heroOver: "2005년 설립",
      heroTitle: "정밀함과 효율성이",
      heroAccent: "교차하는 곳",
      heroDesc: "20,000m² 규모의 스마트 공장——50% 이상의 자동화율, 24시간 온도 제어, 300명 이상의 숙련된 장인. 모든 훌륭한 책은 이곳에서 시작됩니다.",
      scroll: "스크롤하여 탐색",
      stats: [
        { end: 50, suffix: "%+", label: "자동화율" },
        { end: 24, suffix: "시간", label: "온도 제어" },
        { end: 20, suffix: "k m²", label: "공장 면적" },
        { end: 300, suffix: "+", label: "숙련된 장인" },
      ],
      processTitle: "생산 공정",
      processSub: "원자재부터 완제품까지——모든 공정을 엄격하게 품질 관리합니다.",
      steps: [
        { title: "설계 및 제판", desc: "구조 설계, 파일 처리, CTP 제판", img: "/real-factory/DSC00178.JPG" },
        { title: "인쇄", desc: "하이델베르그 오프셋/UV/디지털 인쇄", img: "/real-factory/IMG_5121.JPG" },
        { title: "다이 커팅", desc: "고정밀 자동 다이 커팅", img: "/real-factory/IMG_5271.JPG" },
        { title: "표면 및 제본", desc: "금박, 라미네이팅, 수작업 조립", img: "/real-factory/IMG_5132.JPG" },
        { title: "품질 검사", desc: "EN71 / ASTM / ISO 전수 검사", img: "/real-factory/IMG_5133.JPG" },
        { title: "창고 및 배송", desc: "입체 창고 관리, 글로벌 물류", img: "/real-factory/truck-loading.jpg" },
      ],
      equipTitle: "핵심 설비",
      equipSub: "독일의 정밀함, 일본의 효율성——장인 정신을 뒷받침하는 힘",
      equipItems: [
        { title: "자동 라미네이팅 기계", desc: "고정밀 표면 처리 및 접착으로 매끄럽고 내구성 있는 마감 보장", img: "/real-factory/IMG_5121.JPG" },
        { title: "자동 다이 커팅 라인", desc: "CNC 절단, 크리징, 엠보싱 원스톱 처리", img: "/real-factory/IMG_5271.JPG" },
      ],
      certTitle: "인증 및 자격",
      ctaTitle: "공장 견학",
      ctaDesc: "스마트 공장을 방문하여 자동화의 힘을 직접 확인하십시오",
      ctaBtn: "문의하기",
    },
  }[lang as "en" | "zh" | "ja" | "ko"] || {
    /* Fallback to EN if undefined */
    heroOver: "Since 2005", heroTitle: "Where Precision", heroAccent: "Meets Efficiency", heroDesc: "", scroll: "Scroll", stats: [], processTitle: "", processSub: "", steps: [], equipTitle: "", equipSub: "", equipItems: [], certTitle: "", ctaTitle: "", ctaDesc: "", ctaBtn: ""
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-gold-500/40 selection:text-white overflow-x-hidden">
      <Navbar showBackButton lang={lang} onLangChange={setLang} />

      {/* ═══ HERO — full-screen video ═══ */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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
            <span className="inline-block text-[10px] tracking-[0.3em] text-gold-400/80 font-medium uppercase border border-gold-500/20 rounded-full px-4 py-1.5 backdrop-blur-sm">
              {t.heroOver}
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] mt-6 mb-6">
            <span className="block animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.15s forwards' }}>{t.heroTitle}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600 animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards' }}>{t.heroAccent}</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.45s forwards' }}>
            {t.heroDesc}
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">{t.scroll}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ═══ STATS — parallax with video frame ═══ */}
      <section ref={statsRef} className="relative py-32 px-6 overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0">
          <OptimizedImage src="/real-factory/IMG_5141.JPG" alt="" wrapperClassName="absolute inset-0" className="w-full h-full object-cover" />
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
      <section ref={processRef} className="relative py-32 px-6 border-t border-white/[0.04]">
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
            <p className="text-white/40 text-sm md:text-base">{t.processSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.steps.map((step, i) => (
              <div
                key={i}
                className={`group relative h-72 md:h-80 rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-700 ease-out ${
                  processIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <OptimizedImage src={step.img} alt="" wrapperClassName="absolute inset-0" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] tracking-[0.2em] text-gold-400/70 uppercase bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-1">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EQUIPMENT SHOWCASE — split-screen ═══ */}
      <section className="py-32 px-6 border-t border-white/[0.04] bg-[#060606]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.3em] text-gold-400/60 uppercase font-medium mb-4 block">
              {lang === "zh" ? "核心设备" : lang === "ja" ? "主要設備" : "Equipment"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{t.equipTitle}</h2>
            <p className="text-white/40 text-sm md:text-base">{t.equipSub}</p>
          </div>

          {t.equipItems.map((item, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center mb-20 last:mb-0`}>
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.06]">
                <OptimizedImage src={item.img} alt="" wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-xs tracking-[0.2em] text-gold-400/60 uppercase mb-3 block">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/40 text-base leading-relaxed">{item.desc}</p>
                <div className="mt-6 h-[2px] w-16 bg-gold-500/40" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CERTIFICATIONS STRIP ═══ */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[10px] tracking-[0.3em] text-gold-400/60 uppercase font-medium mb-8 block">{t.certTitle}</span>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {[
              { src: "/certificate/ISO_9001-2015.png", name: "ISO 9001" },
              { src: "/certificate/iso14001.png", name: "ISO 14001" },
              { src: "/certificate/Disney_logo.png", name: "Disney FAMA", invert: true },
              { src: "/certificate/Walmart.png", name: "Walmart" },
              { src: "/certificate/Target.png", name: "Target" },
              { src: "/certificate/Costco.png", name: "Costco" },
            ].map((cert, i) => (
              <div key={i} className="group flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg border border-white/[0.08] p-2 bg-white/[0.03] flex items-center justify-center hover:border-gold-500/30 transition-all duration-300">
                  <OptimizedImage src={cert.src} alt={cert.name} wrapperClassName="w-full h-full" className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${cert.invert ? 'invert' : ''}`} />
                </div>
                <span className="text-[9px] md:text-[10px] text-white/30 tracking-wider">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          {/* Precise Google Maps Embed with Dark Mode CSS Filter */}
          <iframe 
            src="https://maps.google.com/maps?q=深圳市宝安区石岩镇甫鱼石威祥工业区&t=m&z=15&output=embed&iwloc=near" 
            className="w-full h-full opacity-60 pointer-events-none filter invert-[90%] hue-rotate-180 grayscale-[50%] contrast-125"
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0}
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />
          
          {/* Precise Address Text Box (instead of coordinate beacon) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none mt-10 md:mt-0">
             <div className="w-4 h-4 rounded-full bg-gold-500 shadow-[0_0_20px_#D4A84B] mb-2" />
             <div className="text-gold-400/90 font-mono text-xs tracking-widest backdrop-blur-md bg-black/60 px-5 py-2 rounded-full border border-gold-500/20 shadow-2xl text-center">
               深圳市宝安区石岩镇<br className="md:hidden" />甫鱼石威祥工业区星嘉艺大厦1-6楼
             </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-20 max-w-3xl mx-auto text-center mt-32 md:mt-40">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg text-white">{t.ctaTitle}</h2>
          <p className="text-white/60 text-lg mb-10 font-light drop-shadow-md">{t.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-30">
            <a
              href="https://www.google.com/maps/search/?api=1&query=深圳市宝安区石岩镇甫鱼石威祥工业区"
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
