import React, { useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Sparkles, Zap, Shield, MessageSquare } from 'lucide-react';
import { API_URL } from './config';

const features = [
  { icon: <Zap size={14} />, text: 'High-Speed Groq Engine' },
  { icon: <MessageSquare size={14} />, text: 'Persistent chat history' },
  { icon: <Shield size={14} />, text: 'Secure Google Sign-In' },
  { icon: <Sparkles size={14} />, text: 'Markdown & code rendering' },
];

/* ─── Floating particle ─────────────────────────────── */
const Particle = ({ style }) => (
  <div className="particle" style={style} />
);

const Login = ({ onLoginSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    try {
      const response = await axios.post(`${API_URL}/api/auth/google-login`, {
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub,
      });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(response.data.user);
      }
    } catch (error) {
      console.error('Backend login failed:', error);
    }
  };

  const particles = Array.from({ length: 12 }, (_, i) => ({
    key: i,
    style: {
      width: `${Math.random() * 60 + 20}px`,
      height: `${Math.random() * 60 + 20}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: i % 2 === 0
        ? 'radial-gradient(circle, rgba(124,58,237,0.5), transparent)'
        : 'radial-gradient(circle, rgba(6,182,212,0.4), transparent)',
      animationDuration: `${Math.random() * 6 + 6}s`,
      animationDelay: `${Math.random() * 4}s`,
    },
  }));

  return (
    <div
      className="h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Aurora background */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />

      {/* Floating particles */}
      {particles.map(p => <Particle key={p.key} style={p.style} />)}

      {/* Login card */}
      <div
        className="relative w-full max-w-md p-px rounded-3xl z-10"
        style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-glow-purple), var(--shadow-lg)' }}
      >
        <div
          className="rounded-3xl p-10 flex flex-col items-center gap-7"
          style={{ background: 'var(--bg-elevated)' }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-3xl p-1 flex items-center justify-center border border-white/20 shadow-2xl relative overflow-hidden"
              style={{ background: 'rgba(15, 15, 26, 0.9)', backdropFilter: 'blur(20px)' }}
            >
              <img
                src="/favicon.png"
                alt="Astra Logo"
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_20px_rgba(124,58,237,0.8)]"
              />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight gradient-text">
                Astra AI
              </h1>
              <p className="text-xs mt-1 text-gray-400 font-medium">
                Developer AI Workspace & Collaborative Hub
              </p>
            </div>
          </div>

          {/* Feature list */}
          <div className="w-full grid grid-cols-2 gap-2">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ color: 'var(--accent-cyan)' }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Sign in to continue</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.error('Login Failed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              size="large"
            />
          </div>

          {/* Footer */}
          <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
            By signing in, you agree to our{' '}
            <span style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;