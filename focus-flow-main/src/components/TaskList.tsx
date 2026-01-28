import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTasks, addTask, toggleTask, deleteTask, Task } from '@/lib/storage';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const task = addTask(newTaskTitle.trim(), priority);
    setTasks([...tasks, task]);
    setNewTaskTitle('');
    setPriority('medium');
  };

  const handleToggle = (id: string) => {
    toggleTask(id);
    setTasks(getTasks());
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    setTasks(getTasks());
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedCount / tasks.length) * 100) 
    : 0;

  const getPriorityClass = (p: Task['priority']) => {
    switch (p) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
    }
  };

  return (
    <div className="fade-in">
      {/* Progress Bar */}
      <div className="glass-card mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">Task Progress</span>
          <span className="text-sm font-bold text-foreground">{completionPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount} of {tasks.length} tasks completed
        </p>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="glass-card mb-6">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1"
          />
          <Select value={priority} onValueChange={(v) => setPriority(v as Task['priority'])}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="accent">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="glass-card text-center py-12">
            <p className="text-muted-foreground">No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`glass-card flex items-center gap-4 transition-all duration-200 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => handleToggle(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.completed 
                    ? 'bg-success border-success text-success-foreground' 
                    : 'border-muted-foreground/30 hover:border-accent'
                }`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </p>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>

              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
