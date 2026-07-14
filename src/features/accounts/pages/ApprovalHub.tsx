import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Container } from "@mui/material";
import { PendingApplications } from "@/features/admin/components";
import { AccountRequests } from "../components";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`approval-tabpanel-${index}`}
      aria-labelledby={`approval-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ApprovalHub: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Approval Hub
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Centralized workspace for reviewing onboarding applications and new product requests.
        </Typography>
      </Box>

      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="approval hub tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Onboarding Applications" id="approval-tab-0" aria-controls="approval-tabpanel-0" />
          <Tab label="Account Requests" id="approval-tab-1" aria-controls="approval-tabpanel-1" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <PendingApplications />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AccountRequests />
      </TabPanel>
    </Box>
  );
};

export default ApprovalHub;
