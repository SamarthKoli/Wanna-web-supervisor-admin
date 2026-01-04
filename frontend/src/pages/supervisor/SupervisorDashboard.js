import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Map from '../dashboard/Map';
import './SupervisorDashboard.css';

const SupervisorDashboard = () => {
    const navigate = useNavigate();
    const mapComponentRef = useRef(); 
    const [activeUsers, setActiveUsers] = useState(0);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        const isApproved = localStorage.getItem('isApproved') === 'true';

        if (!token || role !== 'supervisor' || !isApproved) {
            navigate('/login');
            return;
        }

        const sosQuery = query(collection(db, "sos_alerts"), where("status", "==", "active"));
        const unsubscribeSOS = onSnapshot(sosQuery, (snapshot) => {
            setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const usersQuery = query(collection(db, "users"), where("isOnline", "==", true));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            setActiveUsers(snapshot.size);
        });

        return () => {
            unsubscribeSOS();
            unsubscribeUsers();
        };
    }, [navigate]);

    const handleLocateVictim = (lat, lng) => {
        if (mapComponentRef.current) {
            mapComponentRef.current.focusLocation(lat, lng);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Supervisor Command Center</h1>
                <div className="header-stats">
                    <span>Active Users: <strong>{activeUsers}</strong></span>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card"><h3>System Status</h3><p>Operational</p></div>
                <div className="stat-card alert-active"><h3>Active SOS Alerts</h3><p>{alerts.length}</p></div>
            </div>

            <div className="dashboard-vertical-layout">
                <section className="map-frame-container">
                    <Map ref={mapComponentRef} alerts={alerts} />
                </section>

                <section className="table-container">
                    <h2>Live Emergency Registry</h2>
                    <table className="alerts-table">
                        <thead>
                            <tr><th>Victim</th><th>Coordinates</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {alerts.map((alert) => (
                                <tr key={alert.id}>
                                    <td>{alert.userName || "Unknown"}</td>
                                    <td>{alert.lat?.toFixed(4)}, {alert.lng?.toFixed(4)}</td>
                                    <td><span className="status-badge pulse">LIVE</span></td>
                                    <td><button className="locate-btn" onClick={() => handleLocateVictim(alert.lat, alert.lng)}>Locate</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {alerts.length === 0 && <p className="no-data">No active alerts reported.</p>}
                </section>
            </div>
        </div>
    );
};

export default SupervisorDashboard;