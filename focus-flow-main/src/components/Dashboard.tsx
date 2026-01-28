import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, Flame, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import { getTodayStats, getStreak, getWeeklyStats, getTasks } from '@/lib/storage';

const Dashboard: React.FC = () => {
  const [todayStats, setTodayStats] = useState({ focusMinutes: 0, tasksCompleted: 0, sessions: 0 });
  const [streak, setStreak] = useState(0);
  const [weeklyProductivity, setWeeklyProductivity] = useState(0);

  useEffect(() => {
    const stats = getTodayStats();
    setTodayStats(stats);
    setStreak(getStreak());
    
    // Calculate weekly productivity
    const weeklyStats = getWeeklyStats();
    const productiveDays = weeklyStats.filter(day => day.focusMinutes > 0 || day.tasksCompleted > 0).length;
    setWeeklyProductivity(Math.round((productiveDays / 7) * 100));
  }, []);

  const formatFocusTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Here's your productivity overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Focus Time"
          value={formatFocusTime(todayStats.focusMinutes)}
          subtitle={`${todayStats.sessions} sessions`}
          icon={Clock}
          variant="accent"
        />
        
        <StatCard
          title="Tasks Completed"
          value={todayStats.tasksCompleted}
          subtitle="Today"
          icon={CheckCircle}
        />
        
        <StatCard
          title="Weekly Productivity"
          value={`${weeklyProductivity}%`}
          subtitle="Active days this week"
          icon={TrendingUp}
        />
        
        <StatCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle="Keep it going!"
          icon={Flame}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 glass-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <span className="text-2xl mb-2 block">🎯</span>
            <h3 className="font-medium text-foreground mb-1">Focus Timer</h3>
            <p className="text-sm text-muted-foreground">Use 25-minute Pomodoro sessions for optimal concentration.</p>
          </div>
          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <span className="text-2xl mb-2 block">✅</span>
            <h3 className="font-medium text-foreground mb-1">Task Priorities</h3>
            <p className="text-sm text-muted-foreground">Tackle high-priority tasks first when your energy is highest.</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <span className="text-2xl mb-2 block">🔥</span>
            <h3 className="font-medium text-foreground mb-1">Build Streaks</h3>
            <p className="text-sm text-muted-foreground">Complete at least one session daily to maintain your streak.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
