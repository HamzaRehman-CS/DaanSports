import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronDown, ArrowRight, Grid, X, Menu } from 'lucide-react';
import { ShopContext } from '../../Context/ShopContext';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { API_URL } from '../../config';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const { getTotalCartItems } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Categories fetch error:", err));
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-500">
      <nav className={`w-full transition-all duration-500 border-b ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl py-3.5 border-white/10 shadow-2xl' : 'bg-[#0a0a0a]/80 backdrop-blur-md py-5 border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white text-[#0a0a0a] font-serif text-2xl font-black italic flex items-center justify-center transform -skew-x-12 group-hover:bg-[#dc2626] group-hover:text-white transition-all duration-300 shadow-lg">
              DS
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl sm:text-[2rem] font-black tracking-tight uppercase text-white leading-none">
                DAAN
              </span>
              <span className="font-sans text-[11px] sm:text-xs font-bold tracking-widest text-zinc-400 uppercase leading-none">
                Sports
              </span>
            </div>
          </Link>

          {/* Clean Main Navigation: Home & Categories */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest relative">
            <Link 
              to="/" 
              className={`hover:text-white transition-colors relative py-2 ${location.pathname === '/' ? 'text-white font-extrabold' : 'text-zinc-400'}`}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#dc2626]"></span>
              )}
            </Link>

            {/* Categories Dropdown Toggle */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1.5 hover:text-white transition-colors py-2 cursor-pointer ${categoriesOpen ? 'text-white' : 'text-zinc-400'}`}
              >
                <span>Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-300 text-[#dc2626] ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sophisticated Golden Ratio Mega Menu Dropdown */}
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-[680px] bg-[#141416]/95 border border-white/15 rounded-xl p-6 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-6 animate-fade-up">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-serif font-bold text-white uppercase border-b border-white/10 pb-2">
                      <Grid size={14} className="text-[#dc2626]" />
                      <span>Product Categories</span>
                    </div>

                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                      {categories.map((cat) => (
                        <Link 
                          key={cat.id} 
                          to={`/category/${cat.slug || cat.name.toLowerCase()}`}
                          className="group p-3 rounded-lg bg-[#0a0a0a]/50 hover:bg-[#dc2626]/10 border border-white/5 hover:border-[#dc2626]/40 flex items-start gap-3 transition-all"
                        >
                          <img src={cat.banner} alt={cat.name} className="w-10 h-10 object-cover rounded bg-[#18181b]" />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#dc2626] transition-colors">{cat.name}</h4>
                            <p className="text-[10px] text-zinc-400 line-clamp-1">{cat.description}</p>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cat.subcategories.slice(0, 3).map((sub, idx) => (
                                  <span key={idx} className="text-[9px] bg-white/5 text-zinc-300 px-1.5 py-0.5 rounded">{sub}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                      <span className="text-golden-small text-[#dc2626] font-bold block">DIRECT FACTORY SUPPLIER</span>
                      <h3 className="font-serif font-bold text-xl text-white">Full Custom OEM & Private Labeling</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Request custom GSM weights, 3D embroidery, heat-transfer tags, and bespoke sportswear packaging.
                      </p>
                    </div>

                    <Link 
                      to="/contact" 
                      className="relative z-10 mt-4 bg-white text-[#0a0a0a] px-4 py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors transform -skew-x-6 flex items-center justify-between"
                    >
                      <span className="skew-x-6">Get Factory Quote</span>
                      <ArrowRight size={14} className="skew-x-6" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons: Search Bar, Cart, Login */}
          <div className="flex items-center gap-4">
            
            {/* Search Pill */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-[#141416] border border-white/10 px-3 py-1.5 rounded-full text-xs text-white w-48 focus-within:w-60 focus-within:border-[#dc2626] transition-all duration-300">
              <Search size={14} className="text-zinc-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search products or GSM..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-500 text-xs font-medium"
              />
            </form>

            {/* Cart Widget */}
            <Link to="/cart" className="relative p-2 bg-[#141416] border border-white/10 hover:border-white/30 text-white rounded-lg transition-colors flex items-center gap-2 group">
              <ShoppingCart size={18} className="group-hover:text-[#dc2626] transition-colors" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Cart</span>
              {getTotalCartItems() > 0 && (
                <span className="bg-[#dc2626] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {getTotalCartItems()}
                </span>
              )}
            </Link>

            {/* Clerk Authentication Integration */}
            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-white text-[#0a0a0a] px-4 py-2 font-bold uppercase tracking-wider text-xs hover:bg-[#dc2626] hover:text-white transition-all transform -skew-x-6 cursor-pointer shadow-md">
                    <span className="skew-x-6 inline-block">Login / Register</span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="bg-[#141416] border border-white/10 p-1.5 rounded-lg flex items-center">
                  <UserButton afterSignOutUrl="/" showName={true} />
                </div>
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-40 pt-28 px-8 space-y-6 animate-fade-up">
          <div className="flex flex-col gap-4 text-lg font-serif font-bold uppercase tracking-wider">
            <Link to="/" className="text-white border-b border-white/10 pb-3">Home</Link>
            <div className="text-zinc-400 font-sans text-xs font-bold uppercase tracking-widest text-[#dc2626] pt-2">All Categories</div>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug || cat.name.toLowerCase()}`} className="text-zinc-300 hover:text-white text-base pl-2 border-b border-white/5 pb-2 flex justify-between items-center">
                <span>{cat.name}</span>
                <ArrowRight size={14} className="text-[#dc2626]" />
              </Link>
            ))}
            <Link to="/orders" className="text-zinc-300 border-b border-white/10 pb-3 pt-2">Track Orders 🚚</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
