'use client';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const productId = Number(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm productId={productId} isEditing={true} />
    </div>
  );
}