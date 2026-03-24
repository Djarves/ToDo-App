// импорт базы
import { db } from './firebase.js';

// импорт функций Firebase
import {
  collection,   // коллекция (как массив)
  addDoc,       // добавить
  getDocs,      // получить
  deleteDoc,    // удалить
  doc,          // ссылка на документ
  updateDoc     // обновить
} from "firebase/firestore";

// загрузка задач из Firebase
export async function loadTasks() {
  try {
    // получаем все документы из коллекции "tasks"
    const querySnapshot = await getDocs(collection(db, "tasks"));

    // преобразуем в массив
    const tasks = [];

    querySnapshot.forEach((docItem) => {
      tasks.push({
        id: docItem.id,        // id документа из Firebase
        ...docItem.data()      // все данные (text, done и т.д.)
      });
    });

    return tasks;

  } catch (e) {
    console.error("Ошибка загрузки:", e);
    return [];
  }
}

export async function addTask(text, priority) {
  try {
    await addDoc(collection(db, "tasks"), {
      text: text.trim(),        // текст задачи
      done: false,              // выполнена или нет
      priority: priority || 'normal'
    });

    console.log("Задача добавлена");

  } catch (e) {
    console.error("Ошибка добавления:", e);
  }
}

export async function removeTask(id) {
  try {
    await deleteDoc(doc(db, "tasks", id));
    console.log("Удалено");
  } catch (e) {
    console.error("Ошибка удаления:", e);
  }
}

export async function updateTask(id, patch) {
  try {
    const taskRef = doc(db, "tasks", id);

    await updateDoc(taskRef, patch);

    console.log("Обновлено");
  } catch (e) {
    console.error("Ошибка обновления:", e);
  }
}


export class TaskModel {
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

