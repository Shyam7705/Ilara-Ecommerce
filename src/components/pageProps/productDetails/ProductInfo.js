import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/ilaraSlice";
import { trackAddToCart } from "../../../utils/analytics";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  
  if (!productInfo) {
    return <div className="text-center py-10">Product information not available.</div>;
  }
  
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName || "Product"}</h2>
      <p className="text-xl font-semibold">₹{productInfo.price || "0.00"}</p>
      <p className="text-base text-gray-600">{productInfo.des || "No description available."}</p>
      <p className="text-sm">Be the first to leave a review.</p>
      <p className="font-medium text-lg">
        <span className="font-normal">Color:</span> {productInfo.color || "Mixed"}
      </p>
      {productInfo.brand && (
        <p className="font-medium text-lg">
          <span className="font-normal">Brand:</span> {productInfo.brand}
        </p>
      )}
      {productInfo.category && (
        <p className="font-medium text-lg">
          <span className="font-normal">Category:</span> {productInfo.category}
        </p>
      )}
      <button
        onClick={() => {
          const cartItem = {
            _id: productInfo.id || productInfo._id,
            name: productInfo.productName,
            quantity: 1,
            image: productInfo.img,
            badge: productInfo.badge,
            price: productInfo.price,
            colors: productInfo.color,
            category: productInfo.category,
            brand: productInfo.brand,
          };
          
          dispatch(addToCart(cartItem));
          
          // Track add to cart event
          trackAddToCart(cartItem);
        }}
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>
      <p className="font-normal text-sm">
        <span className="text-base font-medium">Tags:</span> Featured, {productInfo.category || "General"} | SKU: {productInfo._id || "N/A"}
      </p>
    </div>
  );
};

export default ProductInfo;
