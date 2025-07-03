export default async function handler(req, res) {
  try {
    const { headlines } = req.body;

    if (!headlines || !Array.isArray(headlines) || headlines.length === 0) {
      return res.status(400).json({ error: "No headlines provided" });
    }

    const prompt = `You are an AI stock analyst. Analyze the sentiment of the following Indian stock market news headlines (positive, neutral, or negative). Give a summary.\n\n${headlines.join(
      "\n"
    )}`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await openaiResponse.json();

    // Check if OpenAI returned valid response
    if (
      !data ||
      !data.choices ||
      !Array.isArray(data.choices) ||
      !data.choices[0]?.message?.content
    ) {
      console.error("Invalid OpenAI response:", data);
      return res.status(500).json({ error: "Invalid OpenAI response", debug: data });
    }

    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error("AI error:", err.message);
    return res.status(500).json({ error: "AI analysis failed", details: err.message });
  }
}
