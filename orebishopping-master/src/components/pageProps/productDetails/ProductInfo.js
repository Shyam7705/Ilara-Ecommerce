import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-xl font-semibold">₹{productInfo.price}</p>
      <p className="text-base text-gray-600">{productInfo.des}</p>
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
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
            })
          )
        }
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
