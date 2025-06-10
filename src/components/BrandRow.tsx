
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
}

const BrandRow = ({ brand, shouldAnimate, delay }: BrandRowProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (shouldAnimate && brand.hasPreviousDeal) {
      const timer = setTimeout(() => {
        setShowAnimation(true);
        
        // Reset animation after it completes
        const resetTimer = setTimeout(() => {
          setShowAnimation(false);
        }, 1500);

        return () => clearTimeout(resetTimer);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, delay, brand.hasPreviousDeal]);

  return (
    <div 
      className={`
        relative grid grid-cols-12 gap-4 p-4 border-b border-slate-700 hover:bg-slate-750 transition-colors duration-200
        ${brand.hasPreviousDeal ? 'border-l-2 border-l-green-500' : ''}
      `}
    >
      {/* Animated highlight overlay */}
      {showAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-green-500/20 to-green-500/30 animate-[slide-highlight_1.5s_ease-out_forwards]" />
        </div>
      )}

      {/* Brand Name */}
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-lg">
          {brand.logo}
        </div>
        <div>
          <div className="font-medium text-white flex items-center gap-2">
            {brand.name}
            {brand.hasPreviousDeal && (
              <span className="text-orange-400 text-sm">⚠️</span>
            )}
          </div>
          <div className="text-sm text-slate-400">{brand.category}</div>
        </div>
      </div>

      {/* Brand Owners */}
      <div className="col-span-2 flex items-center">
        {brand.owners.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white">
              {brand.owners[0].avatar}
            </div>
            <span className="text-sm text-slate-300">
              {brand.owners[0].name}
              {brand.owners[0].count && ` +${brand.owners[0].count}`}
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-500 italic">Yet to add</span>
        )}
      </div>

      {/* Company Name */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-slate-300">{brand.companyName}</span>
      </div>

      {/* HQ City */}
      <div className="col-span-1 flex items-center">
        <span className="text-sm text-slate-300">{brand.hqCity}</span>
      </div>

      {/* Marketing Office */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-slate-300">{brand.marketingOffice}</span>
      </div>

      {/* Agency */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-slate-300">{brand.agency}</span>
      </div>
    </div>
  );
};

export default BrandRow;
