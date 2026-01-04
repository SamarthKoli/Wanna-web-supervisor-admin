// fetchPastEvent.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Adjust the path based on where firebaseConfig.js is located

const fetchPastEvent = async () => {
  try {
    const docRef = doc(db, "pastEvents", "5N1Ejh3Q9QDnUyqi9jyB");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Fetched Document:", data);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

export default fetchPastEvent;
