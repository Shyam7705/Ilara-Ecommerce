import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from "./shopBy/Price";

const ShopSideNav = ({ 
  onPriceFilter, 
  priceFilter,
  onColorFilter,
  colorFilter,
  onCategoryFilter,
  categoryFilter,
  onBrandFilter,
  brandFilter,
}) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category 
        icons={false}
        onCategoryFilter={onCategoryFilter}
        categoryFilter={categoryFilter}
      />
      <Color 
        onColorFilter={onColorFilter}
        colorFilter={colorFilter}
      />
      <Brand 
        onBrandFilter={onBrandFilter}
        brandFilter={brandFilter}
      />
      <Price 
        onPriceFilter={onPriceFilter} 
        priceFilter={priceFilter} 
      />
    </div>
  );
};

export default ShopSideNav;
