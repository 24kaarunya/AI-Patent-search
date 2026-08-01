import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText, Search, Bookmark, Activity, Cpu,
  Sparkles, ArrowRight, ShieldCheck, History,
  Lightbulb, GitCompare, TrendingUp, Plus
} from "lucide-react";
import { authService } from "../../services/authService";
import { searchService } from "../../services/searchService";
import { patentService } from "../../services/patentService";
import { PatentTrendChart } from "../../components/charts/PatentTrendChart";
import { TechnologyChart } from "../../components/charts/TechnologyChart";
import { FilingTrendChart } from "../../components/charts/FilingTrendChart";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { formatDate } from "../../utils/formatters";

export function Dashboard() {
  const [currentUser] = useState(() => authService.getCurrentUser());
  const [history, setHistory] = useState([]);
  const [patents, setPatents] = useState([]);
  const [savedPatents, setSavedPatents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const logs = searchService.getSearchHistory(currentUser.email);
      setHistory(logs.slice(0, 4));
      setPatents(patentService.getPatents());
      setSavedPatents(searchService.getSavedPatents(currentUser.email));
    }
  }, [currentUser]);

  const totalSearches = searchService.getSearchHistory(currentUser?.email || "").length;
  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, l) => s + (l.topScore || 0), 0) / history.length)
    : 0;

  // Clickable stat cards — each navigates to its respective page
  const stats = [
    {
      label: "My Search Queries",
      value: totalSearches,
      icon: <Search size={22} style={{ color: "var(--accent-purple-mid)" }} />,
      to: "/history",
      color: "var(--accent-purple-mid)"
    },
    {
      label: "Bookmarked Patents",
      value: savedPatents.length,
      icon: <Bookmark size={22} style={{ color: "var(--accent-teal)" }} />,
      to: "/saved",
      color: "var(--accent-teal)"
    },
    {
      label: "Patent Database",
      value: patents.length,
      icon: <FileText size={22} style={{ color: "var(--accent-green)" }} />,
      to: "/search",
      color: "var(--accent-green)"
    },
    {
      label: "Avg Match Score",
      value: `${avgScore}%`,
      icon: <Activity size={22} style={{ color: "var(--accent-amber)" }} />,
      to: "/trends",
      color: "var(--accent-amber)"
    }
  ];

  // Quick actions — key user workflows
  const quickActions = [
    { label: "Analyze New Invention", icon: <Lightbulb size={18} />, to: "/invention", variant: "primary", desc: "Run AI prior-art search" },
    { label: "Browse Patent Search", icon: <Search size={18} />, to: "/search", variant: "secondary", desc: "Explore patent database" },
    { label: "Open Workspace", icon: <GitCompare size={18} />, to: "/workspace", variant: "secondary", desc: "Compare prior-art side-by-side" },
    { label: "View Trends", icon: <TrendingUp size={18} />, to: "/trends", variant: "secondary", desc: "Patent filing analytics" },
  ];

  const handleLaunchRecent = (log) => {
    navigate("/invention", { state: { loadedInvention: log } });
  };

  return (
    <div className="fade-in" style={{ textAlign: "left" }}>

      {/* Welcome Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", color: "#fff" }}>
            Welcome back, <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{currentUser?.name?.split(" ")[0] || "Inventor"}</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Review pipelines, explore patent trends, and discover novelty gaps in your inventions.
          </p>
        </div>
        <Link to="/invention" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> New Invention Analysis
        </Link>
      </div>

      {/* Clickable Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((stat, i) => (
          <Link key={i} to={stat.to} style={{ textDecoration: "none" }}>
            <Card style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderColor: "var(--border-color)", transition: "var(--transition-smooth)" }}
              className="stat-card-hover">
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
                <h3 style={{ fontSize: "1.8rem", color: "#fff", marginTop: "0.2rem" }}>{stat.value}</h3>
                <span style={{ fontSize: "0.72rem", color: stat.color, display: "flex", alignItems: "center", gap: "0.2rem", marginTop: "0.1rem" }}>
                  View details <ArrowRight size={10} />
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.6rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                {stat.icon}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Action Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {quickActions.map((action, i) => (
          <Link key={i} to={action.to} className={`btn btn-${action.variant}`}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.35rem", padding: "0.85rem 1rem", textDecoration: "none" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
              {action.icon} {action.label}
            </span>
            <span style={{ fontSize: "0.72rem", color: action.variant === "primary" ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>{action.desc}</span>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        <Card>
          <FilingTrendChart />
        </Card>
        <Card>
          <TechnologyChart />
        </Card>
        <Card>
          <PatentTrendChart />
        </Card>
      </div>

      {/* Recent Queries + Patent Sources */}
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.65fr", gap: "1.5rem" }}>

        {/* Recent Search History */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
            <h3 style={{ color: "#fff", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <History size={17} style={{ color: "var(--accent-purple-mid)" }} />
              Recent Invention Queries
            </h3>
            <Link to="/history" style={{ fontSize: "0.78rem", color: "var(--accent-purple-mid)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              All History <ArrowRight size={12} />
            </Link>
          </div>

          {history.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <Cpu size={32} style={{ color: "var(--border-glow)" }} />
              <p>No query history yet.</p>
              <Link to="/invention" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "0.5rem 1rem" }}>
                <Sparkles size={14} /> Start First Analysis
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {history.map(log => (
                <div
                  key={log.id}
                  onClick={() => handleLaunchRecent(log)}
                  style={{
                    padding: "0.85rem 1rem",
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "var(--transition-smooth)"
                  }}
                  className="sidebar-link-hover"
                  title="Click to re-run this invention analysis"
                >
                  <div style={{ flex: 1, marginRight: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{log.title}</span>
                      <Badge variant="teal">{log.domain}</Badge>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {formatDate(log.timestamp)} · {log.matchCount} patents matched · Top: {log.topScore}%
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                    <span style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: log.topScore > 70 ? "var(--accent-red)" : log.topScore > 40 ? "var(--accent-amber)" : "var(--accent-green)"
                    }}>
                      {log.topScore}%
                    </span>
                    <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right Sidebar Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Active Patent Sources */}
          <Card style={{ textAlign: "left" }}>
            <h3 style={{ color: "#fff", fontSize: "0.95rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={16} style={{ color: "var(--accent-teal)" }} />
              Active Patent Sources
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { source: "USPTO (United States)", count: patents.filter(p => p.source === "USPTO").length },
                { source: "EPO (European)", count: patents.filter(p => p.source === "EPO").length },
                { source: "WIPO (Global)", count: 0, pending: true },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{s.source}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: s.pending ? "var(--text-muted)" : "#fff" }}>
                    {s.pending ? "Pending" : `${s.count} Patents`}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/search" className="btn btn-secondary" style={{ marginTop: "0.85rem", padding: "0.5rem 0.75rem", fontSize: "0.8rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
              <Search size={13} /> Browse All Patents
            </Link>
          </Card>

          {/* Saved Patents Quick-Link */}
          <Card style={{ textAlign: "left" }}>
            <h3 style={{ color: "#fff", fontSize: "0.95rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bookmark size={16} style={{ color: "var(--accent-purple-mid)" }} />
              Bookmarked Patents
            </h3>
            {savedPatents.length === 0 ? (
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                No saved patents yet. Bookmark patents from your search results.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {savedPatents.slice(0, 3).map(p => (
                  <Link key={p.id} to={`/patents/details?id=${p.id}`}
                    style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", padding: "0.35rem 0.5rem", background: "rgba(255,255,255,0.01)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color-soft)", display: "flex", alignItems: "center", gap: "0.35rem", transition: "var(--transition-fast)" }}
                    className="sidebar-link-hover">
                    <Bookmark size={11} style={{ color: "var(--accent-purple-mid)" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.title}</span>
                  </Link>
                ))}
              </div>
            )}
            <Link to="/saved" style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--accent-purple-mid)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              View all bookmarks <ArrowRight size={11} />
            </Link>
          </Card>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
