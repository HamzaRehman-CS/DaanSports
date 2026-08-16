import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Lock, Mail, Building, UserCheck } from 'lucide-react';
import SEO from '../Components/SEO/SEO';
import { API_URL } from '../config';

const LoginSignup = () => {
  const [authMethod, setAuthMethod] = useState('clerk'); // 'clerk' or 'email'
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [errorMsg, setErrorMsg] = useState('');

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    setErrorMsg('');
    try {
      let responseData;
      await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      .then(res => res.json())
      .then(data => responseData = data);

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('user-email', formData.email);
        window.location.replace('/');
      } else {
        setErrorMsg(responseData.error || "Login failed");
      }
    } catch (err) {
      setErrorMsg("Login error: " + err.message);
    }
  };

  const signUp = async () => {
    setErrorMsg('');
    try {
      let responseData;
      await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      .then(res => res.json())
      .then(data => responseData = data);


      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('user-email', formData.email);
        window.location.replace('/');
      } else {
        setErrorMsg(responseData.error || "Registration failed");
      }
    } catch (err) {
      setErrorMsg("Registration error: " + err.message);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center px-4">
      <SEO 
        title="B2B Wholesale Portal Login & Registration"
        description="Sign in or register for direct access to DAAN Sports wholesale ordering desk, quotation builder, and customer order tracking."
      />
      <div className="bg-[#18181b] border border-white/10 rounded-xl p-8 md:p-12 w-full max-w-lg shadow-2xl space-y-6">

        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-block bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 transform -skew-x-12">
            <span className="skew-x-12 inline-block">DAAN SPORTS B2B DESK</span>
          </span>
          <h2 className="font-display font-black italic uppercase text-3xl text-white">
            Wholesale Portal Auth
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Sign in with Clerk SSO or local credentials to access volume pricing & live orders.
          </p>
        </div>

        {/* Auth Method Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#0a0a0a] p-1.5 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider">
          <button 
            className={`py-2 rounded transition-all cursor-pointer ${authMethod === 'clerk' ? 'bg-[#dc2626] text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            onClick={() => setAuthMethod('clerk')}
          >
            🔒 Clerk Auth (SSO)
          </button>
          <button 
            className={`py-2 rounded transition-all cursor-pointer ${authMethod === 'email' ? 'bg-[#dc2626] text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            onClick={() => setAuthMethod('email')}
          >
            ✉️ Email & Password
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs p-3 rounded">
            {errorMsg}
          </div>
        )}

        {/* Clerk Auth Component */}
        {authMethod === 'clerk' ? (
          <div className="flex flex-col items-center justify-center py-4">
            {state === "Login" ? (
              <SignIn routing="path" path="/login" signUpUrl="/login" />
            ) : (
              <SignUp routing="path" path="/login" signInUrl="/login" />
            )}
            <div className="mt-4 text-xs text-zinc-400">
              {state === "Login" ? (
                <p>Need a new account? <span className="text-[#dc2626] font-bold cursor-pointer underline" onClick={() => setState('Sign Up')}>Register via Clerk</span></p>
              ) : (
                <p>Already registered? <span className="text-[#dc2626] font-bold cursor-pointer underline" onClick={() => setState('Login')}>Sign In via Clerk</span></p>
              )}
            </div>
          </div>
        ) : (
          /* Email / Password Form */
          <div className="space-y-4">
            {state === "Sign Up" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Company / Contact Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={changeHandler}
                  placeholder="Apex Apparel Inc."
                  className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-bold text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Business Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={changeHandler}
                type="email"
                placeholder="purchasing@company.com"
                className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-bold text-white focus:outline-none focus:border-[#dc2626]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Account Password</label>
              <input
                name="password"
                value={formData.password}
                onChange={changeHandler}
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-bold text-white focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <button 
              className="w-full bg-white text-[#0a0a0a] py-3.5 px-6 font-display font-black italic uppercase text-xs tracking-wider hover:bg-[#dc2626] hover:text-white transition-all transform -skew-x-6 cursor-pointer mt-4 shadow-xl"
              onClick={() => { state === "Login" ? login() : signUp() }}
            >
              <span className="skew-x-6 inline-block">{state === "Login" ? "Access Wholesale Portal ➔" : "Create Business Account ➔"}</span>
            </button>

            <div className="text-center text-xs text-zinc-400 pt-2">
              {state === "Sign Up" ? (
                <p>Already registered? <span className="text-[#dc2626] font-bold cursor-pointer underline" onClick={() => setState('Login')}>Login here</span></p>
              ) : (
                <p>New customer? <span className="text-[#dc2626] font-bold cursor-pointer underline" onClick={() => setState('Sign Up')}>Register Business Account</span></p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginSignup;
