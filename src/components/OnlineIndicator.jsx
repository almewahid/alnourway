import React from "react";
import { motion } from "framer-motion";

export default function OnlineIndicator({ isOnline = false, size = "md" }) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  if (!isOnline) return null;

  return (
    <div className="relative inline-flex items-center">
      <motion.div
        className={`${sizes[size]} rounded-full bg-emerald-500 border-2 border-white shadow-lg`}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className={`absolute ${sizes[size]} rounded-full bg-emerald-400 opacity-75`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.75, 0, 0.75]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}