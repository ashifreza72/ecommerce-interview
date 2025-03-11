import Products from '@/components/Products';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Our Store</h1>
        <Products />
      </div>
    </div>
  );
}
