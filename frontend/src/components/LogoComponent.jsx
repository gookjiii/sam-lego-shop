import React from 'react';

const LogoComponent = ({ size = "lg", onClick }) => (
    <div 
      className={`flex flex-col items-center select-none cursor-pointer group ${size === "lg" ? "animate-in fade-in zoom-in duration-700" : ""}`}
      onClick={onClick}
    >
      {size === "lg" ? (
        <div className="relative mb-4">
          {/* Logo Icon - A Lego Brick Style S */}
          <div className="w-24 h-24 bg-hot-pink rounded-clay shadow-clay-md flex items-center justify-center relative border-2 border-white/50">
            {/* Studs on top of brick */}
            <div className="absolute -top-3 left-4 w-6 h-3 bg-hot-pink rounded-t-full shadow-sm"></div>
            <div className="absolute -top-3 right-4 w-6 h-3 bg-hot-pink rounded-t-full shadow-sm"></div>
            <span className="text-6xl font-heading font-black text-white italic drop-shadow-[4px_4px_0px_#FBCFE8]">S</span>
          </div>
          
          {/* Tagline for large logo */}
          <div className="mt-6 flex flex-col items-center">
            <h1 className="text-5xl font-heading font-black tracking-tighter text-text-main uppercase">
              Sam<span className="text-hot-pink">Lego</span>
            </h1>
            <div className="mt-2 bg-pastel-pink/50 rounded-full px-6 py-1 rotate-1 group-hover:-rotate-1 transition-transform border border-pastel-pink/20 shadow-sm">
              <span className="text-xs uppercase tracking-widest font-bold text-text-main">
                Thế giới quà tặng sáng tạo
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-hot-pink rounded-lg shadow-clay-sm flex items-center justify-center relative scale-90 border-[1px] border-white/50">
             {/* Studs */}
             <div className="absolute -top-1.5 left-1.5 w-2 h-1.5 bg-hot-pink rounded-t-full border-[1px] border-white/20"></div>
             <div className="absolute -top-1.5 right-1.5 w-2 h-1.5 bg-hot-pink rounded-t-full border-[1px] border-white/20"></div>
             <span className="text-xl font-heading font-black text-white italic">S</span>
          </div>
          <h1 className="text-2xl font-heading font-black tracking-tighter text-text-main uppercase">
            Sam<span className="text-hot-pink">Lego</span>
          </h1>
        </div>
      )}
    </div>
);

export default LogoComponent;
