"use client";
import { useLang } from "../hooks/useLang";

export default function Footer({ dark = false }: { dark?: boolean }) {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  const bg = dark ? "bg-[#0a0a0a] border-t border-white/[0.06]" : "bg-surface-2 border-t border-subtle";
  const tSec = dark ? "text-white/45" : "text-secondary";
  const tPri = dark ? "text-white/85" : "text-primary";
  const div = dark ? "border-white/[0.06]" : "border-subtle";

  return (
    <footer className={`${bg} pt-16 pb-8 px-6`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src="/company-logo.png" alt="星嘉艺" className="h-12 w-12 md:h-14 md:w-14 object-cover object-left bg-white/95 p-1.5 rounded-xl shadow-sm ring-1 ring-white/10" />
            <div className="flex flex-col justify-center">
              <span className={`font-bold text-xl md:text-2xl leading-none tracking-widest ${dark ? "text-white" : "text-primary"}`} style={{fontFamily: 'var(--font-noto)'}}>星嘉艺</span>
              <span className={`font-mono text-xs tracking-[0.2em] mt-1 ${dark ? "text-white/80" : "text-secondary"}`}>XINGJIAYI</span>
            </div>
          </div>
          <p className={`${tSec} text-sm leading-relaxed`}>
            {lang === "zh" ? (
              <>
                <span className="block">专注于高端儿童纸艺产品的研发生产</span>
                <span className="block">服务全球知名出版企业</span>
              </>
            ) : lang === "ja" ? (
              "高級児童紙工芸製品の研究開発と製造に特化し、世界中の有名出版社にサービスを提供しています。"
            ) : lang === "ko" ? (
              "프리미엄 아동용 페이퍼 크래프트 제품 연구 개발 및 생산에 전념하며, 글로벌 유명 출판 브랜드에 서비스를 제공합니다."
            ) : (
              "Specializing in premium children's paper craft products, serving world-renowned publishing brands."
            )}
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className={`${tPri} font-bold text-sm uppercase tracking-wider mb-5`}>
            {lang === "zh" ? "联系方式" : lang === "ja" ? "お問い合わせ" : lang === "ko" ? "연락처" : "Contact"}
          </h3>
          <ul className={`space-y-3 text-sm ${tSec}`}>
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{lang === "zh" ? "广东省深圳市宝安区石岩镇宝石南路18号星嘉艺大厦" : lang === "ja" ? "広東省深セン市宝安区石岩鎮宝石南路18号星嘉芸ビル" : lang === "ko" ? "광둥성 선전시 바오안구 스옌진 바오스 남로 18호 싱자이 빌딩" : "Xingjiayi Building, No. 18 Baoshi South Road, Shiyan Town, Bao'an District, Shenzhen, Guangdong"}</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>0755-27643555</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@xingjiayi.com</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m4 2v-2m-8 0V9a4 4 0 014-4h2a4 4 0 014 4v6M5 17h14v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z" />
              </svg>
              <span>{lang === "zh" ? "传真：0755-27643911" : lang === "ja" ? "FAX：0755-27643911" : "Fax: 0755-27643911"}</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={`${tPri} font-bold text-sm uppercase tracking-wider mb-5`}>
            {lang === "zh" ? "快速链接" : lang === "ja" ? "クイックリンク" : "Quick Links"}
          </h3>
          <ul className={`space-y-3 text-sm ${tSec}`}>
            <li><a href="/" className={`${tSec} hover:text-gold-500 ease-smooth`}>{lang === "zh" ? "首页" : lang === "ja" ? "ホーム" : "Home"}</a></li>
            <li><a href="/about" className={`${tSec} hover:text-gold-500 ease-smooth`}>{lang === "zh" ? "关于我们" : lang === "ja" ? "会社概要" : "About"}</a></li>
            <li><a href="/portfolio" className={`${tSec} hover:text-gold-500 ease-smooth`}>{lang === "zh" ? "产品展示" : lang === "ja" ? "製品カタログ" : "Portfolio"}</a></li>
            <li><a href="/plant" className={`${tSec} hover:text-gold-500 ease-smooth`}>{lang === "zh" ? "智能工厂" : lang === "ja" ? "スマート工場" : "Plant"}</a></li>
            <li><a href="/portal" className={`${tSec} hover:text-gold-500 ease-smooth`}>{lang === "zh" ? "客户门户" : lang === "ja" ? "お客様ポータル" : "Client Portal"}</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className={`max-w-7xl mx-auto border-t ${div} pt-8`}>
        <p className={`text-center ${tSec} text-xs`}>&copy; {year} Shenzhen Xingjiayi Art Paper Co., Ltd. | {lang === "zh" ? "深圳市星嘉艺纸艺有限公司" : lang === "ja" ? "深圳市星嘉藝紙芸有限公司" : "Shenzhen Xingjia Yi Art Paper Co., Ltd."}</p>
      </div>
    </footer>
  );
}
