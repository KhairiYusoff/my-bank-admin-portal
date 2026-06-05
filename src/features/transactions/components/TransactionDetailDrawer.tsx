import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StatusChip from "@/components/shared/StatusChip";
import {
  getTransactionTypeColor,
  getTransactionTypeLabel,
} from "@/features/transactions/utils/transactionColors";
import { formatDateTime } from "@/utils/formatters";
import type { Transaction } from "../types";

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const DASH = "—";
const DRAWER_WIDTH = 480;

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAmountPrefix(tx: Transaction): string {
  const isOutgoing =
    tx.type === "withdrawal" ||
    (tx.type === "transfer" && tx.direction === "debit");
  return isOutgoing ? "-" : "+";
}

function getCounterpartLabel(tx: Transaction): string | null {
  if (tx.type === "transfer") return tx.direction === "debit" ? "To" : "From";
  if (tx.type === "deposit" || tx.type === "airdrop") return "From";
  return null;
}

function formatDuration(submittedAt: string, completedAt: string): string {
  const ms = new Date(completedAt).getTime() - new Date(submittedAt).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ minWidth: 140, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500} sx={{ textAlign: "right" }}>
      {value}
    </Typography>
  </Box>
);

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Typography
    variant="caption"
    fontWeight={700}
    color="text.secondary"
    sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}
  >
    {children}
  </Typography>
);

// ── Main component ────────────────────────────────────────────────────────────

const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  transaction,
  onClose,
}) => {
  const open = !!transaction;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      slotProps={{
        paper: {
          sx: {
            width: DRAWER_WIDTH,
            p: 3,
            pt: "80px",
            overflowY: "auto",
            position: "fixed",
            right: 0,
            left: "auto",
          },
        },
      }}
    >
      {/* Close button — fixed to top-right of Paper, above pt offset */}
      <IconButton
        size="small"
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      {transaction && (
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Chip
              label={getTransactionTypeLabel(
                transaction.type,
                transaction.direction,
              )}
              color={getTransactionTypeColor(
                transaction.type,
                transaction.direction,
              )}
              size="small"
              sx={{ mb: 1, fontWeight: 700, letterSpacing: 0.5 }}
            />
            <Typography
              variant="h5"
              fontWeight={700}
              color={
                getAmountPrefix(transaction) === "-"
                  ? "error.main"
                  : "success.main"
              }
            >
              {getAmountPrefix(transaction)}RM {transaction.amount.toFixed(2)}
            </Typography>
          </Box>

          <Divider />

          {/* Core fields */}
          <Stack spacing={1.5}>
            <SectionHeading>Transaction</SectionHeading>

            {/* Reference */}
            <DetailRow
              label="Reference"
              value={
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontFamily="monospace"
                >
                  {transaction.reference ?? DASH}
                </Typography>
              }
            />

            {/* For transfers: show both From and To with full unmasked detail */}
            {transaction.type === "transfer" ? (
              <>
                {transaction.direction === "debit" ? (
                  // TRANSFER SENT: From = this account owner, To = counterpart
                  <>
                    <DetailRow
                      label="From (Account)"
                      value={
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          fontFamily="monospace"
                        >
                          {transaction.account?.accountNumber ?? DASH}
                        </Typography>
                      }
                    />
                    <DetailRow
                      label="To (Name)"
                      value={
                        transaction.counterpartNameRaw ??
                        transaction.counterpartName ??
                        DASH
                      }
                    />
                    {transaction.counterpartAccount && (
                      <DetailRow
                        label="To (Account)"
                        value={
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            fontFamily="monospace"
                          >
                            {transaction.counterpartAccount}
                          </Typography>
                        }
                      />
                    )}
                  </>
                ) : (
                  // TRANSFER RECEIVED: From = counterpart, To = this account
                  <>
                    <DetailRow
                      label="From (Name)"
                      value={
                        transaction.counterpartNameRaw ??
                        transaction.counterpartName ??
                        DASH
                      }
                    />
                    {transaction.counterpartAccount && (
                      <DetailRow
                        label="From (Account)"
                        value={
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            fontFamily="monospace"
                          >
                            {transaction.counterpartAccount}
                          </Typography>
                        }
                      />
                    )}
                    <DetailRow
                      label="To (Account)"
                      value={
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          fontFamily="monospace"
                        >
                          {transaction.account?.accountNumber ?? DASH}
                        </Typography>
                      }
                    />
                  </>
                )}
              </>
            ) : (
              // Non-transfer: show counterpart if applicable (deposit/airdrop = From)
              (() => {
                const label = getCounterpartLabel(transaction);
                if (!label) return null;
                return (
                  <>
                    <DetailRow
                      label={`${label} (Name)`}
                      value={
                        transaction.counterpartNameRaw ??
                        transaction.counterpartName ??
                        DASH
                      }
                    />
                    {transaction.counterpartAccount && (
                      <DetailRow
                        label={`${label} (Account)`}
                        value={
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            fontFamily="monospace"
                          >
                            {transaction.counterpartAccount}
                          </Typography>
                        }
                      />
                    )}
                  </>
                );
              })()
            )}

            {/* Balance before → after */}
            {transaction.balanceBefore != null && (
              <DetailRow
                label="Balance before"
                value={`RM ${transaction.balanceBefore.toFixed(2)}`}
              />
            )}
            {transaction.balanceAfter != null && (
              <DetailRow
                label="Balance after"
                value={`RM ${transaction.balanceAfter.toFixed(2)}`}
              />
            )}

            {/* Fee — always show */}
            <DetailRow
              label="Fee"
              value={`RM ${(transaction.fee ?? 0).toFixed(2)}`}
            />

            {/* Date */}
            <DetailRow label="Date" value={formatDateTime(transaction.date)} />

            {/* Status */}
            <DetailRow
              label="Status"
              value={<StatusChip status={transaction.status} />}
            />

            {/* Channel */}
            {transaction.channel && (
              <DetailRow label="Channel" value={transaction.channel} />
            )}

            {/* Memo */}
            <DetailRow label="Memo" value={transaction.memo ?? DASH} />

            {/* Performed by */}
            <DetailRow
              label="Performed by"
              value={`${transaction.performedBy?.name ?? DASH} (${transaction.performedBy?.role ?? DASH})`}
            />
          </Stack>

          {/* Device Info — hidden if ip is absent */}
          {transaction.deviceInfo?.ip && (
            <>
              <Divider />
              <Stack spacing={1.5}>
                <SectionHeading>Device Info</SectionHeading>
                <DetailRow label="IP" value={transaction.deviceInfo.ip} />
                {transaction.deviceInfo.userAgent && (
                  <DetailRow
                    label="User Agent"
                    value={
                      transaction.deviceInfo.userAgent.length > 80
                        ? `${transaction.deviceInfo.userAgent.slice(0, 80)}…`
                        : transaction.deviceInfo.userAgent
                    }
                  />
                )}
              </Stack>
            </>
          )}

          {/* Processing Time — hidden if submittedAt absent */}
          {transaction.processingTime?.submittedAt && (
            <>
              <Divider />
              <Stack spacing={1.5}>
                <SectionHeading>Processing Time</SectionHeading>
                <DetailRow
                  label="Submitted"
                  value={formatDateTime(transaction.processingTime.submittedAt)}
                />
                {transaction.processingTime.completedAt && (
                  <>
                    <DetailRow
                      label="Completed"
                      value={formatDateTime(
                        transaction.processingTime.completedAt,
                      )}
                    />
                    <DetailRow
                      label="Duration"
                      value={formatDuration(
                        transaction.processingTime.submittedAt,
                        transaction.processingTime.completedAt,
                      )}
                    />
                  </>
                )}
              </Stack>
            </>
          )}
        </Stack>
      )}
    </Drawer>
  );
};

export default TransactionDetailDrawer;
