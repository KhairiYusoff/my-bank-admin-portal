import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/formatters";

export interface FinancialCardProps {
  label: string;
  value: number | undefined;
  sublabel?: string;
  icon: React.ReactNode;
  accentColor: string;
  to?: string;
}

const FinancialCard: React.FC<FinancialCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  accentColor,
  to,
}) => {
  const navigate = useNavigate();

  const inner = (
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box sx={{ color: accentColor }}>{icon}</Box>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.9 }}
        >
          {label}
        </Typography>
      </Box>

      {value === undefined ? (
        <Skeleton variant="text" width={140} height={48} />
      ) : (
        <Typography variant="h5" fontWeight={700} color={accentColor}>
          {formatCurrency(value, "MYR")}
        </Typography>
      )}

      {sublabel && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block" }}
        >
          {sublabel}
        </Typography>
      )}
    </CardContent>
  );

  return (
    <Card
      sx={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        borderRadius: 2,
        borderLeft: `4px solid ${accentColor}`,
        height: "100%",
      }}
    >
      {to ? (
        <CardActionArea onClick={() => navigate(to)} sx={{ height: "100%" }}>
          {inner}
        </CardActionArea>
      ) : (
        inner
      )}
    </Card>
  );
};

export default FinancialCard;
