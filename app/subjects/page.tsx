"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { DIFFICULTY_LEVELS, subjectSchema, SubjectInput } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { db, Subject } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function SubjectsPage() {
  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];
  const isLoading = subjects === undefined;
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SubjectInput>({
    resolver: zodResolver(subjectSchema) as any,
    defaultValues: {
      name: "",
      creditHours: 1,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
    }
  });

  const onSubmit = async (data: SubjectInput) => {
    try {
      if (editingId) {
        await db.subjects.update(editingId, data);
      } else {
        await db.subjects.add(data);
      }
      reset();
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save subject", error);
    }
  };

  const handleEdit = (subject: Subject) => {
    if (!subject.id) return;
    setEditingId(subject.id);
    setValue("name", subject.name);
    setValue("creditHours", subject.creditHours);
    setValue("difficulty", subject.difficulty);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this subject?")) return;
    
    try {
      await db.subjects.delete(id);
      // Also delete related performances (Manual cascade for Dexie)
      await db.performances.where("subjectId").equals(id).delete();
      await db.predictions.where("subjectId").equals(id).delete();
      await db.recommendations.where("subjectId").equals(id).delete();
    } catch (error) {
      console.error("Failed to delete subject", error);
    }
  };

  return (
    <div>
      <header>
        <h1>Manage Subjects</h1>
        <p className="subtitle">Add or edit your study subjects</p>
      </header>

      <Card title={editingId ? "Edit Subject" : "Add New Subject"}>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", display: "grid", gap: "15px" }}>
          <div>
            <Input {...register("name")} placeholder="Subject Name" />
            {errors.name && <p className="error-message" style={{ marginTop: "5px" }}>{errors.name.message}</p>}
          </div>
          <div>
            <Input {...register("creditHours")} type="number" placeholder="Credit Hours" />
            {errors.creditHours && <p className="error-message" style={{ marginTop: "5px" }}>{errors.creditHours.message}</p>}
          </div>
          <div>
            <select 
              {...register("difficulty")}
              style={{ 
                background: "var(--color-background)", 
                border: "1px solid var(--color-border)", 
                color: "var(--color-text-primary)", 
                padding: "12px", 
                borderRadius: "8px",
                width: "100%",
                height: "100%"
              }}
            >
              <option value={DIFFICULTY_LEVELS.EASY}>Easy</option>
              <option value={DIFFICULTY_LEVELS.MEDIUM}>Medium</option>
              <option value={DIFFICULTY_LEVELS.HARD}>Hard</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
             <Button type="submit" style={{ flex: 1 }}>{editingId ? "Update" : "Add"}</Button>
             {editingId && <Button type="button" onClick={() => { setEditingId(null); reset(); }} variant="secondary" style={{ flex: 1 }}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <Card title="Current Subjects" style={{ marginTop: "20px" }}>
        {isLoading ? (
          <p>Loading subjects...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ marginTop: "10px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Credit Hours</th>
                  <th>Difficulty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>No subjects added yet.</td>
                  </tr>
                ) : (
                  subjects.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.creditHours}</td>
                      <td>
                        <span style={{ 
                          color: s.difficulty === DIFFICULTY_LEVELS.HARD ? "var(--color-error)" : 
                                 s.difficulty === DIFFICULTY_LEVELS.MEDIUM ? "var(--color-warning)" : 
                                 "var(--color-success)" 
                        }}>
                          {s.difficulty === DIFFICULTY_LEVELS.HARD ? "Hard" : 
                           s.difficulty === DIFFICULTY_LEVELS.MEDIUM ? "Medium" : "Easy"}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: "10px" }}>
                        <Button onClick={() => handleEdit(s)} variant="secondary" style={{ padding: "5px 10px" }}>Edit</Button>
                        <Button onClick={() => handleDelete(s.id)} variant="delete" style={{ padding: "5px 10px" }}>Delete</Button>
                      </td>
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
