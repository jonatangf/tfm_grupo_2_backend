-- ============================================
-- Triggers to update avg_rating in users table
-- ============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_reviews_after_insert;
DROP TRIGGER IF EXISTS trg_reviews_after_update;
DROP TRIGGER IF EXISTS trg_reviews_after_delete;

-- Change delimiter for all trigger definitions
DELIMITER $$

-- Trigger: After INSERT on reviews
CREATE TRIGGER trg_reviews_after_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  BEGIN
    UPDATE users SET avg_rating=(
      SELECT AVG(score) FROM reviews WHERE reviewed_user_id=NEW.reviewed_user_id AND users_id!=reviewed_user_id
    )
    WHERE id=NEW.reviewed_user_id;
  END$$

-- Trigger: After UPDATE on reviews
CREATE TRIGGER trg_reviews_after_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  BEGIN
    UPDATE users SET avg_rating=(
      SELECT AVG(score) FROM reviews WHERE reviewed_user_id=NEW.reviewed_user_id AND users_id!=reviewed_user_id
    )
    WHERE id=NEW.reviewed_user_id;

    IF OLD.reviewed_user_id!=NEW.reviewed_user_id THEN
      UPDATE users SET avg_rating=(
        SELECT AVG(score) FROM reviews WHERE reviewed_user_id=OLD.reviewed_user_id AND users_id!=reviewed_user_id
      )
      WHERE id=OLD.reviewed_user_id;
    END IF;
  END$$

-- Trigger: After DELETE on reviews
CREATE TRIGGER trg_reviews_after_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  BEGIN
    UPDATE users SET avg_rating = (
      SELECT AVG(score) FROM reviews WHERE reviewed_user_id=OLD.reviewed_user_id AND users_id!=reviewed_user_id
    )
    WHERE id=OLD.reviewed_user_id;
  END$$

-- Reset delimiter back to semicolon
DELIMITER ;
