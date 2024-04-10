CREATE TABLE donor (
    donor_id SERIAL PRIMARY KEY,
    donor_name VARCHAR(50) NOT NULL,
    donor_contact BIGINT NOT NULL,
    donor_email VARCHAR(100) NOT NULL,
    donor_address_line1 VARCHAR(50),
    donor_address_line2 VARCHAR(50),
    donor_state VARCHAR(15),
    donor_city VARCHAR(15),
    donor_zipcode VARCHAR(20) NOT NULL,
    email_opt_in VARCHAR(3) CHECK (email_opt_in IN ('Yes', 'No'))  -- Add CHECK constraint
);