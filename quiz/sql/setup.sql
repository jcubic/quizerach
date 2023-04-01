--------------------------------------------------------------------------------
-- SETUP
--------------------------------------------------------------------------------

CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';
CREATE DATABASE <database> DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON <database>.* TO '<username>'@'localhost' WITH GRANT OPTION;