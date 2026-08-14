CREATE TABLE `automation_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobKey` varchar(100) NOT NULL,
	`taskUid` varchar(65) NOT NULL,
	`cron` varchar(80) NOT NULL,
	`enabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automation_jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `automation_job_key_unq` UNIQUE(`jobKey`),
	CONSTRAINT `automation_task_uid_unq` UNIQUE(`taskUid`)
);
