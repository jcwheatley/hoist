import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { goal, weeklyFrequency, equipment, weekNumber, notes } = req.body;

  if (!goal || !weeklyFrequency || !weekNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
You are a personal trainer. Create a 1-week structured workout plan in JSON format only.

Generate ${weeklyFrequency} unique workouts for Week ${weekNumber} to help the user achieve their goal: ${goal}.
They have access to: ${equipment?.join(", ") || "no equipment"}.
Additional notes: ${notes || "None"}

Each workout must follow this JSON format:

{
  "numberWorkout": "<number the workouts (1, 2, 3, etc.)>",
  "name": "<Workout Name relevant to body group",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": [
        { "type": "reps", "value": "<number>", "weight": "<number>" }
      ]
    }
  ]
}

- Generate ${weeklyFrequency} workouts
- Each workout should have 4–6 exercises.
- Each exercise should have 3–4 sets.
- Do NOT use time-based units.
- Do NOT include units like "lbs", "bodyweight", etc.
- Return only valid JSON like: { "plan": [ ... ] }
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const rawText = response.choices[0].message.content.trim();
    const parsed = JSON.parse(rawText);

    if (!Array.isArray(parsed.plan)) {
      throw new Error("Invalid plan format");
    }
    return res.status(200).json(parsed); // { plan: [...] }
  } catch (error) {
    console.error("Error generating week plan:", error);
    return res.status(500).json({ error: "Failed to generate workout week." });
  }
}
