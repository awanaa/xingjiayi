// FloatingHomeButton — 浮动回首页按钮
// 滚动超过一屏后右下角浮现，点击平滑回到首页顶部
// 折纸菱形造型 + 金色主题

"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingHomeButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 在 Hero 之后出现（~100vh 的 80%）
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="返回首页"
      className={`
        fixed bottom-8 right-8 z-40
        w-14 h-14 rounded-btn
        flex items-center justify-center
        cursor-pointer
        transition-all duration-700 ease-smooth
        hover:scale-110 active:scale-95
        group
        ${visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
        }
      `}
      style={{
        background: "linear-gradient(135deg, #D4A84B 0%, #B38728 50%, #D4A84B 100%)",
        boxShadow: "0 4px 24px rgba(212, 168, 75, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      }}
    >
      {/* 内部菱形 */}
      <div className="absolute inset-[3px] rounded-sm" style={{
        background: "linear-gradient(135deg, #1C1C1C 0%, #2A2A2A 100%)",
        clipPath: "polygon(50% 8%, 92% 50%, 50% 92%, 8% 50%)",
      }} />
      {/* 箭头图标 */}
      <ArrowUp className="relative z-10 w-5 h-5 text-gold-500 group-hover:text-gold-300 transition-colors duration-300" />
      {/* 悬浮文字提示 */}
      <span className="
        absolute right-full mr-4
        whitespace-nowrap text-sm font-medium
        bg-surface-base/90 backdrop-blur-sm
        border border-border-subtle
        px-4 py-2 rounded-lg
        text-primary
        opacity-0 group-hover:opacity-100
        -translate-x-2 group-hover:translate-x-0
        transition-all duration-300 ease-smooth
        pointer-events-none
        shadow-lg
      ">
        返回首页
      </span>
      {/* 光晕 */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(212,168,75,0.3) 0%, transparent 70%)",
        }}
      />
    </button>
  );
}
