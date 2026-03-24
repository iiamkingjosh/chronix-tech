import { Resend } from "resend";

export const runtime = "nodejs"; // ✅ VERY IMPORTANT

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming request:", body);

    const { firstName, lastName, email, phone, message } = body;

    const response = await resend.emails.send({
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

    console.log("Resend response:", response);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("ERROR:", error);

    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}