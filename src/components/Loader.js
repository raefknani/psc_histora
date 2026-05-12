import React from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo_psc-removebg-preview.png';

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#f2dec8', // Matches body background
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <img 
          src={logo} 
          alt="Histora Logo" 
          style={{ height: '80px', width: 'auto' }} 
        />
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#8c5a3c',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          HISTORA
        </div>
      </motion.div>
      
      <div style={{
        marginTop: '40px',
        width: '200px',
        height: '2px',
        background: 'rgba(140, 90, 60, 0.2)',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            background: '#8c5a3c',
            borderRadius: '10px',
          }}
        />
      </div>
    </motion.div>
  );
};

export default Loader;
