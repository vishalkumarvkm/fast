import { mockAuthUsers } from "@/data/mockData";
import type {
  ApplicationStatus,
  AuthUser,
  SlaStatus,
  UserRole,
  WizardData,
  ChatMessage,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loginAs: (user: AuthUser) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

interface AppState {
  wizardStep: number;
  wizardData: WizardData;
  setWizardStep: (step: number) => void;
  updateWizardData: (data: Partial<WizardData>) => void;
  resetWizard: () => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  caseFilters: {
    status: ApplicationStatus | "All";
    slaStatus: SlaStatus | "All";
    assignedHR: string;
    search: string;
  };
  setCaseFilters: (filters: Partial<AppState["caseFilters"]>) => void;
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  unreadChatCount: number;
  setUnreadChatCount: (count: number) => void;
  hasSentProactive: boolean;
  setHasSentProactive: (sent: boolean) => void;
}

type StoreState = AuthState & AppState;


export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,

      loginAs: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      setRole: (role) =>
        set((state) => {
          if (!state.currentUser) return state;
          const userForRole = mockAuthUsers.find((u) => u.role === role);
          return { currentUser: userForRole ?? { ...state.currentUser, role } };
        }),

      wizardStep: 1,
      wizardData: {},
      setWizardStep: (step) => set({ wizardStep: step }),
      updateWizardData: (data) =>
        set((state) => ({ wizardData: { ...state.wizardData, ...data } })),
      resetWizard: () => set({ wizardStep: 1, wizardData: {} }),

      selectedCaseId: null,
      setSelectedCaseId: (id) => set({ selectedCaseId: id }),

      caseFilters: { status: "All", slaStatus: "All", assignedHR: "", search: "" },
      setCaseFilters: (filters) =>
        set((state) => ({ caseFilters: { ...state.caseFilters, ...filters } })),

      unreadNotificationCount: 5,
      setUnreadNotificationCount: (count) =>
        set({ unreadNotificationCount: count }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
      isChatOpen: false,
      setIsChatOpen: (open) => set({ isChatOpen: open }),
      chatMessages: [],
      addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [], hasSentProactive: false, unreadChatCount: 0 }),
      unreadChatCount: 0,
      setUnreadChatCount: (count) => set({ unreadChatCount: count }),
      hasSentProactive: false,
      setHasSentProactive: (sent) => set({ hasSentProactive: sent }),
    }),
    {
      name: "mtra-storage",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);
