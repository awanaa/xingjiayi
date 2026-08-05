// Simple <img> wrapper - no Next.js Image complexity
// Use Tailwind classes directly for sizing
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
}: OptimizedImageProps) {
  if (wrapperClassName) {
    return (
      <div className={wrapperClassName}>
        <img src={src} alt={alt} className={className} />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} />;
}