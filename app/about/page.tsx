"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
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

/* ── Timeline Item ── */
function TimelineItem({ year, event, idx }: { year: string; event: string; idx: number }) {
  const [ref, inView] = useInView(0.3);
  const isLeft = idx % 2 === 0;
  return (
    <div ref={ref} className="relative flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-0 group">
      <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:order-2"}`}>
        <div
          className={`bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl border border-white/[0.05] hover:border-gold-500/30 rounded-2xl p-6 md:p-8 transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{ transitionDelay: `${idx * 100}ms` }}
        >
          <span className="text-gold-500 font-black text-3xl md:text-4xl tracking-tight block mb-2">{year}</span>
          <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">{event}</p>
        </div>
      </div>
      
      {/* Central Line Dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-white/20 group-hover:border-gold-500 transition-colors duration-500 z-10 items-center justify-center top-1/2 -translate-y-1/2">
        <div className={`w-2 h-2 rounded-full bg-gold-500 transition-all duration-700 delay-300 ${inView ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
      </div>
      
      <div className={`hidden md:block w-1/2 ${isLeft ? "order-2" : ""}`} />
    </div>
  );
}

export default function AboutUs() {
  const { lang, setLang } = useLang();

  const [statsRef, statsIn] = useInView(0.3);
  const [cultureRef, cultureIn] = useInView(0.2);

  // Translations
  const t = {
    en: {
      heroSub: "Since 2001",
      heroTitle: "Crafting Childhood",
      heroAccent: "Wonders.",
      heroDesc: "A globally recognized manufacturer of premium children's pop-up books, educational kits, and paper engineering solutions.",
      scroll: "Discover our story",
      profileTitle: "Our Profile",
      stats: [
        { end: 25, suffix: "+", label: "Years of Experience" },
        { end: 250, suffix: "+", label: "Dedicated Employees" },
        { end: 30, suffix: "+", label: "Export Countries" },
        { end: 99, suffix: "%", label: "Client Satisfaction" },
      ],
      coreAdvantageTitle: "Unrivaled Manufacturing Capability",
      coreAdvantageDesc: "At Xingjiayi, we integrate design, precision printing, and post-press finishing under one roof. Our state-of-the-art digital smart factory and fully automated production lines ensure we deliver world-class paper engineering — from pop-up books and board books to interactive paper toys — meeting the strict standards of Disney, Walmart, Target, and Costco.",
      culture: [
        { 
          title: "Our Mission", 
          desc: "To fold wonder into the hands of children globally through masterful paper engineering."
        },
        { 
          title: "Our Vision", 
          desc: "To be the world's premier smart-manufacturing leader in the children's publishing industry."
        },
        { 
          title: "Core Values", 
          desc: "Lean Manufacturing • Continuous Innovation • Eco-Friendly Synergy"
        },
      ],
      timelineTitle: "Development Course",
      milestones: [
        { year: "2001", event: "Founded in Shenzhen, laying the foundation for paper manufacturing excellence." },
        { year: "2008", event: "Achieved ISO9001 certification, standardizing quality management." },
        { year: "2010", event: "Successfully expanded into European and North American export markets." },
        { year: "2012", event: "Passed the Disney FAMA audit, entering the global IP licensing supply chain." },
        { year: "2014-2016", event: "Passed stringent audits for Walmart, Target, and Costco." },
        { year: "2018", event: "Obtained ISO14001 certification for environmental management systems." },
        { year: "2019", event: "Launched the employee stock ownership plan." },
        { year: "2020-2022", event: "Achieved smart manufacturing." },
        { year: "2024-2025", event: "Introduced next-generation MES and ERP systems, completing the digital factory transformation." },
      ],
      certTitle: "Global Trust & Certifications",
      ctaTitle: "Ready to Start Your Project?",
      ctaDesc: "Bring your visionary ideas to a world-class manufacturing partner.",
      ctaBtn: "Contact Us",
    },
    zh: {
      heroSub: "始于 2001",
      heroTitle: "纸艺匠心 ",
      heroAccent: "折叠童年奇境",
      heroDesc: "全球知名的儿童图书、教育套装及高端纸艺工程制造企业",
      scroll: "探索我们的故事",
      profileTitle: "企业全貌",
      stats: [
        { end: 25, suffix: "+", label: "年行业经验" },
        { end: 250, suffix: "+", label: "专业员工" },
        { end: 30, suffix: "+", label: "出口国家" },
        { end: 99, suffix: "%", label: "客户满意度" },
      ],
      coreAdvantageTitle: "卓越制造实力",
      coreAdvantageDesc: "星嘉艺集设计开发、精密印刷与后道加工于一体。我们拥有先进的数字智能工厂与全自动生产线，致力于提供世界级的纸艺产品——从立体书、纸板书到互动纸艺玩具，全面满足迪士尼、沃尔玛、Target及Costco的严格合规标准。",
      culture: [
        { 
          title: "我们的使命", 
          desc: "以纸艺匠心，为全球儿童折叠奇妙世界"
        },
        { 
          title: "我们的愿景", 
          desc: "成为全球顶级的童书智能制造引领者"
        },
        { 
          title: "核心价值观", 
          desc: "精益制造 • 持续创新 • 环保共生"
        },
      ],
      timelineTitle: "发展历程",
      milestones: [
        { year: "2001", event: "星嘉艺于深圳正式成立，开启纸艺制造之路" },
        { year: "2008", event: "通过 ISO9001 认证，实现质量管理标准化" },
        { year: "2010", event: "产品首次成功出口欧美市场，开启全球化布局" },
        { year: "2012", event: "通过 Disney FAMA 审核，正式进入国际顶级 IP 供应链" },
        { year: "2014-2016", event: "通过 Walmart、Target、Costco 等国际巨头严苛审核" },
        { year: "2018", event: "荣获 ISO14001 环境管理体系认证，践行绿色制造" },
        { year: "2019", event: "全面启动员工持股计划" },
        { year: "2020-2022", event: "全面引入全自动生产线，逐步实现智能制造" },
        { year: "2024-2025", event: "引入新一代MES和ERP系统，完成数字化工厂改造" },
      ],
      certTitle: "资质认证",
      ctaTitle: "准备好开启新项目了吗？",
      ctaDesc: "将您的创意交给世界级的制造合作伙伴。",
      ctaBtn: "联系我们",
    },
    ja: {
      heroSub: "2001年設立",
      heroTitle: "ペーパーアートで",
      heroAccent: "子供たちの不思議を形に。",
      heroDesc: "プレミアムな仕掛け絵本、教育キット、ペーパーエンジニアリングの世界的な製造企業。",
      scroll: "私たちのストーリー",
      profileTitle: "会社概要",
      stats: [
        { end: 25, suffix: "+", label: "年の経験" },
        { end: 250, suffix: "+", label: "従業員数" },
        { end: 30, suffix: "+", label: "輸出対象国" },
        { end: 99, suffix: "%", label: "顧客満足度" },
      ],
      coreAdvantageTitle: "卓越した製造能力",
      coreAdvantageDesc: "星嘉藝は設計、精密印刷、製本加工を統合しています。最先端のデジタルスマート工場と完全自動化された生産ラインを備え、ディズニー、ウォルマート、ターゲット、コストコの厳しい基準を満たす、仕掛け絵本、ボードブック、インタラクティブ紙製玩具など、世界クラスのペーパーエンジニアリングを提供します。",
      culture: [
        { 
          title: "ミッション", 
          desc: "匠のペーパーアートを通じて、世界中の子供たちの手に驚きと不思議を届けること。"
        },
        { 
          title: "ビジョン", 
          desc: "児童出版業界における世界トップクラスのスマートマニュファクチャリング・リーダーとなること。"
        },
        { 
          title: "コアバリュー", 
          desc: "リーン生産方式 • 継続的イノベーション • 環境との共生"
        },
      ],
      timelineTitle: "沿革",
      milestones: [
        { year: "2001", event: "深センにて設立。ペーパーマニュファクチャリングの基盤を構築。" },
        { year: "2008", event: "ISO9001認証を取得し、品質管理を標準化。" },
        { year: "2010", event: "欧米市場への輸出を本格的に開始。" },
        { year: "2012", event: "ディズニーFAMA監査に合格。グローバルIPサプライチェーンに参入。" },
        { year: "2014-2016", event: "ウォルマート、ターゲット、コストコの厳しい監査を通過。" },
        { year: "2018", event: "環境マネジメントシステムISO14001認証を取得。" },
        { year: "2019", event: "従業員持株制度を全面的に開始。" },
        { year: "2020-2022", event: "スマートマニュファクチャリングを実現。" },
        { year: "2024-2025", event: "次世代MESおよびERPシステムを導入し、デジタル工場への変革を完了。" },
      ],
      certTitle: "グローバルな信頼と認証",
      ctaTitle: "新しいプロジェクトを始めませんか？",
      ctaDesc: "あなたのアイデアを世界クラスの製造パートナーへ。",
      ctaBtn: "お問い合わせ",
    },
    ko: {
      heroSub: "2001년 설립",
      heroTitle: "페이퍼 아트로",
      heroAccent: "어린이의 경이로움을 구현합니다.",
      heroDesc: "프리미엄 팝업북, 교육용 키트 및 페이퍼 엔지니어링 분야의 세계적인 제조업체입니다.",
      scroll: "스토리 알아보기",
      profileTitle: "회사 소개",
      stats: [
        { end: 25, suffix: "+", label: "년의 경험" },
        { end: 250, suffix: "+", label: "명의 직원" },
        { end: 30, suffix: "+", label: "개국 수출" },
        { end: 99, suffix: "%", label: "고객 만족도" },
      ],
      coreAdvantageTitle: "탁월한 제조 능력",
      coreAdvantageDesc: "싱자이는 설계, 정밀 인쇄 및 제본 가공을 통합합니다. 최첨단 디지털 스마트 공장과 완전 자동화된 생산 라인을 갖추고 있으며, 디즈니, 월마트, 타겟 및 코스트코의 엄격한 기준을 충족하는 세계적 수준의 페이퍼 엔지니어링 팝업북, 보드북 및 인터랙티브 종이 장난감을 제공합니다.",
      culture: [
        { 
          title: "사명", 
          desc: "장인 정신의 페이퍼 아트를 통해 전 세계 어린이들에게 놀라움과 경이로움을 선사하는 것."
        },
        { 
          title: "비전", 
          desc: "아동 출판 산업에서 세계 최고 수준의 스마트 제조 리더가 되는 것."
        },
        { 
          title: "핵심 가치", 
          desc: "린 제조 • 지속적인 혁신 • 환경 공생"
        },
      ],
      timelineTitle: "연혁",
      milestones: [
        { year: "2001", event: "선전에서 설립되어 종이 공예 제조의 길을 열었습니다." },
        { year: "2008", event: "ISO9001 인증을 획득하여 품질 관리를 표준화했습니다." },
        { year: "2010", event: "미국 및 유럽 시장으로의 첫 수출을 성공적으로 시작했습니다." },
        { year: "2012", event: "디즈니 FAMA 감사를 통과하여 글로벌 최고 IP 공급망에 공식적으로 진입했습니다." },
        { year: "2014-2016", event: "월마트, 타겟, 코스트코 등 글로벌 기업의 엄격한 감사를 지속적으로 통과했습니다." },
        { year: "2018", event: "ISO14001 환경 경영 시스템 인증을 획득하여 친환경 제조를 실천합니다." },
        { year: "2019", event: "직원 지주제도를 전면 도입했습니다." },
        { year: "2020-2022", event: "스마트 제조를 달성했습니다." },
        { year: "2024-2025", event: "차세대 MES 및 ERP 시스템을 도입하여 디지털 공장 전환을 완료했습니다." },
      ],
      certTitle: "글로벌 신뢰 및 인증",
      ctaTitle: "새로운 프로젝트를 시작할 준비가 되셨나요?",
      ctaDesc: "아이디어를 세계적인 수준의 제조 파트너에게 맡기십시오.",
      ctaBtn: "문의하기",
    }
  }[lang as "en" | "zh" | "ja" | "ko"] || {
    /* Fallback to EN if undefined */
    heroSub: "Since 2001", heroTitle: "Crafting Childhood", heroAccent: "Wonders.",
    heroDesc: "A globally recognized manufacturer of premium children's pop-up books...", scroll: "Discover our story",
    profileTitle: "Our Profile", stats: [], coreAdvantageTitle: "", coreAdvantageDesc: "", culture: [], timelineTitle: "", milestones: [], certTitle: "", ctaTitle: "", ctaDesc: "", ctaBtn: ""
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-gold-500/40 selection:text-white overflow-x-hidden">
      <Navbar showBackButton lang={lang} onLangChange={setLang} />

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* We use factory-08.jpg as the factory/printing environment background */}
        <OptimizedImage src="/factory/factory-08.jpg" alt="Factory" wrapperClassName="absolute inset-0 w-full h-full" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/50 to-[#0a0a0a]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-16">
          <div className="animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
            <span className="inline-block text-[10px] tracking-[0.3em] text-gold-400 font-medium uppercase border border-gold-500/30 rounded-full px-5 py-2 backdrop-blur-sm bg-black/20 mb-8">
              {t.heroSub}
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1] mb-6">
            <span className="block animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.15s forwards' }}>{t.heroTitle}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600 animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards' }}>{t.heroAccent}</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.45s forwards' }}>
            {t.heroDesc}
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">{t.scroll}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ═══ PROFILE & STATS ═══ */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          {/* Top Level Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center mb-32">
            {t.stats?.map((stat: any, i: number) => (
              <div key={i} className={`transition-all duration-1000 ease-out ${statsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600 mb-3 tracking-tighter drop-shadow-sm">
                  <CountUp end={stat.end} suffix={stat.suffix} started={statsIn} />
                </div>
                <div className="text-white/50 text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Profile Description */}
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">{t.coreAdvantageTitle}</h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed font-light">
              {t.coreAdvantageDesc}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CULTURE (Mission / Vision / Core Values) ═══ */}
      <section ref={cultureRef} className="py-24 px-6 bg-[#060606] relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {t.culture?.map((item: any, i: number) => (
              <div 
                key={i} 
                className={`bg-[#0a0a0a] border border-white/[0.05] hover:border-gold-500/20 rounded-2xl p-8 md:p-10 transition-all duration-700 ease-out flex flex-col justify-center items-center text-center group ${
                  cultureIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-4 h-4 rounded-full bg-gold-500/50" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-gold-400 transition-colors">{item.title}</h3>
                <p className="text-white/50 leading-relaxed font-light text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEVELOPMENT COURSE (Timeline) ═══ */}
      <section className="py-32 px-6 border-t border-white/[0.04] relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t.timelineTitle}</h2>
            <div className="w-16 h-[2px] bg-gold-500/50 mx-auto" />
          </div>

          <div className="relative">
            {/* The central vertical line for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />
            
            <div className="flex flex-col gap-12 md:gap-8">
              {t.milestones?.map((ms: any, i: number) => (
                <TimelineItem key={i} year={ms.year} event={ms.event} idx={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS STRIP ═══ */}
      <section className="py-20 px-6 border-t border-white/[0.04] bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[10px] tracking-[0.3em] text-gold-400/60 uppercase font-medium mb-12 block">{t.certTitle}</span>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 justify-items-center w-full max-w-fit mx-auto">
            {[
              { name: "Disney", src: "/certificate/Disney_logo.png" },
              { name: "Walmart", src: "/certificate/Walmart.png" },
              { name: "Target", src: "/certificate/Target.png" },
              { name: "Costco", src: "/certificate/Costco.png" },
              { name: "ISO 9001", src: "/certificate/ISO_9001-2015.png" },
              { name: "ISO 14001", src: "/certificate/iso14001.png", scale: "scale-[1.3]" },
              { name: "SCAN", src: "/certifications/scan.jpg", scale: "scale-[1.8]" },
              { name: "SMETA", src: "/certifications/smeta-.png", scale: "scale-[1.8]" },
              { name: "Universal", src: "/certifications/universal.png", scale: "scale-[2.1]" },
              { name: "中国环境标志", src: "/certifications/china10.png", scale: "scale-[1.8]" },
              { name: "FSC", src: "/certifications/fsc-new.png", scale: "scale-125" },
              { name: "EXPERT", src: "/certifications/expert.jpg", scale: "scale-125" },
            ].map((cert, i) => (
              <div key={i} className="flex items-center justify-center w-28 h-14 md:w-36 md:h-16 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2 md:p-3 overflow-hidden">
                <OptimizedImage 
                  src={cert.src} 
                  alt={cert.name} 
                  wrapperClassName="w-full h-full flex items-center justify-center" 
                  className={`w-full h-full object-contain mix-blend-multiply ${cert.scale || ""}`} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 px-6 text-center border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t.ctaTitle}</h2>
          <p className="text-white/40 text-lg mb-10 font-light">{t.ctaDesc}</p>
          <a 
            href="mailto:peng.shao.jun@szxingjiayi.com"
            className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-400 text-[#0a0a0a] px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,168,75,0.4)]"
          >
            {t.ctaBtn}
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer dark={true} />
    </div>
  );
}
