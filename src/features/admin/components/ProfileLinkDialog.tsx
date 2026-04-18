import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface ProfileLinkDialogProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

const ProfileLinkDialog: React.FC<ProfileLinkDialogProps> = ({
  open,
  url,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Share Profile Completion Link
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The approval email has been sent. You can also share this link
          directly with the customer to complete their profile.
        </Typography>
        <TextField fullWidth value={url} InputProps={{ readOnly: true }} size="small" />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Tooltip title={copied ? "Copied!" : "Copy link"}>
          <Button
            variant="contained"
            startIcon={<CopyIcon />}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </Tooltip>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileLinkDialog;
