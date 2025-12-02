ALTER TABLE "client_medical_informations" ALTER COLUMN "lastCheckup" SET DATA TYPE date USING "lastCheckup"::date;--> statement-breakpoint
ALTER TABLE "client_personal_informations" ALTER COLUMN "photo" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "client_personal_informations" ALTER COLUMN "gender" DROP NOT NULL;