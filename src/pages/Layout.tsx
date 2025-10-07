"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import {
    LayoutDashboard,
    Activity,
    Beaker,
    Database,
    FolderOpen,
    Settings,
    ChevronLeft,
    ChevronRight,
    Atom,
    Menu,
    X,
    Wind,
    History,
} from "lucide-react";
import { motion } from "framer-motion";
import {createPageUrl} from "../components/utils";
import { Button } from "../components/ui/button";

/* ---------------- Types ---------------- */
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type NavItem = {
    title: string;
    url: string;
    icon: IconType;
};

type LayoutProps = {
    children: React.ReactNode;
};

/* ---------------- Data ---------------- */
const navigationItems: ReadonlyArray<NavItem> = [
    {
        title: "Dashboard",
        url: createPageUrl("Dashboard"),
        icon: LayoutDashboard,
    },
    {
        title: "Phase Diagrams",
        url: createPageUrl("PhaseDiagrams"),
        icon: Activity,
    },
    {
        title: "Equilibrium",
        url: createPageUrl("Equilibrium"),
        icon: Beaker,
    },
    {
        title: "Diffusion",
        url: createPageUrl("Diffusion"),
        icon: Wind,
    },
    {
        title: "Properties",
        url: createPageUrl("Properties"),
        icon: Database,
    },
    {
        title: "Projects",
        url: createPageUrl("Projects"),
        icon: FolderOpen,
    },
    {
        title: "Calculations History",
        url: createPageUrl("Calculations"),
        icon: History,
    },
] as const;

/* ---------------- Component ---------------- */
export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Load collapsed state from localStorage and persist it
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem("sidebar-collapsed");
            return saved === "true";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setMobileOpen(false);
        }
    }, [location.pathname, isMobile]);

    // Persist collapsed state to localStorage
    const handleToggleCollapse = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        try {
            localStorage.setItem("sidebar-collapsed", String(newCollapsed));
        } catch {
            // ignore write errors (e.g., private mode)
        }
    };

    // Determine if sidebar should show collapsed (only on desktop)
    const isCollapsed = collapsed && !isMobile;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div
                className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"
                style={{ animationDelay: "1s" }}
            />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Atom className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm">ThermoCalc</h2>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen((v) => !v)}
                        className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-4 top-4 bottom-4 z-50 backdrop-blur-xl bg-slate-900/40 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]") : "translate-x-0"
                }`}
                style={{ width: isCollapsed ? "80px" : "280px" }}
            >
                {/* Header */}
                <div className="p-4 lg:p-6 border-b border-slate-700/50 flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Atom className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden lg:block">
                                <h2 className="font-bold text-white text-lg">ThermoCalc</h2>
                                <p className="text-xs text-slate-400">Materials Science</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleCollapse}
                        className="text-slate-400 hover:text-white hover:bg-slate-800/50 hidden lg:flex"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.url;
                        const Icon = item.icon;
                        return (
                            <Link key={item.title} to={item.url} onClick={() => setMobileOpen(false)}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        isActive
                                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                                    {isActive && !isCollapsed && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                {!isCollapsed && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
                        <Link to={createPageUrl("Settings")} onClick={() => setMobileOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                                <Settings className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">Settings</span>
                            </div>
                        </Link>
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main
                className="pt-16 lg:pt-0 transition-all duration-300 px-4 lg:px-0"
                style={{
                    marginLeft: !isMobile ? (isCollapsed ? "100px" : "300px") : "0",
                    marginRight: !isMobile ? "1rem" : "0",
                    paddingTop: !isMobile ? "1rem" : undefined,
                    paddingBottom: !isMobile ? "1rem" : undefined,
                }}
            >
                <div className="min-h-[calc(100vh-2rem)]">{children}</div>
            </main>
        </div>
    );
}
