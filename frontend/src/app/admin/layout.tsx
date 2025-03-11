'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTachometerAlt, FaBox, FaSignOutAlt } from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');

    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  // If on login page or loading, just render children
  if (pathname === '/admin/login' || isLoading) {
    return <>{children}</>;
  }

  // For authenticated admin pages, render with sidebar
  if (isAuthenticated) {
    return (
      <div className='flex min-h-screen bg-gray-100 m-0 p-0'>
        {/* Sidebar */}
        <div className='w-64 bg-gray-800 text-white sticky top-0 h-screen m-0 p-0'>
          <div className='p-4 text-xl font-bold border-b border-gray-700'>
            Admin Panel
          </div>
          <nav className='mt-6'>
            <ul>
              <li>
                <Link
                  href='/admin/dashboard'
                  className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                    pathname === '/admin/dashboard' ? 'bg-gray-700' : ''
                  }`}
                >
                  <FaTachometerAlt className='mr-3' />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href='/admin/products'
                  className={`flex items-center px-4 py-3 hover:bg-gray-700 ${
                    pathname.includes('/admin/products') ? 'bg-gray-700' : ''
                  }`}
                >
                  <FaBox className='mr-3' />
                  Products
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center px-4 py-3 hover:bg-gray-700 text-left'
                >
                  <FaSignOutAlt className='mr-3' />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className='flex-1 overflow-auto sticky top-0 right-0 m-0 p-0'>
          {children}
        </div>
      </div>
    );
  }

  // Fallback
  return <>{children}</>;
}
