import React, { useState, useEffect } from 'react';
import { 
  Upload, Plus, FileText, CheckCircle, AlertCircle, Package, Search, 
  ChevronRight, BarChart3, List, Grid, X, LayoutDashboard, TrendingUp,
  DollarSign, ShoppingCart, Users, User, Truck, Clock, Check, Edit2, Trash2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { getProducts, getCategories } from '../api/productService';
import { 
  importProducts, addProduct, getAdminStats, addCategory, 
  getAllOrders, updateOrderStatus, updateProduct, deleteProduct,
  updateCategory, deleteCategory, deleteOrder
} from '../api/adminService';

const AdminDashboard = ({ activeTab, onBack }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderView, setOrderView] = useState('current');

  const initialProductState = {
    name: '',
    productCode: '',
    description: '',
    price: '',
    preAssembledPrice: '',
    preAssembledWithFlowerPrice: '',
    stockQuantity: '',
    imageUrl: '',
    category: { id: '' }
  };

  const initialCategoryState = {
    name: '',
    description: '',
    imageUrl: ''
  };

  const [newProduct, setNewProduct] = useState(initialProductState);
  const [newCategory, setNewCategory] = useState(initialCategoryState);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const p = await getProducts();
        setProducts(p || []);
        const c = await getCategories();
        setCategories(c || []);
      } else if (activeTab === 'categories') {
        const c = await getCategories();
        setCategories(c || []);
      } else if (activeTab === 'stats') {
        const s = await getAdminStats();
        setStats(s);
      } else if (activeTab === 'orders') {
        const o = await getAllOrders();
        setOrders(o || []);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
    setLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setMessage({ type: 'success', text: `Cập nhật trạng thái đơn hàng #${orderId} thành công!` });
      fetchData();
    } catch (err) {
      console.error("Order status update failed:", err);
      let errorDetail = err.response?.data?.message || err.response?.data || err.message;
      if (typeof errorDetail === 'object') errorDetail = JSON.stringify(errorDetail);
      alert(`Lỗi khi cập nhật trạng thái đơn hàng (Mã ${err.response?.status || '??'}): ${errorDetail}`);
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật trạng thái đơn hàng.' });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này khỏi Database?")) return;
    try {
      await deleteOrder(orderId);
      setMessage({ type: 'success', text: 'Đã xóa đơn hàng thành công!' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Lỗi khi xóa đơn hàng.' });
    }
  };

  const orderStatuses = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    { value: 'PAID', label: 'Đã thanh toán', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { value: 'PROCESSING', label: 'Đang chuẩn bị', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { value: 'SHIPPING', label: 'Đang giao hàng', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { value: 'DELIVERED', label: 'Đã giao hàng', color: 'bg-green-50 text-green-600 border-green-100' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100' },
    { value: 'ARCHIVED', label: 'Đã lưu trữ', color: 'bg-gray-50 text-gray-600 border-gray-100' },
  ];

  const currentOrders = orders.filter(order => order.status !== 'ARCHIVED');
  const archivedOrders = orders.filter(order => order.status === 'ARCHIVED');
  const visibleOrders = orderView === 'archived' ? archivedOrders : currentOrders;

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      await importProducts(file);
      setMessage({ type: 'success', text: 'Nhập dữ liệu Excel thành công!' });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data || 'Lỗi khi nhập file Excel.';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Lỗi khi nhập file Excel.' });
    }
    setLoading(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.category.id) {
      alert("Vui lòng chọn danh mục!");
      return;
    }
    setLoading(true);
    try {
      const productData = {
        name: newProduct.name,
        productCode: newProduct.productCode,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        preAssembledPrice: parseFloat(newProduct.preAssembledPrice || 0),
        preAssembledWithFlowerPrice: parseFloat(newProduct.preAssembledWithFlowerPrice || 0),
        stockQuantity: parseInt(newProduct.stockQuantity),
        imageUrl: newProduct.imageUrl,
        category: { id: parseInt(newProduct.category.id) }
      };
      
      if (isEditingProduct) {
        await updateProduct(currentProductId, productData);
        setMessage({ type: 'success', text: 'Cập nhật sản phẩm thành công!' });
      } else {
        await addProduct(productData);
        setMessage({ type: 'success', text: 'Thêm sản phẩm thành công!' });
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Lỗi khi lưu sản phẩm: " + (err.response?.data?.message || err.message));
      setMessage({ type: 'error', text: 'Lỗi khi lưu sản phẩm.' });
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      setMessage({ type: 'success', text: 'Đã xóa sản phẩm!' });
      fetchData();
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm: " + (err.response?.data?.message || err.message));
      setMessage({ type: 'error', text: 'Lỗi khi xóa sản phẩm.' });
    }
  };

  const openEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      productCode: product.productCode || '',
      description: product.description,
      price: product.price,
      preAssembledPrice: product.preAssembledPrice || '',
      preAssembledWithFlowerPrice: product.preAssembledWithFlowerPrice || '',
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      category: { id: product.category?.id || '' }
    });
    setCurrentProductId(product.id);
    setIsEditingProduct(true);
    setShowProductModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditingCategory) {
        await updateCategory(currentCategoryId, newCategory);
        setMessage({ type: 'success', text: 'Cập nhật danh mục thành công!' });
      } else {
        await addCategory(newCategory);
        setMessage({ type: 'success', text: 'Thêm danh mục thành công!' });
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Lỗi khi lưu danh mục.' });
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Lưu ý: Có thể gây lỗi nếu có sản phẩm trong danh mục.")) return;
    try {
      await deleteCategory(id);
      setMessage({ type: 'success', text: 'Đã xóa danh mục!' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Lỗi khi xóa danh mục (Có thể do còn sản phẩm liên kết).' });
    }
  };

  const openEditCategory = (cat) => {
    setNewCategory({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl
    });
    setCurrentCategoryId(cat.id);
    setIsEditingCategory(true);
    setShowCategoryModal(true);
  };

  const formatVND = (value) => new Intl.NumberFormat('vi-VN').format(value) + ' VND';

  return (
    <div className="min-h-screen bg-soft-bg flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between border animate-in slide-in-from-top-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              <div className="flex items-center gap-3">
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span className="font-bold text-sm">{message.text}</span>
              </div>
              <button onClick={() => setMessage({text: ''})}><X size={18} /></button>
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {[
                  { label: 'Tổng doanh thu', value: formatVND(stats.totalRevenue || 0), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
                  { label: 'Tổng đơn hàng', value: stats.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Sản phẩm', value: stats.totalProducts || 0, icon: Package, color: 'text-hot-pink', bg: 'bg-pastel-pink/20' },
                ].map((card, i) => (
                  <div key={i} className="bg-white p-6 md:p-8 rounded-clay border-2 border-white shadow-clay-sm flex items-center gap-4 md:gap-6">
                    <div className={`w-12 h-12 md:w-14 md:h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <card.icon size={24} md:size={28} />
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] text-pastel-pink font-bold tracking-widest">{card.label}</p>
                      <p className="text-xl md:text-2xl font-black text-text-heading">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 border-white shadow-clay-md">
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <TrendingUp className="text-hot-pink" />
                    <h4 className="text-lg md:text-xl font-bold text-text-heading">Doanh thu theo ngày</h4>
                  </div>
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlyRevenue}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF9A86" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#FF9A86" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F4" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                          formatter={(value) => formatVND(value)}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#FF9A86" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 border-white shadow-clay-md">
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <BarChart3 className="text-blue-400" />
                    <h4 className="text-lg md:text-xl font-bold text-text-heading">Sản phẩm bán chạy</h4>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    {(stats.topSellingProducts || []).map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-soft-bg flex items-center justify-center font-bold text-pastel-pink text-xs md:text-base">{i+1}</div>
                          <span className="font-bold text-text-main text-sm md:text-base truncate max-w-[150px] md:max-w-none">{p.name}</span>
                        </div>
                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap">{p.sales} đã bán</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-black text-text-heading">Quản lý <span className="text-hot-pink">đơn hàng</span></h3>
                <div className="text-[10px] md:text-sm font-bold text-pastel-pink">{visibleOrders.length} đơn hàng</div>
              </div>

              <div className="mb-6 md:mb-8 inline-flex w-full sm:w-auto rounded-2xl bg-white p-1.5 shadow-clay-sm border-2 border-white">
                <button
                  type="button"
                  onClick={() => setOrderView('current')}
                  className={`flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-heading font-bold transition-all ${
                    orderView === 'current' ? 'bg-hot-pink text-white shadow-clay-sm' : 'text-text-main hover:bg-soft-bg/60'
                  }`}
                >
                  Hiện tại ({currentOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderView('archived')}
                  className={`flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-heading font-bold transition-all ${
                    orderView === 'archived' ? 'bg-hot-pink text-white shadow-clay-sm' : 'text-text-main hover:bg-soft-bg/60'
                  }`}
                >
                  Lưu trữ ({archivedOrders.length})
                </button>
              </div>

              {/* Mobile View: Cards */}
              <div className="block md:hidden space-y-4">
                {visibleOrders.map(order => (
                  <div key={order.id} className="bg-white p-5 rounded-clay shadow-clay-sm border-2 border-white space-y-4 relative group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-text-heading">#{order.id}</p>
                        <p className="text-xs text-text-main/60">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${
                        orderStatuses.find(s => s.value === order.status)?.color || ''
                      }`}>
                        {orderStatuses.find(s => s.value === order.status)?.label || order.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-text-main">{order.user?.fullName || order.user?.username}</p>
                      <p className="text-xs text-pastel-pink">{order.user?.phone || 'N/A'}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-pastel-pink/10">
                      <p className="font-black text-hot-pink">{formatVND(order.totalAmount)}</p>
                      <div className="flex gap-2">
                         <button onClick={() => { setSelectedOrder(order); setShowContactModal(true); }} className="p-2 bg-pastel-pink/20 text-hot-pink rounded-xl shadow-sm"><FileText size={16} /></button>
                         {order.status !== 'ARCHIVED' && (
                           <button onClick={() => handleUpdateOrderStatus(order.id, 'ARCHIVED')} className="p-2 bg-gray-50 text-gray-400 rounded-xl shadow-sm"><Package size={16} /></button>
                         )}
                         <button onClick={() => handleDeleteOrder(order.id)} className="p-2 bg-red-50 text-red-400 rounded-xl shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="pt-2">
                       <select 
                        className="w-full bg-soft-bg/50 border border-white rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none shadow-inner"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        {orderStatuses.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block bg-white rounded-[40px] shadow-clay-md border-2 border-white overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-soft-bg/50">
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Đơn hàng</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Khách hàng</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Tổng tiền</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Trạng thái</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pastel-pink/10">
                      {visibleOrders.map(order => (
                        <tr key={order.id} className="hover:bg-soft-bg/30 transition-colors group">
                          <td className="px-8 py-5">
                            <p className="font-bold text-text-heading">#{order.id}</p>
                            <p className="text-[10px] text-text-main/40 font-bold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="font-bold text-sm text-text-main">{order.user?.fullName || order.user?.username}</p>
                            <p className="text-xs text-pastel-pink font-medium">{order.user?.phone || 'N/A'}</p>
                          </td>
                          <td className="px-8 py-5 font-bold text-text-heading">{formatVND(order.totalAmount)}</td>
                          <td className="px-8 py-5">
                            <select 
                              className={`bg-white border-2 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none shadow-clay-sm ${
                                orderStatuses.find(s => s.value === order.status)?.color || ''
                              }`}
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            >
                              {orderStatuses.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => { setSelectedOrder(order); setShowContactModal(true); }} className="p-2 bg-pastel-pink/10 text-hot-pink rounded-xl shadow-clay-sm hover:bg-hot-pink hover:text-white transition-all" title="Xem chi tiết đơn hàng"><FileText size={18} /></button>
                                {order.status !== 'ARCHIVED' && (
                                  <button onClick={() => handleUpdateOrderStatus(order.id, 'ARCHIVED')} className="p-2 bg-gray-50 text-gray-400 rounded-xl shadow-clay-sm hover:bg-gray-400 hover:text-white transition-all" title="Lưu trữ"><Package size={18} /></button>
                                )}
                                <button onClick={() => handleDeleteOrder(order.id)} className="p-2 bg-red-50 text-red-400 rounded-xl shadow-clay-sm hover:bg-red-400 hover:text-white transition-all" title="Xóa đơn hàng"><Trash2 size={18} /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {visibleOrders.length === 0 && (
                <div className="px-8 py-20 text-center text-pastel-pink bg-white/50 rounded-[40px] border-2 border-dashed border-pastel-pink mt-6">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">{orderView === 'archived' ? 'Chưa có đơn hàng lưu trữ' : 'Chưa có đơn hàng hiện tại'}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-black text-text-heading">Danh sách <span className="text-hot-pink">sản phẩm</span></h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial group">
                    <button className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-pastel-pink text-text-main rounded-2xl font-bold flex items-center justify-center gap-2 shadow-clay-sm overflow-hidden relative hover:bg-hot-pink hover:text-white transition-all text-xs md:text-sm">
                      <Upload size={16} /> Nhập Excel
                      <input type="file" accept=".xlsx" onChange={handleImport} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </button>
                    {/* Format Hint */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-text-heading text-white text-[10px] p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 shadow-xl z-50">
                      <p className="font-bold mb-1 border-b border-white/20 pb-1">Định dạng file .xlsx:</p>
                      <ul className="space-y-0.5 list-disc list-inside opacity-80">
                        <li>Cột A: Tên sản phẩm</li>
                        <li>Cột B: Mã (Unique)</li>
                        <li>Cột C: Mô tả</li>
                        <li>Cột D: Giá (Số)</li>
                        <li>Cột E: Kho (Số)</li>
                        <li>Cột F: Link ảnh</li>
                        <li>Cột G: ID danh mục (Số)</li>
                      </ul>
                    </div>
                  </div>
                  <button onClick={() => { setIsEditingProduct(false); setNewProduct(initialProductState); setShowProductModal(true); }} className="flex-1 sm:flex-initial px-4 md:px-6 py-2.5 md:py-3 bg-hot-pink text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-clay-sm hover:bg-text-heading transition-all text-xs md:text-sm">
                    <Plus size={16} /> Thêm mới
                  </button>
                </div>
              </div>

              {/* Mobile View: Cards */}
              <div className="block md:hidden space-y-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-clay shadow-clay-sm border-2 border-white flex gap-4">
                    <img src={p.imageUrl?.split(',')[0]} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-inner flex-shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-main truncate text-sm">{p.name}</p>
                      <p className="text-[10px] text-pastel-pink font-bold mb-1">{p.productCode}</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-black text-hot-pink">{formatVND(p.price)}</p>
                          <p className="text-[10px] text-text-main/60">Kho: {p.stockQuantity}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openEditProduct(p)} className="p-2 text-pastel-pink hover:text-blue-400 transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-pastel-pink hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table with Scroll fix */}
              <div className="hidden md:block bg-white rounded-[40px] shadow-clay-md border-2 border-white overflow-hidden">
                <div className="w-full overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-soft-bg/50">
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Sản phẩm</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Mã</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Giá</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase">Kho</th>
                        <th className="px-8 py-5 text-xs font-bold text-pastel-pink tracking-widest uppercase text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pastel-pink/10">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-soft-bg/30 transition-colors">
                          <td className="px-8 py-5 flex items-center gap-4">
                            <img src={p.imageUrl?.split(',')[0]} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-clay-sm" alt="" />
                            <span className="font-bold text-text-main">{p.name}</span>
                          </td>
                          <td className="px-8 py-5 font-bold text-pastel-pink">{p.productCode}</td>
                          <td className="px-8 py-5 font-bold text-hot-pink">{formatVND(p.price)}</td>
                          <td className="px-8 py-5 font-bold text-text-main">{p.stockQuantity}</td>
                          <td className="px-8 py-5 text-right space-x-2">
                            <button onClick={() => openEditProduct(p)} className="p-2 text-pastel-pink hover:text-blue-400 transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-pastel-pink hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="animate-in fade-in duration-500">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-black text-text-heading">Danh mục <span className="text-hot-pink">sản phẩm</span></h3>
                <button onClick={() => { setIsEditingCategory(false); setNewCategory(initialCategoryState); setShowCategoryModal(true); }} className="w-full sm:w-auto px-6 py-3 bg-hot-pink text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-clay-sm text-xs md:text-sm">
                  <Plus size={16} /> Thêm danh mục
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white p-4 md:p-6 rounded-clay border-2 border-white shadow-clay-sm flex items-center gap-4 group relative hover:shadow-clay-md transition-all">
                    <img src={cat.imageUrl} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl object-cover border-2 border-white shadow-inner flex-shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="bg-soft-bg text-hot-pink text-[10px] font-black px-2 py-0.5 rounded-lg border border-pastel-pink/20">ID: {cat.id}</span>
                        <h5 className="font-bold text-text-heading text-sm md:text-base truncate">{cat.name}</h5>
                      </div>
                      <p className="text-[10px] md:text-xs text-pastel-pink font-medium line-clamp-1">{cat.description}</p>
                    </div>
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditCategory(cat)} className="p-1.5 bg-blue-50 text-blue-400 rounded-lg shadow-sm"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 bg-red-50 text-red-400 rounded-lg shadow-sm"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal - Fully Responsive */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text-heading/40 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-clay-lg animate-in zoom-in-95 border-4 border-white overflow-y-auto max-h-[90vh] no-scrollbar">
            <h3 className="text-xl md:text-3xl font-black mb-6 md:mb-8 text-text-heading">{isEditingProduct ? 'Cập nhật sản phẩm' : 'Sản phẩm mới'}</h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <input type="text" placeholder="Tên sản phẩm" required className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <input type="text" placeholder="Mã sản phẩm" required className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.productCode} onChange={e => setNewProduct({...newProduct, productCode: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Giá" required className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input type="number" placeholder="Kho" required className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-hot-pink ml-2">Giá lắp sẵn (+)</p>
                  <input type="number" placeholder="Giá lắp sẵn (+)" className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.preAssembledPrice} onChange={e => setNewProduct({...newProduct, preAssembledPrice: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-hot-pink ml-2">Giá lắp + hoa (+)</p>
                  <input type="number" placeholder="Giá lắp + hoa (+)" className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.preAssembledWithFlowerPrice} onChange={e => setNewProduct({...newProduct, preAssembledWithFlowerPrice: e.target.value})} />
                </div>
              </div>
              <select className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.category.id} onChange={e => setNewProduct({...newProduct, category: {id: e.target.value}})}>
                <option value="">Chọn danh mục</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>)}
              </select>
              <textarea placeholder="Mô tả" className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner min-h-[100px] text-sm md:text-base" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              <input type="text" placeholder="URL hình ảnh (cách nhau bằng dấu phẩy nếu có nhiều ảnh)" className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
              <button className="w-full py-4 md:py-5 bg-hot-pink text-white rounded-2xl font-black text-base md:text-lg shadow-clay-sm hover:bg-text-heading transition-all">
                {isEditingProduct ? 'Cập nhật ngay' : 'Lưu sản phẩm'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal - Fully Responsive */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text-heading/40 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-clay-lg animate-in zoom-in-95 border-4 border-white overflow-y-auto max-h-[90vh] no-scrollbar">
            <h3 className="text-xl md:text-3xl font-black mb-6 md:mb-8 text-text-heading">{isEditingCategory ? 'Cập nhật danh mục' : 'Danh mục mới'}</h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <input type="text" placeholder="Tên danh mục" required className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
              <textarea placeholder="Mô tả" className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner min-h-[100px] text-sm md:text-base" value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} />
              <input type="text" placeholder="URL hình ảnh" className="w-full px-5 md:px-6 py-3 md:py-4 bg-soft-bg/50 border border-white rounded-2xl focus:outline-none font-bold text-text-main shadow-inner text-sm md:text-base" value={newCategory.imageUrl} onChange={e => setNewCategory({...newCategory, imageUrl: e.target.value})} />
              <button className="w-full py-4 md:py-5 bg-hot-pink text-white rounded-2xl font-black text-base md:text-lg shadow-clay-sm hover:bg-text-heading transition-all">
                {isEditingCategory ? 'Cập nhật ngay' : 'Lưu danh mục'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showContactModal && selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text-heading/40 backdrop-blur-sm" onClick={() => setShowContactModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-clay-lg animate-in zoom-in-95 border-4 border-white overflow-y-auto max-h-[90vh] no-scrollbar">
            <h3 className="text-xl md:text-2xl font-black mb-6 text-text-heading flex items-center gap-3">
               <FileText className="text-hot-pink" /> Chi tiết đơn hàng #{selectedOrder.id}
            </h3>
            
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-soft-bg/50 p-4 rounded-2xl border border-white shadow-inner">
                    <p className="text-[10px] text-pastel-pink font-bold uppercase mb-1">Khách hàng:</p>
                    <p className="font-black text-text-heading">{selectedOrder.user?.fullName || selectedOrder.user?.username || 'N/A'}</p>
                 </div>
                 <div className="bg-soft-bg/50 p-4 rounded-2xl border border-white shadow-inner">
                    <p className="text-[10px] text-pastel-pink font-bold uppercase mb-1">Số điện thoại:</p>
                    <p className="font-black text-hot-pink">{selectedOrder.user?.phone || 'Chưa cập nhật'}</p>
                 </div>
               </div>

               <div className="bg-soft-bg/50 p-4 rounded-2xl border border-white shadow-inner">
                  <p className="text-[10px] text-pastel-pink font-bold uppercase mb-1">Địa chỉ giao hàng:</p>
                  <p className="font-bold text-text-main text-sm leading-relaxed">{selectedOrder.shippingAddress || 'Chưa có địa chỉ'}</p>
               </div>

               <div className="space-y-3">
                 <p className="text-[10px] text-pastel-pink font-bold uppercase ml-2">Sản phẩm đã đặt:</p>
                 <div className="bg-white rounded-2xl border-2 border-soft-bg overflow-hidden">
                   {selectedOrder.items?.map((item, idx) => (
                     <div key={idx} className="p-4 border-b border-soft-bg last:border-0 flex justify-between items-center gap-4">
                       <div className="flex-1 min-w-0">
                         <p className="font-bold text-sm text-text-heading truncate uppercase">{item.product?.name}</p>
                         <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] bg-soft-bg px-2 py-0.5 rounded-full font-bold text-text-main/60">SL: {item.quantity}</span>
                           {item.serviceOption && (
                             <span className="text-[10px] bg-pastel-pink/20 text-hot-pink px-2 py-0.5 rounded-full font-bold italic">Dịch vụ: {item.serviceOption}</span>
                           )}
                         </div>
                       </div>
                       <p className="font-black text-text-heading text-sm">{formatVND(item.price * item.quantity)}</p>
                     </div>
                   ))}
                   <div className="p-4 bg-soft-bg/30 flex justify-between items-center">
                     <p className="font-bold text-sm text-text-main uppercase">Tổng cộng:</p>
                     <p className="font-black text-hot-pink text-lg">{formatVND(selectedOrder.totalAmount)}</p>
                   </div>
                 </div>
               </div>
            </div>
            
            <button 
              onClick={() => setShowContactModal(false)}
              className="w-full mt-8 py-4 bg-text-heading text-white rounded-2xl font-black shadow-clay-sm hover:bg-hot-pink transition-all"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
