import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-page">
      <h1>We’d love to hear from you.</h1>
      <p>
        Do you want to support our programs? Do you have an idea for a new way
        for us to make even more dreams come true? We’d love to hear from you.
      </p>

      <p><strong>Email:</strong> <a href="mailto:info@bworks.org">info@bworks.org</a></p>
      <p><strong>Phone:</strong> 314-664-0828</p>
      <p>
        You can also stop by and see us in person on <strong>Tuesday / Thursday or Saturday</strong>.
      </p>

      <p>
        Visit our main contact page for more details: <br />
        <a href="https://www.bworks.org/contact/" target="_blank" rel="noopener noreferrer">
          https://www.bworks.org/contact/
        </a>
      </p>
    </div>
  );
};

export default Contact;
