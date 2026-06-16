"use client";

import { Card } from "@/components/Card";
import { CLASSIFICATIONS } from "@/types";
import { useEffect, useState } from "react";

interface Recommendation {
  subjectId: string;
  subjectName: string;
  classification: string;
  recommendedHours: number;
  avgScore: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations");
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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
