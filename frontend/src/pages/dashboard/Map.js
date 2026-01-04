import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';

const Map = forwardRef(({ alerts = [] }, ref) => {
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Expose the "flyTo" function to the Parent Dashboard
    useImperativeHandle(ref, () => ({
        focusLocation(lat, lng) {
            if (mapRef.current) {
                mapRef.current.setCenter([lat, lng]);
                mapRef.current.setZoom(16); // Deep zoom for emergency location
            }
        }
    }));

    useEffect(() => {
        const initializeMap = () => {
            // Check if mappls is available and div exists
            if (window.mappls && document.getElementById('map') && !mapRef.current) {
                try {
                    mapRef.current = new window.mappls.Map('map', {
                        center: [20.5937, 78.9629], // India Center
                        zoomControl: true,
                        zoom: 5
                    });
                    mapRef.current.on('load', () => setIsMapLoaded(true));
                } catch (error) {
                    console.error("Mappls Initialization Error:", error);
                }
            }
        };

        // Redefine the global callback in case it was triggered before mounting
        window.initMap1 = initializeMap;

        // If SDK is already present in window, initialize immediately
        if (window.mappls) {
            initializeMap();
        }

        return () => {
            // Cleanup to prevent memory leaks
            window.initMap1 = null;
        };
    }, []);

    // Sync markers with the live alerts array
    useEffect(() => {
        if (!isMapLoaded || !mapRef.current) return;

        // Clear removed alerts from the map
        Object.keys(markersRef.current).forEach(id => {
            if (!alerts.find(a => a.id === id)) {
                markersRef.current[id].setMap(null);
                delete markersRef.current[id];
            }
        });

        // Add pins for active SOS alerts
        alerts.forEach(alert => {
            if (!markersRef.current[alert.id] && alert.lat && alert.lng) {
                markersRef.current[alert.id] = new window.mappls.Marker({
                    map: mapRef.current,
                    position: { lat: alert.lat, lng: alert.lng },
                    icon_url: 'https://apis.mapmyindia.com/map_v3/1.png',
                    popupHtml: `<div><strong>${alert.userName}</strong><br/>SOS ACTIVE</div>`
                });
            }
        });
    }, [alerts, isMapLoaded]);

    return (
        <div id="map" style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}>
            {!isMapLoaded && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <strong>Connecting to Mappls Map Engine...</strong>
                </div>
            )}
        </div>
    );
});

export default Map;