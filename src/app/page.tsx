"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { mockAuthUsers } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import type { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ChevronRight,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";

const ROLES: {
  id: UserRole;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: "employee",
    title: "Employee",
    desc: "Apply for tuition or CME reimbursement and track benefits.",
    icon: User,
    color: "bg-blue-500",
  },
  {
    id: "manager",
    title: "Manager",
    desc: "Review and approve employee reimbursement requests.",
    icon: Users,
    color: "bg-violet-500",
  },
  {
    id: "hr",
    title: "HR Specialist",
    desc: "Manage policy, compliance, and process applications.",
    icon: ShieldCheck,
    color: "bg-teal-500",
  },
  {
    id: "admin",
    title: "Administrator",
    desc: "Full system control and advanced reporting.",
    icon: Briefcase,
    color: "bg-slate-700",
  },
];

export default function RootPage() {
  const router = useRouter();
  const { loginAs, isAuthenticated } = useAppStore();
  const [loading, setLoading] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSelectRole = async (role: UserRole) => {
    setLoading(role);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 600));
    
    // Find a mock user with that role
    const user = mockAuthUsers.find((u) => u.role === role) || mockAuthUsers[0];
    loginAs({ ...user, role });
    
    router.push("/dashboard");
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-muted-foreground">Redirecting to Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome to MTRA"
      subtitle="Select your portal to access the Montefiore Tuition Reimbursement Assistant."
    >
      <div className="grid gap-3" data-ocid="login.role_selection">
        {ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            disabled={loading !== null}
            onClick={() => handleSelectRole(role.id)}
            className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left disabled:opacity-50"
            data-ocid={`login.role.${role.id}`}
          >
            <div
              className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center text-white shadow-sm flex-shrink-0 transition-transform group-hover:scale-110`}
            >
              {loading === role.id ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <role.icon className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-foreground block mb-0.5">
                {role.title}
              </span>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {role.desc}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
          Enterprise Security Enabled
        </p>
        <div className="mt-4 flex items-center justify-center gap-6 opacity-30 grayscale">
           <div className="h-4 w-12 bg-foreground/20 rounded" />
           <div className="h-4 w-12 bg-foreground/20 rounded" />
           <div className="h-4 w-12 bg-foreground/20 rounded" />
        </div>
      </div>
    </AuthLayout>
  );
}
