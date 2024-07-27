import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

export async function POST(req: Request) {
  const { email, subject, message } = await req.json();
  console.log(email, subject, message);

  if (!fromEmail) {
    return NextResponse.json({ error: 'FROM_EMAIL environment variable is not set.' }, { status: 500 });
  }

  try {
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
    return NextResponse.json(data);
  } catch (error) {
    // Explicitly cast error to any to access the message property
    const errorMessage = (error as any).message || 'An error occurred while sending the email.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
