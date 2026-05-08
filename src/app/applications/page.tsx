"use client";

import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockApplications, mockPrograms } from "@/data/mockData";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Download,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export default function ApplicationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredApps = mockApplications.filter(
    (app) =>
      app.institution.toLowerCase().includes(search.toLowerCase()) ||
      app.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase()),
  );

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const formatDate = (ts: number | string) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Layout
      title="My Applications"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Applications" },
      ]}
    >
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto" data-ocid="applications.page">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-display text-foreground">
              My Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage your reimbursement requests.
            </p>
          </div>
          <Button onClick={() => router.push("/apply")} className="gap-2 w-full sm:w-auto shadow-sm">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </div>

        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-border bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-background"
                  data-ocid="applications.search_input"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                <Button variant="outline" size="sm" className="h-9 gap-2 whitespace-nowrap">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-2 whitespace-nowrap">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Sort
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-2 whitespace-nowrap">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/50">
                    <TableHead className="w-[120px] font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Details</TableHead>
                    <TableHead className="font-semibold">Program</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Submitted</TableHead>
                    <TableHead className="font-semibold text-center">
                      Status
                    </TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-64 text-center text-muted-foreground"
                      >
                        No applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApps.map((app, idx) => (
                      <TableRow
                        key={app.id}
                        className="cursor-pointer group"
                        onClick={() => router.push(`/applications/${app.id}`)}
                        data-ocid={`applications.row.${idx + 1}`}
                      >
                        <TableCell className="font-mono text-[10px] font-semibold text-muted-foreground">
                          {app.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">
                            {app.institution}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {app.courseTitle}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-medium whitespace-nowrap"
                          >
                            {mockPrograms.find((p) => p.programType === app.programType)?.name ?? app.programType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {formatCurrency(app.amount)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(app.submittedAt ?? app.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={app.status} />
                        </TableCell>
                        <TableCell className="text-right px-4">
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-border">
              {filteredApps.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No applications found.
                </div>
              ) : (
                filteredApps.map((app, idx) => (
                  <div
                    key={app.id}
                    className="p-4 active:bg-muted transition-colors flex flex-col gap-3"
                    onClick={() => router.push(`/applications/${app.id}`)}
                    data-ocid={`applications.card.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                            {app.id}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            • {formatDate(app.submittedAt ?? app.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground text-sm line-clamp-1">
                          {app.institution}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {app.courseTitle}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <Badge
                        variant="outline"
                        className="text-[9px] font-medium bg-muted/30"
                      >
                        {mockPrograms.find((p) => p.programType === app.programType)?.name ?? app.programType}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground">
                          {formatCurrency(app.amount)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
