import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOrder, setSortOrder] = useState("price-low-high");
  const [priceFilter, setPriceFilter] = useState(null);
  const [colorFilter, setColorFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [brandFilter, setBrandFilter] = useState(null);
  
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };
  
  const handleSortChange = (sortValue) => {
    setSortOrder(sortValue);
  };
  
  const handlePriceFilter = (priceRange) => {
    setPriceFilter(priceRange);
  };
  
  const handleColorFilter = (color) => {
    setColorFilter(color);
  };
  
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };
  
  const handleBrandFilter = (brand) => {
    setBrandFilter(brand);
  };
  
  const clearPriceFilter = () => {
    setPriceFilter(null);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav 
            onPriceFilter={handlePriceFilter} 
            priceFilter={priceFilter}
            onColorFilter={handleColorFilter}
            colorFilter={colorFilter}
            onCategoryFilter={handleCategoryFilter}
            categoryFilter={categoryFilter}
            onBrandFilter={handleBrandFilter}
            brandFilter={brandFilter}
          />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner 
            itemsPerPageFromBanner={itemsPerPageFromBanner}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            priceFilter={priceFilter}
            onClearPriceFilter={clearPriceFilter}
          />
          <Pagination 
            itemsPerPage={itemsPerPage} 
            sortOrder={sortOrder} 
            priceFilter={priceFilter}
            colorFilter={colorFilter}
            categoryFilter={categoryFilter}
            brandFilter={brandFilter}
          />
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
