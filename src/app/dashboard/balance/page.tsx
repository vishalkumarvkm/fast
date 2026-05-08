"use client";

import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockEmployees, mockApplications } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  CreditCard,
  Download,
  GraduationCap,
  History,
  Info,
  LineChart,
  PieChart,
  TrendingUp,
  Wallet,
  CheckCircle2,
} from "lucide-react";

export default function BenefitBalancePage() {
  const { currentUser } = useAppStore();
  const employee = mockEmployees.find((e) => e.id === currentUser?.id) || mockEmployees[0];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const myApplications = mockApplications.filter(a => a.employeeId === employee.id && a.status === 'Approved');
  const pendingApplications = mockApplications.filter(a => a.employeeId === employee.id && (a.status === 'PendingApproval' || a.status === 'Submitted' || a.status === 'UnderReview'));
  
  const pendingAmount = pendingApplications.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCredits = pendingApplications.reduce((acc, curr) => acc + curr.credits, 0);

  return (
    <Layout
      title="Benefit Balance Detail"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Balance Deep-dive" },
      ]}
    >
      <div className="p-6 space-y-6 max-w-6xl mx-auto bg-muted/20 min-h-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Tuition Benefit Ledger</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Detailed YTD utilization and projected balance for {employee.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm font-bold text-xs"><Download className="w-3.5 h-3.5" /> Statement (PDF)</Button>
          </div>
        </div>

        {/* Primary Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Financial Balance */}
           <Card className="border-primary/20 bg-primary/[0.02] shadow-sm">
              <CardHeader className="pb-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Wallet className="w-4 h-4 text-primary" />
                       <CardTitle className="text-sm font-bold">Financial Reimbursement ($)</CardTitle>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-transparent text-[10px] font-bold">
                       YTD 2026
                    </Badge>
                 </div>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-end justify-between">
                    <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Available Funds</p>
                       <div className="text-4xl font-bold font-display text-foreground">{formatCurrency(employee.tuitionBalance)}</div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Limit</p>
                       <p className="text-lg font-bold text-muted-foreground">{formatCurrency(employee.tuitionMax)}</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                       <span className="text-muted-foreground">Utilization</span>
                       <span>{Math.round((employee.tuitionUsed / employee.tuitionMax) * 100)}%</span>
                    </div>
                    <Progress value={(employee.tuitionUsed / employee.tuitionMax) * 100} className="h-2 bg-primary/10" />
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
                       <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Used (Actual)</p>
                       <p className="text-sm font-bold text-foreground">{formatCurrency(employee.tuitionUsed)}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-primary/20 shadow-sm">
                       <p className="text-[9px] font-bold text-primary uppercase mb-1">Projected (Pending)</p>
                       <p className="text-sm font-bold text-primary">{formatCurrency(pendingAmount)}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Credit Balance */}
           <Card className="border-violet-500/20 bg-violet-500/[0.02] shadow-sm">
              <CardHeader className="pb-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <GraduationCap className="w-4 h-4 text-violet-600" />
                       <CardTitle className="text-sm font-bold">Credit Cap Adherence</CardTitle>
                    </div>
                    <Badge className="bg-violet-100 text-violet-700 border-transparent text-[10px] font-bold">
                       Max 18/yr
                    </Badge>
                 </div>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-end justify-between">
                    <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Remaining Credits</p>
                       <div className="text-4xl font-bold font-display text-foreground">{employee.creditBalance} <span className="text-lg text-muted-foreground">Credits</span></div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Used</p>
                       <p className="text-lg font-bold text-muted-foreground">{employee.creditUsed} CR</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                       <span className="text-muted-foreground">Limit Progress</span>
                       <span>{Math.round((employee.creditUsed / employee.creditMax) * 100)}%</span>
                    </div>
                    <Progress value={(employee.creditUsed / employee.creditMax) * 100} className="h-2 bg-violet-100" />
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
                       <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Approved Credits</p>
                       <p className="text-sm font-bold text-foreground">{employee.creditUsed} CR</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-violet-200 shadow-sm">
                       <p className="text-[9px] font-bold text-violet-700 uppercase mb-1">In-Process Credits</p>
                       <p className="text-sm font-bold text-violet-700">{pendingCredits} CR</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              {/* Transaction History */}
              <Card className="border-border shadow-sm overflow-hidden">
                 <CardHeader className="py-4 border-b border-border bg-muted/10">
                    <div className="flex items-center gap-2">
                       <History className="w-4 h-4 text-primary" />
                       <CardTitle className="text-sm font-bold">Transaction Ledger</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="p-0">
                    <Table>
                       <TableHeader>
                          <TableRow className="bg-muted/30">
                             <TableHead className="text-[10px] font-bold uppercase px-6 h-10">Application Date</TableHead>
                             <TableHead className="text-[10px] font-bold uppercase h-10">Program / Institution</TableHead>
                             <TableHead className="text-[10px] font-bold uppercase h-10">Credits</TableHead>
                             <TableHead className="text-[10px] font-bold uppercase h-10 text-right pr-6">Amount Deducted</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {myApplications.length === 0 ? (
                            <TableRow>
                               <TableCell colSpan={4} className="h-32 text-center text-muted-foreground text-xs italic">
                                  No approved transactions in the current period.
                               </TableCell>
                            </TableRow>
                          ) : (
                            myApplications.map((app) => (
                              <TableRow key={app.id} className="hover:bg-muted/10 transition-colors">
                                 <TableCell className="px-6 text-xs font-medium text-muted-foreground">
                                    {new Date(app.submittedAt || '').toLocaleDateString()}
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex flex-col">
                                       <span className="text-xs font-bold">{app.institution}</span>
                                       <span className="text-[9px] text-muted-foreground">{app.courseTitle}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="text-xs font-bold">{app.credits} CR</TableCell>
                                 <TableCell className="text-right pr-6 text-xs font-bold text-foreground">
                                    {formatCurrency(app.amount)}
                                 </TableCell>
                              </TableRow>
                            ))
                          )}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>

              {/* Projections */}
              <Card className="border-border shadow-sm bg-gradient-to-br from-background to-muted/20">
                 <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 text-emerald-600" />
                       <CardTitle className="text-sm font-bold">Forecasted Year-End Balance</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-8">
                       <div className="flex-1 space-y-4">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                             Based on your current approved applications and the <span className="font-bold text-foreground font-mono">{pendingApplications.length}</span> applications currently in the review queue, your projected status is:
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Est. Final Balance ($)</p>
                                <p className="text-2xl font-bold text-foreground">{formatCurrency(employee.tuitionBalance - pendingAmount)}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Est. Final Balance (CR)</p>
                                <p className="text-2xl font-bold text-foreground">{employee.creditBalance - pendingCredits} CR</p>
                             </div>
                          </div>
                       </div>
                       <div className="w-full md:w-[200px] p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                          <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-tighter">Budget Healthy</p>
                          <p className="text-[10px] text-emerald-700 mt-1">You will remain within all Montefiore policy caps.</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           <aside className="space-y-6">
              <Card className="border-border shadow-sm">
                 <CardHeader className="py-3 border-b border-border bg-muted/20">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Balance Insights</CardTitle>
                 </CardHeader>
                 <CardContent className="p-5 space-y-5">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <LineChart className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Spend Trend</p>
                          <p className="text-[10px] text-muted-foreground">Your benefit utilization is 12% higher than the same period last year.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 flex-shrink-0">
                          <PieChart className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Category Split</p>
                          <p className="text-[10px] text-muted-foreground">80% of your benefit is being used for your 'BSN to MSN' degree path.</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-amber-500/20 bg-amber-500/5 shadow-sm">
                 <CardHeader className="py-3 border-b border-amber-500/10">
                    <div className="flex items-center gap-2 text-amber-700">
                       <Info className="w-4 h-4" />
                       <CardTitle className="text-xs font-bold uppercase tracking-widest">Policy Note</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="p-4">
                    <p className="text-[10px] text-amber-800/80 leading-relaxed italic">
                       "Unused Tuition Reimbursement balances do not roll over to the next calendar year. Credits are capped at 18 per rolling 12-month period."
                    </p>
                    <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-amber-700 mt-3 flex items-center gap-1">
                       View Policy Article 35 <ChevronRight className="w-3 h-3" />
                    </Button>
                 </CardContent>
              </Card>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
                 <CreditCard className="w-8 h-8 text-muted-foreground opacity-20" />
                 <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Reconciliation</p>
                    <p className="text-[10px] text-muted-foreground italic">Balances are synced with Workday every 24 hours.</p>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </Layout>
  );
}
