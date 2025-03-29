import { OpenAI } from "openai";

console.log("here!")

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { goal, workoutType, level } = req.body;

  const prompt = `
You are a personal trainer. Generate a structured workout for a user based on:
- Goal: ${goal}
- Workout Type: ${workoutType}
- Fitness Level: ${level}
- Provide 4-6 exercises.
- Each exercise should have 3-4 sets.
- Specify reps, and weight if applicable.
- Ensure the response is **valid JSON**.
Format the response **exactly like this**:
{
  "name": "<Workout Name>",
  "exercises": [
    {
      "name": "<Exercise Name>",
      "sets": [
        { "type": "reps", "value": "<value>", "weight": "<weight>" }
      ]
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const rawText = response.choices[0].message.content.trim();
    return res.status(200).json(JSON.parse(rawText));
  } catch (error) {
    console.error("OpenAI or JSON error:", error);
    return res.status(500).json({ error: "AI failed", fallback: null });
  }
}
