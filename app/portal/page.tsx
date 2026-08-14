"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ClipboardCheck, Clock, ShieldCheck, Truck, FileText,
  HeadphonesIcon, ChevronDown, ArrowUpRight, Sparkles
} from "lucide-react";
import Navbar from "../../components/Navbar";
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

export default function ClientPortal() {
  const { lang, setLang } = useLang();

  const [statsRef, statsIn] = useInView(0.3);
  const [gridRef, gridIn] = useInView(0.1);

  const content = {
    en: {
      over: "Client Services",
      title: "Your Partner in",
      accent: "Paper Engineering",
      desc: "From sample confirmation to final delivery, we provide end-to-end support for every project. Here's what you can expect when working with us.",
      scroll: "Scroll to explore",
      stats: [
        { end: 100, suffix: "+", label: "Global Clients" },
        { end: 99, suffix: "%", label: "On-Time Delivery" },
        { end: 24, suffix: "h", label: "Response Time" },
        { end: 25, suffix: "+", label: "Years of Craft" },
      ],
      servicesTitle: "What We Offer",
      servicesSub: "Six pillars of support — from the first sample to the final mile",
      services: [
        {
          icon: ClipboardCheck,
          title: "Free Prototyping",
          desc: "Submit your design files and we'll craft a physical sample for your review. Free of charge for first-round samples on new projects.",
        },
        {
          icon: Clock,
          title: "Standard Lead Times",
          desc: "Sample turnaround: 5–10 business days. Mass production: 20–35 business days depending on complexity and order volume.",
        },
        {
          icon: ShieldCheck,
          title: "Quality Assurance",
          desc: "Every batch undergoes AOI inspection, pull-strength testing, and safety compliance screening (EN71, ASTM, RoHS, CPSIA, GB6675).",
        },
        {
          icon: Truck,
          title: "Global Logistics",
          desc: "FOB Shenzhen with preferred rates from DHL, FedEx, and sea freight. Real-time tracking shared upon dispatch.",
        },
        {
          icon: FileText,
          title: "Order Tracking",
          desc: "Get real-time updates via email or your dedicated account manager. Transparent milestones from pre-press to shipping.",
        },
        {
          icon: HeadphonesIcon,
          title: "Dedicated Support",
          desc: "Each client is assigned a production manager and quality controller who speak your language—English, Chinese, or Japanese.",
        },
      ],
      ctaTitle: "Ready to Start a Project?",
      ctaDesc: "Contact our team for a production quote on your next paper engineering project.",
      ctaBtn: "About Us",
      ctaBtn2: "Get a Quote",
    },
    zh: {
      over: "客户服务",
      title: "您的纸艺工程",
      accent: "长期合作伙伴",
      desc: "从打样确认到最终交付，我们为每个项目提供端到端支持",
      scroll: "向下探索",
      stats: [
        { end: 100, suffix: "+", label: "全球客户" },
        { end: 99, suffix: "%", label: "准时交付率" },
        { end: 24, suffix: "h", label: "快速响应" },
        { end: 25, suffix: "+", label: "行业经验" },
      ],
      servicesTitle: "我们能为您做什么",
      servicesSub: "六大服务支柱——从第一份样品到最后一公里",
      services: [
        {
          icon: ClipboardCheck,
          title: "免费打样",
          desc: "提交您的设计文件，我们将制作实物样品供您审核。新项目的首轮打样免费。",
        },
        {
          icon: Clock,
          title: "标准交期",
          desc: "打样周期：5–10 个工作日。大货周期：20–35 个工作日（视工艺复杂度和订单量而定）。",
        },
        {
          icon: ShieldCheck,
          title: "品质保证",
          desc: "每批次通过 AOI 检测、拉力测试及安全合规筛查（EN71、ASTM、RoHS、CPSIA、GB6675）。",
        },
        {
          icon: Truck,
          title: "全球物流",
          desc: "深圳 FOB 交货，享有 DHL、FedEx 及海运优势运价。发货后实时共享物流追踪。",
        },
        {
          icon: FileText,
          title: "订单追踪",
          desc: "通过邮件或专属客户经理获取实时更新。从印前到出货，每个里程碑透明可见。",
        },
        {
          icon: HeadphonesIcon,
          title: "专属支持",
          desc: "每位客户配备一名生产经理及品质专员，支持中英日三语沟通。",
        },
      ],
      ctaTitle: "有兴趣合作？",
      ctaDesc: "联系我们的团队，为您的下一个纸艺项目获取报价。",
      ctaBtn: "关于我们",
      ctaBtn2: "获取报价",
    },
    ja: {
      over: "お客様サービス",
      title: "紙工芸の",
      accent: "パートナー",
      desc: "サンプル確認から最終納品まで、プロジェクトを完全サポート。",
      scroll: "スクロール",
      stats: [
        { end: 100, suffix: "+", label: "グローバル顧客" },
        { end: 99, suffix: "%", label: "納期順守率" },
        { end: 24, suffix: "h", label: "レスポンス" },
        { end: 25, suffix: "+", label: "年の実績" },
      ],
      servicesTitle: "サービス内容",
      servicesSub: "サンプルから最終納品まで、6つの柱でサポート",
      services: [
        {
          icon: ClipboardCheck,
          title: "無料プロトタイプ",
          desc: "デザインデータをお送りいただければ、実物サンプルを作成。新規案件の初回は無料です。",
        },
        {
          icon: Clock,
          title: "標準リードタイム",
          desc: "サンプル：5–10営業日。量産：20–35営業日（複雑さと数量による）。",
        },
        {
          icon: ShieldCheck,
          title: "品質保証",
          desc: "全ロットにAOI検査、引張試験、安全規制適合確認を実施（EN71、ASTM、RoHS、CPSIA、GB6675）。",
        },
        {
          icon: Truck,
          title: "グローバル物流",
          desc: "深圳FOB条件。DHL、FedEx、海上輸送の優遇料金。出荷後リアルタイム追跡情報を共有。",
        },
        {
          icon: FileText,
          title: "注文追跡",
          desc: "メールまたは専任マネージャーがリアルタイムで進捗報告。",
        },
        {
          icon: HeadphonesIcon,
          title: "専任サポート",
          desc: "お客様ごとに生産マネージャーと品質担当者を配置。英語・中国語・日本語対応可能。",
        },
      ],
      ctaTitle: "お問い合わせはこちら",
      ctaDesc: "次の紙工芸プロジェクトの見積りをご依頼ください。",
      ctaBtn: "会社概要",
      ctaBtn2: "見積り依頼",
    },
  }[lang as "en" | "zh" | "ja"] || {
    over: "", title: "", accent: "", desc: "", scroll: "", stats: [], servicesTitle: "", servicesSub: "", services: [], ctaTitle: "", ctaDesc: "", ctaBtn: "", ctaBtn2: ""
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-gold-500/40 selection:text-white overflow-x-hidden">
      <Navbar showBackButton lang={lang} onLangChange={setLang} />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[50%] aspect-square rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] aspect-square rounded-full bg-gold-500/5 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.5em] text-gold-400/80 font-medium uppercase border border-gold-500/20 rounded-full px-5 py-1.5 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              {content.over}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1] animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.15s forwards' }}>
            {content.title}
            <span className="block mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600">{content.accent}</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light animate-fade-in-up opacity-0" style={{ animation: 'fadeInUp 0.8s ease-out 0.45s forwards' }}>
            {content.desc}
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">{content.scroll}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section ref={statsRef} className="relative py-24 px-6 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {content.stats.map((stat, i) => (
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

      {/* ═══ SERVICES GRID ═══ */}
      <section ref={gridRef} className="relative py-32 px-6 border-t border-white/[0.04]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-gold-500/8 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square rounded-full bg-gold-500/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.3em] text-gold-400/60 uppercase font-medium mb-4 block">
              {content.over}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{content.servicesTitle}</h2>
            <p className="text-white/40 text-sm md:text-base">{content.servicesSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 overflow-hidden transition-all duration-700 ease-out hover:border-gold-500/30 hover:bg-white/[0.04] ${
                    gridIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className="absolute top-5 right-6 text-4xl font-black text-white/[0.04] group-hover:text-gold-500/10 transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 border border-gold-500/25 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:border-gold-500/50">
                    <Icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
                  <div className="mt-6 h-[2px] w-10 bg-gold-500/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold-500/60" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-32 px-6 border-t border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0c09] to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-gold-500/8 blur-[140px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">{content.ctaTitle}</h2>
          <p className="text-white/60 text-lg mb-10 font-light drop-shadow-md">{content.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-[#0a0a0a] rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-500 hover:scale-105 group"
            >
              {content.ctaBtn}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a
              href="mailto:peng.shao.jun@szxingjiayi.com"
              className="inline-flex items-center justify-center gap-2 bg-black/50 hover:bg-white/10 text-white border border-white/20 rounded-full px-8 py-4 text-sm tracking-widest uppercase transition-all duration-500 hover:scale-105 backdrop-blur-md"
            >
              {content.ctaBtn2}
            </a>
          </div>
        </div>
      </section>

      <Footer dark />
    </div>
  );
}
