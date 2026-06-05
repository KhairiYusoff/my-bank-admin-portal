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

export interface AttentionCardProps {
  label: string;
  count: number | undefined;
  icon: React.ReactNode;
  accentColor: string;
  to: string;
}

const AttentionCard: React.FC<AttentionCardProps> = ({
  label,
  count,
  icon,
  accentColor,
  to,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.09)",
        borderRadius: 2,
        borderLeft: `4px solid ${accentColor}`,
        height: "100%",
        opacity: count === 0 ? 0.45 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <CardActionArea
        onClick={() => navigate(to)}
        disabled={count === 0}
        sx={{ height: "100%" }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
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

          {count === undefined ? (
            <Skeleton variant="text" width={40} height={44} />
          ) : (
            <Typography
              variant="h4"
              fontWeight={700}
              color={count > 0 ? accentColor : "text.disabled"}
            >
              {count}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AttentionCard;
