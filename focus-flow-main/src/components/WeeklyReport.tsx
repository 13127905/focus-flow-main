import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, CheckCircle, Flame } from 'lucide-react';
import { getWeeklyStats, DailyStats } from '@/lib/storage';

const WeeklyReport: React.FC = () => {
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    setWeeklyStats(getWeeklyStats());
  }, []);

  const totalFocusMinutes = weeklyStats.reduce((acc, day) => acc + day.focusMinutes, 0);
  const totalTasks = weeklyStats.reduce((acc, day) => acc + day.tasksCompleted, 0);
  const productiveDays = weeklyStats.filter(day => day.focusMinutes > 0 || day.tasksCompleted > 0).length;

  const maxFocusMinutes = Math.max(...weeklyStats.map(d => d.focusMinutes), 1);
  const maxTasks = Math.max(...weeklyStats.map(d => d.tasksCompleted), 1);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getProductivityMessage = () => {
    if (productiveDays >= 6) return "🔥 Outstanding! You're on fire this week!";
    if (productiveDays >= 4) return "💪 Great job! You were productive most days!";
    if (productiveDays >= 2) return "👍 Good start! Keep building momentum!";
    return "🌱 Time to get started! Every journey begins with a step.";
  };

  return (
    <div className="fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Total Focus Time</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
          </p>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Tasks Completed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning/10">
              <Flame className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Productive Days</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{productiveDays}/7</p>
        </div>
      </div>

      {/* Weekly Message */}
      <div className="glass-card mb-8 text-center py-6">
        <p className="text-xl font-medium text-foreground">{getProductivityMessage()}</p>
      </div>

      {/* Focus Time Chart */}
      <div className="glass-card mb-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Focus Time This Week</h3>
        </div>
        
        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyStats.map((day, index) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-36">
                <div 
                  className="chart-bar w-full max-w-12"
                  style={{ 
                    height: `${Math.max((day.focusMinutes / maxFocusMinutes) * 100, 4)}%`,
                    minHeight: day.focusMinutes > 0 ? '8px' : '4px',
                    opacity: day.focusMinutes > 0 ? 1 : 0.3
                  }}
                  title={`${day.focusMinutes} minutes`}
                />
              </div>
              <span className="text-xs text-muted-foreground">{getDayName(day.date)}</span>
              <span className="text-xs font-medium text-foreground">{day.focusMinutes}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Chart */}
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-5 h-5 text-success" />
          <h3 className="text-lg font-semibold text-foreground">Tasks Completed This Week</h3>
        </div>
        
        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyStats.map((day, index) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-36">
                <div 
                  className="w-full max-w-12 rounded-t-md transition-all duration-300"
                  style={{ 
                    height: `${Math.max((day.tasksCompleted / maxTasks) * 100, 4)}%`,
                    minHeight: day.tasksCompleted > 0 ? '8px' : '4px',
                    background: day.tasksCompleted > 0 
                      ? 'linear-gradient(180deg, hsl(var(--success)), hsl(150 50% 35%))' 
                      : 'hsl(var(--muted))',
                    opacity: day.tasksCompleted > 0 ? 1 : 0.3
                  }}
                  title={`${day.tasksCompleted} tasks`}
                />
              </div>
              <span className="text-xs text-muted-foreground">{getDayName(day.date)}</span>
              <span className="text-xs font-medium text-foreground">{day.tasksCompleted}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
