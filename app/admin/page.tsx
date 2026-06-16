import { Card } from "@/components/Card";
import { SummaryCard } from "@/components/SummaryCard";

export default function AdminPage() {
  return (
    <div>
      <header>
        <h1>Admin Panel</h1>
        <p className="subtitle">System overview and user management</p>
      </header>

      <div className="summary">
        <SummaryCard title="Total Users" value={1240} variant="primary" />
        <SummaryCard title="Active Today" value={450} variant="success" />
        <SummaryCard title="Inference Runs" value={120} variant="primary" />
      </div>

      <Card title="System Health">
        <table style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th>Uptime</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Authentication API</td>
              <td><span style={{ color: "var(--color-success)" }}>Healthy</span></td>
              <td>99.9%</td>
            </tr>
            <tr>
              <td>Inference Engine</td>
              <td><span style={{ color: "var(--color-success)" }}>Healthy</span></td>
              <td>98.5%</td>
            </tr>
            <tr>
              <td>Database</td>
              <td><span style={{ color: "var(--color-success)" }}>Healthy</span></td>
              <td>100%</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
