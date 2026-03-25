// This route is deprecated - use Formspree for form submissions
// Contact form now submits to: https://formspree.io/f/xreozdbw

export const runtime = "nodejs";

export async function POST(req) {
  return new Response(
    JSON.stringify({ 
      message: "This API route is deprecated. Use Formspree instead.",
      formspree_url: "https://formspree.io/f/xreozdbw"
    }),
    { status: 410 } // 410 Gone
  );
}