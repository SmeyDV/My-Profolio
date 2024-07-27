import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

export async function POST(req) {
  try {
    // Log environment variables to ensure they are loaded
    console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);
    console.log("FROM_EMAIL:", process.env.FROM_EMAIL);

    const { email, subject, message } = await req.json();
    console.log("Received request:", { email, subject, message });

    const data = await resend.emails.send({
      from: fromEmail,
      to: [fromEmail, email],
      subject: subject,
      react: (
        <>
          <h1>{subject}</h1>
          <p>Thank you for contacting us!</p>
          <p>New message submitted:</p>
          <p>{message}</p>
        </>
      ),
    });

    console.log("Email sent successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message || "An error occurred" });
  }
}
