CREATE TABLE `faculties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `specializations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`faculty_id` integer NOT NULL,
	FOREIGN KEY (`faculty_id`) REFERENCES `faculties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`last_name` text NOT NULL,
	`first_name` text NOT NULL,
	`middle_name` text,
	`faculty_id` integer NOT NULL,
	`specialization_id` integer NOT NULL,
	FOREIGN KEY (`faculty_id`) REFERENCES `faculties`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`specialization_id`) REFERENCES `specializations`(`id`) ON UPDATE no action ON DELETE set null
);
