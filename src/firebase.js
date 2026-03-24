import { initializeApp } from "firebase/app";
import { collection, getFirestore, addDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAO3yVerOFx8uFoOwR8yfdVUZzWsII3Mv0",
  authDomain: "todo-d5e38.firebaseapp.com",
  projectId: "todo-d5e38",
  storageBucket: "todo-d5e38.firebasestorage.app",
  messagingSenderId: "656195443574",
  appId: "1:656195443574:web:37d0d5b814483fc7357857"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function addDateToFirestore() {
   try {
    const docRef = await addDoc(collection(db, 'todos'), {
        title: 'Задача 3',
        status: 'active',
    });
    console.log('Document written with ID: ', docRef.id);
   } catch (e) {
    console.error('Error adding document: ', e);
   }
}

addDateToFirestore();

export { db };

console.log(app);