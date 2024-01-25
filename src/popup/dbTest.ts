import { getFirestore, addDoc, doc, collection } from "firebase/firestore";

import firebase from './firebase';

const db = getFirestore(firebase);

// You might want to perform some client-side validation here
const saveIntoDb = async (name: string, type: string, reviews: string) => {

    try {
        const docRef = await addDoc(collection(db, "main-db"), {
            name: "Alan",
            type: "Mathison",
            reviews: "Turing",
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


saveIntoDb('a', 'b', 'c')