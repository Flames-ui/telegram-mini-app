import React, { useEffect, useState } from 'react';
import getDominantColor from '../../utils/dominantColor'; // default import

const WalletBadge: React.FC = () => {
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    getDominantColor()
      .then((color: string) => {
        setColor(color);
      })
      .catch((error: any) => {
        console.error('Error fetching dominant color:', error);
      });
  }, []);

  return (
    <div style={{ backgroundColor: color }}>
      {/* Wallet badge content */}
      Wallet Badge
    </div>
  );
};

export default WalletBadge;
