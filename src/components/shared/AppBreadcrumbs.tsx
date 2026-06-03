import React from "react";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  /** If omitted, this item is the current page (rendered as plain text, not a link) */
  to?: string;
  /** Router state to pass when navigating — useful for preserving context (e.g. account object) */
  state?: Record<string, unknown>;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = ({ items }) => (
  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
    {items.map((item, index) =>
      item.to ? (
        <MuiLink
          key={index}
          component={Link}
          to={item.to}
          state={item.state}
          underline="hover"
          color="primary"
          sx={{ fontWeight: 500 }}
        >
          {item.label}
        </MuiLink>
      ) : (
        <Typography key={index} color="text.primary" fontWeight={500}>
          {item.label}
        </Typography>
      ),
    )}
  </Breadcrumbs>
);

export default AppBreadcrumbs;
