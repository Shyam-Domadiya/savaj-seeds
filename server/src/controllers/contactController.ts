import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Contact from '../models/Contact';
import sendEmail from '../utils/sendEmail';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, category, subject, message } = req.body;

    if (!name || !email || !category || !subject || !message) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        category,
        subject,
        message,
    });

    if (contact) {
        // Send auto-reply email (non-blocking)
        sendEmail({
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
        }).catch(error => {
            console.error('Email send failed:', error);
        });

        res.status(201).json({
            _id: contact._id,
            name: contact.name,
            email: contact.email,
            message: 'Message sent successfully',
        });
    } else {
        res.status(400);
        throw new Error('Invalid contact data');
    }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = asyncHandler(async (req: Request, res: Response) => {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
});

// @desc    Mark a contact message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markContactAsRead = asyncHandler(async (req: Request, res: Response) => {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        contact.isRead = !contact.isRead; // Toggle read status
        const updatedContact = await contact.save();
        res.json(updatedContact);
    } else {
        res.status(404);
        throw new Error('Contact message not found');
    }
});

export { submitContactForm, getContacts, markContactAsRead };
