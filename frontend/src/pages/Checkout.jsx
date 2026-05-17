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
  const [orderComplete, setOrderComplete] = useState(null);

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
          price: parseFloat(item.price.toString().replace(/[^\d]/g, '')),
          serviceOption: item.selectedOption || 'Fullbox'
        }))
      };

      const createdOrder = await createOrder(orderData);
      setOrderComplete(createdOrder);
      clearCart();
    } catch (err) {
      alert("Đặt hàng thất bại. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  const formatVND = (value) => new Intl.NumberFormat('vi-VN').format(value) + ' VND';

  if (orderComplete) {
    const isQR = orderComplete.paymentMethod === 'QR';
    const qrUrl = isQR ? `https://qr.sepay.vn/img?acc=${storeInfo?.accountNumber}&bank=${storeInfo?.bankName}&amount=${orderComplete.totalAmount}&des=SAMLEGO${orderComplete.id}` : '';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500 bg-soft-bg overflow-y-auto py-20">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-clay shadow-clay-md flex items-center justify-center mb-6 rotate-6 border-4 border-white">
          <CheckCircle size={60} md:size={80} strokeWidth={2} className="text-green-400" />
        </div>
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tighter text-text-heading">Đặt hàng thành công!</h2>
        <p className="text-text-main/50 mb-8 max-w-sm font-body text-sm md:text-lg font-bold italic">Mã đơn hàng: <span className="text-hot-pink">#{orderComplete.id}</span></p>
        
        {isQR && (
          <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-clay-lg border-4 border-white max-w-md w-full mb-10 animate-in slide-in-from-bottom-8 duration-700">
            <h4 className="font-heading font-bold text-text-heading mb-6 flex items-center justify-center gap-2">
              <QrCode size={20} className="text-hot-pink" /> Quét mã để thanh toán
            </h4>
            
            <div className="bg-soft-bg/50 p-4 rounded-2xl mb-6 relative group">
              <img 
                src={qrUrl} 
                alt="QR Thanh toán" 
                className="w-full aspect-square object-contain rounded-xl shadow-clay-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-[2px] rounded-xl">
                 <button onClick={() => window.open(qrUrl, '_blank')} className="bg-white px-4 py-2 rounded-full font-bold text-[10px] shadow-clay-md border border-pastel-pink/20">Mở ảnh lớn</button>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div className="bg-soft-bg/30 p-3 rounded-xl border border-pastel-pink/10">
                <p className="text-[10px] text-pastel-pink font-bold uppercase mb-1">Số tiền cần chuyển:</p>
                <p className="text-xl font-black text-hot-pink">{formatVND(orderComplete.totalAmount)}</p>
              </div>
              <div className="bg-soft-bg/30 p-3 rounded-xl border border-pastel-pink/10">
                <p className="text-[10px] text-pastel-pink font-bold uppercase mb-1">Nội dung chuyển khoản:</p>
                <p className="text-lg font-black text-text-heading">SAMLEGO{orderComplete.id}</p>
              </div>
            </div>
            
            <p className="mt-6 text-[10px] text-text-main/40 font-bold italic leading-relaxed">
              * Shop sẽ liên hệ với bạn sau khi xác nhận, hãy đợi nhé!
            </p>
          </div>
        )}

        {!isQR && (
          <p className="text-text-main/50 mb-10 max-w-sm font-body text-base font-bold italic">Cảm ơn bạn đã tin tưởng SamLego. Đơn hàng của bạn sẽ sớm được giao!</p>
        )}

        <button 
          onClick={onOrderSuccess}
          className="clay-btn bg-hot-pink text-white text-lg md:text-xl px-12 py-4 shadow-clay-lg hover:bg-text-heading transition-all"
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
                  <div className="bg-white p-6 rounded-2xl shadow-clay-md mb-6 rotate-1 flex flex-col items-center text-center">
                    <QrCode size={80} className="text-pastel-pink mb-4" />
                    <p className="font-heading font-bold text-text-heading text-sm uppercase">Mã QR Thanh toán</p>
                    <p className="text-[10px] text-pastel-pink font-bold mt-1">Sẽ được tạo tự động sau khi bạn xác nhận đơn hàng</p>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="bg-white/80 p-4 rounded-2xl shadow-clay-sm border border-pastel-pink/10">
                      <p className="text-[10px] text-pastel-pink font-bold uppercase mb-2 text-center">HƯỚNG DẪN THANH TOÁN</p>
                      <div className="space-y-3">
                        <div className="flex gap-3 text-xs md:text-sm">
                          <span className="w-5 h-5 bg-hot-pink text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px]">1</span>
                          <span className="text-text-main/70 font-bold italic">Bấm "Xác nhận đặt hàng" bên dưới</span>
                        </div>
                        <div className="flex gap-3 text-xs md:text-sm">
                          <span className="w-5 h-5 bg-hot-pink text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px]">2</span>
                          <span className="text-text-main/70 font-bold italic">Quét mã QR xuất hiện ở màn hình tiếp theo</span>
                        </div>
                        <div className="flex gap-3 text-xs md:text-sm">
                          <span className="w-5 h-5 bg-hot-pink text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px]">3</span>
                          <span className="text-text-main/70 font-bold italic">Hệ thống sẽ tự động duyệt đơn hàng của bạn</span>
                        </div>
                      </div>
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
                      {item.selectedOption && (
                        <p className="text-[10px] text-hot-pink font-bold mt-0.5">Dịch vụ: {item.selectedOption}</p>
                      )}
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
