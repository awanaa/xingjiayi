"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Printer,
  FileText,
  Hand,
  ShieldCheck,
  Package,
  CheckCircle,
  Ruler,
  BookOpen,
  Globe,
  Palette,
  ClipboardCheck,
  Settings2,
  Activity,
  Waypoints,
  Leaf,
  Recycle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import OptimizedImage from "../components/OptimizedImage";
import { useLang } from "../hooks/useLang";
import Footer from "../components/Footer";
import TrustProofSection from "../components/TrustProofSection";
import InteractiveGlobe from "../components/InteractiveGlobe";
import QuoteForm from "../components/QuoteForm";

// --- Types (Strict TypeScript) ---
type Lang = "en" | "zh" | "ja" | "ko";

interface ContentType {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  trust: { title: string; subtitle: string };
  featured: { title: string; subtitle: string; categories: { name: string; desc: string }[] };
  capabilities: { title: string; subtitle: string; steps: { name: string; desc: string }[] };
  quality: { title: string; subtitle: string; modules: string[] };
  sustainability: { title: string; subtitle: string; items: string[] };
  global: { title: string; subtitle: string; regions: string[] };
  cta: { title: string; subtitle: string; buttonPrimary: string; buttonSecondary: string };
}

// --- Content Dictionary (zh / en / ja) ---
const contentDict: Record<Lang, ContentType> = {
  en: {
    hero: {
      title: "Bringing Children's Stories to Life",
      subtitle:
        "Premium book manufacturing, complex paper engineering and reliable global delivery for publishers and brands",
      ctaPrimary: "Explore Our Work",
      ctaSecondary: "Start a Project",
    },
    trust: {
      title: "Built for Global Publishing",
      subtitle:
        "A trusted manufacturing partner supporting publishers, retailers and creative brands from concept to delivery",
    },
    featured: {
      title: "Ideas Engineered into Exceptional Products",
      subtitle:
        "Explore how we combine paper engineering, printing, binding and hand assembly to deliver distinctive publishing products",
      categories: [
        { name: "Board Books", desc: "Durable, FSC-certified paperboard books for early learning." },
        { name: "Novelty & Pop-up", desc: "Complex 3D paper mechanics with tabs, wheels, and pop-ups." },
        { name: "Sound & Electronic", desc: "CE-certified sound modules, lights, and interactive electronics." },
        { name: "Activity Kits", desc: "Multi-component sets combining books, puzzles, crafts, and toys." },
        { name: "Boxed Sets", desc: "Premium gift sets with coordinated components for special editions." },
        { name: "Licensed Products", desc: "IP-branded books and kits meeting global compliance standards." },
      ],
    },
    capabilities: {
      title: "From Concept to Global Delivery",
      subtitle:
        "One integrated team supporting engineering, sampling, production, quality assurance and international delivery",
      steps: [
        { name: "Engineering & Design", desc: "Structural evaluation, manufacturability analysis, material & cost optimization." },
        { name: "Sampling & Prototyping", desc: "Blank dummies, color proofs, functional samples & client approval process." },
        { name: "Offset & Digital Printing", desc: "Color management, spot colors, surface finishing & process control." },
        { name: "Die-cutting & Binding", desc: "Stitching, casing-in, custom shaping & complex structure forming." },
        { name: "Hand Assembly", desc: "Manual assembly, module installation, accessory & set packing." },
        { name: "Quality Assurance", desc: "Incoming, in-process, final inspection & functional testing." },
        { name: "Packaging", desc: "Retail packaging, shipping protection & plastic reduction solutions." },
        { name: "Global Logistics", desc: "Shipping plans, documentation, logistics coordination & delivery tracking." },
      ],
    },
    quality: {
      title: "Quality Built into Every Step",
      subtitle: "Systematic quality management from raw material inspection to final shipment",
      modules: [
        "Color Management",
        "Incoming Inspection",
        "In-process Control",
        "Functional Testing",
        "Final Inspection",
        "Traceability",
      ],
    },
    sustainability: {
      title: "Better Materials. Smarter Production",
      subtitle: "Responsible material choices and practical production improvements to reduce waste",
      items: [
        "FSC®-certified paper",
        "Recycled & biodegradable materials",
        "Soy-based & water-based inks",
        "Automated production waste reduction",
        "Waste reduction programs",
        "Energy-efficient production",
      ],
    },
    global: {
      title: "Local Expertise. Global Delivery",
      subtitle: "Dedicated regional support and streamlined logistics for partners worldwide",
      regions: ["North America", "Europe", "Asia-Pacific"],
    },
    cta: {
      title: "Have a Project in Mind?",
      subtitle: "Share your concept, artwork or product specifications with our team",
      buttonPrimary: "Start a Project",
      buttonSecondary: "Request Samples",
    },
  },
  zh: {
    hero: {
      title: "让童话故事跃然纸上",
      subtitle: "为全球出版商和品牌提供高端图书制造、复杂纸艺工程以及可靠的全球交付",
      ctaPrimary: "探索我们的作品",
      ctaSecondary: "开启新项目",
    },
    trust: {
      title: "为全球出版而生",
      subtitle: "值得信赖的制造合作伙伴，从概念到交付全程支持出版商、零售商和创意品牌",
    },
    featured: {
      title: "将创意转化为卓越产品",
      subtitle: "探索我们如何将纸艺工程、印刷、装订与手工组装相结合，打造独具特色的出版产品",
      categories: [
        { name: "纸板书", desc: "耐用FSC认证纸板，专为早期阅读设计。" },
        { name: "立体书与机关书", desc: "包含拉页、转盘、弹起等复杂3D纸艺结构。" },
        { name: "发声书与电子书", desc: "CE认证发声模块、LED灯及互动电子元件。" },
        { name: "活动套装", desc: "书+拼图+手工+玩具的多组件综合套装。" },
        { name: "礼盒套装", desc: "精品礼品组合套装，包含协调搭配的多种组件。" },
        { name: "授权产品", desc: "IP品牌图书与套装，满足全球合规标准。" },
      ],
    },
    capabilities: {
      title: "从卓越产品到全球交付",
      subtitle: "一体化团队支持工程设计、打样、生产、质量保证与国际物流",
      steps: [
        { name: "工程设计", desc: "结构评估、可制造性建议、材料与成本优化。" },
        { name: "打样与原型", desc: "白样、彩样、功能样及客户确认流程。" },
        { name: "胶印与数码印刷", desc: "色彩管理、专色、表面处理及过程控制。" },
        { name: "模切与装订", desc: "装订、裱合、异形加工及复杂结构成型。" },
        { name: "手工组装", desc: "手工装配、模块安装、配件与套装组合。" },
        { name: "质量检测", desc: "来料、过程、成品及功能测试。" },
        { name: "包装出货", desc: "零售包装、运输保护及减塑方案。" },
        { name: "全球物流", desc: "出货计划、文件、物流协同与交付跟踪。" },
      ],
    },
    quality: {
      title: "品质融入每一个环节",
      subtitle: "从原材料检验到成品出运，系统性质量管理覆盖全流程",
      modules: ["色彩管理", "来料检验", "过程控制", "功能测试", "成品检验", "全程追溯"],
    },
    sustainability: {
      title: "更优质的材料 更智能的生产",
      subtitle: "负责任的材料选择和切实可行的生产改进，减少废弃物产生",
      items: [
        "FSC® 认证纸张",
        "再生与可降解材料",
        "大豆基与水性油墨",
        "自动化生产减少损耗",
        "废弃物减量计划",
        "节能高效生产",
      ],
    },
    global: {
      title: "本地专业知识 全球交付",
      subtitle: "为全球合作伙伴提供专属区域支持和高效的物流服务",
      regions: ["北美", "欧洲", "亚太地区"],
    },
    cta: {
      title: "有新项目想法？",
      subtitle: "分享您的概念、图稿或产品规格，我们的团队将为您提供专业方案",
      buttonPrimary: "开启新项目",
      buttonSecondary: "申请样品",
    },
  },
  ja: {
    hero: {
      title: "子供たちの物語に命を吹き込む",
      subtitle:
        "出版社やブランド向けのプレミアムな絵本製造、複雑なペーパーエンジニアリング、信頼性の高いグローバル配送",
      ctaPrimary: "作品を見る",
      ctaSecondary: "プロジェクトを始める",
    },
    trust: {
      title: "グローバル出版のために構築",
      subtitle: "出版社、小売業者、クリエイティブブランドをコンセプトから配送までサポートする信頼の製造パートナー",
    },
    featured: {
      title: "アイデアを卓越した製品へ",
      subtitle:
        "ペーパーエンジニアリング、印刷、製本、手作業による組立を組み合わせた差別化された出版製品を提供",
      categories: [
        { name: "ボードブック", desc: "耐久性に優れたFSC認証紙を使用した知育絵本。" },
        { name: "仕掛け絵本", desc: "タブ、回転盤、飛び出す立体ペーパー構造。" },
        { name: "サウンド＆電子絵本", desc: "CE認証の音声モジュール、LED、インタラクティブ電子部品。" },
        { name: "アクティビティキット", desc: "本、パズル、工作、おもちゃを組み合わせたマルチコンポーネントセット。" },
        { name: "ボックスセット", desc: "特別編集版のためのプレミアムギフトセット。" },
        { name: "ライセンス製品", desc: "IPブランドの絵本とキット、グローバルコンプライアンス基準準拠。" },
      ],
    },
    capabilities: {
      title: "コンセプトからグローバル配送まで",
      subtitle: "エンジニアリング、サンプリング、生産、品質保証、国際物流を一貫サポート",
      steps: [
        { name: "エンジニアリング＆設計", desc: "構造評価、製造可能性分析、材料・コスト最適化。" },
        { name: "サンプリング＆試作", desc: "白サンプル、カラー校正、機能サンプル、承認プロセス。" },
        { name: "オフセット＆デジタル印刷", desc: "カラーマネジメント、特色、表面加工、工程管理。" },
        { name: "抜型＆製本", desc: "製本、貼り合わせ、特殊形状加工、複雑構造成型。" },
        { name: "手作業組立", desc: "手作業組立、モジュール取付、付属品とセット梱包。" },
        { name: "品質保証", desc: "受入検査、工程内検査、完成品検査、機能テスト。" },
        { name: "梱包", desc: "小売包装、輸送保護、プラスチック削減対策。" },
        { name: "グローバル物流", desc: "出荷計画、書類作成、物流調整、配送追跡。" },
      ],
    },
    quality: {
      title: "すべての工程に組み込まれた品質",
      subtitle: "原材料検査から最終出荷まで、体系的な品質管理を実施",
      modules: ["カラーマネジメント", "受入検査", "工程内管理", "機能テスト", "最終検査", "トレーサビリティ"],
    },
    sustainability: {
      title: "より良い素材。よりスマートな生産",
      subtitle: "責任ある素材選択と実践的な生産改善による廃棄物削減",
      items: [
        "FSC® 認証紙",
        "再生・生分解性素材",
        "大豆・水性インク",
        "自動化生産によるロス削減",
        "廃棄物削減プログラム",
        "省エネ生産",
      ],
    },
    global: {
      title: "現地の専門知識。グローバル配送",
      subtitle: "世界中のパートナーに向けた専任の地域サポートと効率的な物流",
      regions: ["北米", "ヨーロッパ", "アジア太平洋"],
    },
    cta: {
      title: "プロジェクトのアイデアはありますか？",
      subtitle: "コンセプト、アートワーク、製品仕様を当社のチームと共有してください",
      buttonPrimary: "プロジェクトを始める",
      buttonSecondary: "サンプルをリクエスト",
    },
  },
  ko: {
    hero: {
      title: "동화를 현실로 만듭니다",
      subtitle: "전 세계 출판사 및 브랜드를 위한 프리미엄 도서 제작, 복잡한 페이퍼 엔지니어링 및 신뢰할 수 있는 글로벌 배송.",
      ctaPrimary: "포트폴리오 탐색",
      ctaSecondary: "프로젝트 시작하기",
    },
    trust: {
      title: "글로벌 출판을 위한 구축",
      subtitle: "컨셉에서 배송까지 출판사, 소매업체, 크리에이티브 브랜드를 지원하는 신뢰할 수 있는 제조 파트너입니다.",
    },
    featured: {
      title: "아이디어를 탁월한 제품으로",
      subtitle: "페이퍼 엔지니어링, 인쇄, 제본 및 수작업을 결합하여 차별화된 출판물을 만드는 방법을 알아보세요.",
      categories: [
        { name: "보드북", desc: "조기 독서를 위해 설계된 내구성 있는 FSC 인증 보드입니다." },
        { name: "팝업북 및 조작북", desc: "풀탭, 휠, 팝업 등 복잡한 3D 종이 구조를 포함합니다." },
        { name: "사운드 및 전자북", desc: "CE 인증 사운드 모듈, LED 및 대화형 전자 부품." },
        { name: "액티비티 키트", desc: "도서 + 퍼즐 + 공예 + 장난감이 결합된 멀티 컴포넌트 세트입니다." },
        { name: "박스 세트", desc: "조화로운 여러 구성 요소를 포함하는 프리미엄 선물 세트입니다." },
        { name: "라이선스 제품", desc: "글로벌 규정 준수 기준을 충족하는 IP 브랜드 도서 및 키트입니다." },
      ],
    },
    capabilities: {
      title: "우수한 제품에서 글로벌 배송까지",
      subtitle: "엔지니어링 디자인, 샘플링, 생산, 품질 보증 및 국제 물류를 지원하는 통합 팀입니다.",
      steps: [
        { name: "엔지니어링 디자인", desc: "구조 평가, 제조 가능성 제안, 재료 및 비용 최적화." },
        { name: "샘플링 및 프로토타입", desc: "백색 샘플, 컬러 샘플, 기능 샘플 및 고객 확인 프로세스." },
        { name: "오프셋 및 디지털 인쇄", desc: "색상 관리, 별색, 표면 처리 및 공정 제어." },
        { name: "다이 커팅 및 제본", desc: "제본, 라미네이팅, 특수 형태 가공 및 복잡한 구조 성형." },
        { name: "수작업 조립", desc: "수동 조립, 모듈 설치, 액세서리 및 세트 조합." },
        { name: "품질 검사", desc: "수입 검사, 공정, 완제품 및 기능 테스트." },
        { name: "포장 및 출하", desc: "소매 포장, 운송 보호 및 플라스틱 저감 솔루션." },
        { name: "글로벌 물류", desc: "출하 계획, 문서, 물류 조정 및 배송 추적." },
      ],
    },
    quality: {
      title: "모든 단계에 통합된 품질",
      subtitle: "원자재 검사부터 완제품 출하까지 전 공정을 포괄하는 체계적인 품질 관리.",
      modules: ["색상 관리", "수입 검사", "공정 제어", "기능 테스트", "완제품 검사", "전체 추적 가능성"],
    },
    sustainability: {
      title: "더 나은 재료, 더 스마트한 생산",
      subtitle: "책임감 있는 재료 선택과 실질적인 생산 개선을 통해 폐기물을 줄입니다.",
      items: [
        "FSC® 인증 종이",
        "재생 및 생분해성 재료",
        "대두 및 수성 잉크",
        "자동화 생산을 통한 손실 감소",
        "폐기물 감축 프로그램",
        "에너지 효율적인 생산",
      ],
    },
    global: {
      title: "현지 전문 지식. 글로벌 배송.",
      subtitle: "전 세계 파트너에게 전담 지역 지원 및 효율적인 물류 서비스를 제공합니다.",
      regions: ["북미", "유럽", "아시아 태평양"],
    },
    cta: {
      title: "새로운 프로젝트 아이디어가 있으신가요?",
      subtitle: "컨셉, 아트워크 또는 제품 사양을 당사 팀과 공유하여 전문 솔루션을 받으세요.",
      buttonPrimary: "프로젝트 시작하기",
      buttonSecondary: "샘플 요청",
    },
  },
};

const certifications = [
  { name: "Disney", src: "/certificate/Disney_logo.png", invert: true },
  { name: "Walmart", src: "/certificate/Walmart.png" },
  { name: "Target", src: "/certificate/Target.png" },
  { name: "Costco", src: "/certificate/Costco.png" },
  { name: "ISO 9001", src: "/certificate/ISO_9001-2015.png" },
  { name: "ISO 14001", src: "/certificate/iso14001.png", scale: "scale-[1.3]" },
  { name: "SCAN", src: "/certifications/scan.jpg", scale: "scale-[1.8]" },
  { name: "SMETA", src: "/certifications/smeta-.png", scale: "scale-[1.8]" },
  { name: "Universal", src: "/certifications/universal.png", invert: true, scale: "scale-[2.1]" },
  { name: "中国环境标志", src: "/certifications/china10.png", scale: "scale-[1.8]" },
  { name: "FSC", src: "/certifications/fsc-new.png", scale: "scale-125" },
  { name: "EXPERT", src: "/certifications/expert.jpg", scale: "scale-125" },
];

const sectionLabels = [
  "Home",
  "Certifications",
  "Why Us",
  "Featured Work",
  "Process",
  "Quality",
  "Sustainability",
  "Global",
  "Contact",
];

export default function HomePage() {
  const { lang, setLang } = useLang();
  const [activeSection, setActiveSection] = useState(0);
  const [activeProcess, setActiveProcess] = useState(0);
  const [activeQuality, setActiveQuality] = useState(0);
  const [activeSustainability, setActiveSustainability] = useState(0);
  const [susMousePos, setSusMousePos] = useState({ x: 0, y: 0 });
  const [showGif, setShowGif] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const content = contentDict[lang as "en" | "zh" | "ja" | "ko"] || contentDict.en;

  // Loop back to video after GIF finishes playing (21 frames * 380ms = ~7.98s + fade time)
  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
        }
      }, 8000); // Wait 8s before switching back to video
      return () => clearTimeout(timer);
    }
  }, [showGif]);

  const activeSectionRef = useRef(0);
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const sections = document.querySelectorAll(".snap-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActiveSection(idx);
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // FullPage Scroll Wheel Hijack
  useEffect(() => {
    // Disable on mobile/small tablets to preserve native touch scrolling
    if (window.innerWidth < 768) return;

    let targetIndex = activeSectionRef.current;
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Hijack native scroll

      const now = Date.now();
      
      // Only process a wheel event if it's been more than 300ms since the last one.
      // This filters out the hundreds of rapid events from a single swipe,
      // but allows multiple distinct swipes to quickly stack up.
      if (now - lastWheelTime < 300) return;

      const direction = Math.sign(e.deltaY);
      if (direction === 0) return;

      const sections = document.querySelectorAll('.snap-section');
      const maxIndex = sections.length - 1;
      
      // Sync targetIndex if the user hasn't scrolled for a while (1s)
      if (now - lastWheelTime > 1000) {
        targetIndex = activeSectionRef.current;
      }
      
      let nextIndex = targetIndex + direction;

      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex > maxIndex) nextIndex = maxIndex;

      targetIndex = nextIndex;
      lastWheelTime = now;
      
      const target = sections[targetIndex] as HTMLElement;
      if (target) {
        // window.scrollTo with behavior smooth handles updating destinations gracefully
        // if another scroll happens while animating.
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

    return (
<div
      className="bg-[#141414] text-white font-sans selection:bg-gold-500 selection:text-surface-base"
      style={{
        backgroundImage: `
          radial-gradient(1100px 650px at 50% -8%, rgba(255,255,255,0.06), transparent 60%),
          radial-gradient(950px 620px at 8% 28%, rgba(212,168,75,0.06), transparent 55%),
          radial-gradient(950px 620px at 92% 72%, rgba(212,168,75,0.05), transparent 55%),
          radial-gradient(140% 100% at 50% 50%, transparent 52%, rgba(0,0,0,0.45) 100%)
        `,
      }}
    >
      <Navbar lang={lang} onLangChange={setLang} />



      <section
        data-index={0}
        className="snap-section relative h-screen w-full snap-start overflow-hidden"
      >
        {/* Background layer: video (primary) + image (fallback) + gradient */}
        <div className="absolute inset-0 z-0 w-full h-full">
          {/* Video background */}
          <video
            key="/hero-video-merged.mp4"
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ${showGif ? 'opacity-0' : 'opacity-100'}`}
          >
            <source src="/hero-video-merged.mp4" type="video/mp4" />
          </video>
          
          {/* GIF background (plays sequentially after video) */}
          <div className={`absolute inset-0 w-full h-full bg-white flex items-center justify-center transition-opacity duration-1000 ${showGif ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {showGif && (
              <img 
                src="/book_animation.gif" 
                alt="Book flip animation"
                className="w-full h-full object-contain brightness-125 contrast-105"
              />
            )}
          </div>
          
          {/* Gradient overlay — light touch so the video stays visible, bottom blends into page */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/45 via-[#141414]/20 to-[#141414]/70 z-10 pointer-events-none" />
          {/* Subtle vignette to keep focus on center */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(120% 95% at 50% 45%, transparent 62%, rgba(0,0,0,0.12) 100%)",
            }}
          />
          {/* Stage light — faint gold rising from the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gold-500/[0.05] to-transparent z-10 pointer-events-none" />
        </div>

        {/* Content Layer — centered vertically & horizontally */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.1] drop-shadow-sm">
            {content.hero.title}
          </h1>
          <p className="text-lg md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-sm">
            {content.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
            <Link
              href="/portfolio"
              className="w-full sm:w-auto bg-gold-500 text-surface-base px-10 py-4 rounded-full font-semibold hover:bg-gold-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5"
            >
              {content.hero.ctaPrimary}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setShowQuoteForm(true)}
              className="w-full sm:w-auto border border-gold-500/40 text-white px-10 py-4 rounded-full font-medium hover:bg-gold-500/10 hover:border-gold-500 transition-all duration-300 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {content.hero.ctaSecondary}
            </button>
          </div>
          <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-12 opacity-80" />

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
            <span className="text-white/30 text-xs tracking-widest uppercase font-light">
              Scroll
            </span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-gold-500/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* 1. Certifications Dedicated Section */}
      <section
        data-index={1}
        className="snap-section relative snap-start h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black"
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-semibold mb-4 block">
            Quality & Compliance
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-16 tracking-tight leading-tight">
            GLOBAL CERTIFICATIONS
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-3 group"
              >
                <div className="flex items-center justify-center h-28 w-56 bg-white rounded-xl shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 p-5 overflow-hidden">
                  <img
                    src={cert.src}
                    alt={cert.name}
                    className={`h-full w-full object-contain mix-blend-multiply ${cert.scale || ""}`}
                  />
                </div>
                <span className="text-white/60 text-xs tracking-wider uppercase group-hover:text-white transition-colors">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Trust Proof Section (Why Us) */}
      <TrustProofSection dataIndex={2} lang={lang} isActive={activeSection === 2} />

      <section
        data-index={3}
        className="snap-section relative snap-start h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden"
      >
        <div className="max-w-7xl w-full">
          <div className="text-center mb-4 md:mb-8">
            <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-medium">
              Featured Work
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-white">
              {content.featured.title}
            </h2>
            <p className="text-white/70 text-sm md:text-base mt-2 max-w-2xl mx-auto">
              {content.featured.subtitle}
            </p>
            <div className="h-0.5 w-12 bg-gold-500 mx-auto mt-3 md:mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {content.featured.categories.map((cat, i) => (
              <Link
                key={i}
                href={`/portfolio`}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover-lift transition-all"
              >
                <div className="aspect-video relative overflow-hidden bg-white/[0.03]">
                  <OptimizedImage
                    src={`/products/prod-${String(i + 1).padStart(2, "0")}.webp`}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-smooth opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-bold text-white group-hover:text-gold-500 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs md:text-sm text-white/70 mt-1 leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        data-index={4}
        className="snap-section relative snap-start h-screen overflow-hidden flex flex-col py-12 md:py-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-white/[0.02] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col h-full justify-center">
          
          <div className="flex flex-col lg:flex-row h-full max-h-[800px] items-center gap-10 lg:gap-20 pt-8 md:pt-0">
            {/* Left Column: Menu & Header */}
            <div className="w-full lg:w-[30%] flex flex-col">
              <div className="mb-12 pl-2">
                <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">Our Process</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white tracking-tight">
                  {content.capabilities.title}
                </h2>
                <div className="h-0.5 w-10 bg-gold-500 mt-6" />
              </div>

              {/* Vertical Menu (Sleek Typography) */}
              <div className="flex flex-col gap-1">
                {content.capabilities.steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProcess(i)}
                    onMouseEnter={() => setActiveProcess(i)}
                    className={`group relative flex items-center text-left py-3.5 px-6 rounded-r-2xl transition-all duration-500 ${
                      activeProcess === i 
                        ? "bg-gradient-to-r from-gold-500/10 to-transparent border-l-2 border-gold-500" 
                        : "hover:bg-white/[0.03] border-l-2 border-transparent"
                    }`}
                  >
                    <span className={`font-mono text-sm tracking-widest w-8 transition-colors duration-500 ${
                      activeProcess === i ? "text-gold-500 font-bold" : "text-white/70/40 font-medium group-hover:text-gold-500/70"
                    }`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-sm md:text-base tracking-wide transition-colors duration-500 ${
                      activeProcess === i ? "text-white font-bold" : "text-white/70 font-medium group-hover:text-white"
                    }`}>
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Cinematic Display */}
            <div className="w-full lg:w-[70%] h-[45vh] lg:h-[75vh] relative rounded-2xl overflow-hidden bg-white/[0.03] shadow-2xl flex-shrink-0 group ring-1 ring-white/5">
              {content.capabilities.steps.map((s, i) => {
                const processImages = [
                  "/process-illustrations/Gemini_Generated_Image_h4tdnmh4tdnmh4td.webp", // 0: Design
                  "/process-illustrations/Gemini_Generated_Image_38tvxi38tvxi38tv.webp", // 1: Prototyping/Prep
                  "/process-illustrations/Gemini_Generated_Image_3i7d4v3i7d4v3i7d.webp", // 2: Printing
                  "/process-illustrations/Gemini_Generated_Image_4nzn934nzn934nzn.webp", // 3: Die-cutting
                  "/process-illustrations/Gemini_Generated_Image_1zhoul1zhoul1zho.webp", // 4: Assembly/Binding
                  "/process-illustrations/Gemini_Generated_Image_rrrvparrrvparrrv.webp", // 5: QC
                  "/process-illustrations/Gemini_Generated_Image_t02tdut02tdut02t.webp", // 6: Packaging
                  "/real-factory/truck-loading.jpg", // 7: Logistics
                ];
                const picSrc = processImages[i % processImages.length];
                const isActive = activeProcess === i;
                
                return (
                  <div 
                    key={i}
                    className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
                    }`}
                  >
                    <OptimizedImage
                      src={picSrc}
                      alt={s.name}
                      fill
                      className="w-full h-full object-cover"
                      priority={i === 0}
                    />
                    {/* Dark gradient at bottom to anchor the text box */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Info Panel (Redesigned Box) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <div className={`transform transition-all duration-1000 delay-200 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                        {/* Solid premium dark background with gold accent bar */}
                        <div className="bg-black/95 backdrop-blur-md border-l-4 border-gold-500 rounded-r-xl rounded-bl-sm p-6 md:p-8 max-w-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 flex items-center gap-4 tracking-wide">
                            <span className="text-gold-500 font-mono text-lg">{String(i + 1).padStart(2, "0")}</span>
                            {s.name}
                          </h3>
                          <p className="text-white/70 text-sm md:text-base leading-relaxed">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        data-index={5}
        className="snap-section relative snap-start h-screen overflow-hidden flex flex-col py-12 md:py-0"
      >
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col h-full justify-center">
          
          <div className="flex flex-col lg:flex-row h-full max-h-[800px] items-center gap-10 lg:gap-20 pt-8 md:pt-0">
            {/* Left Side: Control Panel */}
            <div className="w-full lg:w-[35%] flex flex-col justify-center relative z-20">
              <div className="mb-8 md:mb-12 pl-2">
                <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
                  Quality & Compliance
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white tracking-tight">
                  {content.quality.title}
                </h2>
                <p className="text-white/70 text-sm md:text-base mt-4 font-light leading-relaxed">
                  {content.quality.subtitle}
                </p>
                <div className="h-0.5 w-10 bg-gold-500 mt-6" />
              </div>

              {/* Interactive List */}
              <div className="flex flex-col gap-2">
                {content.quality.modules.map((mod, i) => {
                  const isActive = activeQuality === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveQuality(i)}
                      className={`group relative flex items-center py-3.5 px-6 rounded-r-2xl cursor-pointer transition-all duration-500 ${
                        isActive 
                          ? "bg-gradient-to-r from-gold-500/10 to-transparent border-l-2 border-gold-500" 
                          : "hover:bg-white/[0.03] border-l-2 border-transparent"
                      }`}
                    >
                      <span className={`font-mono text-sm tracking-widest w-10 transition-colors duration-500 ${
                        isActive ? "text-gold-500 font-bold" : "text-white/70/40 font-medium group-hover:text-gold-500/70"
                      }`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className={`text-base md:text-lg tracking-wide transition-all duration-500 ${
                        isActive ? "text-white font-bold translate-x-2" : "text-white/70 font-medium group-hover:text-white translate-x-0"
                      }`}>
                        {mod}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Full-Bleed Cinematic Window (Aligned with Section 3) */}
            <div className="w-full lg:w-[70%] h-[45vh] lg:h-[75vh] relative rounded-2xl overflow-hidden bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex-shrink-0 group ring-1 ring-white/5">
              {content.quality.modules.map((mod, i) => {
                const realPicsQuality = [
                  "color-management.jpg", // 0: 色彩管理 (Ink/Color)
                  "IMG_5110.JPG", // 1: 来料 (Paper stacks)
                  "IMG_5141.JPG", // 2: 过程控制 (Smart factory machines)
                  "IMG_5183.JPG", // 3: 功能测试
                  "IMG_5133.JPG", // 4: 成品检验 (Inspecting books)
                  "truck-loading.jpg", // 5: 全程追溯 (Tracking/Boxes)
                ];
                const picSrc = `/real-factory/${realPicsQuality[i % realPicsQuality.length]}`;
                const isActive = activeQuality === i;
                
                return (
                   <div 
                     key={`qual-full-${i}`}
                     className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                   >
                     <OptimizedImage
                       src={picSrc}
                       alt={mod}
                       fill
                       className={`w-full h-full object-cover transition-transform duration-[20s] ease-linear ${isActive ? "scale-105" : "scale-100"}`}
                       priority={i === 0}
                     />
                   </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        data-index={6}
        className="snap-section relative snap-start h-screen overflow-hidden flex flex-col py-12 md:py-0"
      >
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col h-full justify-center">
          
          <div className="flex flex-col lg:flex-row h-full max-h-[800px] items-center gap-10 lg:gap-20 pt-8 md:pt-0">
            {/* Left Side: Control Panel */}
            <div className="w-full lg:w-[35%] flex flex-col justify-center relative z-20">
              <div className="mb-8 md:mb-12 pl-2">
                <span className="text-emerald-500 text-xs tracking-widest uppercase font-semibold">
                  Sustainability
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white tracking-tight">
                  {content.sustainability.title}
                </h2>
                <p className="text-white/70 text-sm md:text-base mt-4 font-light leading-relaxed">
                  {content.sustainability.subtitle}
                </p>
                <div className="h-0.5 w-10 bg-emerald-500 mt-6" />
              </div>

              {/* Interactive List */}
              <div className="flex flex-col gap-2">
                {content.sustainability.items.map((item, i) => {
                  const isActive = activeSustainability === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveSustainability(i)}
                      className={"group relative flex items-center py-3.5 px-6 rounded-r-2xl cursor-pointer transition-all duration-500 " +
                        (isActive 
                          ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2 border-emerald-500" 
                          : "hover:bg-white/[0.03] border-l-2 border-transparent")}
                    >
                      <span className={"text-base md:text-lg tracking-wide transition-all duration-500 " +
                        (isActive ? "text-white font-bold translate-x-2" : "text-white/70 font-medium group-hover:text-white translate-x-0")}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Full-Bleed Cinematic Window */}
            <div className="w-full lg:w-[70%] h-[45vh] lg:h-[75vh] relative rounded-2xl overflow-hidden bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex-shrink-0 group ring-1 ring-white/5">
              {content.sustainability.items.map((item, i) => {
                 const realPicsSustainability = [
                  "fsc-paper.jpg", // 0: FSC Paper
                  "IMG_5112.JPG", // 1: Recycled materials
                  "IMG_5256.JPG", // 2: Soy/Water inks
                  "automated-production.jpg", // 3: Automated production waste reduction
                  "IMG_5143.JPG", // 4: Waste reduction
                  "IMG_5141.JPG", // 5: Smart production
                 ];
                 const picSrc = `/real-factory/${realPicsSustainability[i % realPicsSustainability.length]}`;
                 const isActive = activeSustainability === i;
                 return (
                   <div 
                     key={"sus-full-" + i}
                     className={"absolute inset-0 transition-opacity duration-1000 " + (isActive ? "opacity-100 z-10" : "opacity-0 z-0")}
                   >
                     <OptimizedImage
                       src={picSrc}
                       alt={item}
                       fill
                       className={"w-full h-full object-cover transition-transform duration-[20s] ease-linear " + (isActive ? "scale-105" : "scale-100")}
                     />
                   </div>
                 );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Global Presence — Ultra Premium Cinematic (Light Theme) */}
      <section
        data-index={7}
        className="snap-section relative snap-start h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background Text / Typography */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-center z-0 pointer-events-none select-none">
          <h2 className="text-[18vw] md:text-[14vw] font-bold text-white/[0.03] tracking-tighter leading-none">
            BORDERLESS
          </h2>
        </div>

        {/* Top Header */}
        <div className="absolute top-12 md:top-20 left-0 w-full px-8 md:px-16 lg:px-24 flex justify-between items-start z-20">
          <div className="flex flex-col gap-2">
            <span className="text-gold-500 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold flex items-center gap-3">
              <span className="w-6 h-[1px] bg-gold-500/50" />
              Global Network
            </span>
            <h3 className="text-white text-3xl md:text-5xl font-light tracking-wide mt-2 leading-tight">
              Everywhere<br />You Need Us.
            </h3>
          </div>
          
          <div className="hidden md:flex flex-col text-right gap-4 opacity-70 mt-2">
            <div className="flex flex-col">
              <span className="text-white font-mono text-xl">15+</span>
              <span className="text-white/70 text-[9px] uppercase tracking-[0.2em]">Countries</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-mono text-xl">30+</span>
              <span className="text-white/70 text-[9px] uppercase tracking-[0.2em]">Partners</span>
            </div>
          </div>
        </div>

        {/* The Globe */}
        <div className="absolute inset-0 z-10 flex items-center justify-center top-[10%] mix-blend-screen">
           {/* We scale the globe container up slightly so it feels massive */}
           <div className="w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] max-w-[900px] max-h-[900px] opacity-90">
             <InteractiveGlobe />
           </div>
        </div>

        {/* Floating City Coordinates (Glassmorphic Light) */}
        <div className="absolute bottom-12 md:bottom-20 left-0 w-full px-8 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-end z-20 gap-6">
          <p className="text-white/70 text-xs md:text-sm font-light max-w-sm leading-relaxed tracking-wide">
            Delivering precision manufacturing and seamless logistics across North America, Europe, and Asia-Pacific.
          </p>

          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar max-w-full pb-2 md:pb-0">
            {[
              { region: "North America Hub", city: "New York", coord: "40.71° N, 74.00° W" },
              { region: "Europe Hub", city: "London", coord: "51.50° N, 0.12° W" },
              { region: "Asia Pacific HQ", city: "Shanghai", coord: "31.23° N, 121.47° E" },
              { region: "East Asia Hub", city: "Tokyo", coord: "35.67° N, 139.65° E" },
            ].map((node, i) => (
              <div key={i} className="group flex flex-col gap-1.5 backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-gold-500/30 transition-all duration-500 shadow-2xl p-5 rounded-2xl shrink-0 min-w-[160px] md:min-w-[180px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/0 via-gold-500/0 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-gold-500 text-[10px] uppercase tracking-widest font-bold mb-1">{node.region}</span>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  <span className="text-white font-bold text-lg tracking-wide">{node.city}</span>
                </div>
                <span className="text-white/40 font-mono text-[10px] tracking-widest">{node.coord}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Section 7: CTA + Footer */}
      <section
        data-index={8}
        className="snap-section relative snap-start h-screen flex flex-col items-center"
      >
        {/* Main Content centered in remaining vertical space */}
        <div className="flex-1 w-full flex flex-col items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-semibold">
              {lang === "zh" ? "开始合作" : lang === "ja" ? "お問い合わせ" : "Get in Touch"}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 tracking-tight leading-tight">
              {content.cta.title}
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
              {content.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowQuoteForm(true)}
                className="bg-gold-500 text-surface-base px-10 py-4 rounded-full font-semibold hover:bg-gold-400 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 flex items-center gap-2"
              >
                {content.cta.buttonPrimary}
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/portfolio"
                className="border border-gold-500/30 text-white px-10 py-4 rounded-full font-medium hover:bg-gold-500/5 hover:border-gold-500 transition-all duration-300"
              >
                {content.cta.buttonSecondary}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer sitting at the absolute bottom */}
        <div className="w-full shrink-0">
          <Footer dark={true} />
        </div>
      </section>
      
      {/* Navigation Dots */}
      <nav className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
        {sectionLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => {
              const el = document.querySelector(`[data-index="${i}"]`);
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center justify-center"
            aria-label={`Go to ${label}`}
          >
            {/* Tooltip */}
            <span className="absolute right-full mr-3 whitespace-nowrap text-[10px] uppercase tracking-widest font-medium text-gold-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
              {label}
            </span>
            {/* Dot */}
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                activeSection === i
                  ? "bg-gold-500 scale-125 shadow-[0_0_10px_rgba(212,168,75,0.6)] ring-2 ring-gold-500/60"
                  : "bg-gold-500/25 ring-1 ring-gold-500/30 hover:bg-gold-500/40 hover:scale-110"
              }`}
            />
            {/* Active indicator line */}
            {activeSection === i && (
              <div className="absolute inset-0 w-2 h-2 rounded-full animate-pulse-dot" />
            )}
          </button>
        ))}
      </nav>

      {/* Film grain — premium texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Quote Form Modal */}
      {showQuoteForm && (
        <QuoteForm
          productName="General Inquiry (Homepage)"
          lang={lang as "en" | "zh" | "ja" | "ko"}
          onClose={() => setShowQuoteForm(false)}
        />
      )}
</div>
  );
}
