import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Phone, User, CreditCard, Wallet, ArrowRight, CheckCircle, QrCode, Landmark } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orderService';
import { getUserProfile, getStoreInfo } from '../api/userService';

const Checkout = ({ onBack, onOrderSuccess }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'QR'
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [storeInfo, setStoreInfo] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStoreInfo();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setShippingInfo({
        fullName: data.fullName || '',
        phone: data.phone || '',
        address: data.address || ''
      });
    } catch (err) {
      console.error("Failed to load profile for checkout");
    }
  };

  const fetchStoreInfo = async () => {
    try {
      const info = await getStoreInfo();
      setStoreInfo(info);
    } catch (err) {
      console.error("Failed to load store info");
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        totalAmount: cartTotal,
        shippingAddress: `${shippingInfo.fullName} | ${shippingInfo.phone} | ${shippingInfo.address}`,
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          product: { id: item.id },
          quantity: item.quantity,
          price: parseFloat(item.price.toString().replace(/[^\d]/g, ''))
        }))
      };

      await createOrder(orderData);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      alert("Đặt hàng thất bại. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500 bg-soft-bg">
        <div className="w-32 h-32 bg-white rounded-clay shadow-clay-md flex items-center justify-center mb-8 rotate-6 border-4 border-white">
          <CheckCircle size={80} strokeWidth={2} className="text-green-400" />
        </div>
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tighter text-text-heading">Thành công rồi!</h2>
        <p className="text-text-main/50 mb-10 max-w-sm font-body text-lg font-bold italic">Cảm ơn bạn đã tin tưởng SamLego. Đơn hàng đang được xử lý!</p>
        <button 
          onClick={onOrderSuccess}
          className="clay-btn bg-hot-pink text-white text-xl px-12"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-32 min-h-screen bg-soft-bg">
      <div className="px-6 py-8 md:px-12 lg:px-24 md:py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-12 border-b-2 border-pastel-pink/30 pb-6">
          <button onClick={onBack} className="p-3 bg-white rounded-full shadow-clay-sm text-hot-pink hover:bg-hot-pink hover:text-white transition-all border border-pastel-pink/10">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
          <h3 className="text-3xl md:text-5xl font-heading font-bold tracking-tighter text-text-heading">Xác nhận <span className="text-hot-pink">thanh toán</span></h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div className="space-y-10">
            <section className="bg-white p-8 rounded-clay shadow-clay-lg border-4 border-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-pastel-pink/20 rounded-full flex items-center justify-center text-hot-pink">
                    <MapPin size={24} strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-heading font-bold text-text-heading">Thông tin giao hàng</h4>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={20} strokeWidth={2} />
                  <input 
                    type="text" 
                    placeholder="Họ và tên người nhận" 
                    className="w-full pl-14 pr-6 py-5 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold placeholder:text-pastel-pink text-text-main outline-none"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={20} strokeWidth={2} />
                  <input 
                    type="text" 
                    placeholder="Số điện thoại" 
                    className="w-full pl-14 pr-6 py-5 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold placeholder:text-pastel-pink text-text-main outline-none"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-5 top-6 text-pastel-pink" size={20} strokeWidth={2} />
                  <textarea 
                    placeholder="Địa chỉ nhận hàng chi tiết" 
                    className="w-full pl-14 pr-6 py-5 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold placeholder:text-pastel-pink text-text-main outline-none min-h-[120px]"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-clay shadow-clay-lg border-4 border-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-pastel-pink/20 rounded-full flex items-center justify-center text-hot-pink">
                    <CreditCard size={24} strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-heading font-bold text-text-heading">Phương thức thanh toán</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-6 rounded-clay transition-all flex flex-col items-center gap-4 border-2 ${paymentMethod === 'COD' ? 'bg-hot-pink text-white shadow-clay-md border-white scale-105' : 'bg-soft-bg/30 text-pastel-pink border-white hover:border-pastel-pink/20 shadow-clay-sm'}`}
                >
                  <Wallet size={40} strokeWidth={2} className={paymentMethod === 'COD' ? 'text-white' : 'text-pastel-pink'} />
                  <span className="font-heading font-bold text-xs md:text-sm text-center tracking-tighter leading-tight uppercase">Thanh toán khi nhận hàng</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('QR')}
                  className={`p-6 rounded-clay transition-all flex flex-col items-center gap-4 border-2 ${paymentMethod === 'QR' ? 'bg-hot-pink text-white shadow-clay-md border-white scale-105' : 'bg-soft-bg/30 text-pastel-pink border-white hover:border-pastel-pink/20 shadow-clay-sm'}`}
                >
                  <QrCode size={40} strokeWidth={2} className={paymentMethod === 'QR' ? 'text-white' : 'text-pastel-pink'} />
                  <span className="font-heading font-bold text-xs md:text-sm text-center tracking-tighter leading-tight uppercase">Chuyển khoản QR Banking</span>
                </button>
              </div>

              {paymentMethod === 'QR' && (
                <div className="mt-8 p-6 md:p-8 bg-soft-bg/30 rounded-clay border-2 border-dashed border-pastel-pink/30 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-white p-4 rounded-2xl shadow-clay-md mb-6 rotate-1">
                    <img 
                      src={storeInfo?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=STB|SamLego|${cartTotal}|Order`} 
                      alt="Banking QR" 
                      className="w-48 h-48 md:w-64 md:h-64 object-contain"
                    />
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="bg-white/80 p-4 rounded-2xl shadow-clay-sm border border-pastel-pink/10">
                      <p className="text-[10px] text-pastel-pink font-bold uppercase mb-2 text-center">THÔNG TIN CHUYỂN KHOẢN</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-text-main/60 uppercase font-bold">Ngân hàng:</span>
                          <span className="text-text-heading font-black">{storeInfo?.bankName || 'Đang cập nhật...'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-text-main/60 uppercase font-bold">Số tài khoản:</span>
                          <span className="text-hot-pink font-black text-lg">{storeInfo?.accountNumber || 'Đang cập nhật...'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-text-main/60 uppercase font-bold">Chủ tài khoản:</span>
                          <span className="text-text-heading font-black">{storeInfo?.accountHolderName || 'Đang cập nhật...'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center bg-hot-pink/10 p-4 rounded-2xl border border-hot-pink/20">
                      <p className="text-[10px] text-hot-pink font-bold uppercase mb-1">NỘI DUNG CHUYỂN KHOẢN:</p>
                      <p className="text-lg font-black text-hot-pink">SAMLEGO {Math.floor(Math.random() * 10000)}</p>
                      <p className="text-[9px] text-text-main/40 mt-1 italic">(Vui lòng ghi đúng nội dung để đơn hàng được duyệt nhanh nhất)</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right: Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-white p-8 rounded-clay shadow-clay-lg border-4 border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-pink/10 rounded-full blur-2xl -rotate-12 translate-x-12 -translate-y-12"></div>

              <h4 className="text-2xl font-heading font-bold mb-8 border-b-2 border-dashed border-pastel-pink/20 pb-3 text-text-heading">Tóm tắt đơn hàng</h4>

              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto no-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-dashed border-pastel-pink/10 pb-4 last:border-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-soft-bg shadow-inner">
                      <img src={item.imageUrl?.split(',')[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-sm text-text-heading truncate uppercase">{item.name}</p>
                      <p className="text-xs text-text-main/40 font-bold mt-1 tracking-tighter">Số lượng: {item.quantity}</p>
                      <p className="font-heading font-black text-hot-pink text-lg mt-1">{formatVND(parseFloat(item.price.toString().replace(/[^\d]/g, '')) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t-2 border-dashed border-pastel-pink/20 font-heading font-bold uppercase">
                <div className="flex justify-between items-center text-sm text-text-main/60">
                  <span>Tạm tính</span>
                  <span>{formatVND(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Phí giao hàng</span>
                  <span className="text-white bg-green-400 px-3 py-1 rounded-full text-[10px] shadow-clay-sm">Miễn phí</span>
                </div>
                <div className="pt-6 flex justify-between items-center border-t border-pastel-pink/10 mt-6">
                  <span className="text-xl text-text-heading">Tổng cộng</span>
                  <span className="text-3xl text-hot-pink drop-shadow-[1px_1px_0px_#FBCFE8]">{formatVND(cartTotal)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-10 py-6 bg-hot-pink text-white rounded-clay shadow-clay-md font-heading font-bold text-xl tracking-widest hover:bg-text-heading transition-all disabled:opacity-50 active:scale-95 shadow-clay-lg"
              >
                {loading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : (
                  <div className="flex items-center justify-center gap-4">
                    Xác nhận đặt hàng <ArrowRight size={24} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>

            <p className="text-center text-[10px] text-pastel-pink font-heading font-bold tracking-[0.3em] mt-8">HỆ THỐNG MÃ HÓA BẢO MẬT 256-BIT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
