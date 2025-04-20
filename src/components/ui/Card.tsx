import { motion } from "framer-motion";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  interactive = false,
  disabled = false,
  onClick,
}) => {
  const baseClasses =
    "p-4 rounded-lg shadow-sm border border-gray-100 bg-white";

  const cardClasses = `
    ${baseClasses}
    ${disabled ? "opacity-75" : ""}
    ${interactive && !disabled ? "hover:shadow-md" : ""}
    ${className}
  `.trim();

  const content = <div className={cardClasses}>{children}</div>;

  if (interactive && onClick) {
    return (
      <motion.div
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={!disabled ? onClick : undefined}
        className={`cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;
