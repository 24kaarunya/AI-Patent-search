import React from "react";
import { TrendingUp, FileText, Globe, Award, Sparkles } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { PatentTrendChart } from "../../components/charts/PatentTrendChart";
import { TechnologyChart } from "../../components/charts/TechnologyChart";
import { FilingTrendChart } from "../../components/charts/FilingTrendChart";

export function PatentTrends() {
  return (
    <div className="fade-in" style={{ textAlign: "left" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp size={24} style={{ color: "var(--accent-teal)" }} />
          Intellectual Property & Filing Trends
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Global intellectual property analytics, sector volume metrics, and domain projections.
        </p>
      </div>

      {/* Grid of Main Charts */}
      <div className="grid-3" style={{ marginBottom: "2rem" }}>
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

      {/* Narrative Analytics & Leaders Board */}
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem" }}>
        
        {/* Market Insights */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Globe size={18} style={{ color: "var(--accent-teal)" }} />
            AI Patent Sector Insights (2026)
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            <p>
              <strong style={{ color: "#fff" }}>1. Acceleration in Edge AI:</strong> Edge-inference patent filings (processing sensor inputs without external server backends) have experienced a <span style={{ color: "var(--accent-green)" }}>45% Year-over-Year increase</span>. This correlates with user privacy demands, as seen in offline wake-word and smart home systems.
            </p>
            <p>
              <strong style={{ color: "#fff" }}>2. Healthcare Wearables Boom:</strong> The integration of continuous diagnostic biosensors (ECG patches, blood oxygenation micro-sensors) onto flexible polymer adhesives is leading medical IoT filings, driven by cloud anomaly alerts.
            </p>
            <p>
              <strong style={{ color: "#fff" }}>3. Dynamic Renewable Trackers:</strong> Solar patent spaces show dynamic tilt tracking and high wind stowage mechanisms replacing static frame panels to maximize grid efficiency coefficients.
            </p>
          </div>
        </Card>

        {/* Global Assignee Leaders */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award size={18} style={{ color: "var(--accent-purple)" }} />
            Top Filing Assignees
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>1. SafeMotion Technologies Inc.</span>
              <Badge variant="purple">IoT + AI</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>2. BioStream Diagnostics Corp.</span>
              <Badge variant="teal">Health IoT</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>3. SkyDrop Aero Labs</span>
              <Badge variant="green">Robotics</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>4. PrismHome Systems LLC</span>
              <Badge variant="amber">Home IoT</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>5. LedgerLogix SA</span>
              <Badge variant="purple">Crypto</Badge>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
}

export default PatentTrends;
