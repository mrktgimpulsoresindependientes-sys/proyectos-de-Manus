CREATE TABLE `notification_deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`recipientRole` enum('patient','professional') NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`kind` enum('confirmation','reminder') NOT NULL,
	`state` enum('queued','sent','failed') NOT NULL DEFAULT 'queued',
	`scheduledAt` timestamp NOT NULL,
	`sentAt` timestamp,
	`providerMessageId` varchar(255),
	`lastError` text,
	`attempts` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_deliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_delivery_idempotency_unq` UNIQUE(`appointmentId`,`recipientRole`,`kind`)
);
--> statement-breakpoint
ALTER TABLE `availability_slots` ADD `sourceSlotId` varchar(160);--> statement-breakpoint
ALTER TABLE `availability_slots` ADD `catalogSyncedAt` timestamp;--> statement-breakpoint
ALTER TABLE `availability_slots` ADD CONSTRAINT `availability_source_slot_unq` UNIQUE(`professionalId`,`sourceSlotId`);--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD CONSTRAINT `notification_deliveries_appointmentId_appointments_id_fk` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `notification_delivery_due_idx` ON `notification_deliveries` (`state`,`scheduledAt`);