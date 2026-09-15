CREATE TYPE "public"."account_type" AS ENUM('CLUB', 'PLAYER', 'COACH');--> statement-breakpoint
ALTER TYPE "public"."search_target_type" ADD VALUE 'COACH';--> statement-breakpoint
CREATE TABLE "coaches" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"nationality" text,
	"current_country" text,
	"specialization" text NOT NULL,
	"coaching_level" text,
	"current_club" text,
	"years_experience" integer,
	"highlight_url" text,
	"photo_url" text,
	"notes" text,
	"status" "record_status" DEFAULT 'NEW' NOT NULL,
	"source" "source_type" DEFAULT 'MANUAL' NOT NULL,
	"source_detail" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"password_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"party_a_type" "account_type" NOT NULL,
	"party_a_id" text NOT NULL,
	"party_b_type" "account_type" NOT NULL,
	"party_b_id" text NOT NULL,
	"last_message_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_type" "account_type" NOT NULL,
	"sender_id" text NOT NULL,
	"body" text NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price_label" text NOT NULL,
	"billing_period" text,
	"tagline" text,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"quote" text NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "contact_logs" ADD COLUMN "coach_id" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "sourcing_suggestions" ADD COLUMN "promoted_coach_id" text;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;