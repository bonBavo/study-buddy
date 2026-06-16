import "dotenv/config";
import { prisma } from "./lib/prisma";

async function test() {
  try {
    const students = await prisma.student.findMany();
    console.log("Success! Found", students.length, "students.");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
