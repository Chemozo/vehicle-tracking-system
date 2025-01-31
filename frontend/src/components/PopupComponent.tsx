import { Typography, Paper } from "@mui/material";
import { Vehicle } from "../types/vehicle";

interface PopupContentProps {
  vehicle: Vehicle;
}

export const PopupContent = ({ vehicle }: PopupContentProps) => {
  return (
    <Paper elevation={3} style={{ padding: "10px", maxWidth: "200px" }}>
      <Typography variant="body2">{vehicle.plate_number}</Typography>
    </Paper>
  );
};
