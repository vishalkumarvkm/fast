"use client";

import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { Layout } from "@/components/layout/Layout";
import { AIConfidenceBadge } from "@/components/ui/AIConfidenceBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockApplications,
  mockEmployees,
  mockNotifications,
  mockPrograms,
} from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FilePlus,
  GraduationCap,
  Heart,
  Info,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const PROGRAM_ICONS: Record<string, React.ReactNode> = {
  TuitionReimbursement: <GraduationCap className="w-5 h-5" />,
  CMEReimbursement: <Heart className="w-5 h-5" />,
  MMCScholarship: <Star className="w-5 h-5" />,
  DependentTuition: <Users className="w-5 h-5" />,
};

const PROGRAM_COLORS: Record<string, string> = {
  TuitionReimbursement:
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  CMEReimbursement:
    "bg-accent/10 text-accent-foreground dark:bg-accent/20 dark:text-accent",
  MMCScholarship:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  DependentTuition:
    "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
};

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  approval: (
    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
  ),
  deadline: (
    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
  ),
  status_change: <Clock className="w-4 h-4 text-primary" />,
  sla: <AlertTriangle className="w-4 h-4 text-destructive" />,
  document: <BookOpen className="w-4 h-4 text-primary" />,
  system: <Info className="w-4 h-4 text-muted-foreground" />,
};

const AI_RECS = [
  {
    id: "rec-1",
    text: "You're eligible for CME reimbursement — renews July 1. Submit your next CME by June 30 to avoid losing $2,500.",
    confidence: 97,
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: "rec-2",
    text: "Spring 2026 transcript from CUNY Lehman must be submitted by May 31, 2026 to complete application MTRA-2026-0041.",
    confidence: 94,
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    id: "rec-3",
    text: "Your service agreement for application MTRA-2026-0041 requires an e-signature within 7 days or it will be auto-withdrawn.",
    confidence: 88,
    icon: <Brain className="w-4 h-4" />,
  },
];

const DEADLINES = [
  {
    id: "dl-1",
    label: "Service Agreement Signature",
    sub: "Application MTRA-2026-0041",
    date: "May 9, 2026",
    daysLeft: 2,
  },
  {
    id: "dl-2",
    label: "Spring 2026 Transcript Submission",
    sub: "CUNY Lehman College",
    date: "May 31, 2026",
    daysLeft: 24,
  },
  {
    id: "dl-3",
    label: "MMC Scholarship Cycle Closes",
    sub: "Committee review",
    date: "Jun 30, 2026",
    daysLeft: 54,
  },
];

function deadlineColor(days: number) {
  if (days <= 7)
    return "bg-destructive/10 border-destructive/30 text-destructive dark:text-red-400";
  if (days <= 14)
    return "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300";
  return "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300";
}

function deadlineDot(days: number) {
  if (days <= 7) return "bg-destructive";
  if (days <= 14) return "bg-amber-500";
  return "bg-emerald-500";
}

export default function DashboardPage() {
  const { currentUser } = useAppStore();
  const router = useRouter();
  const [dismissedRecs, setDismissedRecs] = useState<string[]>([]);
  const [readNotifs] = useState<string[]>([]);
  const [markedAllRead, setMarkedAllRead] = useState(false);

  const employee =
    mockEmployees.find((e) => e.employeeId === currentUser?.employeeId) ??
    mockEmployees[0];

  const myApps = mockApplications.filter((a) => a.employeeId === employee.id);
  const activeApps = myApps.filter(
    (a) => !["Approved", "Rejected"].includes(a.status),
  );
  const approvedApps = myApps.filter((a) => a.status === "Approved");
  const ytdReimbursed = approvedApps.reduce((sum, a) => sum + a.amount, 0);

  const employeeNotifs = mockNotifications.filter(
    (n) => n.userId === employee.id,
  );
  const unreadNotifs = markedAllRead
    ? []
    : employeeNotifs.filter((n) => !n.read && !readNotifs.includes(n.id));

  const activeStatusBreakdown = [
    {
      label: "Submitted",
      count: myApps.filter((a) => a.status === "Submitted").length,
      color: "bg-primary",
    },
    {
      label: "Under Review",
      count: myApps.filter((a) => a.status === "UnderReview").length,
      color: "bg-amber-500",
    },
    {
      label: "Pending Approval",
      count: myApps.filter((a) => a.status === "PendingApproval").length,
      color: "bg-violet-500",
    },
  ].filter((s) => s.count > 0);

  const visibleRecs = AI_RECS.filter((r) => !dismissedRecs.includes(r.id));

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
      <div
        className="p-6 space-y-6 max-w-7xl mx-auto"
        data-ocid="dashboard.page"
      >
        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden shadow-md"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.36 0.16 240) 0%, oklch(0.48 0.15 210) 55%, oklch(0.55 0.14 180) 100%)",
          }}
          data-ocid="dashboard.welcome_banner"
        >
          {/* Decorative circles */}
          <div
            className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10 bg-white"
            aria-hidden="true"
          />
          <div
            className="absolute right-16 bottom-0 w-32 h-32 rounded-full opacity-5 bg-white"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-0.5">
                {greeting},
              </p>
              <h1 className="text-white font-display font-bold text-2xl mb-1">
                {employee.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30 text-xs font-medium hover:bg-white/20">
                  {employee.title}
                </Badge>
                <span className="text-blue-200 text-xs">
                  {employee.department}
                </span>
              </div>
              <p className="text-blue-100/70 text-xs mt-1.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button
              onClick={() => router.push("/apply")}
              className="bg-white text-primary hover:bg-blue-50 font-semibold gap-2 shadow-sm flex-shrink-0"
              data-ocid="dashboard.quick_apply_button"
            >
              <FilePlus className="w-4 h-4" />
              Quick Apply
            </Button>
          </div>
        </div>

        {/* Balance Cards Row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="dashboard.stats_section"
        >
          {/* Tuition Balance */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5 flex items-center gap-4">
              <ProgressRing
                value={employee.tuitionUsed}
                max={employee.tuitionMax}
                size={72}
                color="primary"
                valueDisplay={formatCurrency(employee.tuitionBalance)}
                sublabel="left"
                label="Tuition Balance"
              />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground mb-0.5">
                  Annual budget
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {formatCurrency(employee.tuitionMax)}/yr
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(employee.tuitionUsed)} used
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Balance */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5 flex items-center gap-4">
              <ProgressRing
                value={employee.creditUsed}
                max={employee.creditMax}
                size={72}
                color="accent"
                valueDisplay={`${employee.creditBalance}`}
                sublabel="left"
                label="Credit Balance"
              />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground mb-0.5">
                  Credit limit
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {employee.creditMax} credits/yr
                </div>
                <div className="text-xs text-muted-foreground">
                  {employee.creditUsed} used
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Applications */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Active Applications
                </span>
              </div>
              <div className="text-2xl font-bold font-display text-foreground mb-1">
                {activeApps.length}
              </div>
              {activeStatusBreakdown.length > 0 ? (
                <div className="space-y-0.5">
                  {activeStatusBreakdown.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${s.color} flex-shrink-0`}
                      />
                      <span className="text-[11px] text-muted-foreground">
                        {s.label}: {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {myApps.length} total submitted
                </div>
              )}
            </CardContent>
          </Card>

          {/* YTD Reimbursed */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Total Reimbursed
                </span>
              </div>
              <div className="text-2xl font-bold font-display text-foreground mb-1">
                {formatCurrency(ytdReimbursed)}
              </div>
              <div className="text-xs text-muted-foreground">
                YTD · {approvedApps.length} approved
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Programs + AI Chat */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Programs Grid (3/5) */}
          <div
            className="xl:col-span-3 space-y-4"
            data-ocid="dashboard.programs_section"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Available Programs
              </h2>
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                {mockPrograms.length} programs
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockPrograms.map((prog) => (
                <Card
                  key={prog.id}
                  className="border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                  onClick={() => router.push("/apply")}
                  data-ocid={`dashboard.program.${prog.programType.toLowerCase()}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${PROGRAM_COLORS[prog.programType]}`}
                      >
                        {PROGRAM_ICONS[prog.programType]}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      >
                        Eligible
                      </Badge>
                    </div>
                    <div className="mb-1">
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {prog.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {prog.description}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-primary">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">
                          Up to {formatCurrency(prog.maxAmount)}/yr
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2 text-primary hover:bg-primary/10 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/apply");
                        }}
                        data-ocid={`dashboard.program_apply.${prog.programType.toLowerCase()}`}
                      >
                        Apply
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Chatbot Widget (2/5) */}
          <div
            className="xl:col-span-2"
            data-ocid="dashboard.ai_assistant_section"
          >
            <DashboardChat />
          </div>
        </div>

        {/* Lower Row: Recent Applications + Notifications + Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <Card
            className="border-border shadow-sm lg:col-span-1"
            data-ocid="dashboard.applications_section"
          >
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Recent Applications
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-primary"
                onClick={() => router.push("/applications")}
                data-ocid="dashboard.view_all_link"
              >
                View all
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {myApps.length === 0 ? (
                <div
                  className="text-center py-8 text-sm text-muted-foreground"
                  data-ocid="dashboard.applications_empty_state"
                >
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No applications yet.
                  <button
                    type="button"
                    onClick={() => router.push("/apply")}
                    className="block mx-auto mt-2 text-primary hover:underline text-sm"
                  >
                    Start your first application
                  </button>
                </div>
              ) : (
                myApps.slice(0, 4).map((app, idx) => (
                  <button
                    key={app.id}
                    type="button"
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/applications/${app.id}`)
                    }
                    data-ocid={`dashboard.application.item.${idx + 1}`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">
                        {app.institution}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {app.courseTitle}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <span className="text-xs font-semibold text-foreground">
                        {formatCurrency(app.amount)}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card
            className="border-border shadow-sm"
            data-ocid="dashboard.notifications_section"
          >
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold">
                  Notifications
                </CardTitle>
                {unreadNotifs.length > 0 && (
                  <Badge
                    className="bg-destructive text-destructive-foreground text-[10px] px-1.5 min-w-[18px] justify-center"
                    data-ocid="dashboard.notifications_unread_badge"
                  >
                    {unreadNotifs.length}
                  </Badge>
                )}
              </div>
              <button
                type="button"
                className="text-[11px] text-primary hover:underline"
                onClick={() => setMarkedAllRead(true)}
                data-ocid="dashboard.mark_all_read_button"
              >
                Mark all read
              </button>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {employeeNotifs.slice(0, 5).map((notif, idx) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-colors ${
                    unreadNotifs.some((n) => n.id === notif.id)
                      ? "bg-primary/5 dark:bg-primary/10"
                      : "bg-muted/30"
                  }`}
                  data-ocid={`dashboard.notification.item.${idx + 1}`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {NOTIF_ICONS[notif.type] ?? (
                      <Bell className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                      {notif.title}
                      {unreadNotifs.some((n) => n.id === notif.id) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {notif.message}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Deadlines + AI Recs */}
          <div className="space-y-4">
            {/* Upcoming Deadlines */}
            <Card
              className="border-border shadow-sm"
              data-ocid="dashboard.deadlines_section"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-muted-foreground" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {DEADLINES.map((dl, idx) => (
                  <div
                    key={dl.id}
                    className={`rounded-lg border p-2.5 ${deadlineColor(dl.daysLeft)}`}
                    data-ocid={`dashboard.deadline.item.${idx + 1}`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${deadlineDot(dl.daysLeft)}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold leading-tight">
                          {dl.label}
                        </div>
                        <div className="text-[11px] opacity-75 mt-0.5">
                          {dl.sub}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[11px] font-bold">
                          {dl.daysLeft}d
                        </div>
                        <div className="text-[10px] opacity-60">{dl.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            {visibleRecs.length > 0 && (
              <Card
                className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-sm"
                data-ocid="dashboard.ai_recs_section"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {visibleRecs.map((rec, idx) => (
                    <div
                      key={rec.id}
                      className="bg-card rounded-lg border border-border p-2.5 group"
                      data-ocid={`dashboard.ai_rec.item.${idx + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-primary opacity-70">
                            {rec.icon}
                          </span>
                          <AIConfidenceBadge
                            confidence={rec.confidence}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            setDismissedRecs((prev) => [...prev, rec.id])
                          }
                          aria-label="Dismiss recommendation"
                          data-ocid={`dashboard.ai_rec.dismiss.${idx + 1}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rec.text}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
