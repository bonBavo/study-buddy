import { NextResponse } from "next/server";
import { CLASSIFICATIONS } from "@/types";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const subjects = await prisma.subject.findMany({
      include: {
        performances: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });

    const recommendations = subjects.map(subject => {
      const perfs = subject.performances;
      const avgScore = perfs.length > 0 
        ? perfs.reduce((acc, curr) => acc + curr.score, 0) / perfs.length 
        : 0;
      
      let classification: string = CLASSIFICATIONS.AVERAGE;
      let recommendedHours = subject.difficulty * 2; // Base hours

      if (avgScore < 60) {
        classification = CLASSIFICATIONS.WEAK;
        recommendedHours *= 2; // Double hours for weak subjects
      } else if (avgScore > 85) {
        classification = CLASSIFICATIONS.STRONG;
        recommendedHours *= 0.75; // Reduce hours for strong subjects
      }

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        classification,
        recommendedHours: Math.round(recommendedHours * 10) / 10,
        avgScore: Math.round(avgScore)
      };
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
