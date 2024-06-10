CREATE TABLE `guidebook` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`primaryCategory` text NOT NULL,
	`secondaryCategory` text NOT NULL,
	`is_reviewed` integer DEFAULT false NOT NULL
);
