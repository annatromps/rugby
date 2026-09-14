ALTER TABLE "clubs" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;