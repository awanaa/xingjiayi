"use client";
import React, { useState, useEffect } from "react";
import type { SiteContent, LocaleString } from "@/lib/cms";

const defaultLocale: LocaleString = { en: "", zh: "", ja: "", ko: "" };

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
  plant: {
    heroOver: defaultLocale, heroTitle: defaultLocale, heroAccent: defaultLocale, heroDesc: defaultLocale, scroll: defaultLocale,
    stats: [],
    processTitle: defaultLocale, processSub: defaultLocale, steps: [],
    equipTitle: defaultLocale, equipSub: defaultLocale, equipItems: [],
    certTitle: defaultLocale, ctaTitle: defaultLocale, ctaDesc: defaultLocale, ctaBtn: defaultLocale,
    certifications: [],
  },
  gallery: { folders: [], categories: [] },
};

const DEFAULT_CATEGORY_NAMES: Record<string, string> = {
  boardbook: "纸板书",
  hardcover: "精装书",
  mechanism: "机关书",
  popup: "立体书",
  touch: "触摸书",
  sound: "发声书",
  magnetic: "磁性拼图",
  giftbox: "精品包装",
  uncategorized: "未分类",
};

const buildCategories = (folders: { images: { category?: string }[] }[] | undefined): { key: string; name: string }[] => {
  const seen = new Set<string>();
  const result: { key: string; name: string }[] = [];
  for (const f of folders || []) {
    for (const img of f.images || []) {
      const cat = img.category || "uncategorized";
      if (!seen.has(cat)) {
        seen.add(cat);
        result.push({ key: cat, name: DEFAULT_CATEGORY_NAMES[cat] || cat });
      }
    }
  }
  if (!seen.has("uncategorized")) result.push({ key: "uncategorized", name: "未分类" });
  return result;
};

const mergeDefaults = (data: any): SiteContent => {
  const safeData = data || {};
  return {
    hero: safeData.hero || defaultContent.hero,
    trust: safeData.trust || defaultContent.trust,
    featured: {
      ...defaultContent.featured,
      ...safeData.featured,
      categories: safeData.featured?.categories || [],
    },
    capabilities: {
      ...defaultContent.capabilities,
      ...safeData.capabilities,
      steps: safeData.capabilities?.steps || [],
    },
    quality: {
      ...defaultContent.quality,
      ...safeData.quality,
      modules: safeData.quality?.modules || [],
    },
    sustainability: {
      ...defaultContent.sustainability,
      ...safeData.sustainability,
      items: safeData.sustainability?.items || [],
    },
    cta: safeData.cta || defaultContent.cta,
    certifications: safeData.certifications || [],
    trustNumbers: safeData.trustNumbers || [],
    plant: {
      ...defaultContent.plant,
      ...(safeData.plant || {}),
      heroOver: safeData.plant?.heroOver || defaultLocale,
      heroTitle: safeData.plant?.heroTitle || defaultLocale,
      heroAccent: safeData.plant?.heroAccent || defaultLocale,
      heroDesc: safeData.plant?.heroDesc || defaultLocale,
      scroll: safeData.plant?.scroll || defaultLocale,
      processTitle: safeData.plant?.processTitle || defaultLocale,
      processSub: safeData.plant?.processSub || defaultLocale,
      equipTitle: safeData.plant?.equipTitle || defaultLocale,
      equipSub: safeData.plant?.equipSub || defaultLocale,
      certTitle: safeData.plant?.certTitle || defaultLocale,
      ctaTitle: safeData.plant?.ctaTitle || defaultLocale,
      ctaDesc: safeData.plant?.ctaDesc || defaultLocale,
      ctaBtn: safeData.plant?.ctaBtn || defaultLocale,
      stats: safeData.plant?.stats || [],
      steps: safeData.plant?.steps || [],
      equipItems: safeData.plant?.equipItems || [],
      certifications: safeData.plant?.certifications || [],
    },
    gallery: (() => {
      const g = safeData.gallery || { folders: [] };
      const folders = g.folders || [];
      return {
        folders,
        categories: Array.isArray(g.categories) && g.categories.length > 0 ? g.categories : buildCategories(folders),
      };
    })(),
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

const GalleryTab = ({ content, onContentChange }: { content: SiteContent; onContentChange: (c: SiteContent) => void }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("boardbook");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const folders = content.gallery?.folders || [];
  const categories = content.gallery?.categories || [];
  const catName = (key: string) => categories.find((c) => c.key === key)?.name || DEFAULT_CATEGORY_NAMES[key] || key;

  const updateGallery = (g: { folders: { key: string; images: any[] }[]; categories: { key: string; name: string }[] }) => {
    onContentChange({ ...content, gallery: g as any });
  };

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    const key = name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-") || `cat-${Date.now()}`;
    const finalKey = categories.some((c) => c.key === key) ? `${key}-${Date.now().toString(36)}` : key;
    updateGallery({
      folders,
      categories: [...categories, { key: finalKey, name }],
    });
    setNewCatName("");
  };

  const renameCategory = (key: string, name: string) => {
    updateGallery({ folders, categories: categories.map((c) => (c.key === key ? { ...c, name } : c)) });
  };

  const removeCategory = (key: string) => {
    const target = key === "uncategorized" ? null : "uncategorized";
    // 该分类下的图片移到未分类，同时删除该分类文件夹
    const newFolders = folders
      .map((f) => ({
        ...f,
        images: f.images.map((img) => (img.category === key && target ? { ...img, category: target } : img)),
      }))
      .filter((f) => !(f.key === key));
    updateGallery({
      folders: newFolders,
      categories: categories.filter((c) => c.key !== key),
    });
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
    setUploadMsg("");
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadMsg("请先选择图片");
      return;
    }
    setUploading(true);
    setUploadMsg("");
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append("files", f));
    formData.append("category", category);
    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        setUploadMsg(`✅ 成功上传 ${data.count} 张 (${catName(category)})${data.errors?.length ? `，${data.errors.length} 张失败` : ""}`);
        setSelectedFiles([]);
        // 重新拉取最新 content 以刷新图库列表
        const contentRes = await fetch("/api/admin/content");
        if (contentRes.ok) {
          const fresh = await contentRes.json();
          onContentChange(mergeDefaults(fresh));
        }
      } else {
        setUploadMsg(`上传失败: ${data.error || "未知错误"}`);
      }
    } catch {
      setUploadMsg("上传异常，请重试");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Section title="分类管理">
        <p className="text-sm text-neutral-500 mb-4">管理产品展示的分类栏目：可修改名称、删除栏目。删除后该栏目下的图片会归入「未分类」。</p>
        <div className="space-y-2 mb-4">
          {categories.map((c) => (
            <div key={c.key} className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-800 rounded px-3 py-2">
              <span className="text-xs text-neutral-500 font-mono w-32 truncate">{c.key}</span>
              <input
                type="text"
                value={c.name}
                onChange={(e) => renameCategory(c.key, e.target.value)}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
              />
              <button
                onClick={() => removeCategory(c.key)}
                className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 rounded px-2.5 py-1.5 transition-colors"
              >
                删除
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-neutral-500">暂无分类，请先添加。</p>}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="新分类名称（如：圣诞礼盒）"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
          />
          <button
            onClick={addCategory}
            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            + 添加分类
          </button>
        </div>
      </Section>

      <Section title="批量上传图片">
        <p className="text-sm text-neutral-500 mb-4">可一次选择多张图片（JPG/PNG/WebP/GIF/SVG，单张 ≤5MB，最多 50 张），上传后自动归入所选分类并在下方图库中显示。</p>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">选择分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>{catName(c.key)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">选择图片 ({selectedFiles.length} 张)</label>
            <label className={`cursor-pointer bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 px-4 py-2 rounded text-sm text-white transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              {selectedFiles.length > 0 ? "重新选择" : "选择图片"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
            </label>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="bg-[#d4a84b] hover:bg-[#c29639] text-[#141414] px-6 py-2.5 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {uploading ? `上传中... ${selectedFiles.length} 张` : "开始上传"}
          </button>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-4 md:grid-cols-8 gap-3">
            {selectedFiles.map((f, i) => (
              <div key={i} className="relative aspect-square rounded overflow-hidden border border-neutral-800 bg-neutral-900">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
        {uploadMsg && <p className={`mt-4 text-sm font-medium ${uploadMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{uploadMsg}</p>}
      </Section>

      <Section title="产品展示图库">
        <p className="text-sm text-neutral-500 mb-4">图片按分类分组展示。可修改图片分类、名称或移除条目，修改后记得保存。</p>
        {folders.map((folder, folderIdx) => (
          <div key={folderIdx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 mb-6 shadow-inner">
            <h4 className="text-sm font-bold text-[#d4a84b] mb-2 uppercase">分类: {catName(folder.key)}</h4>
            <p className="text-xs text-neutral-500 mb-4">{folder.images?.length || 0} 张图片</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {(folder.images || []).map((img, imgIdx) => (
                <div key={imgIdx} className="p-2 border border-neutral-800 rounded bg-neutral-900 relative group">
                  {img.src ? <img src={img.src} alt="" className="w-full h-20 object-cover rounded bg-neutral-800" /> : <div className="w-full h-20 bg-neutral-800 rounded" />}
                  <div className="mt-2 space-y-1">
                    <select
                      value={img.category || ""}
                      onChange={(e) => onContentChange({ ...content, gallery: { folders: folders.map((f, fi) => fi === folderIdx ? { ...f, images: f.images.map((im, ii) => ii === imgIdx ? { ...im, category: e.target.value } : im) } : f), categories } as any })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-[11px] text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
                    >
                      {categories.map((c) => (
                        <option key={c.key} value={c.key}>{catName(c.key)}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={img.name || ""}
                      onChange={(e) => onContentChange({ ...content, gallery: { folders: folders.map((f, fi) => fi === folderIdx ? { ...f, images: f.images.map((im, ii) => ii === imgIdx ? { ...im, name: e.target.value } : im) } : f), categories } as any })}
                      placeholder="名称"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-[11px] text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all"
                    />
                  </div>
                  <button
                    onClick={() => onContentChange({ ...content, gallery: { folders: folders.map((f, fi) => fi === folderIdx ? { ...f, images: f.images.filter((_, ii) => ii !== imgIdx) } : f), categories } as any })}
                    className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-300 bg-black/70 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {folders.length === 0 && <p className="text-sm text-neutral-500">暂无图片，请先批量上传。</p>}
      </Section>
    </div>
  );
};

const TABS = [
  { id: "home", name: "首页文案" },
  { id: "featured", name: "产品分类" },
  { id: "capabilities", name: "流程步骤" },
  { id: "quality", name: "质量模块" },
  { id: "sustainability", name: "可持续" },
  { id: "certifications", name: "认证Logo" },
  { id: "trustNumbers", name: "数据数字" },
  { id: "plant", name: "智能工厂" },
  { id: "gallery", name: "产品展示" },
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
      // 保存前清理空壳条目：空条目（所有语言都空）不应写回服务器
      const clean = JSON.parse(JSON.stringify(content));
      const isEmptyLocale = (l: any) => !l || (!l.en && !l.zh && !l.ja && !l.ko);
      const isBlankItem = (it: any) => {
        if (!it) return true;
        const name = it.name || it.title || it.label || {};
        const desc = it.desc || {};
        const value = it.value;
        const hasText = !isEmptyLocale(name) || !isEmptyLocale(desc) || (typeof value === "string" && value !== "") || (it.src && it.src !== "");
        return !hasText;
      };
      const cleanArr = (arr: any[] | undefined) => (arr || []).filter((it) => !isBlankItem(it));
      if (clean.capabilities?.steps) clean.capabilities.steps = cleanArr(clean.capabilities.steps);
      if (clean.quality?.modules) clean.quality.modules = cleanArr(clean.quality.modules);
      if (clean.featured?.categories) clean.featured.categories = cleanArr(clean.featured.categories);
      if (clean.sustainability?.items) clean.sustainability.items = cleanArr(clean.sustainability.items);
      if (clean.certifications) clean.certifications = cleanArr(clean.certifications);
      if (clean.trustNumbers) clean.trustNumbers = cleanArr(clean.trustNumbers);
      if (clean.plant?.steps) clean.plant.steps = cleanArr(clean.plant.steps);
      if (clean.plant?.stats) clean.plant.stats = cleanArr(clean.plant.stats);
      if (clean.plant?.equipItems) clean.plant.equipItems = cleanArr(clean.plant.equipItems);
      if (clean.plant?.certifications) clean.plant.certifications = cleanArr(clean.plant.certifications);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clean),
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

  const updateSectionState = (section: keyof SiteContent, field: string, value: any) => {
    setContent((prev) => ({ ...prev, [section]: { ...(prev[section] as any), [field]: value } }));
  };

  const updateArray = (section: string, arrayField: string, index: number, field: string, value: any) => {
    setContent((prev) => {
      const arr = [...(prev as any)[section][arrayField]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: { ...(prev as any)[section], [arrayField]: arr } };
    });
  };

  const updatePlantRootArray = (index: number, field: string, value: any) => {
    setContent((prev) => {
      const arr = [...(prev.plant?.certifications || [])];
      (arr as any)[index] = { ...(arr as any)[index], [field]: value };
      return { ...prev, plant: { ...(prev.plant as any), certifications: arr } };
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
      case "plant":
        return (
          <div className="space-y-12">
            <Section title="智能工厂 首屏 (Hero)">
              <LocaleRow label="顶部徽章 (如 始于2001)" value={content.plant!.heroOver} onChange={(v: LocaleString) => updateSectionState("plant", "heroOver", v)} />
              <LocaleRow label="主标题" value={content.plant!.heroTitle} onChange={(v: LocaleString) => updateSectionState("plant", "heroTitle", v)} />
              <LocaleRow label="强调词 (金色渐变)" value={content.plant!.heroAccent} onChange={(v: LocaleString) => updateSectionState("plant", "heroAccent", v)} />
              <LocaleRow label="副标题描述" value={content.plant!.heroDesc} onChange={(v: LocaleString) => updateSectionState("plant", "heroDesc", v)} isTextArea />
              <LocaleRow label="滚动提示文字" value={content.plant!.scroll} onChange={(v: LocaleString) => updateSectionState("plant", "scroll", v)} />
            </Section>
            <Section title="统计数字">
              {(content.plant!.stats || []).map((item, idx) => (
                <div key={idx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 mb-4 shadow-inner">
                  <h4 className="text-sm font-bold text-[#d4a84b] mb-4 uppercase">数字 #{idx + 1}</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">数值 (如 50)</label>
                      <input type="text" value={item.value} onChange={(e) => updateArray("plant", "stats", idx, "value", e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">后缀 (如 %+ / 小时)</label>
                      <input type="text" value={item.suffix} onChange={(e) => updateArray("plant", "stats", idx, "suffix", e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-[#d4a84b] focus:outline-none focus:ring-1 focus:ring-[#d4a84b] transition-all" />
                    </div>
                  </div>
                  <LocaleRow label="标签 (如 自动化率)" value={item.label} onChange={(v: LocaleString) => updateArray("plant", "stats", idx, "label", v)} />
                </div>
              ))}
            </Section>
            <Section title="生产流程">
              <LocaleRow label="大标题" value={content.plant!.processTitle} onChange={(v: LocaleString) => updateSectionState("plant", "processTitle", v)} />
              <LocaleRow label="副标题" value={content.plant!.processSub} onChange={(v: LocaleString) => updateSectionState("plant", "processSub", v)} isTextArea />
              {(content.plant!.steps || []).map((item, idx) => (
                <div key={idx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 mb-4 shadow-inner">
                  <h4 className="text-sm font-bold text-[#d4a84b] mb-4 uppercase">流程步骤 #{idx + 1}</h4>
                  <LocaleRow label="步骤名称" value={item.title} onChange={(v: LocaleString) => updateArray("plant", "steps", idx, "title", v)} />
                  <LocaleRow label="步骤描述" value={item.desc} onChange={(v: LocaleString) => updateArray("plant", "steps", idx, "desc", v)} isTextArea />
                  <ImagePicker label="步骤配图" value={item.img} onChange={(v: string) => updateArray("plant", "steps", idx, "img", v)} />
                </div>
              ))}
            </Section>
            <Section title="核心设备">
              <LocaleRow label="大标题" value={content.plant!.equipTitle} onChange={(v: LocaleString) => updateSectionState("plant", "equipTitle", v)} />
              <LocaleRow label="副标题" value={content.plant!.equipSub} onChange={(v: LocaleString) => updateSectionState("plant", "equipSub", v)} isTextArea />
              {(content.plant!.equipItems || []).map((item, idx) => (
                <div key={idx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 mb-4 shadow-inner">
                  <h4 className="text-sm font-bold text-[#d4a84b] mb-4 uppercase">设备 #{idx + 1}</h4>
                  <LocaleRow label="设备名称" value={item.title} onChange={(v: LocaleString) => updateArray("plant", "equipItems", idx, "title", v)} />
                  <LocaleRow label="设备描述" value={item.desc} onChange={(v: LocaleString) => updateArray("plant", "equipItems", idx, "desc", v)} isTextArea />
                  <ImagePicker label="设备配图" value={item.img} onChange={(v: string) => updateArray("plant", "equipItems", idx, "img", v)} />
                </div>
              ))}
            </Section>
            <Section title="认证 + 底部行动">
              <LocaleRow label="认证区标题" value={content.plant!.certTitle} onChange={(v: LocaleString) => updateSectionState("plant", "certTitle", v)} />
              <LocaleRow label="CTA 标题" value={content.plant!.ctaTitle} onChange={(v: LocaleString) => updateSectionState("plant", "ctaTitle", v)} />
              <LocaleRow label="CTA 描述" value={content.plant!.ctaDesc} onChange={(v: LocaleString) => updateSectionState("plant", "ctaDesc", v)} isTextArea />
              <LocaleRow label="CTA 按钮" value={content.plant!.ctaBtn} onChange={(v: LocaleString) => updateSectionState("plant", "ctaBtn", v)} />
            </Section>
            <Section title="认证Logo列表 (智能工厂页)">
              {(content.plant!.certifications || []).map((item, idx) => (
                <div key={idx} className="p-5 border border-neutral-800 rounded bg-neutral-900/50 mb-4 shadow-inner">
                  <h4 className="text-sm font-bold text-[#d4a84b] mb-4 uppercase">Logo #{idx + 1}</h4>
                  <LocaleRow label="名称" value={item.name} onChange={(v: LocaleString) => updatePlantRootArray(idx, "name", v)} />
                  <ImagePicker label="Logo原图" value={item.src} onChange={(v: string) => updatePlantRootArray(idx, "src", v)} />
                  <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer select-none mt-4">
                    <input type="checkbox" checked={item.invert || false} onChange={(e) => updatePlantRootArray(idx, "invert", e.target.checked)} className="accent-[#d4a84b] w-4 h-4 rounded" />
                    深色模式反转
                  </label>
                </div>
              ))}
            </Section>
          </div>
        );
      case "gallery":
        return <GalleryTab content={content} onContentChange={setContent} />;
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
