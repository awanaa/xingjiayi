'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  lang?: "en" | "zh" | "ja" | "ko";
  onLangChange?: (lang: "en" | "zh" | "ja" | "ko") => void;
  showBackButton?: boolean;
}

export default function Navbar({ lang, onLangChange, showBackButton }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
    >
      {/* 背景层 — 始终显示 */}
      <div
        className={`absolute inset-0 h-16 md:h-18 transition-opacity duration-500 opacity-100`}
      >
        <div className="w-full h-full bg-stone-950/40 backdrop-blur-2xl border-b border-gold-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" />
      </div>

      {/* 占位层 */}
      <div className="w-full h-16 md:h-18" />

      {/* Logo + 右侧内容 — 共用同一个水平对齐容器 */}
      <div className="relative max-w-7xl mx-auto px-6 -mt-16 md:-mt-18 h-16 md:h-18">
        {/* Logo — 始终可见，定位在容器左侧 */}
        <Link href="/" className="absolute top-1/2 -translate-y-1/2 z-10 transition-[left] duration-500 ease-smooth flex items-center" style={{ left: showBackButton ? '-16px' : '0px' }}>
          <div className="relative flex items-center gap-3">
            <img
              src="/company-logo.png"
              alt={lang === "zh" ? "星嘉艺" : "XINGJIAYI"}
              className={`h-10 w-10 md:h-12 md:w-12 object-cover object-left bg-white/95 p-1.5 rounded-xl shadow-sm ring-1 ring-white/10 origin-left transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
            />
            <div className={`flex flex-col justify-center origin-left transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}>
              <span className="text-primary font-bold text-lg md:text-xl leading-none tracking-widest drop-shadow-sm" style={{fontFamily: 'var(--font-noto)'}}>星嘉艺</span>
              <span className="text-secondary font-mono text-[10px] md:text-xs tracking-[0.2em] mt-1 opacity-80 drop-shadow-sm">XINGJIAYI</span>
            </div>
          </div>
        </Link>

        {/* 垂直分割线 */}
        {!showBackButton && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-16 md:left-18 h-6 w-[1px] bg-border-subtle hidden md:block transition-opacity duration-500 opacity-100`}
          />
        )}

        {/* 右侧链接 + 按钮 — 始终显示 */}
        <div
          className={`h-full flex justify-end items-center transition-all duration-500 opacity-100`}
        >
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex space-x-8 text-sm font-medium text-white/90">
              {showBackButton ? (
                <Link href="/" className="hover:text-gold-400 hover:drop-shadow-[0_0_8px_rgba(212,168,75,0.4)] ease-smooth flex items-center">
                  {lang === "zh" ? "← 返回首页" : lang === "ja" ? "← 戻る" : lang === "ko" ? "← 홈으로" : "← Back to Home"}
                </Link>
              ) : (
                <>
                  <Link href="/about" className="hover:text-gold-400 hover:drop-shadow-[0_0_8px_rgba(212,168,75,0.4)] ease-smooth">{lang === "zh" ? "关于我们" : lang === "ja" ? "会社概要" : lang === "ko" ? "회사 소개" : "About Us"}</Link>
                  <Link href="/plant" className="hover:text-gold-400 hover:drop-shadow-[0_0_8px_rgba(212,168,75,0.4)] ease-smooth">{lang === "zh" ? "智能工厂" : lang === "ja" ? "スマート工場" : lang === "ko" ? "스마트 팩토리" : "Intelligent Plant"}</Link>
                  <Link href="/portfolio" className="hover:text-gold-400 hover:drop-shadow-[0_0_8px_rgba(212,168,75,0.4)] ease-smooth">{lang === "zh" ? "产品展示" : lang === "ja" ? "製品カタログ" : lang === "ko" ? "제품 카탈로그" : "Portfolio"}</Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {onLangChange && (
                <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-full items-center">
                  {(['zh', 'en', 'ja', 'ko'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => onLangChange(l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ease-smooth ${
                        lang === l ? 'bg-gold-500 text-stone-900 shadow-[0_0_10px_rgba(212,168,75,0.5)]' : 'text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {l === 'zh' ? '中' : l === 'en' ? 'EN' : l === 'ja' ? '日' : '한'}
                    </button>
                  ))}
                </div>
              )}
              <Link href="/portal" className="hidden sm:block bg-white/5 hover:bg-white/10 text-white/90 hover:text-white px-5 py-2.5 rounded-btn text-sm font-medium ease-smooth border border-white/10 backdrop-blur-md">
                {lang === "zh" ? "客户门户" : lang === "ja" ? "お客様ポータル" : lang === "ko" ? "클라이언트 포털" : "Client Portal"}
              </Link>
            </div>

            {/* Mobile Hamburger Icon */}
            <div className="md:hidden flex items-center ml-2">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-white/90 hover:text-gold-400 focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-stone-950/95 backdrop-blur-xl border-b border-gold-500/15 py-4 px-6 flex flex-col gap-2 shadow-2xl">
            {showBackButton ? (
              <Link href="/" className="text-white/90 hover:text-gold-400 py-3 border-b border-white/10 text-sm font-medium" onClick={() => setIsOpen(false)}>
                {lang === "zh" ? "← 返回首页" : lang === "ja" ? "← 戻る" : lang === "ko" ? "← 홈으로" : "← Back to Home"}
              </Link>
            ) : (
              <>
                <Link href="/about" className="text-white/90 hover:text-gold-400 py-3 border-b border-white/10 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  {lang === "zh" ? "关于我们" : lang === "ja" ? "会社概要" : lang === "ko" ? "회사 소개" : "About Us"}
                </Link>
                <Link href="/plant" className="text-white/90 hover:text-gold-400 py-3 border-b border-white/10 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  {lang === "zh" ? "智能工厂" : lang === "ja" ? "スマート工場" : lang === "ko" ? "스마트 팩토리" : "Intelligent Plant"}
                </Link>
                <Link href="/portfolio" className="text-white/90 hover:text-gold-400 py-3 border-b border-white/10 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  {lang === "zh" ? "产品展示" : lang === "ja" ? "製品カタログ" : lang === "ko" ? "제품 카탈로그" : "Portfolio"}
                </Link>
                <Link href="/portal" className="text-white/90 hover:text-gold-400 py-3 border-b border-white/10 text-sm font-medium sm:hidden" onClick={() => setIsOpen(false)}>
                  {lang === "zh" ? "客户门户" : lang === "ja" ? "お客様ポータル" : lang === "ko" ? "클라이언트 포털" : "Client Portal"}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
