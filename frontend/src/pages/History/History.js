import React, { useState, useEffect } from 'react';

const History = () => {
  // State to store SOS data
  const [sosData, setSosData] = useState([]);

  // Fetch SOS data from the backend on component mount
  useEffect(() => {
    const fetchSosData = async () => {
      try {
        const response = await fetch("http://localhost:3000/sos");
        const data = await response.json();
        setSosData(data); // Set the fetched SOS data into state
      } catch (error) {
        console.error("Error fetching SOS data:", error);
      }
    };

    fetchSosData(); // Call the function to fetch data
  }, []); // Empty dependency array means it runs once after the component mounts

  return (
    <div style={{ margin: '20px' }}>
      <h2>History</h2>

      {/* Table to display SOS records (excluding Latitude and Longitude) */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>User ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through SOS data and create rows */}
          {sosData.length > 0 ? (
            sosData.map((record) => (
              <tr key={record._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {record.userId}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {new Date(record.timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ padding: '10px', textAlign: 'center' }}>
                No SOS records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
