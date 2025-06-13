
import { useEffect, useState } from "react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  category: string;
  owners: { name: string; avatar: string; count?: number }[];
  companyName: string;
  hqCity: string;
  marketingOffice: string;
  agency: string;
  hasPreviousDeal: boolean;
}

interface BrandRowProps {
  brand: Brand;
  shouldAnimate: boolean;
  delay: number;
  shouldFadeIn?: boolean;
  fadeInDelay?: number;
}

const BrandRow = ({ brand, shouldAnimate, delay, shouldFadeIn, fadeInDelay = 0 }: BrandRowProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(!shouldFadeIn);

  // Handle fade-in animation
  useEffect(() => {
    if (shouldFadeIn) {
      const fadeTimer = setTimeout(() => {
        setIsVisible(true);
      }, fadeInDelay);

      return () => clearTimeout(fadeTimer);
    }
  }, [shouldFadeIn, fadeInDelay]);

  // Handle highlight animation
  useEffect(() => {
    if (shouldAnimate && brand.hasPreviousDeal && isVisible) {
      const timer = setTimeout(() => {
        setShowAnimation(true);
        
        const resetTimer = setTimeout(() => {
          setShowAnimation(false);
        }, 800);

        return () => clearTimeout(resetTimer);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, delay, brand.hasPreviousDeal, isVisible]);

  // Auto-trigger animation after fade-in completes for previous deal brands
  useEffect(() => {
    if (isVisible && brand.hasPreviousDeal && shouldFadeIn) {
      const autoAnimateTimer = setTimeout(() => {
        setShowAnimation(true);
        
        const resetTimer = setTimeout(() => {
          setShowAnimation(false);
        }, 800);

        return () => clearTimeout(resetTimer);
      }, fadeInDelay + 600); // Wait for fade-in to complete plus small delay

      return () => clearTimeout(autoAnimateTimer);
    }
  }, [isVisible, brand.hasPreviousDeal, shouldFadeIn, fadeInDelay]);

  return (
    <div 
      className={`
        relative grid grid-cols-12 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-500
        ${brand.hasPreviousDeal ? 'border-l-2 border-l-green-500' : ''}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Left gradient beam for previous deals */}
      {brand.hasPreviousDeal && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400/40 via-green-500/60 to-green-600/40 shadow-sm" />
      )}

      {/* Animated highlight overlay */}
      {showAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-green-500/20 to-green-500/30 animate-[slide-highlight_0.8s_ease-out_forwards]" />
        </div>
      )}

      {/* Brand Name */}
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
          {brand.logo}
        </div>
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {brand.name}
            {brand.hasPreviousDeal && (
              <span className="text-orange-500 text-sm">⚠️</span>
            )}
          </div>
          <div className="text-sm text-gray-500">{brand.category}</div>
        </div>
      </div>

      {/* Brand Owners */}
      <div className="col-span-2 flex items-center">
        {brand.owners.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white">
              {brand.owners[0].avatar}
            </div>
            <span className="text-sm text-gray-700">
              {brand.owners[0].name}
              {brand.owners[0].count && ` +${brand.owners[0].count}`}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Yet to add</span>
        )}
      </div>

      {/* Company Name */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-700">{brand.companyName}</span>
      </div>

      {/* HQ City */}
      <div className="col-span-1 flex items-center">
        <span className="text-sm text-gray-700">{brand.hqCity}</span>
      </div>

      {/* Marketing Office */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-700">{brand.marketingOffice}</span>
      </div>

      {/* Agency */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-700">{brand.agency}</span>
      </div>
    </div>
  );
};

export default BrandRow;
