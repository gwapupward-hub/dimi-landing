CREATE TABLE `release_contributors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`releaseId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`handle` varchar(255),
	`role` varchar(100) NOT NULL,
	`splitPercent` int NOT NULL DEFAULT 0,
	`hasSigned` int NOT NULL DEFAULT 0,
	`signedAt` timestamp,
	`avatarColor` varchar(7) NOT NULL DEFAULT '#2EE62E',
	`avatarInitials` varchar(4) NOT NULL DEFAULT '??',
	`isHost` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `release_contributors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `releases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`genre` varchar(100),
	`bpm` int,
	`musicalKey` varchar(20),
	`duration` varchar(20),
	`status` enum('draft','pending_signatures','all_signed','locked') NOT NULL DEFAULT 'draft',
	`lockedAt` timestamp,
	`proofHash` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `releases_id` PRIMARY KEY(`id`)
);
