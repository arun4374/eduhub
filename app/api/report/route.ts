import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        // Check for required environment variables
        if (!process.env.REPORT_EMAIL_TO || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("Email service is not configured. Missing required environment variables.");
            return NextResponse.json({ success: false, message: "Server error: Email service not configured." }, { status: 500 });
        }

        const formData = await req.formData();
        const name = (formData.get('name') as string) || 'Anonymous';
        const email = (formData.get('email') as string) || 'Not provided';
        const pageUrl = formData.get('pageUrl') as string;
        const description = formData.get('description') as string;
        const file = formData.get('file') as File | null;

        if (!pageUrl || !description) {
            return NextResponse.json({ success: false, message: "Page URL and Description are required." }, { status: 400 });
        }

        const attachments = [];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                return NextResponse.json({ success: false, message: "File size exceeds 5MB." }, { status: 400 });
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({ filename: file.name, content: buffer, contentType: file.type });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587", 10),
            secure: parseInt(process.env.SMTP_PORT || "587", 10) === 465,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const subject = `New Issue Report: ${pageUrl.substring(0, 50)}`;
        const textContent = `A new issue has been reported on Arivon.\n\nFrom: ${name} (${email})\nPage URL: ${pageUrl}\n\nDescription:\n${description}`;
        const htmlContent = `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>New Issue Report on Arivon</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Page URL:</strong> <a href="${pageUrl}">${pageUrl}</a></p>
                <hr><h3>Description of Issue:</h3>
                <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${description}</div>
            </div>`;

        await transporter.sendMail({
            from: `"Arivon Bug Reporter" <${process.env.SMTP_USER}>`,
            to: process.env.REPORT_EMAIL_TO,
            replyTo: email !== 'Not provided' ? email : undefined,
            subject: subject,
            text: textContent,
            html: htmlContent,
            attachments: attachments,
        });

        return NextResponse.json({ success: true, message: "Report submitted successfully. Thank you for your feedback!" }, { status: 200 });

    } catch (error) {
        console.error("POST /api/report error:", error);
        return NextResponse.json({ success: false, message: "An internal server error occurred." }, { status: 500 });
    }
}
