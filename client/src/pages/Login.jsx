import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { useShop, createJwtToken, parseJwt } from '../store/ShopContext';
import { registerUser, verifyUserCredentials } from '../utils/authDb';

export default function Login() {
  const { login, sessionExpiredMsg, setSessionExpiredMsg } = useShop();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const sessionDurationSeconds = 24 * 3600; // 24 hours

    if (!cleanEmail || !cleanPass) {
      setError('Please provide both email and password.');
      setIsLoading(false);
      return;
    }

    if (cleanPass.length < 4) {
      setError('Password must be at least 4 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegisterMode
        ? { name: name ? name.trim() : cleanEmail.split('@')[0], email: cleanEmail, password: cleanPass }
        : { email: cleanEmail, password: cleanPass };

      // 1. First attempt to call the Node.js / Express Server API
      let serverAuthSuccess = false;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.token) {
            serverAuthSuccess = true;
            if (setSessionExpiredMsg) setSessionExpiredMsg('');
            login(data);
            setIsLoading(false);
            if (data.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/account');
            }
            return;
          } else if (res.status === 401 || res.status === 400) {
            // If server requires client-side stored hash verification, proceed to authDb
            if (!data.fallbackClientAuth) {
              setIsLoading(false);
              setError(data.message || 'Invalid email or password.');
              return;
            }
          }
        }
      } catch (networkErr) {
        // Fallback to client-side secure authDb if server is offline
      }

      // 2. Fallback / Edge Auth using SHA-256 password hash database & JWT
      if (isRegisterMode) {
        const registeredUser = await registerUser({
          name: name ? name.trim() : cleanEmail.split('@')[0],
          email: cleanEmail,
          password: cleanPass
        });

        const tokenPayload = {
          userId: registeredUser.userId,
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role
        };
        const token = createJwtToken(tokenPayload, sessionDurationSeconds);
        const authUser = {
          ...tokenPayload,
          token,
          expiresAt: Date.now() + sessionDurationSeconds * 1000
        };

        if (setSessionExpiredMsg) setSessionExpiredMsg('');
        login(authUser);
        setIsLoading(false);

        if (authUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      } else {
        const verifiedUser = await verifyUserCredentials({
          email: cleanEmail,
          password: cleanPass
        });

        const tokenPayload = {
          userId: verifiedUser.userId,
          name: verifiedUser.name,
          email: verifiedUser.email,
          role: verifiedUser.role
        };
        const token = createJwtToken(tokenPayload, sessionDurationSeconds);
        const authUser = {
          ...tokenPayload,
          token,
          expiresAt: Date.now() + sessionDurationSeconds * 1000
        };

        if (setSessionExpiredMsg) setSessionExpiredMsg('');
        login(authUser);
        setIsLoading(false);

        if (authUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#202522] font-sans flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="bg-white border border-[#DED8CC] max-w-md w-full p-8 shadow-2xl rounded-sm space-y-6">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#C49A5A] uppercase block">
              CLIENT PORTAL
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#202522]">
              {isRegisterMode ? 'Create Your Account' : 'Sign In to VISHAL JEWELLERY'}
            </h1>
            <p className="text-xs text-[#77736B]">
              {isRegisterMode ? 'Register to manage orders and saved heirlooms.' : 'Enter your credentials to access your account or admin panel.'}
            </p>
          </div>

          {sessionExpiredMsg && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs p-3 rounded text-center flex items-center justify-between">
              <span>{sessionExpiredMsg}</span>
              <button 
                type="button" 
                onClick={() => setSessionExpiredMsg && setSessionExpiredMsg('')}
                className="text-amber-700 hover:text-amber-900 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegisterMode && (
              <div>
                <label htmlFor="fullname" className="text-[11px] font-semibold uppercase text-[#202522] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#77736B] absolute left-3 top-3" />
                  <input
                    id="fullname"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-9 p-3 bg-[#F8F5EE] border border-[#DED8CC] text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-[11px] font-semibold uppercase text-[#202522] block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77736B] absolute left-3 top-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 p-3 bg-[#F8F5EE] border border-[#DED8CC] text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-[11px] font-semibold uppercase text-[#202522] block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#77736B] absolute left-3 top-3.5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 p-3 bg-[#F8F5EE] border border-[#DED8CC] text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D96B27] text-white text-xs font-semibold uppercase tracking-widest py-4 hover:bg-[#B85517] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#D96B27]/25 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? 'Authenticating...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center pt-2 text-xs border-t border-[#DED8CC]">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-[#D96B27] hover:underline font-semibold cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
