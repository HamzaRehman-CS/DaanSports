import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronDown, ArrowRight, Grid, X, Menu, Heart, User } from 'lucide-react';
import { ShopContext } from '../../Context/ShopContext';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { API_URL } from '../../config';
import DsLogo from './DsLogo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [announcementText, setAnnouncementText] = useState("FREE SHIPPING ON ORDERS OVER $99 | LIMITED TIME ONLY!");
  const { getTotalCartItems } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
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

    fetch(`${API_URL}/cms`)
      .then(res => res.json())
      .then(data => {
        if (data && data.announcementText) {
          setAnnouncementText(data.announcementText);
        }
      })
      .catch(err => console.error("CMS fetch error:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      
      {/* Top Announcement Bar matching Reference Design */}
      <div className="bg-[#050505] border-b border-white/10 text-zinc-300 text-[10px] md:text-xs tracking-wider uppercase py-1.5 px-4 text-center font-semibold overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>{announcementText}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-300 border-b ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl py-3 border-white/10 shadow-2xl' : 'bg-[#0a0a0a]/90 backdrop-blur-md py-4 border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center gap-4 lg:gap-8">
          
          {/* DS Athletic Logo */}
          <Link to="/" className="flex items-center group shrink-0" style={{ textDecoration: 'none' }}>
            <DsLogo />
          </Link>

          {/* Navigation Links matching Reference Design */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold uppercase tracking-wider">
            <Link 
              to="/" 
              className={`hover:text-white transition-colors relative py-1 ${location.pathname === '/' ? 'text-white font-extrabold' : 'text-zinc-400'}`}
            >
              HOME
              {location.pathname === '/' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#dc2626]"></span>
              )}
            </Link>

            <Link 
              to="/category/all" 
              className={`hover:text-white transition-colors relative py-1 ${location.pathname.startsWith('/category') && !categoriesOpen ? 'text-white font-extrabold' : 'text-zinc-400'}`}
            >
              SHOP
            </Link>

            {/* Categories Dropdown Toggle */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1 hover:text-white transition-colors py-1 cursor-pointer ${categoriesOpen ? 'text-white' : 'text-zinc-400'}`}
              >
                <span>CATEGORIES</span>
                <ChevronDown size={13} className={`transition-transform duration-300 text-zinc-400 group-hover:text-white ${categoriesOpen ? 'rotate-180 text-white' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-[680px] bg-[#141416]/98 border border-white/15 rounded-xl p-6 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-6 animate-fade-up">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase border-b border-white/10 pb-2">
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
                            <h4 className="font-bold text-sm text-white group-hover:text-[#dc2626] transition-colors">{cat.name}</h4>
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
                      <span className="text-[10px] text-[#dc2626] font-bold block">DIRECT FACTORY SUPPLIER</span>
                      <h3 className="font-bold text-lg text-white">Full Custom OEM & Private Labeling</h3>
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

            <Link to="/category/hoodies" className="hover:text-white text-zinc-400 transition-colors py-1">
              NEW ARRIVALS
            </Link>

            <Link to="/category/tracksuits" className="hover:text-white text-zinc-400 transition-colors py-1">
              BEST SELLERS
            </Link>

            <Link to="/about" className="hover:text-white text-zinc-400 transition-colors py-1">
              ABOUT US
            </Link>

            <Link to="/contact" className="hover:text-white text-zinc-400 transition-colors py-1">
              CONTACT
            </Link>
          </div>

          {/* Right Action Bar matching Reference Design */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            
            {/* Search Box */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-[#18181b] border border-white/15 px-3.5 py-1.5 rounded-md text-xs text-white w-44 md:w-56 focus-within:w-64 focus-within:border-white transition-all duration-300">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-400 text-xs font-medium"
              />
              <button type="submit" aria-label="Search" className="text-zinc-400 hover:text-white shrink-0">
                <Search size={14} />
              </button>
            </form>

            {/* Account / Login */}
            <div className="flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-zinc-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" title="Account">
                    <User size={18} />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="p-1">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>

            {/* Wishlist Link */}
            <Link to="/category/all" className="text-zinc-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:block" title="Wishlist">
              <Heart size={18} />
            </Link>

            {/* Shopping Cart Icon with Badge */}
            <Link to="/cart" className="relative text-zinc-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors group" title="Cart">
              <ShoppingCart size={19} className="group-hover:text-white transition-colors" />
              <span className="absolute top-1 right-0.5 bg-white text-[#0a0a0a] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-black">
                {getTotalCartItems()}
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-40 pt-28 px-8 space-y-6 animate-fade-up overflow-y-auto max-h-screen">
          <form onSubmit={handleSearch} className="flex items-center bg-[#18181b] border border-white/20 px-4 py-2.5 rounded-lg text-sm text-white w-full">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-400 text-sm"
            />
            <button type="submit" aria-label="Search" className="text-zinc-400 hover:text-white">
              <Search size={16} />
            </button>
          </form>

          <div className="flex flex-col gap-4 text-base font-bold uppercase tracking-wider">
            <Link to="/" className="text-white border-b border-white/10 pb-3">Home</Link>
            <Link to="/category/all" className="text-zinc-300 border-b border-white/10 pb-3">Shop All</Link>
            <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest text-[#dc2626] pt-1">Categories</div>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug || cat.name.toLowerCase()}`} className="text-zinc-300 hover:text-white text-sm pl-2 border-b border-white/5 pb-2 flex justify-between items-center">
                <span>{cat.name}</span>
                <ArrowRight size={14} className="text-[#dc2626]" />
              </Link>
            ))}
            <Link to="/category/hoodies" className="text-zinc-300 border-b border-white/10 pb-3">New Arrivals</Link>
            <Link to="/category/tracksuits" className="text-zinc-300 border-b border-white/10 pb-3">Best Sellers</Link>
            <Link to="/about" className="text-zinc-300 border-b border-white/10 pb-3">About Us</Link>
            <Link to="/contact" className="text-zinc-300 border-b border-white/10 pb-3">Contact</Link>
            <Link to="/orders" className="text-zinc-300 border-b border-white/10 pb-3">Track Orders 🚚</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
