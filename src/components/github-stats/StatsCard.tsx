'use client';

import React from 'react';

interface StatItemProps {
  number: number | string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ number, label }) => (
  <div className="stat-item">
    <div className="stat-number">
      {typeof number === 'number' ? number.toLocaleString() : number}
    </div>
    <div className="stat-label">{label}</div>
  </div>
);

interface StatsCardProps {
  items: StatItemProps[];
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  items,
  className = '',
}) => {
  return (
    <div className={`stat-box ${className}`}>
      {items.map((item, index) => (
        <StatItem key={index} number={item.number} label={item.label} />
      ))}
    </div>
  );
};
