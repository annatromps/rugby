ALTER TABLE "accounts" ADD COLUMN "reset_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "reset_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "reset_token" text;--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "reset_token_expires_at" timestamp;