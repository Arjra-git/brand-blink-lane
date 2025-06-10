
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
    { name: "NVIDIA Corporation", logo: "🎮", category: "Graphics & AI", company: "NVIDIA Corporation", city: "Mumbai", office: "Hyderabad", agency: "Edelman Digital" },
    { name: "Zomato Ltd.", logo: "🍕", category: "Food & Delivery", company: "Zomato Limited", city: "Gurgaon", office: "Delhi", agency: "Ogilvy India" },
    { name: "Swiggy Pvt. Ltd.", logo: "🛵", category: "Food Delivery", company: "Bundl Technologies", city: "Bangalore", office: "Mumbai", agency: "Lowe Lintas" },
    { name: "Flipkart Internet", logo: "🛒", category: "E-commerce", company: "Flipkart Private Limited", city: "Bangalore", office: "Delhi", agency: "Wunderman Thompson" },
    { name: "Paytm Ltd.", logo: "💳", category: "Fintech", company: "One97 Communications", city: "Noida", office: "Mumbai", agency: "McCann Worldgroup" },
    { name: "Ola Cabs", logo: "🚖", category: "Transportation", company: "ANI Technologies", city: "Bangalore", office: "Hyderabad", agency: "Leo Burnett India" }
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
      owners: Math.random() > 0.3 ? [
        { 
          name: owners[ownerIndex], 
          avatar: "👤", 
          count: Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 1 : undefined 
        }
      ] : [],
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
    const brands = generateMockBrands(1, 150); // Generate 150 brands total
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
        
        // Trigger animation for brands with previous deals in the new batch
        setTimeout(() => {
          setShouldAnimate(true);
          setTimeout(() => setShouldAnimate(false), 2000);
        }, nextBatch.length * 100 + 500); // Wait for fade-in to complete
        
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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">All Brands</h1>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={`rounded-full ${
                  activeFilter === "all" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
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
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
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
            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
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
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                Loading more brands...
              </div>
            </div>
          )}

          {/* End of list message */}
          {!hasMore && displayedBrands.length > 0 && (
            <div className="p-8 text-center text-gray-500">
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
