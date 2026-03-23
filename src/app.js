const model = new TaskModel('todo.tasks.v1');
const view = new TaskView();
const controller = new TaskController(model, view);
