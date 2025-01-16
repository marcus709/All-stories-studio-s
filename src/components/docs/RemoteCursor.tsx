import { motion } from "framer-motion";

interface RemoteCursorProps {
  color: string;
  position: { x: number; y: number };
  username: string;
}

export const RemoteCursor = ({ color, position, username }: RemoteCursorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 50,
      }}
    >
      <div
        className="relative flex items-center"
        style={{ transform: "translateY(-50%)" }}
      >
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          className="drop-shadow-md"
          style={{ color }}
        >
          <path
            d="M1 1L11.8033 11.8033C12.1362 12.1362 12.1362 12.6805 11.8033 13.0134L1 23.8167"
            strokeLinecap="round"
            fill={color}
          />
        </svg>
        <span
          className="ml-2 px-2 py-1 rounded-full text-xs text-white shadow-sm whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          {username}
        </span>
      </div>
    </motion.div>
  );
};