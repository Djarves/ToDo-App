// model.js
class TaskModel {
  constructor(storageKey) {
    this.STORAGE_KEY = storageKey;
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      console.error('Failed to load tasks', e);
      return [];
    }
  }

  saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  addTask(text, priority='normal') {
    const task = {id: Date.now(), text: text.trim(), done: false, priority};
    this.tasks.unshift(task);
    this.saveTasks();
  }

  updateTask(id, patch) {
    const i = this.tasks.findIndex(t => t.id === id);
    if (i > -1) {
      this.tasks[i] = {...this.tasks[i], ...patch};
      this.saveTasks();
    }
  }

  removeTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
  }

  getTasks(filter='all') {
    return this.tasks.filter(t => {
      if(filter === 'all') return true;
      if(filter === 'active') return !t.done;
      if(filter === 'completed') return t.done;
      return true;
    });
  }
}
