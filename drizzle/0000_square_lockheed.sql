CREATE TYPE "public"."accommodation_status" AS ENUM('REQUESTED', 'SEARCHING', 'OPTIONS_SENT', 'BOOKED', 'NOT_NEEDED');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('OWNER', 'STAFF');--> statement-breakpoint
CREATE TYPE "public"."contact_method" AS ENUM('EMAIL', 'PHONE', 'WHATSAPP', 'IN_PERSON', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."placement_status" AS ENUM('PROPOSED', 'CONFIRMED', 'FELL_THROUGH');--> statement-breakpoint
CREATE TYPE "public"."player_level" AS ENUM('COMMUNITY', 'AMATEUR_LEAGUE', 'SEMI_PRO', 'PROFESSIONAL', 'INTERNATIONAL');--> statement-breakpoint
CREATE TYPE "public"."record_status" AS ENUM('NEW', 'REVIEWING', 'SHORTLISTED', 'CONTACTED', 'IN_TALKS', 'PLACED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."search_target_type" AS ENUM('CLUB', 'PLAYER');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('MANUAL', 'AI_SEARCH', 'SELF_SUBMITTED');--> statement-breakpoint
CREATE TYPE "public"."suggestion_review_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "accommodation_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"placement_id" text,
	"city" text,
	"move_in_date" timestamp,
	"budget_note" text,
	"status" "accommodation_status" DEFAULT 'REQUESTED' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" "admin_role" DEFAULT 'STAFF' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"region" text,
	"league" text,
	"level" "player_level",
	"website" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"notes" text,
	"status" "record_status" DEFAULT 'NEW' NOT NULL,
	"source" "source_type" DEFAULT 'MANUAL' NOT NULL,
	"source_detail" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"club_id" text,
	"player_id" text,
	"admin_id" text,
	"method" "contact_method" NOT NULL,
	"summary" text NOT NULL,
	"contacted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placements" (
	"id" text PRIMARY KEY NOT NULL,
	"club_id" text NOT NULL,
	"player_id" text NOT NULL,
	"status" "placement_status" DEFAULT 'PROPOSED' NOT NULL,
	"start_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"nationality" text,
	"current_country" text,
	"position" text NOT NULL,
	"secondary_position" text,
	"level" "player_level",
	"current_club" text,
	"years_experience" integer,
	"highlight_url" text,
	"notes" text,
	"status" "record_status" DEFAULT 'NEW' NOT NULL,
	"source" "source_type" DEFAULT 'MANUAL' NOT NULL,
	"source_detail" text,
	"needs_accommodation" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "position_needs" (
	"id" text PRIMARY KEY NOT NULL,
	"club_id" text NOT NULL,
	"position" text NOT NULL,
	"level" "player_level",
	"notes" text,
	"open_since" timestamp DEFAULT now() NOT NULL,
	"filled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sourcing_searches" (
	"id" text PRIMARY KEY NOT NULL,
	"target_type" "search_target_type" NOT NULL,
	"query" text NOT NULL,
	"run_by_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sourcing_suggestions" (
	"id" text PRIMARY KEY NOT NULL,
	"search_id" text NOT NULL,
	"target_type" "search_target_type" NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"source_url" text,
	"raw_data" jsonb,
	"review_status" "suggestion_review_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"promoted_club_id" text,
	"promoted_player_id" text
);
--> statement-breakpoint
ALTER TABLE "accommodation_requests" ADD CONSTRAINT "accommodation_requests_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accommodation_requests" ADD CONSTRAINT "accommodation_requests_placement_id_placements_id_fk" FOREIGN KEY ("placement_id") REFERENCES "public"."placements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position_needs" ADD CONSTRAINT "position_needs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sourcing_suggestions" ADD CONSTRAINT "sourcing_suggestions_search_id_sourcing_searches_id_fk" FOREIGN KEY ("search_id") REFERENCES "public"."sourcing_searches"("id") ON DELETE cascade ON UPDATE no action;