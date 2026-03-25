import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming form data:", body);

    const { firstName, lastName, email, phone, message } = body;

    const response = await resend.emails.send({
      from: "Chronix <info@chronixtechnology.com>", // ✅ VERIFIED DOMAIN
      to: "info@chronixtechnology.com", // ✅ RECEIVING EMAIL
      subject: "New Contact Form Message",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log("Resend response:", response);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR:", error);

    return new Response(
      JSON.stringify({ success: false }),
      { status: 500 }
    );
  }
}