import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Gift, ShoppingBag, User, Plus, Package, LayoutDashboard, List, ShoppingCart, MessageCircle } from 'lucide-react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import LogoComponent from './components/LogoComponent';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import { useCart } from './context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getCurrentUser, logout as authLogout } from './api/authService';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(getCurrentUser());
  const { addToCart, cartCount } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.role === 'ADMIN' || user?.username === 'admin';

  // Chuyển màn hình chào
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen(isAdmin ? 'admin-stats' : 'home');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isAdmin]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(selectedProduct);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    const newIsAdmin = userData?.roles?.includes('ROLE_ADMIN') || userData?.role === 'ADMIN' || userData?.username === 'admin';
    setCurrentScreen(newIsAdmin ? 'admin-stats' : 'home');
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setCurrentScreen('home');
  };

  const refreshUser = (updatedData) => {
    if (updatedData) {
        setUser(updatedData);
        localStorage.setItem('user', JSON.stringify(updatedData));
    } else {
        setUser(getCurrentUser());
    }
  };

  const navItems = isAdmin ? [
    { id: 'admin-stats', icon: LayoutDashboard, label: 'Thống kê' },
    { id: 'admin-products', icon: Package, label: 'Sản phẩm' },
    { id: 'admin-categories', icon: List, label: 'Danh mục' },
    { id: 'admin-orders', icon: ShoppingCart, label: 'Đơn hàng' },
  ] : [
    { id: 'home', icon: HomeIcon, label: 'Trang chủ' },
    { id: 'cart', icon: ShoppingBag, badge: cartCount, label: 'Giỏ hàng' },
    { id: user ? 'profile' : 'login', icon: User, label: user ? 'Tôi' : 'Đăng nhập' },
  ];

  if (currentScreen === 'splash') {
    return (
      <div className="h-screen w-full bg-soft-bg flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-pastel-pink/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-lavender/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pastel-pink/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-lavender/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 scale-125">
          <LogoComponent />
        </div>

        <div className="absolute bottom-20 flex flex-col items-center gap-6">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-hot-pink rounded-full animate-bounce"></div>
            <div className="w-6 h-6 bg-pastel-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-6 h-6 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="font-heading font-black text-text-heading tracking-[0.3em] text-sm animate-pulse">
            Đang lắp ráp trải nghiệm...
          </span>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="311664896204-ba5bigcf606thqcurl508ct91qmfbtbg.apps.googleusercontent.com">
      <div className="min-h-screen w-full bg-soft-bg pb-24 md:pb-10 font-sans text-text-main relative overflow-x-hidden">
        
        {currentScreen !== 'detail' && currentScreen !== 'cart' && currentScreen !== 'login' && !currentScreen.startsWith('admin-') && currentScreen !== 'checkout' && (
          <TopBar 
            currentScreen={currentScreen} 
            setCurrentScreen={setCurrentScreen} 
            navItems={navItems} 
            cartCount={cartCount} 
            user={user}
          />
        )}

        {/* Floating Admin Header */}
        {currentScreen.startsWith('admin-') && (
          <TopBar 
            currentScreen={currentScreen} 
            setCurrentScreen={setCurrentScreen} 
            navItems={navItems} 
            cartCount={cartCount} 
            user={user}
          />
        )}

        <main>
          {currentScreen === 'home' && (
            <Home onProductSelect={(product) => { setSelectedProduct(product); setCurrentScreen('detail'); }} />
          )}
          {currentScreen === 'categories' && <Categories />}
          {currentScreen === 'profile' && <Profile user={user} onLogout={handleLogout} refreshUser={refreshUser} />}
          {currentScreen.startsWith('admin-') && (
            <AdminDashboard 
              activeTab={currentScreen.replace('admin-', '')} 
              onBack={() => setCurrentScreen('home')} 
            />
          )}
          {currentScreen === 'checkout' && (
            <Checkout onBack={() => setCurrentScreen('cart')} onOrderSuccess={() => setCurrentScreen('home')} />
          )}
          {currentScreen === 'login' && (
            <Login onBack={() => setCurrentScreen('home')} onLoginSuccess={handleLoginSuccess} />
          )}
          {currentScreen === 'cart' && (
            <Cart onBack={() => setCurrentScreen('home')} onCheckout={() => setCurrentScreen('checkout')} />
          )}
          {currentScreen === 'detail' && (
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setCurrentScreen('home')} 
              onAddToCart={handleAddToCart}
              isAdding={isAdding}
            />
          )}
        </main>

        <BottomNav 
          currentScreen={currentScreen} 
          setCurrentScreen={setCurrentScreen} 
          navItems={navItems} 
        />

        {/* Thông báo nổi */}
        {isAdding && (
          <div className="fixed top-24 md:top-32 left-1/2 -translate-x-1/2 z-[60] bg-white text-text-main rounded-clay shadow-clay-lg px-8 py-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 border-2 border-pastel-pink">
            <div className="w-10 h-10 bg-hot-pink rounded-full flex items-center justify-center text-white shadow-clay-sm">
              <Plus size={24} strokeWidth={3} />
            </div>
            <span className="text-lg font-heading font-black tracking-tight text-text-heading">Đã thêm vào giỏ!</span>
          </div>
        )}

        {/* Nút liên hệ Shop (Client only) */}
        {!isAdmin && currentScreen !== 'splash' && (
          <a 
            href="https://www.facebook.com/profile.php?id=61560493106406" 
            target="_blank" 
            rel="noreferrer"
            className="fixed bottom-24 right-6 z-[45] md:bottom-10 md:right-10 flex items-center gap-2 bg-hot-pink text-white px-4 py-3 rounded-full shadow-clay-lg hover:scale-110 active:scale-95 transition-all group"
          >
            <MessageCircle size={24} strokeWidth={2.5} />
            <span className="font-heading font-bold text-sm hidden md:block">Liên hệ shop</span>
          </a>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
