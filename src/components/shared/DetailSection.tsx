import React from "react";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";

export interface DetailRow {
  label: string;
  value: React.ReactNode;
}

interface DetailSectionProps {
  title: string;
  rows: DetailRow[];
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, rows }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ pb: "16px !important" }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: 1.2 }}
        >
          {title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        {rows.map((row, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              py: 0.75,
              borderBottom: index < rows.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: 130, flexShrink: 0 }}
            >
              {row.label}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {row.value === null || row.value === undefined || row.value === ""
                ? "—"
                : row.value}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default DetailSection;
