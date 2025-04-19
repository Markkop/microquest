import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { CooldownOption } from '../../db/database';

interface CooldownOptionsProps {
  options: CooldownOption[];
  selectedCooldown: number;
  onSelect: (minutes: number) => void;
  formatMinutes: (minutes: number) => string;
}

const CooldownOptions: React.FC<CooldownOptionsProps> = ({
  options,
  selectedCooldown,
  onSelect,
  formatMinutes,
}) => {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option, i) => (
        <motion.button
          key={i}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
            ${selectedCooldown === option.minutes
              ? 'bg-primary-100 border-primary-300 text-primary-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option.minutes);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Clock size={12} />
          <span>{formatMinutes(option.minutes)}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CooldownOptions;