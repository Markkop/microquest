import { Coins } from "lucide-react";
import React from "react";
import { useGame } from "../contexts/GameContext";
import Button from "./ui/Button";

interface AddCreditsButtonProps {
  amount?: number;
}

const AddCreditsButton: React.FC<AddCreditsButtonProps> = ({ amount = 10 }) => {
  const { addCredits } = useGame();

  const handleAddCredits = () => {
    addCredits(amount);
  };

  return (
    <Button
      variant="gradient"
      className="py-1 px-3 rounded-full text-sm font-medium shadow-sm"
      onClick={handleAddCredits}
      icon={<Coins size={14} />}
    >
      +{amount}
    </Button>
  );
};

export default AddCreditsButton;
