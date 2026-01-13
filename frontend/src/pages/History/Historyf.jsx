import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";  

const History = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchRecords = async () => {
    try {
      const eventsCollection = collection(db, "pastEvents");
      const resolvedQuery = query(eventsCollection, where("is_resolved", "==", true));
      const querySnapshot = await getDocs(resolvedQuery);
      
      const resolvedEvents = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Fetched event data:", data);  
        resolvedEvents.push({ id: doc.id, ...data });
      });
      
      setEvents(resolvedEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      <h1>History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : events.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Event ID</th>
              <th>City</th>
              <th>Emergency Type</th>
              <th>Emergency Message</th>
              <th>Location</th>
              <th>Notified To</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.city}</td>
                <td>{event.emergency_type || "N/A"}</td>
                <td>{event.emergency_message || "No message available"}</td>
                <td>
                  {event.location ? `${event.location.latitude}° N, ${event.location.longitude}° E` : "No location available"}
                </td>
                <td>{event.notified_to.join(", ")}</td>
                <td>{new Date(event.timestamp.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No resolved events.</p>
      )}
    </div>
  );
};

export default History;
