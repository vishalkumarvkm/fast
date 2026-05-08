"use client";

import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockApprovalItems } from "@/data/mockData";
import { useRouter } from "next/navigation";
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  User,
  Zap,
  AlertTriangle,
  Clock,
  DollarSign,
  XCircle,
} from "lucide-react";

export default function ApprovalsPage() {
  const router = useRouter();

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const formatDate = (ts: string | number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Layout
      title="Pending Approvals"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Approvals" },
      ]}
    >
      <div className="p-6 space-y-6 max-w-5xl mx-auto" data-ocid="approvals.page">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Manager Approvals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve reimbursement requests for your direct reports.
          </p>
        </div>

        <div className="grid gap-4">
          {mockApprovalItems.length === 0 ? (
            <Card className="border-border shadow-sm p-12 text-center text-muted-foreground">
              No pending approvals.
            </Card>
          ) : (
            mockApprovalItems.map((approval, idx) => (
              <Card
                key={approval.id}
                className="border-border shadow-sm hover:border-primary/30 transition-all group"
                data-ocid={`approvals.item.${idx + 1}`}
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            {approval.employeeName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Employee ID: {approval.employeeId}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold border-primary/20 text-primary">
                        {approval.programType}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                          Amount Requested
                        </p>
                        <p className="text-lg font-bold text-foreground flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-primary" />
                          {formatCurrency(approval.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                          Submission Date
                        </p>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatDate(approval.submittedDate)}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                          Due Date
                        </p>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(approval.dueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">
                          AI Smart Summary
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        &quot;{approval.aiSummary}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/30 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center gap-3 w-full md:w-56">
                    <Button className="w-full h-10 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button variant="outline" className="w-full h-10 gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => router.push(`/cases/${approval.applicationId}`)}
                    >
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
