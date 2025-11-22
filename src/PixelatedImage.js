import { useState, useEffect } from 'react';
import './PixelatedImage.css';

const PixelatedImage = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const [showPixelated, setShowPixelated] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      setTimeout(() => setShowPixelated(false), 500);
    };
    img.src = src;
  }, [src]);

  return (
    <div className={`pixelated-image-container ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`pixelated-image ${loaded ? 'loaded' : ''} ${showPixelated ? 'pixelated' : ''}`}
      />
    </div>
  );
};

export default PixelatedImage;