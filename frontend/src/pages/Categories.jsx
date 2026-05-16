import React, { useState, useEffect } from 'react';
import { ArrowRight, Grid, Layout } from 'lucide-react';
import { getCategories } from '../api/productService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
    setLoading(false);
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 min-h-screen bg-soft-bg">
      <div className="px-4 py-8 md:px-12 lg:px-24 md:py-16 max-w-7xl mx-auto">
        <div className="mb-12 border-b-2 border-pastel-pink/30 pb-6">
          <h3 className="text-3xl md:text-6xl font-heading font-black tracking-tighter text-text-heading">
            Khám phá <span className="text-hot-pink">danh mục</span>
          </h3>
          <p className="mt-4 text-sm md:text-xl font-body font-bold text-text-main/50 tracking-widest">
            Tìm kiếm mảnh ghép hoàn hảo theo sở thích của bạn.
          </p>
        </div>
        
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-8 border-pastel-pink border-t-hot-pink rounded-full animate-spin"></div>
            <span className="font-heading font-bold animate-pulse text-text-main">Đang phân loại...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-pastel-pink bg-white/50 rounded-clay border-2 border-dashed border-pastel-pink">
            <Layout size={80} strokeWidth={1} className="mb-4" />
            <p className="font-heading font-bold text-lg">Chưa có danh mục nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {categories.map((cat, i) => (
              <div key={cat.id} className="relative h-64 md:h-96 rounded-clay shadow-clay-md group cursor-pointer overflow-hidden bg-white border-4 border-white hover:shadow-clay-lg transition-all duration-500">
                <img src={cat.imageUrl || 'https://images.unsplash.com/photo-1549462182-13c88d2f1668?w=800&q=80'} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                
                {/* Text Overlay */}
                <div className="absolute inset-x-4 bottom-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 md:p-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-white border border-pastel-pink/10 shadow-clay-sm">
                  <h4 className="text-xl md:text-2xl font-heading font-bold text-text-heading mb-1">{cat.name}</h4>
                  <p className="text-text-main/50 text-[10px] md:text-xs font-bold tracking-wider line-clamp-1 mb-4">{cat.description}</p>
                  
                  <div className="flex items-center gap-2 text-hot-pink font-heading font-bold text-xs md:text-sm tracking-tight group-hover:translate-x-1 transition-transform">
                    Xem bộ sưu tập <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Icon Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-hot-pink rounded-2xl flex items-center justify-center text-white shadow-clay-sm group-hover:rotate-12 transition-transform duration-300 border-2 border-white/50">
                  <Grid size={24} strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
