import React from 'react';
import './styles/contactInfo.css';

const ContactInfo = () => {
    return (
        <div className="contact-wrapper">
            <div className="contact-info">
                <h2>Contact Information</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <i className="fas fa-building"></i>
                        <div>
                            <strong>Company Name Ltd.</strong><br />
                            123 Business Street<br />
                            New York, NY 10001
                        </div>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <span>+1 234 567 8900</span>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-envelope"></i>
                        <span>contact@company.com</span>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-clock"></i>
                        <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;