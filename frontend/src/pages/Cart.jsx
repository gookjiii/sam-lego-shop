import React from 'react';
import { ChevronLeft, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = ({ onBack, onCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 bg-soft-bg">
        <div className="w-32 h-32 bg-white rounded-clay shadow-clay-md flex items-center justify-center text-pastel-pink mb-8 rotate-3 border-4 border-white">
          <ShoppingBag size={64} strokeWidth={1.5} />
        </div>
        <h3 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-text-heading">Giỏ hàng đang trống!</h3>
        <p className="text-text-main/50 mb-10 max-w-sm font-body font-bold text-lg italic">Hãy chọn cho mình những mảnh ghép tuyệt vời nhất để bắt đầu xây dựng nhé!</p>
        <button 
          onClick={onBack}
          className="clay-btn bg-hot-pink text-white text-xl px-12"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-32 bg-soft-bg min-h-screen">
      <div className="px-4 py-8 md:px-12 lg:px-24 md:py-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-6 mb-10 border-b-2 border-pastel-pink/30 pb-6">
          <button onClick={onBack} className="p-3 bg-white rounded-full shadow-clay-sm text-hot-pink hover:bg-hot-pink hover:text-white transition-all border border-pastel-pink/10">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-text-heading">
            Giỏ hàng <span className="text-hot-pink">của bạn</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, idx) => (
              <div key={idx} className="bg-white p-4 md:p-6 rounded-clay shadow-clay-md flex items-center gap-4 md:gap-8 group border-2 border-white hover:shadow-clay-lg transition-all">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-soft-bg shadow-inner border border-pastel-pink/10">
                  <img src={item.imageUrl?.split(',')[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-bold text-sm md:text-xl mb-1 truncate text-text-heading group-hover:text-hot-pink transition-colors">{item.name}</h4>
                  <p className="text-hot-pink font-heading font-black text-lg md:text-2xl drop-shadow-sm">{item.price}</p>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch py-1">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 bg-soft-bg/50 rounded-full text-pastel-pink hover:text-white hover:bg-hot-pink transition-all shadow-sm"
                  >
                    <Trash2 size={20} strokeWidth={2} />
                  </button>

                  <div className="flex items-center bg-soft-bg/30 rounded-full p-1 border border-pastel-pink/10 shadow-inner mt-4">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-text-main shadow-clay-sm flex items-center justify-center hover:bg-hot-pink hover:text-white transition-all active:scale-90"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-10 md:w-14 text-center font-heading font-bold text-lg text-text-main">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-hot-pink text-white shadow-clay-sm flex items-center justify-center hover:bg-text-main transition-all active:scale-90"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-clay shadow-clay-lg border-4 border-white -rotate-1">
              <h4 className="font-heading font-bold text-xl mb-6 border-b-2 border-dashed border-pastel-pink/30 pb-3 text-text-heading">Tổng đơn hàng</h4>

              <div className="space-y-4 font-heading font-bold text-sm">
                <div className="flex justify-between items-center text-text-main/60">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-main/60">Vận chuyển</span>
                  <span className="text-hot-pink bg-pastel-pink/20 px-3 py-1 rounded-full text-[10px]">Miễn phí</span>
                </div>
                <div className="pt-6 mt-6 border-t-2 border-pastel-pink/30 border-dashed flex justify-between items-center text-xl md:text-2xl">
                  <span className="text-text-heading">Tổng cộng</span>
                  <span className="text-hot-pink drop-shadow-[1px_1px_0px_#FBCFE8]">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full py-5 md:py-7 bg-hot-pink text-white rounded-clay shadow-clay-md font-heading font-bold text-xl flex items-center justify-center gap-4 hover:bg-text-main transition-all group active:scale-95 shadow-clay-lg"
            >
              Thanh toán ngay
              <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
