import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        gap: 2,
      }}
    >
      <SecurityIcon sx={{ fontSize: "6rem", color: "error.main" }} />
      <Typography variant="h4" component="h1" gutterBottom>
        403 - Forbidden
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You do not have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default ForbiddenPage;
