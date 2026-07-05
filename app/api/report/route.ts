import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
// NOTE: adjust this import path/export name to match your existing Mongoose
// connection helper if it differs (e.g. `import dbConnect from "@/lib/db"`).
import dbConnect from '@/lib/dbConnect';
import Report, { REPORT_CATEGORIES, type ReportCategory } from "@/models/Report";
import { generateUniqueTicketId } from "@/lib/ticket";

export async function POST(req: NextRequest) {
    try {
        // Check for required environment variables
        if (!process.env.REPORT_EMAIL_TO || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("Email service is not configured. Missing required environment variables.");
            return NextResponse.json({ success: false, message: "Server error: Email service not configured." }, { status: 500 });
        }

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const pageUrl = formData.get('pageUrl') as string;
        const description = formData.get('description') as string;
        const categoryRaw = (formData.get('category') as string) || 'other';
        const file = formData.get('file') as File | null;

        if (!name || !email || !pageUrl || !description) {
            return NextResponse.json({ success: false, message: "Name, Email, Page URL and Description are required." }, { status: 400 });
        }

        const category = (REPORT_CATEGORIES as string[]).includes(categoryRaw) ? (categoryRaw as ReportCategory) : "other";

        const attachments = [];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                return NextResponse.json({ success: false, message: "File size exceeds 5MB." }, { status: 400 });
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({ filename: file.name, content: buffer, contentType: file.type });
        }

        await dbConnect();
        const ticketId = await generateUniqueTicketId();

        const report = await Report.create({
            ticketId,
            name,
            email,
            category,
            pageUrl,
            description,
            // If you upload the attachment to storage (S3/Cloudinary/etc.) instead of
            // just emailing it, set fileUrl here to that hosted URL.
            status: "pending",
            statusHistory: [{ status: "pending", changedAt: new Date() }],
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587", 10),
            secure: parseInt(process.env.SMTP_PORT || "587", 10) === 465,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const subject = `[${ticketId}] New Issue Report: ${pageUrl.substring(0, 50)}`;
        const textContent = `A new issue has been reported on Arivon.\n\nTicket: ${ticketId}\nCategory: ${category}\nFrom: ${name} (${email})\nPage URL: ${pageUrl}\n\nDescription:\n${description}`;
        const htmlContent = `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>New Issue Report on Arivon</h2>
                <p><strong>Ticket:</strong> ${ticketId}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Page URL:</strong> <a href="${pageUrl}">${pageUrl}</a></p>
                <hr><h3>Description of Issue:</h3>
                <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${description}</div>
            </div>`;

        try {
            await transporter.sendMail({
                from: `"Arivon Bug Reporter" <${process.env.SMTP_USER}>`,
                to: process.env.REPORT_EMAIL_TO,
                replyTo: email,
                subject: subject,
                text: textContent,
                html: htmlContent,
                attachments: attachments,
            });
        } catch (mailError) {
            // The report is already saved — don't fail the whole request just
            // because the notification email didn't go out. Log it for follow-up.
            console.error("Report saved but email notification failed:", mailError);
        }

        return NextResponse.json(
            {
                success: true,
                message: "Report submitted successfully. Thank you for your feedback!",
                ticketId: report.ticketId,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("POST /api/report error:", error);
        return NextResponse.json({ success: false, message: "An internal server error occurred." }, { status: 500 });
    }
}