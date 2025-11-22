import React from 'react';
import './GradientText.css';

const GradientText = ({ 
  children, 
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"], 
  animationSpeed = 3, 
  showBorder = false, 
  className = "" 
}) => {
  const gradientColors = colors.join(', ');
  
  const style = {
    '--gradient-colors': gradientColors,
    '--animation-speed': `${animationSpeed}s`,
    '--border-display': showBorder ? 'block' : 'none'
  };

  return (
    <span 
      className={`gradient-text ${className}`} 
      style={style}
    >
      {children}
    </span>
  );
};

export default GradientText;