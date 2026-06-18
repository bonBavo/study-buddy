import Dexie, { type EntityTable } from 'dexie';

interface Subject {
  id?: string;
  name: string;
  creditHours: number;
  difficulty: number;
}

interface Performance {
  id?: string;
  studentId: string;
  subjectId: string;
  score: number;
  studyHours: number;
  grade?: string;
  createdAt: number;
}

interface AIPrediction {
  id?: string;
  studentId: string;
  subjectId: string;
  predictedGrade: string;
  classification: string;
  finalScore: number;
  createdAt: number;
}

interface StudyRecommendation {
  id?: string;
  studentId: string;
  subjectId: string;
  recommendedHours: number;
  classification: string;
  createdAt: number;
}

interface Student {
  id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt: number;
}

const db = new Dexie('StudyBuddyDatabase') as Dexie & {
  subjects: EntityTable<Subject, 'id'>;
  performances: EntityTable<Performance, 'id'>;
  predictions: EntityTable<AIPrediction, 'id'>;
  recommendations: EntityTable<StudyRecommendation, 'id'>;
  students: EntityTable<Student, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  subjects: '++id, name',
  performances: '++id, studentId, subjectId, createdAt',
  predictions: '++id, studentId, subjectId',
  recommendations: '++id, studentId, subjectId',
  students: '++id, email'
});

export type { Subject, Performance, AIPrediction, StudyRecommendation, Student };
export { db };
