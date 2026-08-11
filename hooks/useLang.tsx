"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "zh" | "ja" | "ko";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "zh";
  const saved = localStorage.getItem("site-lang") as Lang | null;
  if (saved === "en" || saved === "zh" || saved === "ja") return saved;
  // Default to Chinese for China-based company
  return "zh";
}

const LangContext = createContext<LangContextType>({
  lang: "zh",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("site-lang") as Lang | null;
    if (saved === "en" || saved === "zh" || saved === "ja" || saved === "ko") {
      setLangState(saved);
    } else {
      fetch("https://get.geojs.io/v1/ip/country.json")
        .then(res => res.json())
        .then(data => {
          const country = data.country;
          let newLang: Lang = "en";
          if (["CN", "TW", "HK", "MO", "SG"].includes(country)) {
            newLang = "zh";
          } else if (country === "JP") {
            newLang = "ja";
          } else if (country === "KR") {
            newLang = "ko";
          }
          setLangState(newLang);
          localStorage.setItem("site-lang", newLang);
        })
        .catch(() => {
          setLangState("en");
          localStorage.setItem("site-lang", "en");
        });
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("site-lang", newLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}