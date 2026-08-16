import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Factory, Award } from 'lucide-react';
import SEO from '../Components/SEO/SEO';

const GenericPage = () => {
  const location = useLocation();
  const rawPath = location.pathname.substring(1).replace('-', ' ') || 'Page';
  const pageTitle = rawPath.toUpperCase();

  return (
    <div className="pt-32 pb-24 min-h-[80vh] flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-4 text-center">
      <SEO 
        title={`${pageTitle} — DAAN Sports B2B Manufacturing`}
        description={`Learn more about DAAN Sports ${pageTitle}. High capacity sportswear manufacturing, OEM private labeling, and ISO certified production.`}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: pageTitle, url: location.pathname }
        ]}
      />
      <div className="max-w-3xl bg-[#18181b] border border-white/10 p-10 md:p-16 rounded-xl shadow-2xl space-y-6">

        
        <span className="inline-block bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 transform -skew-x-12">
          <span className="skew-x-12 inline-block">DAAN SPORTS B2B APPAREL</span>
        </span>

        <h1 className="text-4xl md:text-6xl font-display font-black italic uppercase tracking-wider text-white">
          {pageTitle}
        </h1>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Welcome to the <strong>{pageTitle}</strong> section. DAAN Sports Manufacturing provides end-to-end custom apparel production, OEM labeling, technical fabric sourcing (220 - 380 GSM), and direct airway shipping for global brands.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-bold uppercase tracking-wider">
          <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded text-zinc-300 flex flex-col items-center gap-2">
            <Factory className="text-[#dc2626]" size={20} />
            <span>50K+ Monthly Capacity</span>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded text-zinc-300 flex flex-col items-center gap-2">
            <Award className="text-[#dc2626]" size={20} />
            <span>ISO Certified Plant</span>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded text-zinc-300 flex flex-col items-center gap-2">
            <ShieldCheck className="text-[#dc2626]" size={20} />
            <span>Strict QC Standards</span>
          </div>
        </div>

        <div className="pt-6">
          <Link to="/tracksuits" className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-8 py-3.5 font-display font-black italic uppercase text-xs tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors transform -skew-x-12 shadow-xl">
            <span className="skew-x-12 inline-block">View Wholesale Catalog</span>
            <ArrowRight size={16} className="skew-x-12" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default GenericPage;
