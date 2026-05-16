import React, { useState } from 'react';
import { ChevronLeft, Mail, Lock, User, Github, Globe, ArrowRight } from 'lucide-react';
import { login, register } from '../api/authService';
import LogoComponent from '../components/LogoComponent';

const Login = ({ onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let response;
      if (isLogin) {
        response = await login(formData.username, formData.password);
      } else {
        response = await register(formData);
      }
      onLoginSuccess(response);
    } catch (err) {
      setError(err.response?.data || 'Đã có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 bg-soft-bg min-h-screen flex flex-col items-center justify-center p-4 pb-32 md:pb-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-pastel-pink/20 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-hot-pink/10 rounded-full blur-3xl opacity-60"></div>

      <button onClick={onBack} className="absolute top-4 left-4 p-2.5 bg-white rounded-full shadow-clay-sm text-hot-pink hover:bg-hot-pink hover:text-white transition-all border border-pastel-pink/20 z-20">
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="scale-75 origin-bottom">
            <LogoComponent size="sm" />
          </div>
          <div className="inline-block px-4 py-1.5 bg-hot-pink text-white rounded-full shadow-clay-sm -rotate-1 mb-2 mt-2 font-heading font-bold text-sm">
            {isLogin ? 'Chào mừng quay lại' : 'Tạo tài khoản mới'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[32px] shadow-clay-lg border-2 border-white">
          {error && (
            <div className="bg-red-50 text-red-400 p-3 rounded-xl mb-4 text-xs font-heading font-bold text-center border border-red-100 shadow-inner">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} />
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Họ và tên" 
                  className="w-full pl-12 pr-4 py-3.5 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold placeholder:text-pastel-pink text-text-heading outline-none text-sm"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} />
              <input 
                type="text" 
                name="username"
                placeholder="Tên đăng nhập" 
                className="w-full pl-12 pr-4 py-3.5 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold placeholder:text-pastel-pink text-text-heading outline-none text-sm"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  className="w-full pl-12 pr-4 py-3.5 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold placeholder:text-pastel-pink text-text-heading outline-none text-sm"
                  value={formData.email}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-pink" size={18} />
              <input 
                type="password" 
                name="password"
                placeholder="Mật khẩu" 
                className="w-full pl-12 pr-4 py-3.5 bg-soft-bg/50 rounded-2xl focus:bg-white focus:shadow-clay-sm transition-all font-heading font-bold placeholder:text-pastel-pink text-text-heading outline-none text-sm"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-hot-pink text-white rounded-clay shadow-clay-md font-heading font-bold text-lg tracking-widest hover:bg-text-heading transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-pastel-pink/20"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-4 bg-white font-heading font-bold text-pastel-pink tracking-widest uppercase">Hoặc</span>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" className="flex-1 flex justify-center items-center py-3 bg-white rounded-xl border border-pastel-pink/10 shadow-clay-sm hover:shadow-clay-md transition-all">
              <Mail size={20} className="text-hot-pink" />
            </button>
            <button type="button" className="flex-1 flex justify-center items-center py-3 bg-white rounded-xl border border-pastel-pink/10 shadow-clay-sm hover:shadow-clay-md transition-all">
              <User size={20} className="text-text-heading" />
            </button>
          </div>
        </form>

        <p className="mt-6 text-center font-body font-bold text-xs text-text-main/60">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <button onClick={switchMode} className="ml-2 text-hot-pink hover:underline decoration-2 font-black">
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
