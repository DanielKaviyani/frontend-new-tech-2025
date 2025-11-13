import { useState, useDeferredValue, useMemo } from 'react';

// داده‌های نمونه
const PRODUCTS = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
}));

function Dashboard() {
  const [search, setSearch] = useState('');

  // این مقدار با تاخیر در پس‌زمینه به‌روزرسانی می‌شود
  const deferredSearch = useDeferredValue(search, '');

  // فیلتر کردن لیست محصولات بر اساس deferredSearch
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(deferredSearch.toLowerCase())
    );
  }, [deferredSearch]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Dashboard</h2>
      <title>this is title test</title>
      <meta name="description" content="Product dashboard" />
      
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '300px', marginBottom: '20px' }}
      />

      <p>Showing {filteredProducts.length} products</p>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;