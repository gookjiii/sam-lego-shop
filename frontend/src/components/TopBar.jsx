import React from 'react';
import { Bell } from 'lucide-react';
import LogoComponent from './LogoComponent';

const TopBar = ({ currentScreen, setCurrentScreen, navItems, cartCount, user }) => (
    <div className="sticky top-0 z-40 flex justify-between items-center px-4 lg:px-12 py-2 md:py-3 bg-white/80 backdrop-blur-md border-b border-pastel-pink/20 transition-all shadow-clay-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <LogoComponent size="sm" onClick={() => setCurrentScreen('home')} />
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4">
        {navItems.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setCurrentScreen(tab.id)}
            className={`flex items-center gap-2 px-4 py-1.5 lg:px-6 lg:py-2 rounded-full transition-all font-heading font-bold tracking-tight ${currentScreen === tab.id ? 'bg-hot-pink text-white shadow-clay-sm scale-105' : 'text-text-main/60 hover:bg-pastel-pink/20 hover:text-text-main'}`}
          >
            <tab.icon size={16} strokeWidth={2.5} />
            <span className="text-xs lg:text-sm">{tab.label}</span>
            {tab.badge > 0 && tab.id === 'cart' && (
              <span className="bg-white text-hot-pink text-[10px] px-2 py-0.5 rounded-full shadow-sm font-bold border border-pastel-pink ml-1">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-2 lg:gap-6">
        <div className="hidden sm:block text-right">
          <p className="text-[10px] text-hot-pink/60 font-bold uppercase tracking-widest leading-tight">Brick Master</p>
          {user ? (
            <p className="text-sm font-bold text-text-heading line-clamp-1 max-w-[120px]">{user.fullName || user.username}</p>
          ) : (
            <button onClick={() => setCurrentScreen('login')} className="text-sm font-bold text-hot-pink hover:underline decoration-pastel-pink">Gia nhập</button>
          )}
        </div>
        <div className="relative cursor-pointer" onClick={() => setCurrentScreen(user ? 'profile' : 'login')}>
          <div className="w-9 h-9 md:w-11 md:h-11 bg-pastel-pink rounded-full p-1 hover:scale-110 transition-transform shadow-clay-sm">
            <div className="w-full h-full bg-white overflow-hidden rounded-full border-2 border-white">
              <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'guest'}`} alt="User" className="w-full h-full object-cover bg-pastel-pink/10" />
            </div>
          </div>
        </div>
        <button className="p-1.5 md:p-2 rounded-full bg-white text-text-main relative hover:bg-pastel-pink/20 transition-colors hidden sm:block shadow-clay-sm border border-white">
          <Bell size={16} md:size={18} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-hot-pink rounded-full text-[8px] flex items-center justify-center text-white font-bold shadow-sm">!</span>
        </button>
      </div>
    </div>
);

export default TopBar;
