"use client";
import React, { useState, useEffect } from "react";
import type { SiteContent, LocaleString } from "@/lib/cms";

const defaultLocale: LocaleString = { en: "", zh: "", ja: "", ko: "" };

const fillArray = <T,>(arr: T[] | undefined, len: number, factory: () => T): T[] => {
  const result = [...(arr || [])];
  while (result.length < len) {
    result.push(factory());
  }
  return result;
};

const defaultContent: SiteContent = {
  hero: { title: defaultLocale, subtitle: defaultLocale, ctaPrimary: defaultLocale, ctaSecondary: defaultLocale },
  trust: { title: defaultLocale, subtitle: defaultLocale },
  featured: { title: defaultLocale, subtitle: defaultLocale, categories: [] },
  capabilities: { title: defaultLocale, subtitle: defaultLocale, steps: [] },
  quality: { title: defaultLocale, subtitle: defaultLocale, modules: [] },
  sustainability: { title: defaultLocale, subtitle: defaultLocale, items: [] },
  cta: { title: defaultLocale, subtitle: defaultLocale, buttonPrimary: defaultLocale, buttonSecondary: defaultLocale },
  certifications: [],
  trustNumbers: [],
};

const mergeDefaults = (data: any): SiteContent => {
  const safeData = data || {};
  return {
    hero: safeData.hero || defaultContent.hero,
    trust: safeData.trust || defaultContent.trust,
    featured: {
      ...defaultContent.featured,
      ...safeData.featured,
      categories: fillArray(safeData.featured?.categories, 6, () => ({ name: defaultLocale, desc: defaultLocale, image: "" })),
    },
    capabilities: {
      ...defaultContent.capabilities,
      ...safeData.capabilities,
      steps: fillArray(safeData.capabilities?.steps, 8, () => ({ name: defaultLocale, desc: defaultLocale, image: "" })),
    },
    quality: {
      ...defaultContent.quality,
      ...safeData.quality,
      modules: fillArray(safeData.quality?.modules, 6, () => ({ name: defaultLocale, image: "" })),
    },
    sustainability: {
      ...defaultContent.sustainability,
      ...safeData.sustainability,
      items: fillArray(safeData.sustainability?.items, 6, () => ({ name: defaultLocale, image: "" })),
    },
    cta: safeData.cta || defaultContent.cta,
    certifications: fillArray(safeData.certifications, 12, () => ({ name: defaultLocale, src: "", invert: false, scale: "" })),
    trustNumbers: fillArray(safeData.trustNumbers, 4, () => ({ value: "", suffix: "", label: defaultLocale, desc: defaultLocale })),
  };
};

const LocaleRow = ({ value, onChange, label, isTextArea }: { value: LocaleString; onChange: (v: LocaleString) => void; label?: string; isTextArea?: boolean }) => {
  const handleChange = (lang: keyof LocaleString, val: string) => {
    onChange({ ...(value || defaultLocale), [lang]: val });
  };
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-neutral-400 mb-2">{label}</label>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(["en", "zh", "ja", "ko"] as const).map((lang) => (
          <div key={lang}>
            <div className="text-xs text-neutral-500 mb-1 uppercase">{lang === "zh" ? "中" : lang === "ja" ? "日" : lang === "ko" ? "韩" : "EN"}</div>
            {isTextArea ? (
              <textarea
                value={value?.[lang] || ""}
                onChange={(e) => handleChange(lang, e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
                rows={3}
              />
            ) : (
              <input
                type="text"
                value={value?.[lang] || ""}
                onChange={(e) => handleChange(lang, e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ImagePicker = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) onChange(data.url);
      else alert(data.error || "上传失败");
    } catch {
      alert("上传异常");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-neutral-400 mb-2">{label}</label>}
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="Preview" className="h-16 w-16 object-cover rounded bg-neutral-800 border border-neutral-700" />
        ) : (
          <div className="h-16 w-16 bg-neutral-800 rounded border border-neutral-700 border-dashed flex items-center justify-center text-xs text-neutral-500">无图</div>
        )}
        <label className={`cursor-pointer bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 px-4 py-2 rounded text-sm text-white transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "上传中..." : "选择图片"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        {value && <span className="text-xs text-neutral-500 truncate max-w-[200px]" title={value}>{value}</span>}
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-neutral-800">{title}</h3>
    <div className="space-y-6">{children}</div>
  </section>
);

const ArraySection = ({ title, subtitle, onTitleChange, onSubtitleChange, items, renderItem }: any) => (
  <div className="space-y-6">
    <Section title="区块设置">
      <LocaleRow label="大标题" value={title} onChange={onTitleChange} />
      <LocaleRow label="副标题" value={subtitle} onChange={onSubtitleChange} isTextArea />
    </Section>
    <div className="space-y-4">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 shadow-inner">
          <h4 className="text-sm font-bold text-[#d4a84b] mb-4 uppercase tracking-wider">项 #{idx + 1}</h4>
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  </div>
);

const TABS = [
  { id: "home", name: "首页文案" },
  { id: "featured", name: "产品分类" },
  { id: "capabilities", name: "流程步骤" },
  { id: "quality", name: "质量模块" },
  { id: "sustainability", name: "可持续" },
  { id: "certifications", name: "认证Logo" },
  { id: "trustNumbers", name: "数据数字" },
];

export default function AdminPage() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch("/api/admin/me");
      if (authRes.ok) {
        setIsAuthenticated(true);
        const contentRes = await fetch("/api/admin/content");
        if (contentRes.ok) {
          const data = await contentRes.json();
          setContent(mergeDefaults(data));
        } else {
          setContent(mergeDefaults({}));
        }
      }
    } catch {
      // ignore
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setLoginError("密码错误，请重试");
      }
    } catch {
      setLoginError("网络异常");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaveMessage("已保存 ✓");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("保存失败，请检查网络");
      }
    } catch {
      setSaveMessage("保存异常");
    } finally {
      setSaving(false);
    }
  };

  const updateSectionState = <K extends keyof SiteContent>(section: K, field: keyof SiteContent[K], value: any) => {
    setContent((prev) => ({ ...prev, [section]: { ...(prev[section] as any), [field]: value } }));
  };

  const updateArray = <K extends "featured" | "capabilities" | "quality" | "sustainability">(section: K, arrayField: keyof SiteContent[K], index: number, field: string, value: any) => {
    setContent((prev) => {
      const arr = [...(prev[section] as any)[arrayField]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: { ...(prev[section] as any), [arrayField]: arr } };
    });
  };

  const updateRootArray = <K extends "certifications" | "trustNumbers">(section: K, index: number, field: string, value: any) => {
    setContent((prev) => {
      const arr = [...prev[section]];
      (arr as any)[index] = { ...(arr as any)[index], [field]: value };
      return { ...prev, [section]: arr };
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-12">
            <Section title="首屏 (Hero)">
              <LocaleRow label="主标题" value={content.hero.title} onChange={(v) => updateSectionState("hero", "title", v)} />
              <LocaleRow label="副标题" value={content.hero.subtitle} onChange={(v) => updateSectionState("hero", "subtitle", v)} isTextArea />
              <LocaleRow label="主按钮" value={content.hero.ctaPrimary} onChange={(v) => updateSectionState("hero", "ctaPrimary", v)} />
              <LocaleRow label="次按钮" value={content.hero.ctaSecondary} onChange={(v) => updateSectionState("hero", "ctaSecondary", v)} />
            </Section>
            <Section title="信任背书 (Trust)">
              <LocaleRow label="标题" value={content.trust.title} onChange={(v) => updateSectionState("trust", "title", v)} />
              <LocaleRow label="副标题" value={content.trust.subtitle} onChange={(v) => updateSectionState("trust", "subtitle", v)} isTextArea />
            </Section>
            <Section title="底部行动呼唤 (CTA)">
              <LocaleRow label="标题" value={content.cta.title} onChange={(v) => updateSectionState("cta", "title", v)} />
              <LocaleRow label="副标题" value={content.cta.subtitle} onChange={(v) => updateSectionState("cta", "subtitle", v)} isTextArea />
              <LocaleRow label="主按钮" value={content.cta.buttonPrimary} onChange={(v) => updateSectionState("cta", "buttonPrimary", v)} />
              <LocaleRow label="次按钮" value={content.cta.buttonSecondary} onChange={(v) => updateSectionState("cta", "buttonSecondary", v)} />
            </Section>
          </div>
        );
      case "featured":
        return (
          <ArraySection
            title={content.featured.title}
            onTitleChange={(v: LocaleString) => updateSectionState("featured", "title", v)}
            subtitle={content.featured.subtitle}
            onSubtitleChange={(v: LocaleString) => updateSectionState("featured", "subtitle", v)}
            items={content.featured.categories}
            renderItem={(item: any, idx: number) => (
              <>
                <LocaleRow label="分类名称" value={item.name} onChange={(v: LocaleString) => updateArray("featured", "categories", idx, "name", v)} />
                <LocaleRow label="分类描述" value={item.desc} onChange={(v: LocaleString) => updateArray("featured", "categories", idx, "desc", v)} isTextArea />
                <ImagePicker label="代表配图" value={item.image} onChange={(v: string) => updateArray("featured", "categories", idx, "image", v)} />
              </>
            )}
          />
        );
      case "capabilities":
        return (
          <ArraySection
            title={content.capabilities.title}
            onTitleChange={(v: LocaleString) => updateSectionState("capabilities", "title", v)}
            subtitle={content.capabilities.subtitle}
            onSubtitleChange={(v: LocaleString) => updateSectionState("capabilities", "subtitle", v)}
            items={content.capabilities.steps}
            renderItem={(item: any, idx: number) => (
              <>
                <LocaleRow label="步骤名称" value={item.name} onChange={(v: LocaleString) => updateArray("capabilities", "steps", idx, "name", v)} />
                <LocaleRow label="步骤描述" value={item.desc} onChange={(v: LocaleString) => updateArray("capabilities", "steps", idx, "desc", v)} isTextArea />
                <ImagePicker label="代表配图" value={item.image} onChange={(v: string) => updateArray("capabilities", "steps", idx, "image", v)} />
              </>
            )}
          />
        );
      case "quality":
        return (
          <ArraySection
            title={content.quality.title}
            onTitleChange={(v: LocaleString) => updateSectionState("quality", "title", v)}
            subtitle={content.quality.subtitle}
            onSubtitleChange={(v: LocaleString) => updateSectionState("quality", "subtitle", v)}
            items={content.quality.modules}
            renderItem={(item: any, idx: number) => (
              <>
                <LocaleRow label="模块名称" value={item.name} onChange={(v: LocaleString) => updateArray("quality", "modules", idx, "name", v)} />
                <ImagePicker label="模块图标/图片" value={item.image} onChange={(v: string) => updateArray("quality", "modules", idx, "image", v)} />
              </>
            )}
          />
        );
      case "sustainability":
        return (
          <ArraySection
            title={content.sustainability.title}
            onTitleChange={(v: LocaleString) => updateSectionState("sustainability", "title", v)}
            subtitle={content.sustainability.subtitle}
            onSubtitleChange={(v: LocaleString) => updateSectionState("sustainability", "subtitle", v)}
            items={content.sustainability.items}
            renderItem={(item: any, idx: number) => (
              <>
                <LocaleRow label="举措名称" value={item.name} onChange={(v: LocaleString) => updateArray("sustainability", "items", idx, "name", v)} />
                <ImagePicker label="配图" value={item.image} onChange={(v: string) => updateArray("sustainability", "items", idx, "image", v)} />
              </>
            )}
          />
        );
      case "certifications":
        return (
          <div className="space-y-4">
            <Section title="认证Logo列表">
              {content.certifications.map((item, idx) => (
                <div key={idx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 mb-4 shadow-inner">
                  <h4 className="text-sm font-bold text-[#d4a84b] mb-4 uppercase">Logo #{idx + 1}</h4>
                  <LocaleRow label="名称 (仅用于辅助访问，前台不显示)" value={item.name} onChange={(v: LocaleString) => updateRootArray("certifications", idx, "name", v)} />
                  <ImagePicker label="Logo原图" value={item.src} onChange={(v: string) => updateRootArray("certifications", idx, "src", v)} />
                  <div className="flex gap-6 mt-4">
                    <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer select-none">
                      <input type="checkbox" checked={item.invert || false} onChange={(e) => updateRootArray("certifications", idx, "invert", e.target.checked)} className="accent-[#d4a84b] w-4 h-4 rounded" />
                      深色模式反转 (适用于全黑Logo)
                    </label>
                    <label className="block text-sm text-neutral-400">
                      缩放类名 (高级，如 scale-[1.8]，留空默认)
                      <input type="text" value={item.scale || ""} onChange={(e) => updateRootArray("certifications", idx, "scale", e.target.value)} placeholder="scale-[1.8]" className="mt-1 block w-48 bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all" />
                    </label>
                  </div>
                </div>
              ))}
            </Section>
          </div>
        );
      case "trustNumbers":
        return (
          <div className="space-y-4">
            <Section title="关键数据指标">
              {content.trustNumbers.map((item, idx) => (
                <div key={idx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 mb-4 shadow-inner">
                  <h4 className="text-sm font-bold text-[#d4a84b] mb-4 uppercase">数据 #{idx + 1}</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">数值 (如 100)</label>
                      <input type="text" value={item.value} onChange={(e) => updateRootArray("trustNumbers", idx, "value", e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">后缀 (如 % 或 +)</label>
                      <input type="text" value={item.suffix} onChange={(e) => updateRootArray("trustNumbers", idx, "suffix", e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all" />
                    </div>
                  </div>
                  <LocaleRow label="主标签 (如 研发投入)" value={item.label} onChange={(v: LocaleString) => updateRootArray("trustNumbers", idx, "label", v)} />
                  <LocaleRow label="副描述 (如 每年占比)" value={item.desc} onChange={(v: LocaleString) => updateRootArray("trustNumbers", idx, "desc", v)} />
                </div>
              ))}
            </Section>
          </div>
        );
      default:
        return null;
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-[#d4a84b] font-medium tracking-widest">初始化中...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-lg p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#d4a84b] mb-2">星嘉艺</h1>
            <p className="text-sm text-neutral-400">官方网站内容管理后台</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="请输入管理员密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-4 py-3 text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm font-medium">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#d4a84b] hover:bg-[#c29639] text-[#141414] font-bold py-3 rounded transition-colors disabled:opacity-50 mt-4"
            >
              {loginLoading ? "登录中..." : "安全登录"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-neutral-200 flex flex-col md:flex-row font-sans selection:bg-[#d4a84b] selection:text-[#141414]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-auto md:h-screen sticky top-0 z-20 overflow-x-auto md:overflow-y-auto shadow-xl md:shadow-none">
        <div className="p-4 md:p-6 border-b border-neutral-800 flex justify-between items-center md:flex-col md:items-start md:gap-4 shrink-0">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white whitespace-nowrap">星嘉艺<span className="text-[#d4a84b] ml-1">内容管理</span></h1>
            <p className="text-xs text-neutral-500 mt-1 hidden md:block">v1.0.0</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-neutral-400 hover:text-red-400 transition-colors">退出登录</button>
        </div>
        <nav className="p-2 md:p-4 flex md:flex-col gap-1 md:gap-2 overflow-x-auto shrink-0 md:shrink">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded text-left whitespace-nowrap transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-[#d4a84b] text-[#141414] shadow-md"
                  : "hover:bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Editor Content Area */}
      <main className="flex-1 flex flex-col h-auto md:h-screen md:overflow-hidden relative pb-24 md:pb-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 md:pb-32 bg-[#141414]">
          <div className="max-w-4xl mx-auto">
            {renderTabContent()}
          </div>
        </div>

        {/* Fixed Save Bar */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30">
          <div className="text-sm font-bold text-[#d4a84b] flex items-center gap-2">
            {saveMessage && <span>{saveMessage}</span>}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#d4a84b] hover:bg-[#c29639] text-[#141414] px-8 py-2.5 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {saving ? "保存中..." : "保存当前更改"}
          </button>
        </div>
      </main>
    </div>
  );
}
