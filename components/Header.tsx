import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const base = "px-4 py-2 rounded-full font-medium transition-colors duration-200";
    return location.pathname === path
      ? `${base} bg-white text-blue-600 shadow-sm`
      : `${base} text-blue-800 hover:bg-blue-300/50`;
  };

  return (
    <header className="bg-blue-200 text-blue-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Simulasi Djikstra</span>
          </div>
          <nav className="flex space-x-2">
            <Link to="/" className={getLinkClass('/')}>Dashboard</Link>
            <Link to="/about" className={getLinkClass('/about')}>Tentang</Link>
            <Link to="/users" className={getLinkClass('/users')}>Info</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;