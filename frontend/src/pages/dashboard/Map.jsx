import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

/**
 * INDIA DEFAULT CENTER
 * ⚠️ Mappls uses [lng, lat]
 */
const INDIA_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};

/**
 * INDIA BOUNDS (lng, lat)
 */
const INDIA_BOUNDS = [
  [68.0, 6.0],   // South-West (lng, lat)
  [97.0, 36.0],  // North-East (lng, lat)
];

const Map = forwardRef(({ alerts = [] }, ref) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const circlesRef = useRef({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // =================================================
  // Expose Locate function to parent
  // =================================================
  useImperativeHandle(ref, () => ({
    focusLocation(lat, lng) {
      if (!mapRef.current || !isMapLoaded) return;
      mapRef.current.setCenter([lng, lat]); // ✅ lng, lat
      mapRef.current.setZoom(16);
    },
  }));

  // =================================================
  // Initialize Mappls Map
  // =================================================
  useEffect(() => {
    const initializeMap = () => {
      if (!window.mappls) {
        console.error("❌ Mappls SDK not loaded");
        return;
      }

      if (mapRef.current) return;

      try {
        mapRef.current = new window.mappls.Map("map", {
          center: [INDIA_CENTER.lng, INDIA_CENTER.lat], // ✅ FIXED
          zoom: 5,
          zoomControl: true,
          mapStyle: "standard_day",

          // 🔒 INDIA-ONLY VIEW (CORRECT ORDER)
          maxBounds: INDIA_BOUNDS,
          minZoom: 4,
          maxZoom: 18,
        });

        mapRef.current.on("load", () => {
          setIsMapLoaded(true);
        });
      } catch (error) {
        console.error("❌ Mappls initialization error:", error);
      }
    };

    // Required by SDK callback
    window.initMap1 = initializeMap;

    if (window.mappls) {
      initializeMap();
    }

    return () => {
      window.initMap1 = null;
    };
  }, []);

  // =================================================
  // Sync SOS Markers
  // =================================================
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    // Remove stale markers
    Object.keys(markersRef.current).forEach((id) => {
      if (!alerts.find((a) => a.id === id)) {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];

        if (circlesRef.current[id]) {
          circlesRef.current[id].setMap(null);
          delete circlesRef.current[id];
        }
      }
    });

    // Add new SOS markers
    alerts.forEach((alert) => {
      if (
        markersRef.current[alert.id] ||
        typeof alert.lat !== "number" ||
        typeof alert.lng !== "number"
      ) {
        return;
      }

      const marker = new window.mappls.Marker({
        map: mapRef.current,
        position: {
          lng: alert.lng, // ✅ FIXED
          lat: alert.lat,
        },
        icon_url: "https://apis.mapmyindia.com/map_v3/1.png",
      });

      // Show victim name on click
      marker.addListener("click", () => {
        new window.mappls.Popup({
          map: mapRef.current,
          position: {
            lng: alert.lng, // ✅ FIXED
            lat: alert.lat,
          },
          content: `
            <div style="font-size:14px; line-height:1.4">
              <strong>${alert.userName || "Unknown Victim"}</strong><br/>
              🚨 SOS ACTIVE
            </div>
          `,
        });
      });

      markersRef.current[alert.id] = marker;
    });
  }, [alerts, isMapLoaded]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#eaeaea",
        position: "relative",
      }}
    >
      {!isMapLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          Connecting to Mappls Map Engine…
        </div>
      )}
    </div>
  );
});

export default Map;
