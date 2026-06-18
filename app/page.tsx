"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SummaryCard } from "@/components/SummaryCard";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function Home() {
  const stats = useLiveQuery(async () => {
    const subjectsCount = await db.subjects.count();
    const perfs = await db.performances.toArray();
    const totalHours = perfs.reduce((acc, curr) => acc + curr.studyHours, 0);
    const avgScore = perfs.length > 0 
      ? Math.round(perfs.reduce((acc, curr) => acc + curr.score, 0) / perfs.length)
      : 0;
    
    return {
      subjectsCount,
      totalHours,
      avgScore
    };
  }, []) || { subjectsCount: 0, totalHours: 0, avgScore: 0 };

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
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
          <Link href="/subjects" style={{ textDecoration: "none" }}>
            <Button variant="secondary">Manage Subjects</Button>
          </Link>
        </div>
      </Card>

      <div className="summary">
        <SummaryCard title="Subjects Tracked" value={stats.subjectsCount} variant="primary" />
        <SummaryCard title="Study Hours" value={`${stats.totalHours}h`} variant="success" />
        <SummaryCard title="Avg Score" value={`${stats.avgScore}%`} variant="error" />
      </div>
    </div>
  );
}
