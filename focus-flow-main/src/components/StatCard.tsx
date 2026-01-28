import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  variant = 'default' 
}) => {
  if (variant === 'accent') {
    return (
      <div className="stat-card text-primary-foreground slide-up">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-accent/10">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
