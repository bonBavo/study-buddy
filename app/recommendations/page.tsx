"use client";

import { Card } from "@/components/Card";
import { CLASSIFICATIONS } from "@/types";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

interface Recommendation {
  subjectId: string;
  subjectName: string;
  classification: string;
  recommendedHours: number;
  avgScore: number;
}

export default function RecommendationsPage() {
  const recommendations = useLiveQuery(async () => {
    const subjects = await db.subjects.toArray();
    const performances = await db.performances.toArray();

    return subjects.map(s => {
      const subPerfs = performances.filter(p => p.subjectId === s.id);
      const avgScore = subPerfs.length > 0
        ? subPerfs.reduce((acc, curr) => acc + curr.score, 0) / subPerfs.length
        : 0;
      
      let classification: string = CLASSIFICATIONS.AVERAGE;
      let recommendedHours = 5;

      if (avgScore < 60) {
        classification = CLASSIFICATIONS.WEAK;
        recommendedHours = 10;
      } else if (avgScore >= 80) {
        classification = CLASSIFICATIONS.STRONG;
        recommendedHours = 2;
      }

      return {
        subjectId: s.id!,
        subjectName: s.name,
        classification,
        recommendedHours,
        avgScore: Math.round(avgScore)
      };
    });
  }, []) || [];

  const isLoading = recommendations.length === 0 && (useLiveQuery(() => db.subjects.count()) || 0) > 0;

  return (
    <div>
      <header>
        <h1>Study Recommendations</h1>
        <p className="subtitle">AI-powered suggestions to optimize your study time</p>
      </header>

      <Card title="Suggested Study Plan">
        {isLoading ? (
          <p>Analyzing your performance...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ marginTop: "10px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Suggested Hours/Week</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>Add subjects and log performance to see recommendations.</td>
                  </tr>
                ) : (
                  recommendations.map((rec) => (
                    <tr key={rec.subjectId}>
                      <td>
                        <span style={{ 
                          color: rec.classification === CLASSIFICATIONS.WEAK ? "var(--color-error)" : 
                                 rec.classification === CLASSIFICATIONS.AVERAGE ? "var(--color-warning)" : 
                                 "var(--color-success)" 
                        }}>
                          {rec.classification === CLASSIFICATIONS.WEAK ? "🔥 High" : 
                           rec.classification === CLASSIFICATIONS.AVERAGE ? "⚡ Medium" : "✅ Low"}
                        </span>
                      </td>
                      <td>{rec.subjectName}</td>
                      <td>{rec.classification} (Avg: {rec.avgScore}%)</td>
                      <td><strong>{rec.recommendedHours} hours</strong></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div style={{ marginTop: "20px" }}>
        <Card title="Tips for Success">
          <ul style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
            <li>Focus on <strong>High Priority</strong> subjects first to bridge knowledge gaps.</li>
            <li>Maintain your <strong>Strong</strong> subjects with consistent, shorter review sessions.</li>
            <li>Log your study hours daily in the <strong>Data Entry</strong> section for better accuracy.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
