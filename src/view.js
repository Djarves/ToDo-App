// view.js
export class TaskView {
  constructor() {
    this.taskList = document.getElementById('task-list');
  }

  clear() {
    this.taskList.innerHTML = '';
  }

  render(tasks, onEdit, onRemove, onToggle) {
    this.clear();
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.className = 'task-item' + (t.done ? ' completed' : '');
      li.dataset.id = t.id;

      const left = document.createElement('div');
      left.className = 'left';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.done;
      cb.addEventListener('change', () => onToggle(t.id, cb.checked));

      const title = document.createElement('div');
      title.className = 'task-text' + (t.done ? ' completed' : '') + (t.priority==='important' ? ' important' : '');
      title.textContent = t.text;

      const meta = document.createElement('div');
      meta.className = 'small';
      meta.textContent = t.priority === 'important' ? 'Важная' : '';

      left.append(cb, title, meta);

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn edit';
      editBtn.textContent = 'Изменить';
      editBtn.addEventListener('click', () => onEdit(t.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn delete';
      delBtn.textContent = 'Удалить';
      delBtn.addEventListener('click', () => onRemove(t.id));

      actions.append(editBtn, delBtn);
      li.append(left, actions);
      this.taskList.appendChild(li);
    });
  }
}
