CREATE TYPE "public"."service_request_status" AS ENUM('NEW', 'IN_PROGRESS', 'DONE');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('CV_HELP', 'ACCOMMODATION', 'VISA_RELOCATION', 'OTHER');--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"service_type" "service_type" NOT NULL,
	"message" text,
	"status" "service_request_status" DEFAULT 'NEW' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
