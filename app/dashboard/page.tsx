"use client";

import { Card } from "@/components/Card";
import { SummaryCard } from "@/components/SummaryCard";
import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line 
} from "recharts";
import Link from "next/link";
import { Button } from "@/components/Button";

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [subsRes, perfRes] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/performance")
        ]);
        
        const subjects = await subsRes.json();
        const performances = await perfRes.json();

        // Calculate stats
        const totalSubjects = subjects.length;
        const averageScore = performances.length > 0 
          ? Math.round(performances.reduce((acc: number, curr: any) => acc + curr.score, 0) / performances.length)
          : 0;
        
        // Simple logic for weak subjects (avg score < 60)
        const subjectAverages: Record<string, { total: number, count: number }> = {};
        performances.forEach((p: any) => {
          if (!subjectAverages[p.subject.name]) {
            subjectAverages[p.subject.name] = { total: 0, count: 0 };
          }
          subjectAverages[p.subject.name].total += p.score;
          subjectAverages[p.subject.name].count += 1;
        });

        const weakSubjects = Object.values(subjectAverages).filter(s => (s.total / s.count) < 60).length;

        // Prepare chart data (latest score per subject)
        const performanceData = subjects.map((s: any) => {
          const subPerf = performances.filter((p: any) => p.subjectId === s.id);
          const latestScore = subPerf.length > 0 ? subPerf[0].score : 0;
          const totalHours = subPerf.reduce((acc: number, curr: any) => acc + curr.studyHours, 0);
          return {
            subject: s.name,
            score: latestScore,
            studyHours: totalHours
          };
        });

        setStats({
          totalSubjects,
          averageScore,
          weakSubjects,
          performanceData
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
