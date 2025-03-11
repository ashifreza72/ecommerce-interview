'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  recentProducts: {
    id: number;
    name: string;
    price: number;
    createdAt: string;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const products = (await response.json()) as Product[];

        // Calculate dashboard stats
        const dashboardStats: DashboardStats = {
          totalProducts: products.length,
          recentProducts: products
            .sort(
              (a: Product, b: Product) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
            .map((product: Product) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              createdAt: new Date(product.createdAt).toLocaleDateString(),
            })),
        };

        setStats(dashboardStats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[300px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center p-4 bg-red-100 text-red-700 rounded-md'>
        {error}
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {/* Product Stats Card */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Product Statistics</h2>
          <div className='text-4xl font-bold text-blue-600 mb-2'>
            {stats.totalProducts}
          </div>
          <p className='text-gray-600'>Total Products</p>
          <div className='mt-4'>
            <Link
              href='/admin/products'
              className='text-blue-600 hover:underline flex items-center'
            >
              Manage Products →
            </Link>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
          <div className='space-y-3'>
            <Link
              href='/admin/products/create'
              className='block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center'
            >
              Add New Product
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Recent Products</h2>
          <Link
            href='/admin/products'
            className='text-blue-600 hover:underline'
          >
            View All
          </Link>
        </div>

        {stats.recentProducts.length === 0 ? (
          <p className='text-gray-600'>No products available.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='py-2 px-4 text-left text-gray-500 font-medium'>
                    Name
                  </th>
                  <th className='py-2 px-4 text-left text-gray-500 font-medium'>
                    Price
                  </th>
                  <th className='py-2 px-4 text-left text-gray-500 font-medium'>
                    Added On
                  </th>
                  <th className='py-2 px-4 text-left text-gray-500 font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {stats.recentProducts.map((product) => (
                  <tr key={product.id} className='hover:bg-gray-50'>
                    <td className='py-3 px-4'>{product.name}</td>
                    <td className='py-3 px-4'>
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className='py-3 px-4'>{product.createdAt}</td>
                    <td className='py-3 px-4'>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className='text-blue-600 hover:underline'
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
