import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTotalStats, getStreak } from '@/lib/storage';
import { User, Clock, CheckCircle, Flame, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { username } = useAuth();
  const stats = getTotalStats();
  const streak = getStreak();

  return (
    <div className="max-w-2xl mx-auto fade-in">
      {/* Profile Header */}
      <div className="glass-card text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent/70 mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl font-bold text-accent-foreground">
            {username?.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">{username}</h2>
        <p className="text-muted-foreground">FocusFlowX Member</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card text-center">
          <div className="p-3 rounded-xl bg-accent/10 w-fit mx-auto mb-3">
            <Clock className="w-6 h-6 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalFocusHours}h</p>
          <p className="text-sm text-muted-foreground">Total Focus Time</p>
        </div>

        <div className="glass-card text-center">
          <div className="p-3 rounded-xl bg-success/10 w-fit mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalTasksCompleted}</p>
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
        </div>

        <div className="glass-card text-center">
          <div className="p-3 rounded-xl bg-warning/10 w-fit mx-auto mb-3">
            <Flame className="w-6 h-6 text-warning" />
          </div>
          <p className="text-3xl font-bold text-foreground">{streak}</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>

        <div className="glass-card text-center">
          <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-3">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalSessions}</p>
          <p className="text-sm text-muted-foreground">Focus Sessions</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${stats.totalSessions >= 1 ? 'bg-accent/10' : 'bg-muted'}`}>
            <span className="text-2xl">{stats.totalSessions >= 1 ? '🎯' : '🔒'}</span>
            <div>
              <p className="font-medium text-foreground">First Focus</p>
              <p className="text-sm text-muted-foreground">Complete your first focus session</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 p-3 rounded-lg ${stats.totalTasksCompleted >= 10 ? 'bg-accent/10' : 'bg-muted'}`}>
            <span className="text-2xl">{stats.totalTasksCompleted >= 10 ? '✅' : '🔒'}</span>
            <div>
              <p className="font-medium text-foreground">Task Master</p>
              <p className="text-sm text-muted-foreground">Complete 10 tasks</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 p-3 rounded-lg ${streak >= 7 ? 'bg-accent/10' : 'bg-muted'}`}>
            <span className="text-2xl">{streak >= 7 ? '🔥' : '🔒'}</span>
            <div>
              <p className="font-medium text-foreground">Week Warrior</p>
              <p className="text-sm text-muted-foreground">Maintain a 7-day streak</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 p-3 rounded-lg ${stats.totalFocusHours >= 10 ? 'bg-accent/10' : 'bg-muted'}`}>
            <span className="text-2xl">{stats.totalFocusHours >= 10 ? '⏰' : '🔒'}</span>
            <div>
              <p className="font-medium text-foreground">Deep Worker</p>
              <p className="text-sm text-muted-foreground">Accumulate 10 hours of focus time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
