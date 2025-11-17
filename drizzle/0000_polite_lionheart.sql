CREATE TYPE "public"."client_status" AS ENUM('active', 'pending', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."coverage_type" AS ENUM('Basic', 'Standard', 'Premium');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "client_benefits" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"insurance_provider" text,
	"policy_number" text,
	"coverage_type" "coverage_type",
	"deductible" integer,
	"copay" integer,
	"annual_limit" integer,
	"dental_coverage" boolean,
	"vision_coverage" boolean,
	"mental_health_coverage" boolean
);
--> statement-breakpoint
CREATE TABLE "client_medical_information" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"blood_type" text,
	"allergies" text[],
	"chronic_conditions" text[],
	"medications" text[],
	"last_checkup" text,
	"emergency_contact_name" text,
	"emergency_contact_phone" text,
	"emergency_contact_relationship" text
);
--> statement-breakpoint
CREATE TABLE "client_personal_information" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"photo" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"birth_date" text NOT NULL,
	"age" integer NOT NULL,
	"gender" "gender" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "client_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_benefits" ADD CONSTRAINT "client_benefits_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_medical_information" ADD CONSTRAINT "client_medical_information_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_personal_information" ADD CONSTRAINT "client_personal_information_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;