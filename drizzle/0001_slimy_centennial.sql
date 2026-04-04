CREATE TABLE `creators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`genre` varchar(100),
	`followers` int NOT NULL DEFAULT 0,
	`isLive` int NOT NULL DEFAULT 0,
	`bio` text,
	`avatarUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creators_id` PRIMARY KEY(`id`),
	CONSTRAINT `creators_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`storageUrl` varchar(500) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`producerId` int NOT NULL,
	`genre` varchar(100),
	`bpm` int,
	`viewers` int NOT NULL DEFAULT 0,
	`collaborators` int NOT NULL DEFAULT 0,
	`isLive` int NOT NULL DEFAULT 0,
	`color` varchar(7) NOT NULL DEFAULT '#2EE62E',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`signedUpAt` timestamp NOT NULL DEFAULT (now()),
	`notified` int NOT NULL DEFAULT 0,
	`notifiedAt` timestamp,
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `waitlist_email_unique` UNIQUE(`email`)
);
