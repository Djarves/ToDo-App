import './firebase.js';

import { TaskModel } from './model.js';
import { TaskView } from './view.js';
import { TaskController } from './controller.js';

const model = new TaskModel('todo.tasks.v1');
const view = new TaskView();
const controller = new TaskController(model, view);



