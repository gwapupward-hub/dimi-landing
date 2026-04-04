CREATE TABLE `rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hostUserId` int NOT NULL,
	`roomName` varchar(100) NOT NULL,
	`description` text,
	`visibility` enum('public','private') NOT NULL DEFAULT 'private',
	`status` enum('idle','live','ended') NOT NULL DEFAULT 'idle',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
