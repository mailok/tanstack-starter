CREATE TYPE "public"."coverageType" AS ENUM('Basic', 'Standard', 'Premium');--> statement-breakpoint
CREATE TYPE "public"."clientStatus" AS ENUM('active', 'pending', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "client_benefits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clientId" uuid NOT NULL,
	"insuranceProvider" text,
	"policyNumber" text,
	"coverageType" "coverageType",
	"deductible" integer,
	"copay" integer,
	"annualLimit" integer,
	"dentalCoverage" boolean,
	"visionCoverage" boolean,
	"mentalHealthCoverage" boolean
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "clientStatus" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_medical_informations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clientId" uuid NOT NULL,
	"bloodType" text,
	"allergies" text[],
	"chronicConditions" text[],
	"medications" text[],
	"lastCheckup" text,
	"emergencyContactName" text,
	"emergencyContactPhone" text,
	"emergencyContactRelationship" text
);
--> statement-breakpoint
CREATE TABLE "client_personal_informations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clientId" uuid NOT NULL,
	"photo" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"birthDate" text NOT NULL,
	"age" integer NOT NULL,
	"gender" "gender" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_benefits" ADD CONSTRAINT "client_benefits_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_medical_informations" ADD CONSTRAINT "client_medical_informations_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_personal_informations" ADD CONSTRAINT "client_personal_informations_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;