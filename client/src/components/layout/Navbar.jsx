import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import { openAuthModal } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';

const links = [
  { to: '/seasonal', label: 'Seasonal' },
  { to: '/top', label: 'Top' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 200 50" className="h-8 w-auto text-luffy-text">
              <circle cx="25" cy="18" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="25" cy="32" rx="18" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="15" y="19" width="20" height="2" fill="#e63946" rx="1" />
              <text x="48" y="34" fontFamily="'Bebas Neue',Impact,sans-serif" fontSize="28" fill="currentColor">LUFFY</text>
            </svg>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === l.to ? 'text-luffy-red' : 'text-luffy-muted hover:text-luffy-text'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/search" className="p-2 text-luffy-muted hover:text-luffy-text transition-colors">
              <FiSearch className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="w-8 h-8 rounded-full bg-luffy-red/20 flex items-center justify-center text-luffy-red text-sm font-bold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </Link>
                <button onClick={() => dispatch(logout())} className="hidden md:flex p-2 text-luffy-muted hover:text-luffy-text transition-colors">
                  <FiLogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => dispatch(openAuthModal('login'))} className="px-4 py-2 bg-luffy-red text-white text-sm font-medium rounded hover:shadow-glow-red transition-all duration-200">
                Sign In
              </button>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-luffy-text">
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute right-0 top-16 w-64 glass border-l border-white/5 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block text-luffy-muted hover:text-luffy-text transition-colors">
                {l.label}
              </Link>
            ))}
            <hr className="border-white/5" />
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-luffy-muted hover:text-luffy-text transition-colors">Profile</Link>
                <Link to="/watchlist" onClick={() => setMobileOpen(false)} className="block text-luffy-muted hover:text-luffy-text transition-colors">Watchlist</Link>
                <Link to="/favorites" onClick={() => setMobileOpen(false)} className="block text-luffy-muted hover:text-luffy-text transition-colors">Favorites</Link>
              </>
            ) : (
              <button onClick={() => { dispatch(openAuthModal('login')); setMobileOpen(false); }} className="block text-luffy-red transition-colors">Sign In</button>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

function BottomNav() {
  const location = useLocation();
  const items = [
    { to: '/', icon: FiMenu, label: 'Home' },
    { to: '/search', icon: FiSearch, label: 'Search' },
    { to: '/seasonal', icon: FiMenu, label: 'Seasonal' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-white/5">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
              location.pathname === item.to ? 'text-luffy-red' : 'text-luffy-muted'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
