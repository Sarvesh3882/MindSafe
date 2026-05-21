import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
  illustration: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export function EmptyState({
  illustration,
  title,
  description,
  ctaText,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="glass rounded-3xl p-8 text-center border border-white/60 bg-white/50">
      <div className="relative h-48 w-48 mx-auto mb-6">
        <Image
          src={`/illustrations/${illustration}`}
          alt={title}
          fill
          loading="lazy"
          className="object-contain"
        />
      </div>
      
      <h3 className="text-lg font-semibold text-[#1E1E2E] mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-[#6B7280] mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {ctaText && ctaHref && (
        <Link href={ctaHref}>
          <button className="px-6 py-2.5 bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
            {ctaText}
          </button>
        </Link>
      )}
    </div>
  );
}
