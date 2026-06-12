import React from "react";
import { Chip } from "@mui/material";
import { ChipProps } from "@mui/material/Chip";

interface StatusChipProps {
  status: string;
}

const formatStatusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const getStatusColor = (status: string): ChipProps["color"] => {
  if (!status) return "default";
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "success":
      return "success";
    case "approved":
    case "processing":
    case "info":
      return "info";
    case "inactive":
    case "pending":
    case "pending_approval":
    case "pending_closure":
    case "dormant":
      return "warning";
    case "suspended":
    case "rejected":
    case "failed":
    case "error":
    case "closed":
      return "error";
    default:
      return "default";
  }
};

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  return (
    <Chip
      label={status ? formatStatusLabel(status) : "N/A"}
      color={getStatusColor(status)}
      size="small"
      sx={{ minWidth: "80px", textTransform: "capitalize" }}
    />
  );
};

export default StatusChip;
