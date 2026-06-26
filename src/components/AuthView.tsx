import { useState, FormEvent } from 'react';
import { Mail, Lock, User, Sparkles, LogIn, ChevronRight, UserCheck, ShieldAlert, BadgeCheck } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface AuthViewProps {
  onLogin: (email: string, password: string, isDemo?: boolean, demoRole?: UserRole) => Promise<void>;
  onRegister: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  onBackToHome: () => void;
}

export default function AuthView({ onLogin, onRegister, onBackToHome }: AuthViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Customer');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setErrorMsg('Please specify your name.');
          setLoading(false);
          return;
        }
        await onRegister(email, password, name, selectedRole);
        setSuccessMsg('Private luxury credentials generated successfully. Logging in...');
        setTimeout(() => {
          onBackToHome();
        }, 1500);
      } else {
        await onLogin(email, password);
        setSuccessMsg('Appraisal confirmed. Access unlocked.');
        setTimeout(() => {
          onBackToHome();
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await onLogin('', '', true, role);
      setSuccessMsg(`Access unlocked as Demo ${role}!`);
      setTimeout(() => {
        onBackToHome();
      }, 1500);
    } catch (err: any) {
      setErrorMsg('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-[85vh] flex items-center justify-center py-16 px-4" id="auth-view-container">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-white/[0.01] border border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-10 w-10 border border-white/10 text-[#D4AF37] mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-light tracking-[0.15em] uppercase text-white">
            {isRegister ? 'Register Concierge' : 'Concierge Entry'}
          </h2>
          <p className="text-xs text-white/40 font-light">
            {isRegister ? 'Design your luxury account credentials' : 'Enter your private credentials below'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-mono tracking-wide">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs text-center font-mono tracking-wide">
            {successMsg}
          </div>
        )}

        {/* Regular Login/Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hissan Sethi"
                  className="w-full pl-10 pr-3 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-xs text-white focus:outline-none placeholder-white/20 rounded-none transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="connoisseur@hs.com"
                className="w-full pl-10 pr-3 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-xs text-white focus:outline-none placeholder-white/20 rounded-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 bg-[#050505] border border-white/10 focus:border-[#D4AF37] text-xs text-white focus:outline-none placeholder-white/20 rounded-none transition-colors"
              />
            </div>
          </div>

          {/* Role selector removed to prevent unverified admin/editor selection */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8962f] text-black font-semibold tracking-widest text-[10px] uppercase rounded-none transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none shadow-lg"
            id="btn-auth-submit"
          >
            <LogIn className="w-3.5 h-3.5 text-black" />
            <span>{loading ? 'Validating...' : isRegister ? 'Generate Credentials' : 'Access Scent Lounge'}</span>
          </button>
        </form>

        {/* Toggle between register and login */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-[11px] text-[#D4AF37] hover:text-[#b8962f] transition-colors focus:outline-none underline underline-offset-4 tracking-wide font-light"
            id="btn-toggle-auth-mode"
          >
            {isRegister ? 'Already have credentials? Enter Scent Lounge' : 'Create new luxury credentials'}
          </button>
        </div>

        {/* DEMO ACCESS GATES - HIGHER-TIER UX FOR FAST TESTING */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <p className="text-[9px] uppercase tracking-widest text-white/30 font-mono text-center">
            ⚡ Quick-Pass Guest Entry
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={() => handleQuickDemoLogin('Customer')}
              className="w-full sm:w-2/3 px-3 py-2.5 bg-[#050505] border border-white/10 hover:border-[#D4AF37] text-[10px] font-mono tracking-wider text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 uppercase rounded-none"
              id="btn-demo-customer"
              title="Test customer order histories & tracking"
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Enter Scent Lounge as Guest</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
