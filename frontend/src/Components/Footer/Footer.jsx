import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import DsLogo from '../Navbar/DsLogo';

const Footer = () => {
  return (
    <footer className="bg-[#18181b] pt-20 pb-10 border-t border-white/10 relative overflow-hidden text-zinc-400">
      {/* Animated Glow Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#dc2626] to-transparent opacity-60 shadow-[0_0_20px_rgba(220,38,38,0.8)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 relative z-10">
        
        {/* Brand Overview */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <DsLogo className="h-10 w-auto" />
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
            Premium sportswear and activewear manufacturer. Specializing in high-quality OEM/ODM services for global brands since 2012. Quality, speed, and precision in every stitch.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#dc2626] hover:border-[#dc2626] transition-colors"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#dc2626] hover:border-[#dc2626] transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#dc2626] hover:border-[#dc2626] transition-colors"><Facebook size={18} /></a>
          </div>
        </div>
        
        {/* Categories */}
        <div>
          <h4 className="font-display text-lg font-black italic tracking-widest uppercase text-white mb-6">Categories</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/tracksuits" className="hover:text-[#dc2626] transition-colors">Wholesale Tracksuits</Link></li>
            <li><Link to="/sweatshirts" className="hover:text-[#dc2626] transition-colors">Heavyweight Hoodies</Link></li>
            <li><Link to="/activewear" className="hover:text-[#dc2626] transition-colors">Pro Activewear</Link></li>
            <li><Link to="/tshirts" className="hover:text-[#dc2626] transition-colors">Athletic Jerseys</Link></li>
            <li><Link to="/outerwear" className="hover:text-[#dc2626] transition-colors">Sports Outerwear</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-display text-lg font-black italic tracking-widest uppercase text-white mb-6">Company</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About Factory</Link></li>
            <li><Link to="/manufacturing" className="hover:text-white transition-colors">Our Production Line</Link></li>
            <li><Link to="/oem" className="hover:text-white transition-colors">Private Labeling</Link></li>
            <li><Link to="/certifications" className="hover:text-white transition-colors">ISO Certifications</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Customer Order Portal</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display text-lg font-black italic tracking-widest uppercase text-white mb-6">Contact B2B Desk</h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#dc2626] shrink-0 mt-0.5" />
              <span>Industrial Zone Phase 4, Global Export City</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[#dc2626] shrink-0" />
              <a href="mailto:export@dansports.com" className="hover:text-white transition-colors">export@dansports.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[#dc2626] shrink-0" />
              <a href="tel:+18003777678" className="hover:text-white transition-colors">+1 (800) DS-SPORT</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} DAAN Sports B2B Apparel Manufacturing. All Rights Reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <Link to="/returns" className="hover:text-white transition-colors">Return Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
