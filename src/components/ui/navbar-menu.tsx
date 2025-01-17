import React from "react";
import { motion } from "framer-motion";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div 
      onMouseEnter={() => setActive(item)}
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:opacity-[0.9]"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div 
              className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4"
              onMouseEnter={(e) => {
                e.stopPropagation();
                setActive(item);
              }}
            >
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.2] shadow-xl"
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  setActive(null);
                }}
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav className="relative flex justify-center space-x-4">
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, onClick, ...rest }: any) => {
  return (
    <div
      onClick={onClick}
      className="text-neutral-200 hover:text-white cursor-pointer"
      {...rest}
    >
      {children}
    </div>
  );
};