// Simple <img> wrapper - no Next.js Image complexity
// Use Tailwind classes directly for sizing
// 优化: 默认 loading="lazy" + decoding="async"; priority=true 时急切加载(首屏关键图)
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  priority = false,
}: OptimizedImageProps) {
  const imgProps = {
    src,
    alt,
    className,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    fetchPriority: (priority ? "high" : "auto") as "high" | "auto",
  };
  if (wrapperClassName) {
    return (
      <div className={wrapperClassName}>
        <img {...imgProps} />
      </div>
    );
  }
  return <img {...imgProps} />;
}
