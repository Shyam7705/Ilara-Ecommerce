import React, { useState } from "react";
// import { FaPlus } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";

const Category = ({ onCategoryFilter, categoryFilter }) => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);
  const items = [
    {
      _id: 990,
      title: "Accessories",
      icons: true,
    },
    {
      _id: 991,
      title: "Electronics",
    },
    {
      _id: 992,
      title: "Furniture",
    },
    {
      _id: 993,
      title: "Others",
    },
  ];
  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {items.map(({ _id, title, icons }) => {
            const isActive = categoryFilter === title;
            return (
              <li
                key={_id}
                onClick={() => {
                  if (isActive) {
                    onCategoryFilter(null);
                  } else {
                    onCategoryFilter(title);
                  }
                }}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor hover:border-gray-400 duration-300 ${
                  isActive ? "text-primeColor font-semibold" : ""
                }`}
              >
                {title}
                {icons && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSubCatOne(!showSubCatOne);
                    }}
                    className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
                  >
                    <ImPlus />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Category;
