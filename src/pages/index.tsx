import React from "react";
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";

import Layout from "./Layout";
import Dashboard from "./Dashboard";
import PhaseDiagrams from "./PhaseDiagrams";
import Equilibrium from "./Equilibrium";
import Properties from "./Properties";
import Projects from "./Projects";
import Diffusion from "./Diffusion";
import Calculations from "./Calculations";
import Settings from "./Settings";

const PAGES = {
    Dashboard,
    PhaseDiagrams,
    Equilibrium,
    Properties,
    Projects,
    Diffusion,
    Calculations,
    Settings,
};

type PageName = keyof typeof PAGES;

const getCurrentPage = (url: string): PageName => {
    const normalized = url.endsWith("/") ? url.slice(0, -1) : url;
    let urlLastPart = normalized.split("/").pop() ?? "";
    if (urlLastPart.includes("?")) {
        urlLastPart = urlLastPart.split("?")[0];
    }

    const pageNames = Object.keys(PAGES) as PageName[];
    return pageNames.find((page) => page.toLowerCase() === urlLastPart.toLowerCase()) ??
        pageNames[0];
};

// Uses useLocation inside Router context
const PagesContent: React.FC = () => {
    const location = useLocation();
    const currentPage = getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/PhaseDiagrams" element={<PhaseDiagrams />} />
                <Route path="/Equilibrium" element={<Equilibrium />} />
                <Route path="/Properties" element={<Properties />} />
                <Route path="/Projects" element={<Projects />} />
                <Route path="/Diffusion" element={<Diffusion />} />
                <Route path="/Calculations" element={<Calculations />} />
                <Route path="/Settings" element={<Settings />} />
            </Routes>
        </Layout>
    );
};

const Pages: React.FC = () => {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
};

export default Pages;
