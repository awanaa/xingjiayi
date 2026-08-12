"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OptimizedImage from "../components/OptimizedImage";
import { useLang } from "../hooks/useLang";

// --- Inline Helpers ---
function useInView(options: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.threshold]);

  return { ref, isInView };
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const { ref, isInView } = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easedProgress = easeOutExpo(percentage);

      setCount(Math.floor(easedProgress * end));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// --- Content Data ---
const translations = {
  zh: {
    heroTitle: "新一代智能制造工厂",
    heroSubtitle: "重塑童书与纸艺的工业标准",
    stats: [
      { num: 50, suffix: "%+", label: "全自动产线比例" },
      { num: 20000, suffix: "m²", label: "生产基地总面积" },
      { num: 24, suffix: "H", label: "全天候恒温恒湿控制" },
      { num: 100, suffix: "%", label: "智能仓储物流追溯" },
    ],
    sectionTitle: "生产工艺全流程",
    steps: [
      { id: "01", title: "印前色彩管理", desc: "采用 G7 国际认证标准，实现从屏幕到纸张的完美色彩还原。" },
      { id: "02", title: "高精度印刷", desc: "引进海德堡等国际顶级印刷矩阵，确保网点清晰、色彩饱满。" },
      { id: "03", title: "表面特种工艺", desc: "烫金、击凸、UV光油、覆膜，赋予每一页超越视觉的触感。" },
      { id: "04", title: "模切与成型", desc: "高精度模切设备，确保各种异型书页与立体机关边缘平滑无毛刺。" },
      { id: "05", title: "立体纯手工装配", desc: "500+ 名熟练技师，精准组装精密立体机关，注入手工匠心。" },
      { id: "06", title: "全检与包装", desc: "360° 严苛品控，多道质检工序，确保每一件产品绝对安全达标。" },
    ],
    equipment1Title: "世界级印刷设备集群",
    equipment1Desc: "配备多台德国进口高速印刷机，从单色到多色，从薄纸到厚纸板，实现全覆盖、高效率、高品质的印刷输出。每一张印品都在严密的数字化监控下进行。",
    equipment2Title: "全自动印后装订线",
    equipment2Desc: "摒弃传统低效模式，全面引入全自动锁线机、胶装机及皮壳机，在保证书籍牢固度的同时，极大提升了生产规模与交付速度。",
    certTitle: "全球品质认证",
    ctaTitle: "准备好启动您的项目了吗？",
    ctaButton: "联系我们的制造专家",
  },
  en: {
    heroTitle: "Next-Gen Smart Factory",
    heroSubtitle: "Reshaping the Standards of Book & Paper Art Manufacturing",
    stats: [
      { num: 50, suffix: "%+", label: "Automated Production Lines" },
      { num: 20000, suffix: "m²", label: "Manufacturing Facility Area" },
      { num: 24, suffix: "H", label: "24/7 Climate & Humidity Control" },
      { num: 100, suffix: "%", label: "Smart Inventory Tracking" },
    ],
    sectionTitle: "End-to-End Production Process",
    steps: [
      { id: "01", title: "Pre-press Color Management", desc: "G7 certified color calibration ensuring perfect screen-to-paper matching." },
      { id: "02", title: "High-Precision Printing", desc: "Equipped with world-class Heidelberg presses for vibrant, flawless prints." },
      { id: "03", title: "Surface Finishing", desc: "Foil stamping, embossing, UV varnishing, and lamination for premium tactile feel." },
      { id: "04", title: "Die-cutting & Gluing", desc: "Precision die-cutting ensuring smooth, burr-free edges for all interactive mechanisms." },
      { id: "05", title: "Handcrafting & Assembly", desc: "Over 500 skilled artisans assembling intricate pop-up mechanisms with care." },
      { id: "06", title: "Quality Inspection & Packaging", desc: "Rigorous 360° quality control ensuring absolute safety and compliance." },
    ],
    equipment1Title: "World-Class Printing Fleet",
    equipment1Desc: "Equipped with multiple high-speed offset presses imported from Germany, handling everything from thin paper to thick board with uncompromising quality and speed under digital supervision.",
    equipment2Title: "Automated Post-Press Binding",
    equipment2Desc: "Saying goodbye to traditional inefficiencies. Our fully automated sewing, binding, and casing-in machines ensure maximum durability while drastically accelerating delivery times.",
    certTitle: "Global Quality Certifications",
    ctaTitle: "Ready to start your next project?",
    ctaButton: "Contact Our Manufacturing Experts",
  },
  ja: {
    heroTitle: "次世代スマート工場",
    heroSubtitle: "絵本とペーパーアートの製造基準を再定義",
    stats: [
      { num: 50, suffix: "%+", label: "自動化生産ラインの割合" },
      { num: 20000, suffix: "m²", label: "生産拠点の総面積" },
      { num: 24, suffix: "H", label: "24時間恒温恒湿制御" },
      { num: 100, suffix: "%", label: "スマート在庫管理追跡" },
    ],
    sectionTitle: "一貫した生産プロセス",
    steps: [
      { id: "01", title: "プリプレスカラーマネジメント", desc: "G7認証による画面から紙への完璧な色合わせ。" },
      { id: "02", title: "高精度印刷", desc: "ハイデルベルグ製の最高峰印刷機による鮮やかで完璧な印刷。" },
      { id: "03", title: "表面加工", desc: "箔押し、エンボス、UVニス、PP加工による極上の手触り。" },
      { id: "04", title: "打ち抜き・糊付け", desc: "複雑な仕掛けもバリなく滑らかに仕上げる高精度な打ち抜き。" },
      { id: "05", title: "手作業による組み立て", desc: "500人以上の熟練職人が複雑な飛び出す仕掛けを丁寧に組み立て。" },
      { id: "06", title: "全品検査・梱包", desc: "絶対的な安全と基準を満たすための厳格な360°品質管理。" },
    ],
    equipment1Title: "世界トップクラスの印刷設備",
    equipment1Desc: "ドイツから輸入した複数の高速オフセット印刷機を備え、薄紙から厚紙まで、デジタル監視の下で妥協のない品質と速度で処理します。",
    equipment2Title: "自動化された製本ライン",
    equipment2Desc: "従来の非効率な作業を排除。完全自動化された糸綴じ、製本、上製本機により、最大の耐久性を確保しながら納品時間を大幅に短縮します。",
    certTitle: "グローバル品質認証",
    ctaTitle: "次のプロジェクトを始める準備はできましたか？",
    ctaButton: "製造の専門家に連絡する",
  }
};

const certs = ["ISO 9001", "ISO 14001", "Disney FAMA", "Walmart", "Target", "Costco", "FSC Certified"];

// --- Components ---
const FadeInUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
};

export default function PlantPage() {
  const { lang, setLang } = useLang();
  const content = translations[lang as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/90 selection:bg-gold-500 selection:text-[#0a0a0a] font-sans">
      <Navbar lang={lang} onLangChange={setLang} showBackButton />

      {/* Hero Video Section */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-[#0a0a0a]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/Premium_Children_s_Book_Factory_Video_opt.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-6 mt-16">
          <FadeInUp>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              {content.heroTitle}
            </h1>
          </FadeInUp>
          <FadeInUp delay={200}>
            <p className="text-lg md:text-2xl text-white/70 max-w-2xl font-light">
              {content.heroSubtitle}
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl md:text-6xl font-bold text-gold-500 mb-3 tracking-tighter">
                <CountUp end={stat.num} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base text-white/50 tracking-wider uppercase font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Production Steps (Cards with Backgrounds) */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <FadeInUp>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
              {content.sectionTitle}
            </h2>
          </FadeInUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.steps.map((step, i) => (
              <FadeInUp key={i} delay={i * 100}>
                <div className="group relative h-[400px] overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 flex flex-col justify-end p-8">
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={`/process-illustrations/process-0${i + 1}.webp`} 
                      alt={step.title}
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-gold-500 font-mono text-xl block mb-2 opacity-80">{step.id}.</span>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Split Section 1 */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <FadeInUp>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.equipment1Title}</h2>
              <p className="text-white/60 leading-relaxed text-lg mb-8">
                {content.equipment1Desc}
              </p>
              <div className="h-[1px] w-24 bg-gold-500/50" />
            </FadeInUp>
          </div>
          <div className="w-full md:w-1/2 relative">
            <FadeInUp delay={200}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 relative">
                <OptimizedImage 
                  src="/exhibit-07.jpg" 
                  alt="High Speed Printing"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l border-b border-gold-500/30 z-[-1]" />
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Equipment Split Section 2 */}
      <section className="py-24 px-6 overflow-hidden bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2">
            <FadeInUp>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.equipment2Title}</h2>
              <p className="text-white/60 leading-relaxed text-lg mb-8">
                {content.equipment2Desc}
              </p>
              <div className="h-[1px] w-24 bg-gold-500/50" />
            </FadeInUp>
          </div>
          <div className="w-full md:w-1/2 relative">
            <FadeInUp delay={200}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 relative">
                <OptimizedImage 
                  src="/exhibit-08.jpg" 
                  alt="Automated Binding"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -top-6 -right-6 w-32 h-32 border-r border-t border-gold-500/30 z-[-1]" />
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Certification Strip */}
      <section className="py-12 border-y border-white/5 bg-[#0f0f0f] overflow-hidden flex">
        <div className="animate-[scroll_30s_linear_infinite] whitespace-nowrap flex gap-16 px-8 opacity-50 hover:opacity-100 transition-opacity">
          {[...certs, ...certs, ...certs].map((cert, i) => (
            <span key={i} className="text-xl md:text-2xl font-semibold tracking-wider text-white">
              {cert}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <FadeInUp>
          <div className="inline-block p-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mb-8">
            <div className="bg-[#0a0a0a] px-6 py-2 tracking-widest uppercase text-sm text-gold-400">
              {lang === "zh" ? "联系我们" : lang === "ja" ? "お問い合わせ" : "Get in Touch"}
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-12">{content.ctaTitle}</h2>
          <a 
            href="mailto:peng.shao.jun@szxingjiayi.com"
            className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-400 text-[#0a0a0a] px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,168,75,0.4)]"
          >
            {content.ctaButton}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </FadeInUp>
      </section>

      <Footer />
      
      {/* Required for the scrolling marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}} />
    </div>
  );
}
