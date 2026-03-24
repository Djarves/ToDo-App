export class TaskController {
  constructor(model, view) {
    this.model = model; // модель (работа с Firebase)
    this.view = view;   // отображение
    this.currentFilter = 'all'; // текущий фильтр

    // получаем элементы со страницы
    this.taskForm = document.getElementById('task-form');
    this.taskInput = document.getElementById('task-input');
    this.prioritySelect = document.getElementById('priority-select');
    this.filterButtons = document.querySelectorAll('.filter-btn');

    this.bindEvents();  // вешаем события
    this.init();        // 🔥 вместо render — делаем async инициализацию
  }

  // 🔥 загружаем задачи при старте
  async init() {
    await this.render();
  }

  bindEvents() {
    // отправка формы (добавление задачи)
    this.taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const text = this.taskInput.value;
      const priority = this.prioritySelect.value;

      if(!text.trim()) return;

      // 🔥 ждём пока задача добавится в Firebase
      await this.model.addTask(text, priority);

      // очищаем поля
      this.taskInput.value = '';
      this.prioritySelect.value = 'normal';

      // перерисовываем список
      await this.render();
    });

    // кнопки фильтра
    this.filterButtons.forEach(btn => btn.addEventListener('click', async () => {
      this.filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      this.currentFilter = btn.dataset.filter;

      await this.render();
    }));
  }

  // 🔥 теперь render асинхронный
  async render() {
    // получаем задачи из Firebase
    const tasks = await this.model.getTasks(this.currentFilter);

    // передаём в view
    this.view.render(
      tasks,
      (id) => this.handleEdit(id),
      (id) => this.handleRemove(id),
      (id, done) => this.handleToggle(id, done)
    );
  }

  // редактирование
  async handleEdit(id) {
    const t = this.model.tasks.find(x => x.id === id);
    if(!t) return;

    const newText = prompt('Измените текст задачи:', t.text);
    if(newText === null) return;

    const newPriority = prompt(
      'Приоритет: пусто для обычного, "important" для важной:',
      t.priority
    );

    // обновляем в Firebase
    await this.model.updateTask(id, {
      text: newText.trim() || t.text,
      priority: (newPriority && newPriority.trim())
        ? newPriority.trim()
        : t.priority
    });

    await this.render();
  }

  // удаление
  async handleRemove(id) {
    if(confirm('Удалить задачу?')) {
      await this.model.removeTask(id);
      await this.render();
    }
  }

  // переключение done
  async handleToggle(id, done) {
    await this.model.updateTask(id, { done });
    await this.render();
  }
}

