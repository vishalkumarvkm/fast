"use client";

import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockNotifications } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import {
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  AlertTriangle,
  BookOpen,
  Info,
  ChevronRight,
  Mail,
  MessageSquare,
  Smartphone,
  History,
} from "lucide-react";
import { useState } from "react";

const NOTIF_ICONS: Record<string, any> = {
  approval: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  deadline: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  status_change: { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  sla: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  document: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  system: { icon: Info, color: "text-muted-foreground", bg: "bg-muted" },
};

const CHANNEL_ICONS: Record<string, any> = {
  email: Mail,
  sms: Smartphone,
  portal: Bell,
  servicenow: MessageSquare,
};

export default function NotificationCenter() {
  const { currentUser } = useAppStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredNotifs = mockNotifications.filter((n) => {
    const matchesFilter = filter === "all" || n.type === filter;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                         n.message.toLowerCase().includes(search.toLowerCase());
    const matchesUser = n.userId === currentUser?.id || currentUser?.role === 'hr';
    return matchesFilter && matchesSearch && matchesUser;
  });

  return (
    <Layout
      title="Notification Center"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notifications" },
      ]}
    >
      <div className="p-6 space-y-6 max-w-5xl mx-auto bg-muted/20 min-h-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Communication Hub</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Audit trail of all automated alerts, approvals, and system messages</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4 font-bold text-xs">Mark All Read</Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0"><History className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                 placeholder="Search notifications..." 
                 className="h-10 pl-9 text-xs bg-card"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px] h-10 text-xs bg-card">
                 <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">All Types</SelectItem>
                 <SelectItem value="approval">Approvals</SelectItem>
                 <SelectItem value="deadline">Deadlines</SelectItem>
                 <SelectItem value="document">Documents</SelectItem>
                 <SelectItem value="status_change">Status Updates</SelectItem>
              </SelectContent>
           </Select>
        </div>

        <Card className="border-border shadow-sm overflow-hidden">
           <CardContent className="p-0 divide-y divide-border">
              {filteredNotifs.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                   <Bell className="w-12 h-12 mx-auto mb-3 opacity-10" />
                   <p className="text-sm font-medium">No notifications found</p>
                </div>
              ) : (
                filteredNotifs.map((notif, idx) => {
                  const typeInfo = NOTIF_ICONS[notif.type] || NOTIF_ICONS.system;
                  const NotifIcon = typeInfo.icon;

                  return (
                    <div key={notif.id} className={`flex items-start gap-4 p-5 transition-colors group relative ${notif.read ? 'bg-card' : 'bg-primary/[0.02]'}`}>
                       {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.bg} ${typeInfo.color}`}>
                          <NotifIcon className="w-5 h-5" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                             <div className="flex items-center gap-2">
                                <h3 className={`text-sm font-bold ${notif.read ? 'text-foreground' : 'text-primary'}`}>{notif.title}</h3>
                                {!notif.read && <Badge className="h-4 px-1 text-[8px] uppercase tracking-tighter">New</Badge>}
                             </div>
                             <span className="text-[10px] text-muted-foreground font-medium">{new Date(notif.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">{notif.message}</p>
                          <div className="flex items-center gap-4 mt-3">
                             <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Channels:</span>
                                <div className="flex gap-1">
                                   <Badge variant="outline" className="h-4 px-1.5 gap-1 border-border/50 text-muted-foreground/60"><Mail className="w-2.5 h-2.5" /> Email</Badge>
                                   <Badge variant="outline" className="h-4 px-1.5 gap-1 border-border/50 text-muted-foreground/60"><MessageSquare className="w-2.5 h-2.5" /> Portal</Badge>
                                </div>
                             </div>
                             {notif.actionUrl && (
                               <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold gap-1 text-primary">
                                  View Related Application <ChevronRight className="w-3 h-3" />
                                </Button>
                             )}
                          </div>
                       </div>
                    </div>
                  );
                })
              )}
           </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
