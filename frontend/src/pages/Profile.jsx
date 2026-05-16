import React, { useState, useEffect } from 'react';
import { Edit2, ShoppingBag, ChevronRight, Package, X, Check, MapPin as MapPinIcon, Phone, User as UserIcon, LogOut, Star, QrCode, Landmark } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../api/userService';
import { getUserOrders } from '../api/orderService';

const MapPin = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const Profile = ({ user: initialUser, onLogout, refreshUser }) => {
  const [user, setUser] = useState(initialUser);
  const [orders, setOrders] = useState([]);
  const [showEditModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'profile', 'address', 'qrCode', or 'bankInfo'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatarUrl: user?.avatarUrl || '',
    qrCodeUrl: user?.qrCodeUrl || '',
    accountNumber: user?.accountNumber || '',
    bankName: user?.bankName || '',
    accountHolderName: user?.accountHolderName || ''
  });

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setUser(data);
      setFormData({
        fullName: data.fullName || '',
        phone: data.phone || '',
        address: data.address || '',
        avatarUrl: data.avatarUrl || '',
        qrCodeUrl: data.qrCodeUrl || '',
        accountNumber: data.accountNumber || '',
        bankName: data.bankName || '',
        accountHolderName: data.accountHolderName || ''
      });
    } catch (err) {
      console.error("Failed to fetch profile");
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      if (refreshUser) refreshUser(updatedUser);
      setShowAddModal(false);
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
    setLoading(false);
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.role === 'ADMIN' || user?.username === 'admin';

  const profileItems = isAdmin ? [
    { id: 'profile', label: 'Chỉnh sửa hồ sơ', icon: Edit2, color: 'bg-hot-pink' },
    { id: 'bankInfo', label: 'Thông tin chuyển khoản', icon: Landmark, color: 'bg-blue-400' },
    { id: 'qrCode', label: 'Mã QR nhận tiền', icon: QrCode, color: 'bg-pastel-pink' },
  ] : [
    { id: 'profile', label: 'Chỉnh sửa hồ sơ', icon: Edit2, color: 'bg-hot-pink' },
    { id: 'address', label: 'Địa chỉ nhận hàng', icon: MapPin, color: 'bg-pastel-pink' },
    { id: 'orders', label: 'Lịch sử mua hàng', icon: ShoppingBag, color: 'bg-text-heading' },
  ];

  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'orders'

  if (activeTab === 'orders') {
    return (
      <div className="animate-in slide-in-from-right duration-500 bg-soft-bg min-h-screen pb-32">
        <div className="px-4 py-8 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-10 border-b-2 border-pastel-pink/30 pb-6">
            <button onClick={() => setActiveTab('main')} className="p-3 bg-white rounded-full shadow-clay-sm text-hot-pink border border-pastel-pink/10 transition-all">
              <ChevronRight size={28} strokeWidth={2.5} className="rotate-180" />
            </button>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-text-heading">Lịch sử <span className="text-hot-pink">mua hàng</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.length === 0 ? (
              <div className="col-span-full bg-white/50 rounded-clay border-2 border-dashed border-pastel-pink p-12 text-center shadow-inner">
                <Package size={64} strokeWidth={1} className="mx-auto text-pastel-pink mb-6" />
                <p className="text-text-main/50 font-heading font-bold text-lg">Bạn chưa có đơn hàng nào.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-clay shadow-clay-md group border-2 border-white hover:shadow-clay-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] text-pastel-pink font-bold tracking-widest mb-1">Đơn hàng #{order.id}</p>
                      <p className="text-sm font-bold text-text-heading">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-white ${
                      order.status === 'DELIVERED' ? 'bg-green-400 text-white' : 'bg-pastel-pink/30 text-hot-pink'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="border-t border-pastel-pink/10 border-dashed pt-4 flex justify-between items-center">
                    <p className="text-xs text-text-main/40 font-bold uppercase">Tổng cộng</p>
                    <p className="text-xl font-heading font-black text-hot-pink">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 bg-soft-bg min-h-screen pb-32">
      <div className="md:max-w-5xl md:mx-auto md:mt-4 md:mb-16 bg-white md:rounded-clay md:shadow-clay-lg overflow-hidden border-4 border-white">
        {/* Header Profile - Super Compacted */}
        <div className="relative h-48 md:h-72 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-pastel-pink/30">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-hot-pink/20 rounded-full blur-[60px]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 md:w-36 md:h-36 bg-white rounded-full shadow-clay-lg p-1 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer group border-2 border-white">
              <div className="w-full h-full bg-soft-bg rounded-full overflow-hidden shadow-inner">
                <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || 'Sam'}&hair=long&hairColor=f1ff52`} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
            <h3 className="text-text-heading font-heading font-black text-xl md:text-4xl mt-3 tracking-tighter drop-shadow-[1px_1px_0px_#FBCFE8]">{user?.fullName || user?.username || 'Khách'}</h3>
            <div className="mt-1 px-3 py-0.5 bg-hot-pink rounded-full shadow-clay-sm -rotate-1">
              <p className="text-white text-[8px] md:text-xs font-bold tracking-widest uppercase">{user?.provider ? `Liên kết: ${user.provider}` : 'Thành viên Brick Master'}</p>
            </div>
          </div>
        </div>

        {/* Content Profile - Super Compacted */}
        <div className="px-4 py-4 md:p-10 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-3 md:gap-8">
            <div className="bg-soft-bg/30 p-3 md:p-6 rounded-clay border-2 border-white shadow-clay-sm hover:shadow-clay-md transition-all group">
              <p className="text-[8px] md:text-[10px] text-pastel-pink font-bold uppercase tracking-widest">Số đơn hàng</p>
              <p className="text-xl md:text-4xl font-heading font-black text-text-heading">{orders.length} <span className="text-[10px]">Đơn</span></p>
            </div>
            <div className="bg-soft-bg/30 p-3 md:p-6 rounded-clay border-2 border-white shadow-clay-sm hover:shadow-clay-md transition-all group">
              <p className="text-[8px] md:text-[10px] text-pastel-pink font-bold uppercase tracking-widest">Hạng thành viên</p>
              <p className="text-xl md:text-4xl font-heading font-black text-hot-pink tracking-tighter">VIP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profileItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => {
                  if (item.id === 'orders') setActiveTab('orders');
                  else {
                    setModalType(item.id);
                    setShowAddModal(true);
                  }
                }}
                className="w-full p-4 md:p-6 bg-white rounded-clay shadow-clay-sm flex items-center justify-between group hover:shadow-md border border-pastel-pink/10 transition-all"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-clay-sm group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon size={20} md:size={24} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <span className="font-heading font-bold text-sm md:text-lg block tracking-tight text-text-heading">{item.label}</span>
                    {item.id === 'address' && <span className="text-[9px] md:text-xs text-text-main/40 font-bold truncate max-w-[150px] block mt-0.5">{user?.address || 'Chưa cập nhật'}</span>}
                  </div>
                </div>
                <ChevronRight size={20} strokeWidth={2.5} className="text-pastel-pink group-hover:translate-x-2 transition-transform" />
              </button>
            ))}
            
            <button 
              onClick={onLogout}
              className="w-full p-4 md:p-6 bg-white rounded-clay shadow-clay-sm flex items-center justify-between group hover:shadow-md border border-pastel-pink/10 transition-all"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-text-heading rounded-2xl flex items-center justify-center text-white shadow-clay-sm group-hover:bg-hot-pink transition-colors">
                  <LogOut size={20} md:size={24} strokeWidth={2.5} />
                </div>
                <span className="font-heading font-bold text-sm md:text-lg block tracking-tight text-text-heading">Đăng xuất</span>
              </div>
              <ChevronRight size={20} strokeWidth={2.5} className="text-pastel-pink group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text-heading/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-clay-lg p-6 md:p-10 animate-in zoom-in-95 duration-300 border-4 border-white overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-8 border-b-2 border-pastel-pink/20 pb-4">
              <h3 className="text-xl md:text-3xl font-heading font-black uppercase tracking-tighter text-text-heading">
                {modalType === 'profile' ? 'Cập nhật hồ sơ' : modalType === 'qrCode' ? 'Mã QR nhận tiền' : modalType === 'bankInfo' ? 'Thông tin chuyển khoản' : 'Địa chỉ giao hàng'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-hot-pink text-white rounded-full shadow-clay-sm hover:bg-text-main transition-all">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              {modalType === 'profile' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">Họ và tên</label>
                    <div className="relative">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} strokeWidth={2} />
                      <input 
                        type="text" 
                        placeholder="Nhập họ tên của bạn" 
                        required
                        className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none text-sm"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} strokeWidth={2} />
                      <input 
                        type="text" 
                        placeholder="Số điện thoại liên lạc" 
                        className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none text-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">URL Ảnh đại diện</label>
                    <div className="relative">
                      <Edit2 className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} strokeWidth={2} />
                      <input 
                        type="text" 
                        placeholder="Nhập link ảnh của bạn" 
                        className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none text-sm"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                      />
                    </div>
                  </div>
                </>
              ) : modalType === 'bankInfo' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">Số tài khoản (STK)</label>
                    <div className="relative">
                      <Landmark className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} strokeWidth={2} />
                      <input 
                        type="text" 
                        placeholder="Số tài khoản ngân hàng" 
                        className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none text-sm"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">Tên Ngân hàng</label>
                    <div className="relative">
                      <Landmark className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} strokeWidth={2} />
                      <input 
                        type="text" 
                        placeholder="Ví dụ: Vietcombank, MB Bank..." 
                        className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none text-sm"
                        value={formData.bankName}
                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">Tên chủ tài khoản</label>
                    <div className="relative">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} strokeWidth={2} />
                      <input 
                        type="text" 
                        placeholder="Tên đầy đủ trên thẻ" 
                        className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none text-sm"
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData({...formData, accountHolderName: e.target.value})}
                      />
                    </div>
                  </div>
                </>
              ) : modalType === 'qrCode' ? (
                <div className="space-y-2">
                  <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">URL Mã QR nhận tiền</label>
                  <div className="relative">
                    <QrCode className="absolute left-5 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} strokeWidth={2} />
                    <input 
                      type="text" 
                      placeholder="Nhập link ảnh QR code của bạn" 
                      className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none text-sm"
                      value={formData.qrCodeUrl}
                      onChange={(e) => setFormData({...formData, qrCodeUrl: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] text-pastel-pink font-bold tracking-widest ml-1 uppercase">Địa chỉ nhận hàng</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-5 top-5 text-pastel-pink" size={18} strokeWidth={2} />
                    <textarea 
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" 
                      className="w-full pl-12 pr-5 py-4 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold text-text-heading outline-none min-h-[120px] text-sm"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <button 
                disabled={loading}
                className="w-full py-5 bg-hot-pink text-white rounded-clay shadow-clay-md font-heading font-bold text-lg tracking-widest hover:bg-text-heading transition-all mt-2 flex items-center justify-center gap-4 active:scale-95 shadow-clay-lg"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Check size={20} strokeWidth={3} /> Lưu thay đổi</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
