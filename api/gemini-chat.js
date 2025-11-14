export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing 'message' in request body" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    const { GoogleGenerativeAI } = await import("@google/genai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const result = await model.generateContent({ contents });

    let reply = "";
    try {
      reply = result?.response?.text?.() || "";
    } catch {
      reply =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    res.status(200).json({ reply: reply || "Sorry, I could not generate a response." });
  } catch (err) {
    console.error("gemini-chat handler error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}