-- Add score validation constraint (1-5 range)
ALTER TABLE `project`.`reviews` ADD CONSTRAINT `chk_score_range` CHECK (`score` BETWEEN 1 AND 5);