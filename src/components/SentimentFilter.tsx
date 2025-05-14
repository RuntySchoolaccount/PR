import React from 'react';
import { SmilePlus, Meh, Frown } from 'lucide-react';
import { motion } from 'framer-motion';

interface SentimentFilterProps {
  selectedSentiments: ('Positive' | 'Neutral' | 'Negative')[];
  onChange: (sentiments: ('Positive' | 'Neutral' | 'Negative')[]) => void;
}

const SentimentFilter: React.FC<SentimentFilterProps> = ({ 
  selectedSentiments, 
  onChange 
}) => {
  const handleToggle = (sentiment: 'Positive' | 'Neutral' | 'Negative') => {
    if (selectedSentiments.includes(sentiment)) {
      onChange(selectedSentiments.filter(s => s !== sentiment));
    } else {
      onChange([...selectedSentiments, sentiment]);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2">Sentiment Filter</label>
      <div className="flex space-x-3">
        <SentimentButton 
          label="Positive" 
          icon={<SmilePlus className="h-5 w-5" />}
          color="green"
          isSelected={selectedSentiments.includes('Positive')}
          onClick={() => handleToggle('Positive')}
        />
        <SentimentButton 
          label="Neutral" 
          icon={<Meh className="h-5 w-5" />}
          color="yellow"
          isSelected={selectedSentiments.includes('Neutral')}
          onClick={() => handleToggle('Neutral')}
        />
        <SentimentButton 
          label="Negative" 
          icon={<Frown className="h-5 w-5" />}
          color="red"
          isSelected={selectedSentiments.includes('Negative')}
          onClick={() => handleToggle('Negative')}
        />
      </div>
    </div>
  );
};

interface SentimentButtonProps {
  label: string;
  icon: React.ReactNode;
  color: 'green' | 'yellow' | 'red';
  isSelected: boolean;
  onClick: () => void;
}

const SentimentButton: React.FC<SentimentButtonProps> = ({
  label,
  icon,
  color,
  isSelected,
  onClick
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      hover: 'hover:bg-green-600',
      selected: 'bg-green-700',
      border: 'border-green-600',
      text: 'text-green-700'
    },
    yellow: {
      bg: 'bg-yellow-400',
      hover: 'hover:bg-yellow-500',
      selected: 'bg-yellow-600',
      border: 'border-yellow-500',
      text: 'text-yellow-700'
    },
    red: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      selected: 'bg-red-700',
      border: 'border-red-600',
      text: 'text-red-700'
    }
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center px-3 py-2 rounded-md border transition-all duration-300
        ${isSelected 
          ? `${colorClasses[color].selected} text-white border-transparent` 
          : `bg-white ${colorClasses[color].text} ${colorClasses[color].border} ${colorClasses[color].hover}`
        }
      `}
    >
      {icon}
      <span className="ml-2 text-sm font-medium">{label}</span>
    </motion.button>
  );
};

export default SentimentFilter;