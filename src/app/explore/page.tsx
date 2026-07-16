'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import DestinationCard from '@/components/destinations/DestinationCard';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { IDestination, PaginatedResponse } from '@/types';
import { useAuth } from '@/providers/AppProvider';

const CATEGORIES = ['All', 'Beach', 'Mountains', 'City', 'Nature', 'Adventure', 'Coastal'];
const CONTINENTS = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, toggleWishlist } = useAuth();

  const [data, setData] = useState<PaginatedResponse<IDestination> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const currentParams: Record<string, string> = {};
  searchParams.forEach((v, k) => { currentParams[k] = v; });

  const fetchData = useCallback(async (params: Record<string, string>) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/destinations?${qs}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(currentParams); }, [searchParams]);

  const updateParams = (updates: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== '' && v !== 'All') p.set(k, v);
      else p.delete(k);
    });
    if (!updates.page) p.set('page', '1');
    router.push(`/explore?${p.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const handlePageChange = (page: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('page', String(page));
    router.push(`/explore?${p.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchInput('');
    router.push('/explore');
  };

  const hasFilters = currentParams.search || currentParams.category || currentParams.continent || currentParams.sortBy;

  return (
    <div className="min-h-screen pt-10 bg-[#F8FAFC]">
      <div className="bg-white border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 mb-1">Explore Destinations</h1>
            <p className="text-dark-400">{data ? `${data.total} destinations worldwide` : 'Loading...'}</p>
          </motion.div>

          <form onSubmit={handleSearch} className="mt-6 flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Search destinations, locations, countries..."
                className="w-full pl-11 pr-4 py-3 bg-dark-50 border border-dark-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <button type="submit" className="gradient-primary text-white font-medium px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity text-sm">
              Search
            </button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium border transition-all ${
                showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-dark-200 text-dark-600 hover:bg-dark-50'
              }`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </form>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="text-xs font-medium text-dark-500 mb-1 block">Category</label>
                    <select value={currentParams.category || 'All'} onChange={e => updateParams({ category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-50 border border-dark-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                      {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-500 mb-1 block">Continent</label>
                    <select value={currentParams.continent || 'All'} onChange={e => updateParams({ continent: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-50 border border-dark-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                      {CONTINENTS.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-500 mb-1 block">Sort By</label>
                    <select value={currentParams.sortBy || 'newest'} onChange={e => updateParams({ sortBy: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-50 border border-dark-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-500 mb-1 block">Min Price</label>
                    <input type="number" placeholder="$0" value={currentParams.minPrice || ''}
                      onChange={e => updateParams({ minPrice: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-50 border border-dark-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-500 mb-1 block">Max Price</label>
                    <input type="number" placeholder="$500" value={currentParams.maxPrice || ''}
                      onChange={e => updateParams({ maxPrice: e.target.value })}
                      className="w-full px-3 py-2.5 bg-dark-50 border border-dark-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-3 text-xs text-primary-600 font-medium hover:text-primary-700">
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {data.items.map(dest => (
                  <motion.div key={dest._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                    <DestinationCard destination={dest} onWishlist={toggleWishlist} isWishlisted={user?.wishlist?.includes(dest._id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => handlePageChange(data.page - 1)} disabled={data.page <= 1}
                  className="px-4 py-2.5 rounded-xl bg-white border border-dark-200 text-sm font-medium disabled:opacity-40 hover:bg-dark-50 transition-colors">
                  ← Previous
                </button>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      p === data.page ? 'bg-primary-600 text-white shadow-glow' : 'bg-white border border-dark-200 hover:bg-dark-50'
                    }`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => handlePageChange(data.page + 1)} disabled={data.page >= data.totalPages}
                  className="px-4 py-2.5 rounded-xl bg-white border border-dark-200 text-sm font-medium disabled:opacity-40 hover:bg-dark-50 transition-colors">
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl mb-4">🔍</motion.div>
            <h3 className="text-2xl font-display font-bold text-dark-900 mb-2">No destinations found</h3>
            <p className="text-dark-400 mb-6">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="text-primary-600 font-semibold">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}