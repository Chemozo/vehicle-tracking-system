import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { PopupContent } from "../../components/PopupComponent";
import { Vehicle } from "../../types/vehicle";
import { authApi, vehicleApi } from "../../utils/api";
import axios from "axios";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import SvgIcon from "@mui/icons-material/AirportShuttle";
export const MapPage = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | undefined>();
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
  }, [markers]);

  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem("refreshToken");
      if (!token) {
        navigate("/");
        return false;
      }

      try {
        const response = await authApi.refresh(token);
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        return true;
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/");
        return false;
      }
    };

    const updateVehicleMarkers = (vehicles: Vehicle[]) => {
      Object.values(markers.current).forEach((marker) => marker.remove());
      markers.current = {};

      vehicles.forEach((vehicle) => {
        if (!mapRef.current) return;

        const popupNode = document.createElement("div");
        const root = createRoot(popupNode);
        root.render(<PopupContent vehicle={vehicle} />);

        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
          popupNode
        );

        const icon = document.createElement("div");
        const iconRoot = createRoot(icon);
        iconRoot.render(
          <SvgIcon
            component={AirportShuttleIcon}
            fontSize="large"
            color="secondary"
          />
        );

        markers.current[vehicle.id] = new mapboxgl.Marker({
          element: icon,
        })
          .setLngLat([vehicle.longitude, vehicle.latitude])
          .setPopup(popup)
          .addTo(mapRef.current);
      });
    };

    const fetchVehicles = async () => {
      try {
        const response = await vehicleApi.getAll();
        updateVehicleMarkers(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          const refreshSuccessful = await refreshToken();
          if (refreshSuccessful) {
            try {
              const response = await vehicleApi.getAll();
              updateVehicleMarkers(response.data);
            } catch (retryError) {
              console.error(
                "Error fetching vehicles after token refresh:",
                retryError
              );
            }
          }
        } else {
          console.error("Error fetching vehicles:", error);
        }
      }
    };

    fetchVehicles();

    const intervalId = setInterval(fetchVehicles, 30000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div
        ref={mapContainerRef}
        className="map-container"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};
