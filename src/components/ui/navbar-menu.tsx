import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
  className,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  let closeTimeout: ReturnType<typeof setTimeout>;

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setActive(null);
    }, 300); // 300ms delay before closing
  };

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
    }
    setActive(item);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className={`cursor-pointer hover:opacity-[0.9] ${className || 'text-white'}`}
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
              className="absolute left-1/2 transform -translate-x-1/2"
              onMouseEnter={() => setActive(item)}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] shadow-xl"
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
    <nav
      className="relative flex justify-center space-x-4"
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, onClick, ...rest }: any) => {
  return (
    <div
      onClick={onClick}
      className="text-neutral-700 hover:text-black cursor-pointer"
      {...rest}
    >
      {children}
    </div>
  );
};