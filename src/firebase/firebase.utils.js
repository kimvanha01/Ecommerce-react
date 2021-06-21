import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var config = {
  apiKey: "AIzaSyCYasgm1EscysJPt4i095XPxauUM1h5cBI",
  authDomain: "crwn-db-14d0d.firebaseapp.com",
  databaseURL: "https://crwn-db-14d0d.firebaseio.com",
  projectId: "crwn-db-14d0d",
  storageBucket: "crwn-db-14d0d.appspot.com",
  messagingSenderId: "392831499894",
  appId: "1:392831499894:web:4f9ae5f6bd76b83f412957",
  measurementId: "G-YZ7CRF2QTJ"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    await userRef.set({
      displayName,
      email,
      createdAt,
      ...additionalData,
    });
    try {
    } catch (err) {
      console.log("Error creating user", err.message);
    }
  }
  return userRef;
};

export const addCollectionAndDoccuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });
  return transformedCollection.reduce((acc, collection) => {
    acc[collection.title.toLowerCase()] = collection;
    return acc;
  }, {});
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
