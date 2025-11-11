import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import { paginationItems, SplOfferData } from "../../constants";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    setPrevLocation(location.pathname);
    
    // Check if product data is in location.state
    if (location.state?.item) {
      setProductInfo(location.state.item);
      return;
    }

    // If not in state, try to find product from URL
    const productId = location.pathname.split("/product/")[1];
    if (productId) {
      // Combine all products
      const allProducts = [...paginationItems, ...SplOfferData];
      
      // Find product by matching the ID (product name lowercase, spaces removed)
      const foundProduct = allProducts.find((product) => {
        if (!product || !product.productName) return false;
        const productIdFromName = product.productName.toLowerCase().replace(/\s+/g, "");
        return productIdFromName === productId;
      });

      if (foundProduct) {
        setProductInfo(foundProduct);
      } else {
        // If product not found and we're not already on shop page, redirect to shop page
        if (location.pathname !== "/shop") {
          navigate("/shop");
        }
      }
    } else if (location.pathname.startsWith("/product/")) {
      // If we're on a product page but no ID found, redirect to shop
      if (location.pathname !== "/shop") {
        navigate("/shop");
      }
    }
  }, [location.pathname, location.state, navigate]);

  // Show loading or redirect if product not found
  if (!productInfo) {
    return (
      <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
        <div className="max-w-container mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            <ProductsOnSale />
          </div>
          <div className="h-full xl:col-span-2">
            <img
              className="w-full h-full object-cover"
              src={productInfo.img}
              alt={productInfo.productName || "Product"}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
