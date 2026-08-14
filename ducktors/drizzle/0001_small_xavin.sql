CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientUserId` int NOT NULL,
	`professionalId` int NOT NULL,
	`availabilitySlotId` int,
	`modality` enum('presencial','videollamada') NOT NULL,
	`state` enum('requested','confirmed','cancelled','completed','no_show') NOT NULL DEFAULT 'requested',
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`patientNote` text,
	`telemedicineRoomUrl` text,
	`confirmedAt` timestamp,
	`patientReminderSentAt` timestamp,
	`professionalReminderSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `availability_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`professionalId` int NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`modality` enum('presencial','videollamada') NOT NULL,
	`state` enum('available','reserved','blocked') NOT NULL DEFAULT 'available',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `availability_slots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expert_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionId` int NOT NULL,
	`professionalId` int NOT NULL,
	`body` text NOT NULL,
	`state` enum('pending','published','hidden') NOT NULL DEFAULT 'pending',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expert_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expert_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topic` varchar(180) NOT NULL,
	`body` text NOT NULL,
	`state` enum('pending','answered','hidden') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expert_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professional_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` enum('yellow_duxn') NOT NULL DEFAULT 'yellow_duxn',
	`sourceRecordId` varchar(128) NOT NULL,
	`ownerUserId` int,
	`slug` varchar(180) NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`profileType` enum('medico','dentista','psicologo','clinica') NOT NULL,
	`specialties` text NOT NULL,
	`city` varchar(160) NOT NULL,
	`locality` varchar(160),
	`insuranceText` text,
	`symptomsText` text,
	`biography` text,
	`photoUrl` text,
	`telemedicineEnabled` int NOT NULL DEFAULT 0,
	`inPersonEnabled` int NOT NULL DEFAULT 1,
	`profileStatus` enum('pending','published','suspended') NOT NULL DEFAULT 'pending',
	`verificationStatus` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`searchTitle` varchar(180),
	`searchDescription` text,
	`catalogSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professional_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `professional_source_record_unq` UNIQUE(`source`,`sourceRecordId`),
	CONSTRAINT `professional_slug_unq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientUserId` int NOT NULL,
	`professionalId` int NOT NULL,
	`rating` int NOT NULL,
	`body` text,
	`state` enum('pending','published','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`publishedAt` timestamp,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `review_one_per_appointment_unq` UNIQUE(`appointmentId`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_patientUserId_users_id_fk` FOREIGN KEY (`patientUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_professionalId_professional_profiles_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professional_profiles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_availabilitySlotId_availability_slots_id_fk` FOREIGN KEY (`availabilitySlotId`) REFERENCES `availability_slots`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `availability_slots` ADD CONSTRAINT `availability_slots_professionalId_professional_profiles_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professional_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expert_answers` ADD CONSTRAINT `expert_answers_questionId_expert_questions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `expert_questions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expert_answers` ADD CONSTRAINT `expert_answers_professionalId_professional_profiles_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professional_profiles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD CONSTRAINT `professional_profiles_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_appointmentId_appointments_id_fk` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_patientUserId_users_id_fk` FOREIGN KEY (`patientUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_professionalId_professional_profiles_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professional_profiles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `appointment_patient_time_idx` ON `appointments` (`patientUserId`,`startsAt`);--> statement-breakpoint
CREATE INDEX `appointment_professional_time_idx` ON `appointments` (`professionalId`,`startsAt`);--> statement-breakpoint
CREATE INDEX `availability_professional_time_idx` ON `availability_slots` (`professionalId`,`startsAt`,`state`);--> statement-breakpoint
CREATE INDEX `expert_answer_question_state_idx` ON `expert_answers` (`questionId`,`state`);--> statement-breakpoint
CREATE INDEX `expert_question_state_created_idx` ON `expert_questions` (`state`,`createdAt`);--> statement-breakpoint
CREATE INDEX `professional_public_directory_idx` ON `professional_profiles` (`profileStatus`,`verificationStatus`,`city`);--> statement-breakpoint
CREATE INDEX `review_professional_state_idx` ON `reviews` (`professionalId`,`state`);