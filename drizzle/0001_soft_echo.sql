ALTER TABLE "clubs" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;