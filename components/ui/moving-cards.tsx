"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Card {
  id: number;
  title: string;
  description: string;
}

export const MovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
}: {
  items: Card[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duplicateItems, setDuplicateItems] = useState<Card[]>([]);

  useEffect(() => {
    setDuplicateItems([...items, ...items]);
  }, [items]);

  const getSpeed = () => {
    switch (speed) {
      case "fast":
        return 20;
      case "normal":
        return 40;
      case "slow":
        return 60;
      default:
        return 40;
    }
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden w-full"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <motion.div
        className="flex gap-4 py-4"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: getSpeed(),
          ease: "linear",
          repeat: Infinity,
        }}
        {...(pauseOnHover && {
          whileHover: { animationPlayState: "paused" },
        })}
      >
        {duplicateItems.map((item, idx) => (
          <div
            key={item.id + idx}
            className="relative flex-shrink-0 w-[300px] h-[200px] rounded-xl bg-neutral-100 dark:bg-neutral-900 p-6"
          >
            <div className="font-semibold text-lg mb-2">{item.title}</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {item.description}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};