import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './styles/sendEmail.css';

const SendEmail = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    // กำหนดค่า EmailJS
    const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    // Initialize EmailJS
    useEffect(() => {
        if (EMAILJS_PUBLIC_KEY) {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }
    }, [EMAILJS_PUBLIC_KEY]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage({ text: '', type: '' });

        // ตรวจสอบการตั้งค่า EmailJS
        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            setStatusMessage({
                text: 'EmailJS is not configured. Please check your .env file and restart the server.',
                type: 'error'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // ส่งอีเมลผ่าน EmailJS
            const templateParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || 'ไม่ระบุ',
                subject: formData.subject,
                message: formData.message,
                time: new Date().toLocaleString(),
                reply_to: formData.email,
                to_name: 'Weather App Team'
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );
            
            setStatusMessage({
                text: 'Message sent successfully! We will get back to you soon.',
                type: 'success'
            });
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

        } catch (error) {
            let errorMessage = 'Failed to send message. Please try again later.';
            
            if (error.status === 400) {
                errorMessage = 'Bad Request: Please check your EmailJS template configuration.';
            } else if (error.status === 401) {
                errorMessage = 'Unauthorized: Invalid public key or service access.';
            } else if (error.status === 404) {
                errorMessage = 'Not Found: Service or template ID is incorrect.';
            } else if (error.status === 422) {
                errorMessage = 'Invalid template: Check your template configuration.';
            } else if (error.text) {
                errorMessage = `Error: ${error.text}`;
            }
            
            setStatusMessage({
                text: errorMessage,
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // แสดงสถานะการตั้งค่า
    const isConfigured = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY;

    return (
        <div className="contact-form">
            <h2>Send us a message</h2>
            
            {!isConfigured && (
                <div className="status-message error">
                    ⚠️ EmailJS is not configured. Please check your .env file and restart the server.
                    <br />
                    Missing: {!EMAILJS_SERVICE_ID && 'SERVICE_ID '}{!EMAILJS_TEMPLATE_ID && 'TEMPLATE_ID '}{!EMAILJS_PUBLIC_KEY && 'PUBLIC_KEY'}
                </div>
            )}
            
            {statusMessage.text && (
                <div className={`status-message ${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number (optional)"
                    />
                </div>

                <div className="form-group">
                    <label>Subject *</label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Please select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Business Partnership">Business Partnership</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Message *</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe your inquiry in detail..."
                        rows="5"
                        required
                    />
                </div>

                <div className="button-container">
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isSubmitting || !isConfigured}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendEmail;