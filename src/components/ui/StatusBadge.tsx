import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus, ApprovalStatus, SlaStatus } from "@/types";

const APP_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  Draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted",
  },
  Submitted: {
    label: "Submitted",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  UnderReview: {
    label: "Under Review",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  PendingApproval: {
    label: "Pending Approval",
    className:
      "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
  },
  Approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  Rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  },
  Escalated: {
    label: "Escalated",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  },
};

const SLA_STATUS_CONFIG: Record<
  SlaStatus,
  { label: string; className: string }
> = {
  OnTrack: {
    label: "On Track",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  AtRisk: {
    label: "At Risk",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  Overdue: {
    label: "Overdue",
    className:
      "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  },
};

const APPROVAL_STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; className: string }
> = {
  Pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  Approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  Rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  },
  Escalated: {
    label: "Escalated",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus | SlaStatus | ApprovalStatus;
  type?: "application" | "sla" | "approval";
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({
  status,
  type = "application",
  size = "md",
  className,
}: StatusBadgeProps) {
  let config: { label: string; className: string } | undefined;
  if (type === "sla") config = SLA_STATUS_CONFIG[status as SlaStatus];
  else if (type === "approval")
    config = APPROVAL_STATUS_CONFIG[status as ApprovalStatus];
  else config = APP_STATUS_CONFIG[status as ApplicationStatus];

  if (!config) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        size === "sm" ? "text-xs px-1.5 py-0" : "text-xs px-2 py-0.5",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
