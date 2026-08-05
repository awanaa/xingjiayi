"use client";

import React from "react";
import Link from "next/link";
import { ClipboardCheck, Clock, ShieldCheck, Truck, FileText, HeadphonesIcon } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLang } from "../../hooks/useLang";

export default function ClientPortal() {
  const { lang, setLang } = useLang();

  const content = {
    en: {
      title: "Client Services",
      sub: "Your Partner in Paper Engineering.",
      desc: "From sample confirmation to final delivery, we provide end-to-end support for every project. Here's what you can expect when working with us.",
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
    },
    zh: {
      title: "客户服务",
      sub: "您的纸艺工程合作伙伴。",
      desc: "从打样确认到最终交付，我们为每个项目提供端到端支持。以下是与我们合作时您可以期待的服务。",
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
    },
    ja: {
      title: "お客様サービス",
      sub: "紙工芸のパートナー。",
      desc: "サンプル確認から最終納品まで、プロジェクトを完全サポート。",
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
    },
  }[lang as "en" | "zh" | "ja"]!;

  return (
    <div className="min-h-screen bg-surface-base text-primary font-sans selection:bg-gold-500 selection:text-surface-base pb-32">
      <Navbar showBackButton lang={lang} onLangChange={setLang} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden border-b border-subtle bg-surface-2">
        <div className="max-w-7xl mx-auto relative z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            {content.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-warm">{content.sub}</span>
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto font-light leading-relaxed">
            {content.desc}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={idx} className="shadow-elevation-1 rounded-container p-8 group hover-lift border border-subtle">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-600/20 to-gold-600/5 border border-gold flex items-center justify-center mb-6 group-hover:scale-110 ease-smooth">
                  <Icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-primary font-bold text-lg mb-3">{service.title}</h3>
                <p className="text-warm text-sm leading-relaxed">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface-1 border-y border-subtle">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {lang === "zh" ? "有兴趣合作？" : lang === "ja" ? "お問い合わせはこちら" : "Ready to Start a Project?"}
          </h2>
          <p className="text-warm text-lg mb-8 max-w-2xl mx-auto">
            {lang === "zh" ? "联系我们的团队，为您的下一个纸艺项目获取报价。" : lang === "ja" ? "次の紙工芸プロジェクトの見積りをご依頼ください。" : "Contact our team for a production quote on your next paper engineering project."}
          </p>
          <Link
            href="/about"
            className="inline-block bg-gold-500 hover:bg-gold-400 text-primary font-bold px-8 py-4 rounded-btn ease-smooth shadow-lg shadow-gold-500/20"
          >
            {lang === "zh" ? "关于我们" : lang === "ja" ? "会社概要" : "About Us"}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
