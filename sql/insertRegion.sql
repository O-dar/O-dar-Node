-- 지역 정보 임시

INSERT 
  INTO province
  (province_name)
VALUES
  ('경상남도'),
  ('경상북도'),
  ('울산광역시');


INSERT 
  INTO city
  (province_id, city_name)
VALUES
  (1, '진주시'),
  (1, '창원시');
  
INSERT 
  INTO city
  (city_name)
VALUES
  ('진주시'),
  ('창원시');

INSERT 
  INTO regions
  (city_id, region_name)
VALUES
  (4, '가좌동'),
  (4, '주약동');

INSERT 
  INTO regions
  (region_name)
VALUES
  ('가좌동'),
  ('주약동');