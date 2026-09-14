CREATE TABLE "rate_limit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"ip_hash" text NOT NULL,
	"form_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
