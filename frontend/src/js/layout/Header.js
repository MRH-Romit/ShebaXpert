import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/login';

    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'service_provider':
        return '/provider';
      default:
        return '/user';
    }
  };

  return (
    <header className={`shadow-md sticky top-0 z-50 transition-all ${scrolled ? 'bg-white' : 'bg-white bg-opacity-95'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/justlogo.png" 
              alt="সেবাXpert লোগো" 
              className="h-10 w-auto mr-2" 
            />
            <h1 className="text-2xl font-bold text-green-600">সেবাXpert</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              হোম
            </Link>
            <Link to="/map" className="text-gray-700 hover:text-green-600 transition-colors">
              সেবা খুঁজুন
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  ড্যাশবোর্ড
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-green-600">
                    <img 
                      src={user.profilePicture || '/assets/default-avatar.png'} 
                      alt="প্রোফাইল" 
                      className="h-8 w-8 rounded-full object-cover mr-2"
                    />
                    {user.name}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link 
                      to="/profile/edit" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      প্রোফাইল সম্পাদনা
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      লগ আউট
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-600 transition-colors">
                  লগইন
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
                >
                  সাইন আপ করুন
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-2 border-t">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              হোম
            </Link>
            <Link 
              to="/map" 
              className="block py-2 text-gray-700 hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              সেবা খুঁজুন
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="block py-2 text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ড্যাশবোর্ড
                </Link>
                <Link 
                  to="/profile/edit" 
                  className="block py-2 text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  প্রোফাইল সম্পাদনা
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
                >
                  লগ আউট
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  লগইন
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  সাইন আপ করুন
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;