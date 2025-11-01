import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Color = ({ onColorFilter, colorFilter }) => {
  const [showColors, setShowColors] = useState(true);
  const colors = [
    {
      _id: 9001,
      title: "Black",
      base: "#000000",
    },
    {
      _id: 9002,
      title: "White",
      base: "#ffffff",
    },
    {
      _id: 9003,
      title: "Gray",
      base: "#a3a3a3",
    },
    {
      _id: 9004,
      title: "Mixed",
      base: "#6366f1",
    },
  ];

  return (
    <div>
      <div
        onClick={() => setShowColors(!showColors)}
        className="cursor-pointer"
      >
        <NavTitle title="Shop by Color" icons={true} />
      </div>
      {showColors && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {colors.map((item) => {
              const isActive = colorFilter === item.title;
              return (
                <li
                  key={item._id}
                  onClick={() => {
                    if (isActive) {
                      onColorFilter(null);
                    } else {
                      onColorFilter(item.title);
                    }
                  }}
                  className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer hover:text-primeColor hover:border-gray-400 duration-300 ${
                    isActive ? "text-primeColor font-semibold" : ""
                  }`}
                >
                  <span
                    style={{ background: item.base }}
                    className={`w-3 h-3 rounded-full border ${item.title === "White" ? "border-gray-300" : ""}`}
                  ></span>
                  {item.title}
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Color;
