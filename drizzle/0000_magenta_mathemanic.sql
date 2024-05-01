CREATE TABLE `tbl_movieinfo` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(246) NOT NULL,
	`is_dubbed` boolean NOT NULL,
	`is_domestic` boolean NOT NULL,
	`is_live_action` boolean NOT NULL,
	`theater_id` int NOT NULL,
	`view_start_datetime` datetime NOT NULL,
	`view_end_datetime` datetime NOT NULL,
	`accompanier` int,
	`rating` int,
	`comment` text,
	CONSTRAINT `tbl_movieinfo_id` PRIMARY KEY(`id`),
	CONSTRAINT `tbl_movieinfo_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `tbl_theater` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(246) NOT NULL,
	CONSTRAINT `tbl_theater_id` PRIMARY KEY(`id`),
	CONSTRAINT `tbl_theater_id_unique` UNIQUE(`id`),
	CONSTRAINT `tbl_theater_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD CONSTRAINT `tbl_movieinfo_theater_id_tbl_theater_id_fk` FOREIGN KEY (`theater_id`) REFERENCES `tbl_theater`(`id`) ON DELETE no action ON UPDATE no action;