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

export interface KpiCardProps {
  label: string;
  count: number | undefined;
  sublabel?: string;
  icon: React.ReactNode;
  iconColor: string;
  to: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  count,
  sublabel,
  icon,
  iconColor,
  to,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <CardActionArea onClick={() => navigate(to)} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{ textTransform: "uppercase", letterSpacing: 0.9 }}
            >
              {label}
            </Typography>
            <Box sx={{ color: iconColor, opacity: 0.85 }}>{icon}</Box>
          </Box>

          {count === undefined ? (
            <Skeleton variant="text" width={80} height={56} />
          ) : (
            <Typography variant="h3" fontWeight={700} lineHeight={1}>
              {count.toLocaleString()}
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
      </CardActionArea>
    </Card>
  );
};

export default KpiCard;
