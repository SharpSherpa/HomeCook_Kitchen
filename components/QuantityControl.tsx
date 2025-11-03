
import React from 'react';
import { IconPlus, IconMinus } from '../constants.tsx';

interface QuantityControlProps {
  quantity: number;
  onIncrease: (e: React.MouseEvent) => void;
  onDecrease: (e: React.MouseEvent) => void;
  size?: 'small' | 'large';
}

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, onIncrease, onDecrease, size = 'small' }) => {
  
  const sizeClasses = {
    small: {
      button: 'w-8 h-8',
      text: 'w-8 h-8 text-sm',
    },
    large: {
      button: 'w-11 h-11',
      text: 'w-11 h-11 text-base',
    }
  }

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600">
      <button 
        onClick={onDecrease} 
        className={`${classes.button} flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md transition-colors`}
        aria-label="Decrease quantity"
      >
        <IconMinus />
      </button>
      <span 
        className={`${classes.text} flex items-center justify-center font-semibold text-gray-800 dark:text-gray-200 border-l border-r border-gray-300 dark:border-gray-600`}
      >
        {quantity}
      </span>
      <button 
        onClick={onIncrease} 
        className={`${classes.button} flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md transition-colors`}
        aria-label="Increase quantity"
      >
        <IconPlus />
      </button>
    </div>
  );
};

export default QuantityControl;