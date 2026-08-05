import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { LangProvider } from "../hooks/useLang";
import ScrollToTop from "../components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Shenzhen Xingjiayi Art Paper Co., Ltd. | 深圳市星嘉艺纸艺有限公司",
  description: "深圳市星嘉艺纸艺有限公司 – 立足深圳，服务全球。三十年深耕纸艺工程与智能印刷解决方案。",
  icons: {
    icon: "/company-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${notoSansSC.variable} font-sans`}>
        <LangProvider>
          {children}
          <ScrollToTop />
        </LangProvider>
      </body>
    </html>
  );
}