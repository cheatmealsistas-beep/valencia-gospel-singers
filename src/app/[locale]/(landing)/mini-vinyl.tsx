'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

interface MiniVinylProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  index?: number;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
};

const grooveSizes = {
  sm: [55, 75, 90],
  md: [50, 65, 80, 92],
  lg: [45, 60, 75, 88],
};

const centerInset = {
  sm: '28%',
  md: '30%',
  lg: '32%',
};

export function MiniVinyl({ size = 'md', className, index = 0 }: MiniVinylProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn('relative flex-shrink-0', sizeClasses[size], className)}
      initial={{ rotate: 0 }}
      whileInView={{ rotate: 360 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{
        duration: 1.2,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={prefersReducedMotion ? {} : undefined}
    >
      {/* Vinyl base */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: '#111',
          boxShadow: `
            inset 0 0 ${size === 'sm' ? '15px' : '20px'} rgba(0,0,0,0.8),
            0 0 ${size === 'sm' ? '10px' : '15px'} rgba(168,85,247,0.15)
          `,
        }}
      >
        {/* Grooves */}
        {grooveSizes[size].map((grooveSize, i) => (
          <div
            key={`groove-${index}-${i}`}
            className="absolute rounded-full"
            style={{
              inset: `${(100 - grooveSize) / 2}%`,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
        ))}

        {/* Iridescent shine - always visible */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
          style={{
            background: `conic-gradient(from 0deg,
              transparent 0deg,
              rgba(168,85,247,0.25) 40deg,
              rgba(236,72,153,0.15) 80deg,
              transparent 120deg,
              transparent 360deg
            )`,
          }}
        />

        {/* Center label */}
        <div
          className="absolute rounded-full"
          style={{
            inset: centerInset[size],
            background: `radial-gradient(circle at 30% 30%, #fff 0%, #e879f9 15%, #a855f7 50%, #7c3aed 100%)`,
            boxShadow: '0 0 12px rgba(168,85,247,0.5)',
          }}
        >
          {/* Center hole */}
          <div className="absolute inset-[35%] rounded-full bg-[#0a0a0a]" />
        </div>
      </div>
    </motion.div>
  );
}
