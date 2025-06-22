import { Button, Container, Typography, Box, Paper, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <Container maxWidth="sm">
      <Fade in={fadeIn} timeout={800}>
        <Paper 
          elevation={3}
          sx={{
            p: 6,
            mt: 8,
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, #1976d2 0%, #21c7d3 100%)',
            }
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <ErrorOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: 'error.main',
                mb: 2,
                opacity: 0.9
              }} 
            />
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontSize: '6rem',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #21c7d3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                lineHeight: 1
              }}
            >
              404
            </Typography>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                color: 'text.primary'
              }}
            >
              Oops! Page Not Found
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                mb: 4,
                maxWidth: '80%',
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}
            >
              The page you're looking for doesn't exist or has been moved.
              Don't worry, let's get you back on track!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/dashboard")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default NotFoundPage;
