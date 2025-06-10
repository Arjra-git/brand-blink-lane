
import { useState } from "react";
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

const mockBrands: Brand[] = [
  {
    id: "1",
    name: "Google Pvt. Ltd.",
    logo: "🌐",
    category: "Internet & Web",
    owners: [
      { name: "Thara", avatar: "👤", count: 2 }
    ],
    companyName: "Alphabet Inc.",
    hqCity: "Bengaluru",
    marketingOffice: "Chennai",
    agency: "Efficacy Worldwide +2",
    hasPreviousDeal: true
  },
  {
    id: "2",
    name: "Microsoft Corp.",
    logo: "🖥️",
    category: "Software & Technology",
    owners: [
      { name: "Sarah", avatar: "👤" }
    ],
    companyName: "Microsoft Corporation",
    hqCity: "Mumbai",
    marketingOffice: "Delhi",
    agency: "Ogilvy India",
    hasPreviousDeal: false
  },
  {
    id: "3",
    name: "Apple Inc.",
    logo: "🍎",
    category: "Technology & Electronics",
    owners: [
      { name: "John", avatar: "👤", count: 3 }
    ],
    companyName: "Apple Inc.",
    hqCity: "Hyderabad",
    marketingOffice: "Bangalore",
    agency: "TBWA India +1",
    hasPreviousDeal: true
  },
  {
    id: "4",
    name: "Amazon Web Services",
    logo: "☁️",
    category: "Cloud Computing",
    owners: [
      { name: "Lisa", avatar: "👤" }
    ],
    companyName: "Amazon.com Inc.",
    hqCity: "Pune",
    marketingOffice: "Mumbai",
    agency: "Wunderman Thompson",
    hasPreviousDeal: false
  },
  {
    id: "5",
    name: "Meta Platforms",
    logo: "📘",
    category: "Social Media",
    owners: [
      { name: "David", avatar: "👤", count: 1 }
    ],
    companyName: "Meta Platforms Inc.",
    hqCity: "Gurgaon",
    marketingOffice: "Noida",
    agency: "Leo Burnett +3",
    hasPreviousDeal: true
  },
  {
    id: "6",
    name: "Netflix Inc.",
    logo: "🎬",
    category: "Entertainment & Media",
    owners: [
      { name: "Emma", avatar: "👤" }
    ],
    companyName: "Netflix Inc.",
    hqCity: "Chennai",
    marketingOffice: "Bangalore",
    agency: "Dentsu India",
    hasPreviousDeal: false
  },
  {
    id: "7",
    name: "Tesla Motors",
    logo: "🚗",
    category: "Automotive & Energy",
    owners: [
      { name: "Alex", avatar: "👤", count: 2 }
    ],
    companyName: "Tesla Inc.",
    hqCity: "Bangalore",
    marketingOffice: "Delhi",
    agency: "McCann Worldgroup +1",
    hasPreviousDeal: true
  },
  {
    id: "8",
    name: "Spotify Technology",
    logo: "🎵",
    category: "Music & Audio",
    owners: [
      { name: "Maya", avatar: "👤" }
    ],
    companyName: "Spotify Technology S.A.",
    hqCity: "Mumbai",
    marketingOffice: "Pune",
    agency: "Havas Media",
    hasPreviousDeal: false
  }
];

const BrandList = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "offloaded">("all");
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const filteredBrands = activeFilter === "all" 
    ? mockBrands 
    : mockBrands.filter(brand => !brand.hasPreviousDeal);

  const totalCount = mockBrands.length;
  const offloadedCount = mockBrands.filter(brand => !brand.hasPreviousDeal).length;

  const triggerAnimation = () => {
    setShouldAnimate(true);
    setTimeout(() => setShouldAnimate(false), 2000);
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
            {filteredBrands.map((brand, index) => (
              <BrandRow 
                key={brand.id} 
                brand={brand} 
                shouldAnimate={shouldAnimate}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandList;
