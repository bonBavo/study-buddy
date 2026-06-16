"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { performanceSchema, PerformanceInput } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Subject, Performance } from "@prisma/client";

type PerformanceWithSubject = Performance & { subject: Subject };

export default function DataEntryPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [history, setHistory] = useState<PerformanceWithSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PerformanceInput>({
    resolver: zodResolver(performanceSchema) as any,
    defaultValues: {
      subjectId: "",
      score: 0,
      studyHours: 0,
    }
  });

  const fetchData = async () => {
    try {
      const [subsRes, perfRes] = await Promise.all([
        fetch("/api/subjects"),
        fetch("/api/performance")
      ]);
      const subsData = await subsRes.json();
      const perfData = await perfRes.json();
      setSubjects(subsData);
      setHistory(perfData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: PerformanceInput) => {
    try {
      const response = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        fetchData();
      } else {
        const err = await response.json();
        alert(err.error || "Failed to save record");
      }
    } catch (error) {
      console.error("Failed to save record", error);
    }
  };

  return (
    <div>
      <header>
        <h1>Data Entry</h1>
        <p className="subtitle">Log your study hours and exam scores</p>
      </header>

      <Card title="Log New Performance">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", display: "grid", gap: "15px" }}>
          <div>
            <select 
              {...register("subjectId")}
              style={{ 
                background: "var(--color-background)", 
                border: "1px solid var(--color-border)", 
                color: "var(--color-text-primary)", 
                padding: "12px", 
                borderRadius: "8px",
                width: "100%"
              }}
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.subjectId && <p className="error-message" style={{ marginTop: "5px" }}>{errors.subjectId.message}</p>}
          </div>
          <div>
            <Input {...register("score")} type="number" placeholder="Score (0-100)" />
            {errors.score && <p className="error-message" style={{ marginTop: "5px" }}>{errors.score.message}</p>}
          </div>
          <div>
            <Input {...register("studyHours")} type="number" step="0.5" placeholder="Study Hours" />
            {errors.studyHours && <p className="error-message" style={{ marginTop: "5px" }}>{errors.studyHours.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Record"}
          </Button>
        </form>
      </Card>

      <Card title="Recent History" style={{ marginTop: "20px" }}>
        {isLoading ? (
          <p>Loading history...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ marginTop: "10px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Study Hours</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>No records found.</td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h.id}>
                      <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                      <td>{h.subject.name}</td>
                      <td style={{ 
                        color: h.score >= 70 ? "var(--color-success)" : 
                               h.score >= 50 ? "var(--color-warning)" : 
                               "var(--color-error)" 
                      }}>
                        {h.score}%
                      </td>
                      <td>{h.studyHours} hrs</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
