-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema project
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema project
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `project` ;

-- -----------------------------------------------------
-- Table `project`.`countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`countries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `continent` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) NULL,
  `description` MEDIUMTEXT NULL,
  `countries_id` INT UNSIGNED NULL,
  `birthdate` DATE NULL,
  `telephone` VARCHAR(20) NULL,
  `avg_rating` FLOAT(2,1) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_users_countries1_idx` (`countries_id` ASC),
  CONSTRAINT `fk_users_countries1`
    FOREIGN KEY (`countries_id`)
    REFERENCES `project`.`countries` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`accommodations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`accommodations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`means_of_transports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`means_of_transports` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`trips`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`trips` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `destiny_country_id` INT UNSIGNED NULL,
  `destiny_place` VARCHAR(150) NOT NULL,
  `destiny_image` VARCHAR(255) NOT NULL,
  `itinerary` MEDIUMTEXT NOT NULL,
  `means_of_transports_id` INT UNSIGNED NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `creator_id` INT UNSIGNED NOT NULL,
  `accommodations_id` INT UNSIGNED NULL,
  `cost_per_person` INT NOT NULL,
  `min_participants` INT NOT NULL,
  `status` ENUM("open", "closed", "finished", "cancelled") NOT NULL DEFAULT 'open',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_trips_countries1_idx` (`destiny_country_id` ASC),
  INDEX `fk_trips_users1_idx` (`creator_id` ASC),
  INDEX `fk_trips_accomodations1_idx` (`accommodations_id` ASC),
  INDEX `fk_trips_means_of_transports1_idx` (`means_of_transports_id` ASC),
  INDEX `idx_trips_status` (`status` ASC),
  CONSTRAINT `fk_trips_countries1`
    FOREIGN KEY (`destiny_country_id`)
    REFERENCES `project`.`countries` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL,
  CONSTRAINT `fk_trips_creator1`
    FOREIGN KEY (`creator_id`)
    REFERENCES `project`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_trips_accommodations1`
    FOREIGN KEY (`accommodations_id`)
    REFERENCES `project`.`accommodations` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL,
  CONSTRAINT `fk_trips_means_of_transports1`
    FOREIGN KEY (`means_of_transports_id`)
    REFERENCES `project`.`means_of_transports` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`reviews` (
  `users_id` INT UNSIGNED NOT NULL,
  `trips_id` INT UNSIGNED NOT NULL,
  `reviewed_user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `review` MEDIUMTEXT NOT NULL,
  `score` TINYINT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`users_id`, `trips_id`, `reviewed_user_id`),
  INDEX `fk_reviews_users1_idx` (`users_id` ASC),
  INDEX `fk_reviews_trips1_idx` (`trips_id` ASC),
  INDEX `fk_reviews_reviewed_user_id_idx` (`reviewed_user_id` ASC),
  INDEX `idx_reviewed_user_id` (`reviewed_user_id` ASC),
  CONSTRAINT `fk_reviews_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `project`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_trips1`
    FOREIGN KEY (`trips_id`)
    REFERENCES `project`.`trips` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_reviewed_user_id`
    FOREIGN KEY (`reviewed_user_id`)
    REFERENCES `project`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  `message` MEDIUMTEXT NOT NULL,
  `users_id` INT UNSIGNED NOT NULL,
  `trips_id` INT UNSIGNED NOT NULL,
  `messages_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_messages_users1_idx` (`users_id` ASC),
  INDEX `fk_messages_trips1_idx` (`trips_id` ASC),
  INDEX `fk_messages_messages1_idx` (`messages_id` ASC),
  CONSTRAINT `fk_messages_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `project`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_messages_trips1`
    FOREIGN KEY (`trips_id`)
    REFERENCES `project`.`trips` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_messages_messages1`
    FOREIGN KEY (`messages_id`)
    REFERENCES `project`.`messages` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`interests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`interests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`interests_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`interests_users` (
  `interests_id` INT UNSIGNED NOT NULL,
  `users_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`interests_id`, `users_id`),
  INDEX `fk_interests_has_users_users1_idx` (`users_id` ASC),
  INDEX `fk_interests_has_users_interests1_idx` (`interests_id` ASC),
  CONSTRAINT `fk_interests_has_users_interests1`
    FOREIGN KEY (`interests_id`)
    REFERENCES `project`.`interests` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_interests_has_users_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `project`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`countries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `continent` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`.`trips_members`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project`.`trips_members` (
  `users_id` INT UNSIGNED NOT NULL,
  `trips_id` INT UNSIGNED NOT NULL,
  `status` ENUM("pending", "accepted", "rejected") NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`users_id`, `trips_id`),
  INDEX `fk_users_has_trips_trips1_idx` (`trips_id` ASC),
  INDEX `fk_users_has_trips_users1_idx` (`users_id` ASC),
  INDEX `idx_trips_participations_status` (`status` ASC),
  CONSTRAINT `fk_users_has_trips_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `project`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_users_has_trips_trips1`
    FOREIGN KEY (`trips_id`)
    REFERENCES `project`.`trips` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
