const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TO_EMAIL = "raef.knani@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = await req.json();

    // Supabase Database Webhook sends { type, table, schema, record, old_record }
    const record = payload.record;

    if (!record) {
      return new Response(
        JSON.stringify({ error: "No record in payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subjectLabel: Record<string, string> = {
      "space-inquiry": "Space Inquiry",
      "tour-request": "Request a Tour",
      "collaboration": "Collaboration",
      "other": "Other",
    };

    const subjectText = subjectLabel[record.subject] ?? record.subject;
    const submittedAt = record.created_at
      ? new Date(record.created_at).toUTCString()
      : new Date().toUTCString();

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Histora Contact Form <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: `📬 New Contact: ${subjectText}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e0d0c0;border-radius:12px;overflow:hidden;">
            <div style="background:#8c5a3c;padding:24px 32px;">
              <h1 style="color:white;margin:0;font-size:22px;">New Contact Message — Histora</h1>
            </div>
            <div style="padding:32px;background:#fdf8f4;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;color:#8c5a3c;font-weight:600;width:120px;vertical-align:top;">Name</td>
                  <td style="padding:10px 0;color:#2a2f28;">${record.name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#8c5a3c;font-weight:600;vertical-align:top;">Email</td>
                  <td style="padding:10px 0;">
                    <a href="mailto:${record.email}" style="color:#8c5a3c;">${record.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#8c5a3c;font-weight:600;vertical-align:top;">Phone</td>
                  <td style="padding:10px 0;color:#2a2f28;">${record.phone ?? "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#8c5a3c;font-weight:600;vertical-align:top;">Subject</td>
                  <td style="padding:10px 0;color:#2a2f28;">${subjectText}</td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px solid #e0d0c0;margin:24px 0;" />
              <p style="color:#8c5a3c;font-weight:600;margin:0 0 10px;">Message</p>
              <p style="color:#2a2f28;line-height:1.7;white-space:pre-wrap;margin:0;">${record.message}</p>
            </div>
            <div style="background:#f2dec8;padding:16px 32px;text-align:center;font-size:12px;color:#8c5a3c;">
              Received on ${submittedAt}
            </div>
          </div>
        `,
      }),
    });

    const data = await emailRes.json();
    console.log("Resend response:", JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      status: emailRes.ok ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
