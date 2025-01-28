import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Button } from "@mui/material";

import "mapbox-gl/dist/mapbox-gl.css";

import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { PopupContent } from "../../components/PopupComponent";
import { Vehicle } from "../../types/vehicle";
import { vehicleApi } from "../../utils/api";

export const MapPage = () => {
  const navigate = useNavigate();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | undefined>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapboxgl.supported()) {
      alert("Your browser does not support Mapbox GL");
      return;
    }
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-99.133209, 19.432608],
      zoom: 11,
    });

    mapRef.current = newMap;

    return () => newMap.remove();
  }, [vehicles]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleApi.getAll();
        updateVehicleMarkers(response.data);
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    const updateVehicleMarkers = (vehicles: Vehicle[]) => {
      // Remove old markers
      Object.values(markers.current).forEach((marker) => marker.remove());
      markers.current = {};

      // Add new markers
      vehicles.forEach((vehicle) => {
        if (!mapRef.current) return;

        const popupNode = document.createElement("div");
        const root = createRoot(popupNode);
        root.render(<PopupContent vehicle={vehicle} />);

        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
          popupNode
        );

        markers.current[vehicle.id] = new mapboxgl.Marker()
          .setLngLat([vehicle.longitude, vehicle.latitude])
          .setPopup(popup)
          .addTo(mapRef.current);
      });
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    navigate("/add-vehicle");
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div
        ref={mapContainerRef}
        className="map-container"
        style={{ height: "100%", width: "100%" }}
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        style={{
          position: "absolute",
          bottom: "5vh",
          left: "50vw",
          zIndex: 1,
        }}
      >
        Add Marker
      </Button>
    </div>
  );
};
