-- LocateIQ (MySQL / XAMPP) — import via phpMyAdmin or: mysql -u root < schema.sql

CREATE DATABASE IF NOT EXISTS locateiq CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE locateiq;

CREATE TABLE IF NOT EXISTS users (
  userID INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password CHAR(64) NOT NULL COMMENT 'SHA-256 hex',
  language VARCHAR(10) DEFAULT 'ar',
  registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  phoneNumber VARCHAR(50) DEFAULT NULL,
  nationalID VARCHAR(50) DEFAULT NULL,
  birthDate DATE DEFAULT NULL,
  profileImage VARCHAR(512) DEFAULT NULL,
  PRIMARY KEY (userID),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS liq_dataset (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  city VARCHAR(120) NOT NULL,
  neighborhood VARCHAR(255) NOT NULL,
  population_density DOUBLE NOT NULL,
  services_count DOUBLE NOT NULL,
  competitors_count DOUBLE NOT NULL,
  latitude DOUBLE DEFAULT NULL,
  longitude DOUBLE DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_city (city),
  KEY idx_neighborhood (neighborhood(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_chat_analysis (
  chatID INT UNSIGNED NOT NULL AUTO_INCREMENT,
  userID INT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  aiResponse TEXT NOT NULL,
  confidenceScore DECIMAL(6,2) DEFAULT NULL,
  project_name VARCHAR(512) DEFAULT NULL,
  location_label VARCHAR(255) DEFAULT NULL,
  cluster_val INT DEFAULT NULL,
  suitability_label VARCHAR(255) DEFAULT NULL,
  score_val DECIMAL(6,2) DEFAULT NULL,
  timestamp_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chatID),
  KEY idx_chat_user_time (userID, timestamp_created),
  CONSTRAINT fk_chat_user FOREIGN KEY (userID) REFERENCES users (userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- حساب الأدمن (نفس تشفير PHP: hash('sha256', 'Admin@123'))
-- البريد: admin@locateiq.com | كلمة المرور: Admin@123
INSERT INTO users (name, email, password, language)
SELECT 'Admin', 'admin@locateiq.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'ar'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@locateiq.com' LIMIT 1);
