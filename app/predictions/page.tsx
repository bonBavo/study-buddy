"use client";

import { Card } from "@/components/Card";
import { CLASSIFICATIONS } from "@/types";
import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

interface Prediction {
  subjectId: string;
  subjectName: string;
  classification: string;
  avgScore: number;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch("/api/recommendations");
        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error("Failed to fetch predictions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const getBarColor = (classification: string) => {
    switch (classification) {
      case CLASSIFICATIONS.WEAK: return "var(--color-error)";
      case CLASSIFICATIONS.AVERAGE: return "var(--color-warning)";
      case CLASSIFICATIONS.STRONG: return "var(--color-success)";
      default: return "var(--color-primary)";
    }
  };

  return (
    <div>
      <header>
        <h1>AI Predictions</h1>
        <p className="subtitle">Forecasted academic standing based on current trends</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
        <Card title="Performance Distribution">
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="subjectName" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  itemStyle={{ color: "var(--color-text-primary)" }}
                />
                <Bar dataKey="avgScore" name="Average Score (%)">
                  {predictions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.classification)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Subject Status">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Predicted Standing</th>
                </tr>
              </thead>
              <tbody>
                {predictions.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", padding: "20px" }}>No data available.</td>
                  </tr>
                ) : (
                  predictions.map((p) => (
                    <tr key={p.subjectId}>
                      <td>{p.subjectName}</td>
                      <td>
                         <span style={{ 
                          color: getBarColor(p.classification),
                          fontWeight: "600"
                        }}>
                          {p.classification}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card title="AI Analysis Note" style={{ marginTop: "20px" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          The predictions are calculated using your recent scores and study hour efficiency. 
          A <strong>Weak</strong> classification suggests that current study patterns may not be enough to achieve mastery, while <strong>Strong</strong> indicates excellent retention and performance.
        </p>
      </Card>
    </div>
  );
}
