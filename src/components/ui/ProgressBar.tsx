import { motion } from "framer-motion";
import React from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  height?: string;
  className?: string;
  barClassName?: string;
  animated?: boolean;
  duration?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  height = "h-4",
  className = "",
  barClassName = "",
  animated = true,
  duration = 0.5,
}) => {
  // Calculate percentage
  const percentage = Math.min(100, (value / max) * 100);

  const baseClasses = `${height} bg-gray-200 rounded-full overflow-hidden`;
  const combinedClasses = `${baseClasses} ${className}`;

  const barBaseClasses =
    "h-full bg-gradient-to-r from-primary-500 to-accent-500";
  const combinedBarClasses = `${barBaseClasses} ${barClassName}`;

  return (
    <div className={combinedClasses}>
      {animated ? (
        <motion.div
          className={combinedBarClasses}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration }}
        />
      ) : (
        <div
          className={combinedBarClasses}
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  );
};

export default ProgressBar;
