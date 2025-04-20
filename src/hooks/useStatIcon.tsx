import { Dumbbell, Zap } from "lucide-react";
import React from "react";

// Define Heart component since it's not available in lucide-react
const Heart: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
};

type StatType = "strength" | "vitality" | "focus" | string;

interface StatIconOptions {
  size?: number;
  withColor?: boolean;
}

export const useStatIcon = () => {
  const getStatIcon = (
    stat: StatType,
    options: StatIconOptions = { size: 16, withColor: true }
  ) => {
    const { size = 16, withColor = true } = options;

    const colorClasses = {
      strength: "text-error-500",
      vitality: "text-success-500",
      focus: "text-warning-500",
    };

    const className =
      withColor && stat in colorClasses
        ? colorClasses[stat as keyof typeof colorClasses]
        : "";

    switch (stat) {
      case "strength":
        return <Dumbbell size={size} className={className} />;
      case "vitality":
        return <Heart size={size} className={className} />;
      case "focus":
        return <Zap size={size} className={className} />;
      default:
        return null;
    }
  };

  return { getStatIcon };
};
