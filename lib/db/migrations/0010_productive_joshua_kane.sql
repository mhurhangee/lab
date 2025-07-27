ALTER TABLE "contexts" ADD COLUMN "openai_upload_id" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "vector_store_id" varchar(255);