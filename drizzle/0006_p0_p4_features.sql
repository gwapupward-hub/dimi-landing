ALTER TABLE `creators` ADD COLUMN `handle` varchar(32);--> statement-breakpoint
ALTER TABLE `creators` ADD COLUMN `walletAddress` varchar(64);--> statement-breakpoint
ALTER TABLE `creators` ADD COLUMN `gwapScore` int;--> statement-breakpoint
ALTER TABLE `creators` ADD CONSTRAINT `creators_handle_unique` UNIQUE(`handle`);--> statement-breakpoint
CREATE TABLE `session_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`userId` int,
	`type` varchar(32) NOT NULL,
	`payload` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `session_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`uploadedBy` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`s3Key` varchar(512) NOT NULL,
	`s3Url` varchar(1024) NOT NULL,
	`fileType` varchar(64) NOT NULL,
	`fileSizeBytes` int NOT NULL,
	`durationSeconds` int,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attestations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`releaseId` int NOT NULL,
	`documentHash` varchar(64) NOT NULL,
	`txSignature` varchar(128),
	`network` varchar(16) NOT NULL DEFAULT 'mainnet-beta',
	`attestedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attestations_id` PRIMARY KEY(`id`)
);
