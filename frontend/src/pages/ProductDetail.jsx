import React from 'react';
import { ChevronLeft, Heart, Star, Clock, Calendar, ShoppingBag } from 'lucide-react';

const ProductDetail = ({ product, onBack, onAddToCart, isAdding }) => {
  if (!product) return null;

  const [selectedServiceOption, setSelectedServiceOption] = React.useState('Fullbox');
  const serviceOptions = [
    { id: 'Fullbox', label: 'Fullbox', price: 0 },
    { id: 'Pre-assembled', label: 'Đã lắp sẵn', price: product.preAssembledPrice || 70000 },
    { id: 'Pre-assembled + Flower', label: 'Đã lắp sẵn + gói hoa', price: product.preAssembledWithFlowerPrice || 100000 },
  ];

  const currentOption = serviceOptions.find(opt => opt.id === selectedServiceOption);
  const totalPrice = product.price + (currentOption ? currentOption.price : 0);

  const images = product.imageUrl ? product.imageUrl.split(',').map(img => img.trim()) : [];
  const [mainImage, setMainImage] = React.useState(images[0] || '');

  React.useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [product]);

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 bg-soft-bg min-h-screen pb-24 md:pb-12">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 flex justify-between items-center px-4 py-4 bg-white/80 backdrop-blur-md border-b border-pastel-pink/20">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-clay-sm text-hot-pink border border-pastel-pink/20">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <span className="font-heading font-bold text-sm truncate max-w-[200px] text-text-heading">{product.name}</span>
        <button className="p-2 bg-white rounded-full shadow-clay-sm text-hot-pink border border-pastel-pink/20">
          <Heart size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto md:px-12 lg:px-24 md:pt-16 md:flex md:gap-16 lg:gap-24 items-start">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="relative h-[350px] md:h-[650px] w-full bg-white rounded-clay shadow-clay-lg overflow-hidden group border-8 border-white">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4 bg-hot-pink text-white rounded-full px-4 py-2 font-heading font-bold shadow-clay-sm -rotate-2 text-xs md:text-sm">
              Lego chính hãng
            </div>
          </div>
          
          {/* Image Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 transition-all overflow-hidden flex-shrink-0 shadow-clay-sm ${mainImage === img ? 'border-hot-pink scale-95' : 'border-white hover:border-pastel-pink'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-6 py-8 md:py-0 md:px-0 md:w-1/2 flex flex-col justify-center">
          <div className="bg-transparent">
            
            {/* Back button Desktop */}
            <button onClick={onBack} className="hidden md:flex items-center gap-3 text-text-main/60 hover:text-hot-pink mb-8 font-heading font-bold transition-all group">
              <div className="p-2 bg-white rounded-full shadow-clay-sm group-hover:bg-hot-pink group-hover:text-white transition-all">
                <ChevronLeft size={20} strokeWidth={2.5} />
              </div>
              Quay lại cửa hàng
            </button>

            <div className="flex flex-col mb-8">
                <h2 className="text-3xl md:text-6xl font-heading font-black leading-tight mb-4 tracking-tighter text-text-heading drop-shadow-[2px_2px_0px_#FBCFE8]">{product.name}</h2>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={20} fill={s <= Math.round(product.rating || 0) ? "#F472B6" : "none"} stroke="#F472B6" strokeWidth={2} />
                  ))}
                  <span className="font-heading font-bold text-lg ml-3 underline decoration-4 decoration-pastel-pink text-text-heading">{product.rating?.toFixed(1) || 'N/A'} đánh giá</span>
                </div>
            </div>

            <div className="mb-8 p-6 bg-white rounded-clay shadow-clay-md inline-block border-2 border-pastel-pink/20 -rotate-1">
              <p className="text-3xl md:text-5xl font-heading font-black text-hot-pink">{new Intl.NumberFormat('vi-VN').format(totalPrice)} VND</p>
            </div>

            <div className="mb-10 space-y-4">
              <h4 className="font-heading font-bold text-lg md:text-xl flex items-center gap-3 text-text-heading">
                <span className="w-1.5 h-6 bg-hot-pink rounded-full"></span>
                Tùy chọn sản phẩm
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {serviceOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedServiceOption(option.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-heading font-bold ${
                      selectedServiceOption === option.id
                        ? 'border-hot-pink bg-hot-pink/5 shadow-clay-sm scale-[1.02]'
                        : 'border-white bg-white/50 hover:border-pastel-pink'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedServiceOption === option.id ? 'border-hot-pink' : 'border-text-main/20'}`}>
                        {selectedServiceOption === option.id && <div className="w-2.5 h-2.5 bg-hot-pink rounded-full"></div>}
                      </div>
                      <span className={selectedServiceOption === option.id ? 'text-text-heading' : 'text-text-main/60'}>{option.label}</span>
                    </div>
                    <span className={`text-sm ${selectedServiceOption === option.id ? 'text-hot-pink' : 'text-text-main/40'}`}>
                      {option.price === 0 ? 'Mặc định' : `+ ${new Intl.NumberFormat('vi-VN').format(option.price)} VND`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="p-4 bg-white rounded-clay shadow-clay-sm flex items-center gap-4 border border-pastel-pink/10">
                <div className="w-12 h-12 bg-pastel-pink/20 rounded-full flex items-center justify-center text-hot-pink">
                  <Clock size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] text-text-main/40 font-heading font-bold">Giao hàng</p>
                  <p className="text-sm md:text-base font-bold tracking-tight text-text-heading">Giao hàng tận nơi</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-clay shadow-clay-sm flex items-center gap-4 border border-pastel-pink/10">
                <div className="w-12 h-12 bg-pastel-pink/20 rounded-full flex items-center justify-center text-hot-pink">
                  <Calendar size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] text-text-main/40 font-heading font-bold">Tình trạng</p>
                  <p className={`text-sm md:text-base font-bold tracking-tight ${product.stockQuantity > 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {product.stockQuantity > 0 ? 'Đang có sẵn' : 'Hết hàng'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-10">
                <h4 className="font-heading font-bold text-xl md:text-2xl mb-4 flex items-center gap-3 text-text-heading">
                    <span className="w-2 h-8 bg-hot-pink rounded-full"></span>
                    Mô tả sản phẩm
                </h4>
                <p className="text-sm md:text-lg text-text-main font-body leading-relaxed bg-white/50 p-6 rounded-clay border-2 border-dashed border-pastel-pink/30 shadow-inner">
                  {product.description || 'Chưa có mô tả cho mảnh ghép này. Nhưng nó chắc chắn sẽ là một phần tuyệt vời trong bộ sưu tập của bạn!'}
                </p>
            </div>

            <div className="flex gap-6">
              <button className="hidden md:flex w-20 h-20 bg-white rounded-clay shadow-clay-sm items-center justify-center text-hot-pink hover:bg-hot-pink hover:text-white transition-all hover:scale-110 active:scale-95 border-2 border-white">
                <Heart size={32} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => onAddToCart({ 
                  ...product, 
                  price: totalPrice, 
                  selectedOption: currentOption?.label, 
                  basePrice: product.price,
                  optionPrice: currentOption?.price 
                })}
                disabled={isAdding}
                className="flex-1 py-5 md:py-7 bg-hot-pink text-white rounded-clay shadow-clay-md font-heading font-bold text-xl md:text-2xl tracking-widest hover:bg-text-main transition-all flex items-center justify-center gap-4 relative active:scale-95"
              >
                {isAdding ? (
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingBag size={24} strokeWidth={2.5} />
                    Thêm vào giỏ hàng
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
