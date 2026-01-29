-- 1. Create database
CREATE DATABASE venture_pulse;

-- 2. Use database
USE venture_pulse;

-- -----------------------------
-- USERS TABLE
-- -----------------------------
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------
-- IDEAS TABLE
-- -----------------------------
CREATE TABLE ideas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,

    idea_text TEXT NOT NULL,
    domain VARCHAR(100),
    target_users VARCHAR(150),
    pricing_model VARCHAR(100),
    team_info TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ideas_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- -----------------------------
-- REPORTS TABLE
-- -----------------------------
CREATE TABLE reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idea_id BIGINT NOT NULL,

    risk_score INT,
    verdict VARCHAR(50),

    market_analysis TEXT,
    competitors TEXT,
    signals TEXT,
    recommendations TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reports_idea
        FOREIGN KEY (idea_id)
        REFERENCES ideas(id)
        ON DELETE CASCADE
);
