"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContactForm = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Contact_1 = __importDefault(require("../models/Contact"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, phone, category, subject, message } = req.body;
    if (!name || !email || !category || !subject || !message) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }
    const contact = await Contact_1.default.create({
        name,
        email,
        phone,
        category,
        subject,
        message,
    });
    if (contact) {
        // Send auto-reply email
        try {
            await (0, sendEmail_1.default)({
                email: contact.email,
                subject: `We've received your message: ${contact.subject}`,
                message: `
                    <h1>Hi ${contact.name},</h1>
                    <p>Thank you for reaching out to Savaj Seeds.</p>
                    <p>We have received your message regarding "<strong>${contact.subject}</strong>" and our team will get back to you shortly.</p>
                    <p>Your Request ID: ${contact._id}</p>
                    <br>
                    <p>Best Regards,</p>
                    <p>Savaj Seeds Team</p>
                `,
            });
        }
        catch (error) {
            console.error('Email send failed:', error);
        }
        res.status(201).json({
            _id: contact._id,
            name: contact.name,
            email: contact.email,
            message: 'Message sent successfully',
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid contact data');
    }
});
exports.submitContactForm = submitContactForm;
