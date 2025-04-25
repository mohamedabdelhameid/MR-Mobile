// دالة لتحسين البحث عن المنتجات
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm.trim()) return products;

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  
  return products.filter(product => {
    // البحث في العنوان
    if (product.title?.toLowerCase().includes(normalizedSearchTerm)) return true;
    
    // البحث في الوصف
    if (product.description?.toLowerCase().includes(normalizedSearchTerm)) return true;
    
    // البحث في المواصفات
    if (product.specs?.some(spec => 
      spec.label?.toLowerCase().includes(normalizedSearchTerm) ||
      spec.value?.toLowerCase().includes(normalizedSearchTerm)
    )) return true;
    
    // البحث في اسم الماركة
    if (product.brandName?.toLowerCase().includes(normalizedSearchTerm)) return true;
    
    return false;
  });
};

// دالة لتصفية المنتجات حسب السعر
export const filterByPrice = (products, minPrice, maxPrice) => {
  return products.filter(product => {
    const price = product.price || 0;
    return price >= minPrice && (!maxPrice || price <= maxPrice);
  });
};

// دالة لتصفية المنتجات حسب الماركة
export const filterByBrand = (products, brandId) => {
  if (!brandId) return products;
  return products.filter(product => product.brand_id === brandId);
};

// دالة لترتيب المنتجات
export const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price-desc':
      return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sortedProducts;
  }
}; 