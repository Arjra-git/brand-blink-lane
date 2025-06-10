
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, Play } from "lucide-react";
import BrandRow from "./BrandRow";

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

const generateMockBrands = (startId: number, count: number): Brand[] => {
  const companies = [
    { name: "Google Pvt. Ltd.", logo: "🌐", category: "Internet & Web", company: "Alphabet Inc.", city: "Bengaluru", office: "Chennai", agency: "Efficacy Worldwide +2" },
    { name: "Microsoft Corp.", logo: "🖥️", category: "Software & Technology", company: "Microsoft Corporation", city: "Mumbai", office: "Delhi", agency: "Ogilvy India" },
    { name: "Apple Inc.", logo: "🍎", category: "Technology & Electronics", company: "Apple Inc.", city: "Hyderabad", office: "Bangalore", agency: "TBWA India +1" },
    { name: "Amazon Web Services", logo: "☁️", category: "Cloud Computing", company: "Amazon.com Inc.", city: "Pune", office: "Mumbai", agency: "Wunderman Thompson" },
    { name: "Meta Platforms", logo: "📘", category: "Social Media", company: "Meta Platforms Inc.", city: "Gurgaon", office: "Noida", agency: "Leo Burnett +3" },
    { name: "Netflix Inc.", logo: "🎬", category: "Entertainment & Media", company: "Netflix Inc.", city: "Chennai", office: "Bangalore", agency: "Dentsu India" },
    { name: "Tesla Motors", logo: "🚗", category: "Automotive & Energy", company: "Tesla Inc.", city: "Bangalore", office: "Delhi", agency: "McCann Worldgroup +1" },
    { name: "Spotify Technology", logo: "🎵", category: "Music & Audio", company: "Spotify Technology S.A.", city: "Mumbai", office: "Pune", agency: "Havas Media" },
    { name: "Adobe Systems", logo: "🎨", category: "Creative Software", company: "Adobe Inc.", city: "Noida", office: "Gurgaon", agency: "Publicis Sapient" },
    { name: "Salesforce Inc.", logo: "☁️", category: "CRM & Cloud", company: "Salesforce Inc.", city: "Hyderabad", office: "Chennai", agency: "Accenture Interactive" },
    { name: "Oracle Corporation", logo: "🔶", category: "Database & Enterprise", company: "Oracle Corporation", city: "Bangalore", office: "Mumbai", agency: "TCS Interactive" },
    { name: "SAP SE", logo: "💼", category: "Enterprise Software", company: "SAP SE", city: "Pune", office: "Hyderabad", agency: "Wipro Digital" },
    { name: "IBM Corporation", logo: "🔷", category: "Technology & Consulting", company: "IBM Corporation", city: "Delhi", office: "Bangalore", agency: "IBM iX" },
    { name: "Intel Corporation", logo: "💻", category: "Semiconductors", company: "Intel Corporation", city: "Chennai", office: "Pune", agency: "Weber Shandwick" },
    { name: "NVIDIA Corporation", logo: "🎮", category: "Graphics & AI", company: "NVIDIA Corporation", city: "Mumbai", office: "Hyderabad", agency: "Edelman Digital" }
  ];

  const owners = ["Thara", "Sarah", "John", "Lisa", "David", "Emma", "Alex", "Maya", "Priya", "Rahul", "Anita", "Vikram"];

  return Array.from({ length: count }, (_, i) => {
    const companyIndex = (startId + i) % companies.length;
    const company = companies[companyIndex];
    const ownerIndex = (startId + i) % owners.length;
    
    return {
      id: `${startId + i}`,
      name: company.name,
      logo: company.logo,
      category: company.category,
      owners: [
        { 
          name: owners[ownerIndex], 
          avatar: "👤", 
          count: Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 1 : undefined 
        }
      ],
      companyName: company.company,
      hqCity: company.city,
      marketingOffice: company.office,
      agency: company.agency,
      hasPreviousDeal: Math.random() > 0.6
    };
  });
};

const ITEMS_PER_LOAD = 15;

const BrandList = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "offloaded">("all");
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [displayedBrands, setDisplayedBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadedBrandsCount, setLoadedBrandsCount] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);

  // Generate all brands once
  useEffect(() => {
    const brands = generateMockBrands(1, 100); // Generate 100 brands total
    setAllBrands(brands);
  }, []);

  const filteredAllBrands = activeFilter === "all" 
    ? allBrands 
    : allBrands.filter(brand => !brand.hasPreviousDeal);

  const totalCount = allBrands.length;
  const offloadedCount = allBrands.filter(brand => !brand.hasPreviousDeal).length;

  const loadMoreBrands = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    setTimeout(() => {
      const currentLength = displayedBrands.length;
      const nextBatch = filteredAllBrands.slice(currentLength, currentLength + ITEMS_PER_LOAD);
      
      if (nextBatch.length > 0) {
        setDisplayedBrands(prev => [...prev, ...nextBatch]);
        setLoadedBrandsCount(prev => prev + nextBatch.length);
        
        if (currentLength + nextBatch.length >= filteredAllBrands.length) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
      setIsInitialLoad(false);
    }, 500); // Simulate loading delay
  }, [loading, hasMore, displayedBrands.length, filteredAllBrands]);

  // Load initial data on mount and filter change
  useEffect(() => {
    setDisplayedBrands([]);
    setLoadedBrandsCount(0);
    setHasMore(true);
    setIsInitialLoad(true);
    
    // Reset and load first batch
    setTimeout(() => {
      loadMoreBrands();
    }, 100);
  }, [activeFilter, allBrands.length]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreBrands();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMoreBrands]);

  const triggerAnimation = () => {
    setShouldAnimate(true);
    setTimeout(() => setShouldAnimate(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-white">All Brands</h1>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={`rounded-full ${
                  activeFilter === "all" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                All({totalCount})
              </Button>
              <Button
                variant={activeFilter === "offloaded" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("offloaded")}
                className={`rounded-full ${
                  activeFilter === "offloaded" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Offloaded ({offloadedCount})
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={triggerAnimation}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <Play className="w-4 h-4 mr-2" />
              Test Animation
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-750 border-b border-slate-700 text-sm font-medium text-slate-300">
            <div className="col-span-3 flex items-center">
              Brand Name ↕
            </div>
            <div className="col-span-2 flex items-center">
              Brand Owners ↕
            </div>
            <div className="col-span-2 flex items-center">
              Company Name ↕
            </div>
            <div className="col-span-1 flex items-center">
              HQ City ↕
            </div>
            <div className="col-span-2 flex items-center">
              Marketing Office ↕
            </div>
            <div className="col-span-2 flex items-center">
              Agency ↕
            </div>
          </div>

          {/* Table Body */}
          <div>
            {displayedBrands.map((brand, index) => (
              <BrandRow 
                key={brand.id} 
                brand={brand} 
                shouldAnimate={shouldAnimate}
                delay={index * 50}
                shouldFadeIn={true}
                fadeInDelay={index * 100}
              />
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 text-slate-400">
                <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                Loading more brands...
              </div>
            </div>
          )}

          {/* End of list message */}
          {!hasMore && displayedBrands.length > 0 && (
            <div className="p-8 text-center text-slate-500">
              You've reached the end of the list
            </div>
          )}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={observerRef} className="h-10" />
      </div>
    </div>
  );
};

export default BrandList;
