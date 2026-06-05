import type { ChipProps } from "@mui/material/Chip";

export function getTransactionTypeColor(
  type: string,
  direction?: string,
): ChipProps["color"] {
  if (!type) return "default";
  switch (type.toLowerCase()) {
    case "deposit":
      return "success";
    case "airdrop":
      return "warning";
    case "withdrawal":
      return "error";
    case "transfer":
      return direction === "debit" ? "error" : "success";
    default:
      return "default";
  }
}

export function getTransactionTypeLabel(
  type: string,
  direction?: string,
): string {
  if (!type) return "UNKNOWN";
  switch (type.toLowerCase()) {
    case "deposit":
      return "Deposit";
    case "airdrop":
      return "Airdrop";
    case "withdrawal":
      return "Withdrawal";
    case "transfer":
      return direction === "debit" ? "Transfer Sent" : "Transfer Received";
    default:
      return type;
  }
}
