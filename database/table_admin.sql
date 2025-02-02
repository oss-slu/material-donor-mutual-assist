CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    admin_email VARCHAR(100),
    admin_address_line1 VARCHAR(50),
    admin_address_line2 VARCHAR(50),
    admin_state VARCHAR(15),
    admin_city VARCHAR(15),
    admin_zipcode VARCHAR(20),
    admin_contact INT NOT NULL
);