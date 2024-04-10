CREATE TABLE inventory (
    item_id SERIAL PRIMARY KEY,
    category_id INT,
    item_name VARCHAR(50),
    item_description VARCHAR(200),
    received_date DATE,
    updated_by_admin_id INT NOT NULL,
    donor_id INT NOT NULL,
    FOREIGN KEY (updated_by_admin_id) REFERENCES admin(admin_id),
    FOREIGN KEY (donor_id) REFERENCES donor(donor_id)
);