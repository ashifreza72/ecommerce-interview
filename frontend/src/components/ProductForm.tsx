'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductFormProps {
  productId?: number;
  isEditing?: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
}

export default function ProductForm({
  productId,
  isEditing = false,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  // Fetch product data if editing
  useEffect(() => {
    if (isEditing && productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }

          const product: Product = await response.json();
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price.toString());
          if (product.image) {
            setImagePreview(product.image);
          }
        } catch (err) {
          setError('Failed to load product data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !description || !price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (image) {
        formData.append('image', image);
      }

      // Determine URL and method based on whether we're creating or updating
      const url = productId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
      const method = productId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      setSuccess(
        productId
          ? 'Product updated successfully!'
          : 'Product created successfully!'
      );

      if (!productId) {
        // Reset form after successful creation
        setName('');
        setDescription('');
        setPrice('');
        setImage(null);
        setImagePreview(null);
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>
        {isEditing ? 'Edit Product' : 'Create New Product'}
      </h2>

      {error && (
        <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      {success && (
        <div className='mb-4 p-3 bg-green-100 text-green-700 rounded-md'>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-gray-700 mb-2'>
            Product Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='description' className='block text-gray-700 mb-2'>
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='price' className='block text-gray-700 mb-2'>
            Price ($)
          </label>
          <input
            type='number'
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step='0.01'
            min='0'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='image' className='block text-gray-700 mb-2'>
            Product Image
          </label>
          <input
            type='file'
            id='image'
            onChange={handleImageChange}
            accept='image/jpeg, image/png, image/jpg'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {imagePreview && (
            <div className='mt-2'>
              <Image
                src={imagePreview}
                alt='Preview'
                className='h-40 object-contain border rounded-md'
              />
            </div>
          )}
        </div>

        <div className='flex justify-between'>
          <button
            type='button'
            onClick={() => router.push('/admin/products')}
            className='py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className={`py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading
              ? 'Processing...'
              : isEditing
              ? 'Update Product'
              : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
