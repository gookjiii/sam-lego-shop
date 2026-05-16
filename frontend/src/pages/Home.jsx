import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../api/productService';

const Home = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const cats = (await getCategories()) || [];
      setCategories([{ id: 0, name: 'Tất cả' }, ...cats]);
      const prods = (await getProducts()) || [];
      setProducts(prods);
    } catch (err) {
      console.error("Failed to load home data");
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prods = await getProducts(null, searchQuery);
      setProducts(prods);
      setActiveCategory(0);
    } catch (err) {
      console.error("Search failed");
    }
    setLoading(false);
  };

  const handleCategoryClick = async (catId) => {
    setActiveCategory(catId);
    setLoading(true);
    try {
      const prods = await getProducts(catId === 0 ? null : catId);
      setProducts(prods);
      setSearchQuery('');
    } catch (err) {
      console.error("Failed to filter category");
    }
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-4 py-6 md:px-12 lg:px-24 md:py-12 max-w-7xl mx-auto">
        <div className="mb-8 md:text-center relative">
           {/* Decorative Background Elements */}
           <div className="hidden md:block absolute -top-10 -left-10 w-32 h-32 bg-pastel-pink/20 rounded-full blur-2xl -rotate-12 opacity-60"></div>
           <div className="hidden md:block absolute -top-5 -right-5 w-24 h-24 bg-lavender/30 rounded-full blur-xl rotate-12 opacity-60"></div>

          <h2 className="text-3xl md:text-7xl lg:text-8xl font-heading font-black leading-tight tracking-tighter text-text-heading">
            Xây dựng <br/> 
            <span className="text-hot-pink drop-shadow-[4px_4px_0px_#FBCFE8]">Ước mơ</span>
          </h2>
          <p className="mt-2 text-xs md:text-xl font-body font-bold text-text-main/50 tracking-widest">Từng mảnh ghép, vạn niềm vui</p>
          
          <form onSubmit={handleSearch} className="mt-6 md:mt-10 max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Tìm kiếm bộ sưu tập..." 
              className="w-full pl-5 pr-20 py-4 md:py-6 bg-white rounded-clay shadow-clay-md border-2 border-white focus:outline-none focus:shadow-clay-lg text-sm md:text-lg font-heading font-bold transition-all placeholder:text-slate-400 text-text-heading"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-hot-pink text-white px-4 md:px-8 py-2.5 md:py-4 rounded-clay shadow-clay-sm text-xs md:text-base font-heading font-bold hover:bg-text-heading transition-all active:scale-95">
              Tìm
            </button>
          </form>
        </div>
        
        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-clay transition-all font-heading font-bold text-[10px] md:text-sm tracking-tight border-2 ${activeCategory === cat.id ? 'bg-hot-pink text-white shadow-clay-md border-white scale-105' : 'bg-white text-text-main border-white hover:bg-lavender/30 shadow-clay-sm'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end mb-6 mt-8 border-b-2 border-pastel-pink/30 pb-3">
          <h4 className="text-xl md:text-4xl font-heading font-bold text-text-heading">
            {searchQuery ? `Kết quả: "${searchQuery}"` : (activeCategory === 0 ? 'Bộ sưu tập mới' : categories.find(c => c.id === activeCategory)?.name)}
          </h4>
          {!searchQuery && (
            <button className="bg-white text-hot-pink border-2 border-white rounded-clay shadow-clay-sm px-3 py-1.5 text-[10px] md:text-sm font-heading font-bold flex items-center gap-1 hover:bg-hot-pink hover:text-white transition-all">
              Tất cả <ChevronRight size={14} md:size={18} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Responsive Grid */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-8 border-pastel-pink border-t-hot-pink rounded-full animate-spin"></div>
            <span className="font-heading font-black uppercase animate-pulse text-text-main">ĐANG LẮP RÁP...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-pastel-pink bg-white/50 rounded-clay border-2 border-dashed border-pastel-pink">
            <Package size={80} strokeWidth={1} className="mb-4" />
            <p className="font-heading font-black uppercase text-lg">KHÔNG CÓ MẢNH GHÉP NÀO</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            {products.map((item, idx) => (
              <ProductCard key={idx} item={{...item, img: item.imageUrl?.split(',')[0]}} onClick={() => onProductSelect(item)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
