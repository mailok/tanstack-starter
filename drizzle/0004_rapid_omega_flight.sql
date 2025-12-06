ALTER TABLE "client_benefits" ADD CONSTRAINT "client_benefits_clientId_unique" UNIQUE("clientId");--> statement-breakpoint
ALTER TABLE "client_medical_informations" ADD CONSTRAINT "client_medical_informations_clientId_unique" UNIQUE("clientId");--> statement-breakpoint
ALTER TABLE "client_personal_informations" ADD CONSTRAINT "client_personal_informations_clientId_unique" UNIQUE("clientId");