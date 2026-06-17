"use client";

import { Card } from "@/components/Card";
import { SummaryCard } from "@/components/SummaryCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import Link from "next/link";
import { Button } from "@/components/Button";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

interface DashboardStats {
  totalSubjects: number;
  averageScore: number;
  weakSubjects: number;
  performanceData: {
    subject: string;
    score: number;
    studyHours: number;
  }[];
}

export default function DashboardPage() {
  const stats = useLiveQuery(async () => {
    const subjects = await db.subjects.toArray();
    const performances = await db.performances.toArray();
    
    // Resolve subjects for performances
    const performancesWithSubject = await Promise.all(performances.map(async (p) => ({
      ...p,
      subject: await db.subjects.get(p.subjectId)
    })));

    // Calculate stats
    const totalSubjects = subjects.length;
    const averageScore = performances.length > 0 
      ? Math.round(performances.reduce((acc, curr) => acc + curr.score, 0) / performances.length)
      : 0;
    
    // Simple logic for weak subjects (avg score < 60)
    const subjectAverages: Record<string, { total: number, count: number }> = {};
    performancesWithSubject.forEach((p) => {
      const subName = p.subject?.name || "Deleted Subject";
      if (!subjectAverages[subName]) {
        subjectAverages[subName] = { total: 0, count: 0 };
      }
      subjectAverages[subName].total += p.score;
      subjectAverages[subName].count += 1;
    });

    const weakSubjects = Object.values(subjectAverages).filter(s => (s.total / s.count) < 60).length;

    // Prepare chart data (latest score per subject)
    const performanceData = subjects.map((s) => {
      const subPerf = performances.filter((p) => p.subjectId === s.id)
        .sort((a, b) => b.createdAt - a.createdAt);
      const latestScore = subPerf.length > 0 ? subPerf[0].score : 0;
      const totalHours = subPerf.reduce((acc, curr) => acc + curr.studyHours, 0);
      return {
        subject: s.name,
        score: latestScore,
        studyHours: totalHours
      };
    });

    return {
      totalSubjects,
      averageScore,
      weakSubjects,
      performanceData
    } as DashboardStats;
  }, []) || null;

  const isLoading = stats === null;

  if (isLoading) return <p>Loading Dashboard...</p>;

  return (
    <div>
      <header>
        <h1>Study Dashboard</h1>
        <p className="subtitle">Overview of your academic performance</p>
      </header>

      <div className="summary">
        <SummaryCard title="Total Subjects" value={stats?.totalSubjects.toString() || "0"} />
        <SummaryCard title="Avg Score" value={`${stats?.averageScore}%`} variant="primary" />
        <SummaryCard title="Weak Subjects" value={stats?.weakSubjects.toString() || "0"} variant="error" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
        <Card title="Score vs Study Hours">
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="subject" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip 
                  contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  itemStyle={{ color: "var(--color-text-primary)" }}
                />
                <Legend />
                <Bar dataKey="score" name="Latest Score (%)" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="studyHours" name="Total Hours" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "center", height: "100%" }}>
            <p>Ready to improve your grades?</p>
            <Link href="/predictions">
              <Button style={{ width: "100%" }}>View AI Predictions</Button>
            </Link>
            <Link href="/recommendations">
              <Button variant="secondary" style={{ width: "100%" }}>Study Recommendations</Button>
            </Link>
            <Link href="/data-entry">
              <Button variant="secondary" style={{ width: "100%" }}>Log New Data</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
