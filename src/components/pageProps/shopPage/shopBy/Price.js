import React from "react";
import NavTitle from "./NavTitle";

const Price = ({ onPriceFilter, priceFilter }) => {
  const priceList = [
    {
      _id: 950,
      priceOne: 0,
      priceTwo: 2000,
    },
    {
      _id: 951,
      priceOne: 2000,
      priceTwo: 4000,
    },
    {
      _id: 952,
      priceOne: 4000,
      priceTwo: 6000,
    },
    {
      _id: 953,
      priceOne: 6000,
      priceTwo: 10000,
    },
    {
      _id: 954,
      priceOne: 10000,
      priceTwo: 15000,
    },
    {
      _id: 955,
      priceOne: 15000,
      priceTwo: 20000,
    },
    {
      _id: 956,
      priceOne: 20000,
      priceTwo: 30000,
    },
  ];
  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {priceList.map((item) => {
            const isActive = priceFilter && priceFilter.priceOne === item.priceOne && priceFilter.priceTwo === item.priceTwo;
            return (
              <li
                key={item._id}
                onClick={() => {
                  if (isActive) {
                    onPriceFilter(null);
                  } else {
                    onPriceFilter(item);
                  }
                }}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer ${
                  isActive ? "text-primeColor font-semibold" : ""
                }`}
              >
                ₹{item.priceOne.toLocaleString()} - ₹{item.priceTwo.toLocaleString()}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Price;
