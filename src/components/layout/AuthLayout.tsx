import { Activity, Brain, CheckCircle2, BarChart3, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.32 0.16 240) 0%, oklch(0.22 0.14 240) 40%, oklch(0.28 0.18 170) 100%)",
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative circles */}
        <div
          className="absolute top-1/4 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/2"
          style={{ background: "oklch(0.7 0.14 170)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 left-0 w-60 h-60 rounded-full opacity-10 -translate-x-1/2"
          style={{ background: "oklch(0.6 0.15 240)" }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold font-display text-lg leading-none">
                MTRA
              </div>
              <div className="text-white/60 text-xs">
                Montefiore Health System
              </div>
            </div>
          </div>

          <h2 className="text-white font-display font-bold text-3xl leading-tight mb-4">
            Tuition Reimbursement
            <br />
            Agent Platform
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            AI-powered tuition reimbursement management for Montefiore Health
            System employees. NYSNA Article 35 compliant.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: Brain, text: "AI document extraction & verification", color: "text-blue-400" },
            { icon: CheckCircle2, text: "NYSNA 45-day SLA compliance tracking", color: "text-emerald-400" },
            { icon: BarChart3, text: "IRS §127 tax optimization", color: "text-amber-400" },
            { icon: ShieldCheck, text: "SOC 2 Type II certified platform", color: "text-orange-400" },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-white/80 text-sm font-medium"
            >
              <feature.icon className={`w-4 h-4 ${feature.color}`} />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Montefiore Health System. Powered
            by MTRA.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold font-display text-foreground">
              MTRA
            </div>
            <div className="text-[10px] text-muted-foreground">
              Montefiore Health System
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-2xl font-bold font-display text-foreground mb-1">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Montefiore Health System. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
