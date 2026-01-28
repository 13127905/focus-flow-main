// LocalStorage utility functions for FocusFlowX

export interface User {
  username: string;
  password: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface FocusSession {
  id: string;
  duration: number; // in seconds
  date: string;
  type: 'focus' | 'break';
}

export interface DailyStats {
  date: string;
  focusMinutes: number;
  tasksCompleted: number;
  sessions: number;
}

const STORAGE_KEYS = {
  USERS: 'focusflowx_users',
  CURRENT_USER: 'focusflowx_current_user',
  TASKS: 'focusflowx_tasks',
  SESSIONS: 'focusflowx_sessions',
  DAILY_STATS: 'focusflowx_daily_stats',
  STREAK: 'focusflowx_streak',
};

// User management
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const registerUser = (username: string, password: string): boolean => {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return false;
  }
  users.push({ username, password, createdAt: new Date().toISOString() });
  saveUsers(users);
  return true;
};

export const validateUser = (username: string, password: string): boolean => {
  const users = getUsers();
  return users.some(u => u.username === username && u.password === password);
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (username: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Task management
export const getTasks = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const addTask = (title: string, priority: Task['priority']): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const toggleTask = (id: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : undefined;
    saveTasks(tasks);
    
    if (task.completed) {
      updateDailyStats({ tasksCompleted: 1 });
    }
  }
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
};

// Focus sessions
export const getSessions = (): FocusSession[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveSessions = (sessions: FocusSession[]): void => {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};

export const addSession = (duration: number, type: FocusSession['type']): void => {
  const sessions = getSessions();
  sessions.push({
    id: Date.now().toString(),
    duration,
    date: new Date().toISOString(),
    type,
  });
  saveSessions(sessions);
  
  if (type === 'focus') {
    updateDailyStats({ focusMinutes: Math.floor(duration / 60), sessions: 1 });
    updateStreak();
  }
};

// Daily stats
export const getDailyStats = (): DailyStats[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
  return data ? JSON.parse(data) : [];
};

export const saveDailyStats = (stats: DailyStats[]): void => {
  localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
};

export const getTodayStats = (): DailyStats => {
  const today = new Date().toISOString().split('T')[0];
  const stats = getDailyStats();
  const todayStats = stats.find(s => s.date === today);
  return todayStats || { date: today, focusMinutes: 0, tasksCompleted: 0, sessions: 0 };
};

export const updateDailyStats = (update: Partial<Omit<DailyStats, 'date'>>): void => {
  const today = new Date().toISOString().split('T')[0];
  const stats = getDailyStats();
  const todayIndex = stats.findIndex(s => s.date === today);
  
  if (todayIndex >= 0) {
    stats[todayIndex] = {
      ...stats[todayIndex],
      focusMinutes: stats[todayIndex].focusMinutes + (update.focusMinutes || 0),
      tasksCompleted: stats[todayIndex].tasksCompleted + (update.tasksCompleted || 0),
      sessions: stats[todayIndex].sessions + (update.sessions || 0),
    };
  } else {
    stats.push({
      date: today,
      focusMinutes: update.focusMinutes || 0,
      tasksCompleted: update.tasksCompleted || 0,
      sessions: update.sessions || 0,
    });
  }
  
  saveDailyStats(stats);
};

// Streak management
export const getStreak = (): number => {
  const data = localStorage.getItem(STORAGE_KEYS.STREAK);
  if (!data) return 0;
  
  const { count, lastDate } = JSON.parse(data);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (lastDate === today || lastDate === yesterday) {
    return count;
  }
  return 0;
};

export const updateStreak = (): void => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const data = localStorage.getItem(STORAGE_KEYS.STREAK);
  
  let count = 1;
  if (data) {
    const { count: prevCount, lastDate } = JSON.parse(data);
    if (lastDate === today) {
      return; // Already updated today
    } else if (lastDate === yesterday) {
      count = prevCount + 1;
    }
  }
  
  localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ count, lastDate: today }));
};

// Weekly stats
export const getWeeklyStats = (): DailyStats[] => {
  const stats = getDailyStats();
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Get last 7 days
  const weekDays: DailyStats[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const dayStats = stats.find(s => s.date === dateStr);
    weekDays.push(dayStats || { date: dateStr, focusMinutes: 0, tasksCompleted: 0, sessions: 0 });
  }
  
  return weekDays;
};

// Total stats for profile
export const getTotalStats = () => {
  const sessions = getSessions().filter(s => s.type === 'focus');
  const tasks = getTasks();
  
  return {
    totalFocusHours: Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 3600 * 10) / 10,
    totalTasksCompleted: tasks.filter(t => t.completed).length,
    totalSessions: sessions.length,
  };
};
