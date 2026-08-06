"use client";
import React, { useState, useEffect, useRef } from "react";
import { Building2, Globe, Award, Clock } from "lucide-react";
import type { TrustNumberItem } from "../lib/cms";

interface Props {
  lang: string;
  isActive: boolean;
  topContent?: React.ReactNode;
  dataIndex?: number;
  trustData?: TrustNumberItem[];
}

// 跳动数字组件 — easeOutExpo 缓动，每次滚动到此屏时重新触发动画
const AnimatedNumber = ({ end, suffix, isActive }: { end: number; suffix: string; isActive: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isActive) {
      let startTime: number | null = null;
      let animationFrameId: number;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(ease * end));
        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      animationFrameId = window.requestAnimationFrame(step);
      
      return () => window.cancelAnimationFrame(animationFrameId);
    } else {
      setCount(0);
    }
  }, [end, isActive]);

  return <span className="tabular-nums">{count}{suffix}</span>;
};

export default function TrustProofSection({ lang, isActive, topContent, dataIndex, trustData }: Props) {
  const L = (ls: { en: string; zh: string; ja: string; ko: string } | undefined, fallback: string) => {
    if (!ls) return fallback;
    const v = ls[lang as keyof typeof ls];
    return v || ls.en || fallback;
  };

  const icons = [Building2, Globe, Award, Clock];
  const cmsCards = (trustData || []).map((t, i) => ({
    end: Number(t.value) || 0,
    suffix: t.suffix || "",
    label: L(t.label, ""),
    desc: L(t.desc, ""),
    Icon: icons[i % icons.length],
  }));

  const content = {
    title:
      lang === "zh"
        ? "为全球出版而生"
        : lang === "ja"
          ? "グローバル出版のために"
          : "Built for Global Publishing",
    sub:
      lang === "zh"
        ? "从创意到交付，值得信赖的儿童图书及创意纸品制造伙伴"
        : lang === "ja"
          ? "コンセプトから納品まで、出版社・小売・ブランドを支える信頼のパートナー"
          : "A trusted manufacturing partner supporting publishers, retailers and creative brands from concept to delivery",
    cards: cmsCards.length ? cmsCards : [
      {
        end: 25, suffix: "+",
        label: lang === "zh" ? "行业经验" : lang === "ja" ? "業界経験" : "Years of Experience",
        desc: lang === "zh" ? "自2000年起，专注于纸艺工程与精密印刷。" : lang === "ja" ? "2000年より紙工芸と精密印刷に特化。" : "Since 2000, dedicated to paper engineering and precision printing.",
        Icon: Building2,
      },
      {
        end: 30, suffix: "+",
        label: lang === "zh" ? "出口国家" : lang === "ja" ? "輸出先国" : "Global Markets",
        desc: lang === "zh" ? "产品远销全球六大洲的出版商与品牌。" : lang === "ja" ? "六大州の出版社・ブランドへ輸出。" : "Exporting to publishers and brands across six continents.",
        Icon: Globe,
      },
      {
        end: 500, suffix: "+",
        label: lang === "zh" ? "年项目数" : lang === "ja" ? "年間プロジェクト" : "Projects Annually",
        desc: lang === "zh" ? "从纸板书到复杂立体书工程。" : lang === "ja" ? "ボードブックから複雑なポップアップまで。" : "From board books to complex pop-up engineering.",
        Icon: Award,
      },
      {
        end: 98, suffix: "%",
        label: lang === "zh" ? "准时交付率" : lang === "ja" ? "納品率" : "On-time Delivery",
        desc: lang === "zh" ? "稳定的项目管控与物流协同。" : lang === "ja" ? "安定したプロジェクト管理と物流。" : "Consistent, reliable project management and logistics.",
        Icon: Clock,
      },
    ],
  };

  return (
    <section data-index={dataIndex} className="snap-section snap-start relative min-h-screen sm:h-screen w-full flex flex-col items-center justify-start overflow-hidden">
      {topContent && <div className="w-full shrink-0">{topContent}</div>}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col items-center justify-center h-full py-16 sm:py-12 md:py-16 flex-1">
        {/* 标题区 */}
        <div className="text-center flex-shrink-0 mb-8 sm:mb-10 md:mb-12 mt-4 sm:mt-0 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            {content.title}
          </h2>
          {/* 金色分割线 — 匹配 Hero 风格 */}
          <div className="w-[60px] h-[2px] bg-gold-500/80 mx-auto mt-3 sm:mt-4 md:mt-6 mb-6" />
          <p className="text-sm sm:text-base md:text-xl text-white/70 font-light leading-relaxed px-4">
            {content.sub}
          </p>
        </div>

        {/* 数据卡片 — 移动端1列  ↔  平板2列  ↔  桌面4列 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-5xl flex-grow md:flex-grow-0 min-h-0">
          {content.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white/[0.04] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-white/[0.06] hover:bg-white/[0.08] transition-colors duration-300 h-full"
            >
              {/* 图标圈 — 淡化处理，不与金色数字抢视觉权重 */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 sm:mb-6 text-white/30 flex-shrink-0">
                <card.Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              {/* 跳动金色数字 — 核心视觉焦点 */}
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold-500 mb-2 sm:mb-4 tracking-tighter">
                <AnimatedNumber end={card.end} suffix={card.suffix} isActive={isActive} />
              </div>
              <div className="text-sm sm:text-base md:text-lg font-medium text-white mb-2 sm:mb-3">
                {card.label}
              </div>
              {/* 描述文字 — 所有屏幕尺寸都显示 */}
              <p className="text-[11px] sm:text-[12px] md:text-sm text-white/60 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
