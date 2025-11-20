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
            src="/images/evs-minis-logo.png"
            alt="EVS MINIS Logo" 
            className="h-12 w-auto drop-shadow-lg group-hover:scale-110 transition-transform"
          />
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
                    <Link
                      to="/admin/ready-stock"
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3 py-1 rounded font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      📦 Pronta Entrega
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
