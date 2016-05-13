DROP FUNCTION IF EXISTS age;
DROP FUNCTION IF EXISTS distance;
DROP FUNCTION IF EXISTS likeCount;
DROP PROCEDURE IF EXISTS location_BINS;

DELIMITER $$
  create function age(dob date)
      returns integer
        begin
           declare reference date default CURDATE();
           return DATE_FORMAT(reference, '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(reference, '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d'));
        end $$

  create function distance(longA float(8,4), latA float(8,4), longB float(8,4), latB float(8,4))
       returns float(9,3)
         begin
          declare radius float default 6387.7;
          declare degToRad float default 57.29577951;
          RETURN(Radius * ACOS((sin(latA / degToRad) * SIN(latB / degToRad)) +
                    (COS(latA / degToRad) * COS(latB / degToRad) *
                      COS(longB / degToRad - longA/ degToRad))));
          end $$

  create function likeCount(email varchar(90))
       returns integer
         begin
          declare likenum integer;
          select count(*) into likenum from likes where poster_email = email;
          return likenum;
        end $$

  create trigger `location_BINS` before insert on `location` for each row
    begin
      if new.latitude < -90.00 or new.latitude > 90.00 then
       SIGNAL sqlstate '45010' set message_text = "Oops, bad latitude value";
      end if;
      if new.longitude < -180.000 or new.longitude > 180.00 then
       SIGNAL sqlstate '45011' set message_text = "Oops, bad longitude value!";
      end if;
    end $$
  DELIMITER  ;
