import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';  

const Dashboard = () => {
  const [locations, setLocations] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  
  const fetchLocations = async () => {
    try {
      const eventsCollection = collection(db, 'ongoingEvents');  
      const querySnapshot = await getDocs(eventsCollection);
      const fetchedLocations = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.location) {
          
          const { latitude, longitude } = data.location;  
          fetchedLocations.push({ latitude, longitude });
        }
      });

      setLocations(fetchedLocations);
      setMapLoaded(true);  
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      
      const loadMapScript = () => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src =
            'https://apis.mappls.com/advancedmaps/api/0ec8a551bb6c52185d80282e718eb7df/map_sdk?layer=vector&v=3.0&callback=initMap1';
          script.defer = true;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      window.initMap1 = function () {
        const map = new window.mappls.Map('map', {
          center: [28.61, 77.23], 
          zoomControl: true,
          location: true,
          zoom: 10,
        });

        window.map = map;

        map.addListener('load', function () {
          
          locations.forEach((location) => {
            new window.mappls.Marker({
              map: map,
              position: [location.latitude, location.longitude],
              icon_url: 'https://apis.mapmyindia.com/map_v3/1.png',
              fitbounds: true,
              clusters: true,
              clustersIcon: 'https://mappls.com/images/2.png',
              fitboundOptions: {
                padding: 120,
                duration: 1000,
              },
              popupOptions: {
                offset: { bottom: [0, -20] },
              },
            });
          });
        });
      };

      loadMapScript().catch((error) => {
        console.error('Error loading Mappls script:', error);
      });
    }
  }, [locations, mapLoaded]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default Dashboard;
