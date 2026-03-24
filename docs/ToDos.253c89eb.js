// controller.js
class TaskController {
    constructor(model, view){
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
        this.taskForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const text = this.taskInput.value;
            const priority = this.prioritySelect.value;
            if (!text.trim()) return;
            this.model.addTask(text, priority);
            this.taskInput.value = '';
            this.prioritySelect.value = 'normal';
            this.render();
        });
        this.filterButtons.forEach((btn)=>btn.addEventListener('click', ()=>{
                this.filterButtons.forEach((b)=>b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.render();
            }));
    }
    render() {
        const tasks = this.model.getTasks(this.currentFilter);
        this.view.render(tasks, (id)=>this.handleEdit(id), (id)=>this.handleRemove(id), (id, done)=>this.handleToggle(id, done));
    }
    handleEdit(id) {
        const t = this.model.tasks.find((x)=>x.id === id);
        if (!t) return;
        const newText = prompt("\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442 \u0437\u0430\u0434\u0430\u0447\u0438:", t.text);
        if (newText === null) return;
        const newPriority = prompt('\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442: \u043F\u0443\u0441\u0442\u043E \u0434\u043B\u044F \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E, "important" \u0434\u043B\u044F \u0432\u0430\u0436\u043D\u043E\u0439:', t.priority);
        this.model.updateTask(id, {
            text: newText.trim() || t.text,
            priority: newPriority && newPriority.trim() ? newPriority.trim() : t.priority
        });
        this.render();
    }
    handleRemove(id) {
        if (confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443?")) {
            this.model.removeTask(id);
            this.render();
        }
    }
    handleToggle(id, done) {
        this.model.updateTask(id, {
            done
        });
        this.render();
    }
}

//# sourceMappingURL=ToDos.253c89eb.js.map
