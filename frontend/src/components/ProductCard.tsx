'use client';
import Image from 'next/image';

interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string | null;
}

export default function ProductCard({
  id, // Keep the id as is
  name,
  description,
  price,
  image,
}: ProductProps) {
  // Convert price to number and handle potential non-numeric values
  const numericPrice =
    typeof price === 'number' ? price : parseFloat(price as string);
  const formattedPrice = !isNaN(numericPrice)
    ? numericPrice.toFixed(2)
    : '0.00';

  return (
    <div className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1'>
      <div className='relative h-48 w-full flex justify-center items-center pt-4'>
        {image ? (
          <div className='relative w-3/4 h-40 flex justify-center'>
            <Image
              src={image}
              alt={name}
              width={200}
              height={150}
              className='object-contain rounded-t-2xl'
            />
          </div>
        ) : (
          <div className='flex items-center justify-center h-40 bg-gray-200 w-3/4'>
            <span className='text-gray-500 text-lg font-medium'>
              No Image Available
            </span>
          </div>
        )}
      </div>
      <div className='p-5'>
        <h3 className='font-semibold text-xl text-gray-800 mb-2'>{name}</h3>
        <p className='text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed'>
          {description}
        </p>
        <div className='flex justify-between items-center'>
          <span className='font-bold text-blue-600 text-lg'>
            ${formattedPrice}
          </span>
          <button className='bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg'>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
