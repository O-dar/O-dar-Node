-- 오다르 초기 Database, Table 설정 SQL
-- postgreSQL 기준
-- USE odar;

-- 지역
-- 도/특별시/광역시
CREATE TABLE province (
  province_id SERIAL NOT NULL PRIMARY KEY,
  province_name VARCHAR(255) UNIQUE NOT NULL
);

-- 시/군/구
CREATE TABLE city (
  city_id SERIAL NOT NULL PRIMARY KEY,
  city_name VARCHAR(255) UNIQUE NOT NULL,
	province_id INT NOT NULL,
	
  FOREIGN KEY (province_id) REFERENCES province(province_id)
);
ALTER TABLE city ALTER province_id DROP NOT NULL;
ALTER TABLE city DROP COLUMN city_name;
ALTER TABLE city ADD COLUMN city_name VARCHAR(255) NOT NULL;

-- 읍/면/동(지역)
CREATE TABLE regions (
  region_id SERIAL NOT NULL PRIMARY KEY,
  region_name VARCHAR(255) UNIQUE NOT NULL,
  city_id INT NOT NULL,
	
  FOREIGN KEY (city_id) REFERENCES city(city_id)
);
ALTER TABLE regions ALTER city_id DROP NOT NULL;
ALTER TABLE regions DROP COLUMN region_name;
ALTER TABLE regions ADD COLUMN region_name VARCHAR(255) NOT NULL;

-- 직종 목록
CREATE TABLE job_categories (
  job_id SERIAL NOT NULL PRIMARY KEY,
  job_name VARCHAR(45) UNIQUE NOT NULL
);

-- 회원
CREATE TABLE users (
  user_id SERIAL NOT NULL PRIMARY KEY,
  region_id INT NULL DEFAULT NULL,
  job_id INT NULL DEFAULT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(250) NOT NULL,
  birthdate DATE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  desire_start_time INT,
  desire_end_time INT,
  profile_img VARCHAR(255),
  job_notice INT2 DEFAULT 0,
  place_notice INT2 DEFAULT 0,
  place_provide INT2 DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active_status INT2 DEFAULT 0,

  FOREIGN KEY (region_id) REFERENCES regions(region_id),
  FOREIGN KEY (job_id) REFERENCES job_categories(job_id)
);
ALTER TABLE users ALTER region_id DROP NOT NULL;
ALTER TABLE users ALTER job_id DROP NOT NULL;
ALTER TABLE users ADD COLUMN want_days VARCHAR(50)[];
ALTER TABLE users MODIFY updated_at DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 알림
CREATE TABLE notices (
  notice_id SERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL,
  notice_title VARCHAR(255) UNIQUE NOT NULL,
  notice_content VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  job_posting_id INT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(job_posting_id)
);
CREATE TRIGGER updated_at
BEFORE UPDATE ON notices
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();