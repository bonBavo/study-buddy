import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SummaryCard } from "@/components/SummaryCard";

export default function Home() {
  return (
    <div>
      <header>
        <h1>Study Buddy</h1>
        <p className="subtitle">Your AI-powered study companion to ace your exams</p>
      </header>

      <Card className="text-center" style={{ textAlign: "center" }}>
        <h2>Welcome to the Future of Studying</h2>
        <p style={{ marginBottom: "25px", color: "var(--color-text-secondary)" }}>
          Track your progress, get AI predictions, and follow personalized study recommendations.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <Button variant="tab" active>Login</Button>
          </Link>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <Button variant="tab">Register</Button>
          </Link>
        </div>
      </Card>

      <div className="summary">
        <SummaryCard title="Subjects Tracked" value={0} variant="primary" />
        <SummaryCard title="Study Hours" value="0h" variant="success" />
        <SummaryCard title="Avg Score" value="0%" variant="error" />
      </div>
    </div>
  );
}
