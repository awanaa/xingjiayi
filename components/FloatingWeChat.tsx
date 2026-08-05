"use client";

import React from "react";
import { useLang } from "../hooks/useLang";

export default function FloatingWeChat() {
  const { lang } = useLang();
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      <div className="group relative bg-[#1A1A1A] border border-white/10 rounded-l-xl py-3 px-2 shadow-2xl hover:border-green-500/40 hover:bg-[#222] transition-all duration-300 cursor-pointer">
        <div className="w-12 h-12 flex items-center justify-center">
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-[10px] text-center leading-tight p-0.5 shadow-lg">
            {lang === "zh" ? "微信\n咨询" : lang === "ja" ? "微信\n問合" : "WeChat"}
          </div>
        </div>
        <span className="text-[8px] text-gray-500 block text-center mt-1.5 tracking-wider">微信</span>

        {/* Hover popup */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 shadow-2xl min-w-[160px]">
            <div className="w-28 h-28 mx-auto rounded-lg border border-white/10 flex items-center justify-center mb-2 overflow-hidden relative">
              {/* Placeholder QR-style pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 p-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${[0,2,6,8].includes(i) ? 'bg-green-500/60' : [4].includes(i) ? 'bg-green-500/30' : 'bg-green-500/10'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="relative z-10 w-20 h-20 bg-surface-base/10 backdrop-blur-sm rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-green-400/40 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-[8px] text-green-300/60 tracking-wider">QR</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center">{lang === "zh" ? "扫码咨询 · 快速报价" : lang === "ja" ? "スキャンしてお問い合わせ" : "Scan for inquiry"}</p>
            <p className="text-[8px] text-gray-600 text-center mt-1">(二维码待添加)</p>
          </div>
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#1A1A1A] border-r border-t border-white/10 rotate-45" />
        </div>
      </div>
    </div>
  );
}
