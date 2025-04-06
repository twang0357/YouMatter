CREATE DATABASE MedReminder_web;
USE MedReminder_web;

CREATE TABLE accounts(
	account_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	fname VARCHAR(255) NOT NULL,
	lname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE medications (
	medication_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	account_id INT UNSIGNED NOT NULL,
	name VARCHAR(255) NOT NULL,
	start_date DATE NOT NULL,
	frequency INT NOT NULL,
	frequency_unit VARCHAR(100),
	dosage DECIMAL(5,2) NOT NULL,
	dosage_unit VARCHAR(10) NOT NULL,
	quantity INT UNSIGNED NOT NULL,
	importance VARCHAR(15),
	FOREIGN KEY(account_id) REFERENCES accounts(account_id)
		ON DELETE CASCADE
);