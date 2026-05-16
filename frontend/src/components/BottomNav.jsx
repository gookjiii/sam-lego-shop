import React from 'react';

const BottomNav = ({ currentScreen, setCurrentScreen, navItems }) => (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[450px] bg-white/90 backdrop-blur-lg rounded-clay shadow-clay-lg flex justify-around items-center p-2 z-50 border-2 border-white">
      {navItems.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentScreen(tab.id)}
          className={`relative flex flex-col items-center gap-1 px-4 py-3 transition-all rounded-clay ${currentScreen === tab.id ? 'bg-hot-pink text-white shadow-clay-sm scale-110 -translate-y-2' : 'text-text-main/40 hover:text-hot-pink'}`}
        >
          <tab.icon size={22} strokeWidth={currentScreen === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-heading font-bold leading-none">{tab.label}</span>
          {tab.badge > 0 && tab.id === 'cart' && (
            <span className="absolute -top-1 right-1 bg-white text-hot-pink text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-clay-sm border border-pastel-pink">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
);

export default BottomNav;
