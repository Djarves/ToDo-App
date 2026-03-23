// controller.js
class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.currentFilter = 'all';

    this.taskForm = document.getElementById('task-form');
    this.taskInput = document.getElementById('task-input');
    this.prioritySelect = document.getElementById('priority-select');
    this.filterButtons = document.querySelectorAll('.filter-btn');

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.taskInput.value;
      const priority = this.prioritySelect.value;
      if(!text.trim()) return;
      this.model.addTask(text, priority);
      this.taskInput.value = '';
      this.prioritySelect.value = 'normal';
      this.render();
    });

    this.filterButtons.forEach(btn => btn.addEventListener('click', () => {
      this.filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.currentFilter = btn.dataset.filter;
      this.render();
    }));
  }

  render() {
    const tasks = this.model.getTasks(this.currentFilter);
    this.view.render(tasks, 
      (id) => this.handleEdit(id), 
      (id) => this.handleRemove(id), 
      (id, done) => this.handleToggle(id, done)
    );
  }

  handleEdit(id) {
    const t = this.model.tasks.find(x => x.id === id);
    if(!t) return;
    const newText = prompt('Измените текст задачи:', t.text);
    if(newText === null) return;
    const newPriority = prompt('Приоритет: пусто для обычного, "important" для важной:', t.priority);
    this.model.updateTask(id, {text: newText.trim() || t.text, priority: (newPriority && newPriority.trim()) ? newPriority.trim() : t.priority});
    this.render();
  }

  handleRemove(id) {
    if(confirm('Удалить задачу?')) {
      this.model.removeTask(id);
      this.render();
    }
  }

  handleToggle(id, done) {
    this.model.updateTask(id, {done});
    this.render();
  }
}
