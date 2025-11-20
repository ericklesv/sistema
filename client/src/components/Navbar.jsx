import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DarkModeToggle } from './DarkModeToggle';

export function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b-4 border-blue-600 dark:border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='55' fill='%231e40af' stroke='%23999' stroke-width='3'/%3E%3Ctext x='60' y='75' font-size='48' font-weight='bold' text-anchor='middle' fill='white' font-family='Arial'%3EEV%3C/text%3E%3C/svg%3E"
            alt="EVS MINIS Logo" 
            className="w-14 h-14 drop-shadow-lg group-hover:scale-110 transition-transform"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">EVS</span>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">MINIS</span>
          </div>
        </Link>          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {user.username}
                </span>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-1 rounded font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      ⚙️ Admin
                    </Link>
                    <Link
                      to="/admin/miniaturas-base"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      📦 Miniaturas
                    </Link>
                    <Link
                      to="/admin/usa-stock"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-1 rounded font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      🚚 USA Stock
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold text-sm transition-colors shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            )}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
