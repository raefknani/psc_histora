import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TopBarLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 0;
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 90); // Cap at 90% until done
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      zIndex: 10001,
      background: 'rgba(140, 90, 60, 0.1)',
    }}>
      <motion.div
        style={{
          height: '100%',
          background: '#8c5a3c',
          boxShadow: '0 0 10px rgba(140, 90, 60, 0.5)',
          width: `${progress}%`,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

export default TopBarLoader;
