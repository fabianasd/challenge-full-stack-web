-- CreateTable
CREATE TABLE "person" (
    "person_id" BIGSERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "document" CHAR(11) NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "student" (
    "person_id" BIGINT NOT NULL,
    "ra" VARCHAR(20) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("person_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "person_document_key" ON "person"("document");

-- CreateIndex
CREATE INDEX "student_person_id_idx" ON "student"("person_id");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("person_id") ON DELETE CASCADE ON UPDATE CASCADE;
