/*
  Warnings:

  - A unique constraint covering the columns `[ra]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_ra_key" ON "student"("ra");

-- CreateIndex
CREATE INDEX "student_ra_idx" ON "student"("ra");
