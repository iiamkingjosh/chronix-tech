import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming request:", body);

    const { firstName, lastName, email, phone, message } = body;

    await resend.emails.send({
      from: "Chronix <onboarding@resend.dev>",
      to: "your-email@gmail.com", // 🔥 PUT YOUR REAL EMAIL
      subject: "New Contact Message",
      html: `
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false });
  }
}