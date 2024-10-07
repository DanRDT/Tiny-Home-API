CREATE TABLE IF NOT EXISTS "Tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taskDescription" text NOT NULL,
	"createdDate" timestamp DEFAULT now() NOT NULL,
	"dueDate" timestamp NOT NULL,
	"completed" boolean NOT NULL
);
