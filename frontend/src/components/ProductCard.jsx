import React from 'react';
import { Heart, Star, Plus } from 'lucide-react';

const ProductCard = ({ item, onClick }) => (
    <div 
      onClick={onClick}
      className="group bg-white rounded-clay shadow-clay-md hover:shadow-clay-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden border-2 border-white"
    >
      <div className="h-36 sm:h-56 md:h-64 overflow-hidden relative rounded-t-clay">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <button className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-hot-pink shadow-clay-sm hover:bg-hot-pink hover:text-white transition-all active:scale-90">
          <Heart size={14} md:size={18} strokeWidth={2.5} />
        </button>
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-clay-sm">
          <Star size={10} className="text-hot-pink" fill="currentColor" />
          <span className="text-[10px] font-black text-text-main">{item.rating}</span>
        </div>
      </div>
      <div className="p-3 md:p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h5 className="font-heading font-bold text-xs md:text-lg mb-1 md:mb-2 line-clamp-2 tracking-tight text-text-heading group-hover:text-hot-pink transition-colors">{item.name}</h5>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-clay-sm ${item.stockQuantity > 0 ? 'bg-green-400' : 'bg-red-300'}`}>
              {item.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2 md:pt-4 border-t-2 border-dashed border-pastel-pink/30">
          <p className="text-sm md:text-2xl font-bold text-hot-pink drop-shadow-sm">{item.price}</p>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-pastel-pink rounded-full shadow-clay-sm flex items-center justify-center text-white group-hover:bg-hot-pink group-hover:rotate-90 transition-all duration-500">
            <Plus size={16} md:size={20} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
);


export default ProductCard;
