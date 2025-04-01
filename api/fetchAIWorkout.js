import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FALLBACK_WORKOUT = {
  name: "Basic Full Body Backup",
  exercises: [
    {
      name: "Push-ups",
      sets: [
        { type: "reps", value: 10 },
        { type: "reps", value: 10 },
        { type: "reps", value: 10 },
      ],
    },
    {
      name: "Bodyweight Squats",
      sets: [
        { type: "reps", value: 15 },
        { type: "reps", value: 15 },
        { type: "reps", value: 15 },
      ],
    },
    {
      name: "Sit-ups",
      sets: [
        { type: "reps", value: 15 },
        { type: "reps", value: 15 },
        { type: "reps", value: 15 },
      ],
    },
    {
      name: "Lunges",
      sets: [
        { type: "reps", value: 12 },
        { type: "reps", value: 12 },
        { type: "reps", value: 12 },
      ],
    },
  ],
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { goal, workoutType, level } = req.body;
  if (!goal || !workoutType || !level) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
    You are a personal trainer. Generate a structured workout for a user based on:
    - Goal: ${goal}
    - Workout Type: ${workoutType}
    - Fitness Level: ${level}
    
    Format the response exactly like this:
    {
      "name": "<Workout Name>",
      "exercises": [
        {
          "name": "<Exercise Name>",
          "sets": [
            { "type": "reps", "value": "<number only>", "weight": "<number only>" }
          ]
        }
      ]
    }

    - Provide 4-6 exercises
    - Each exercise should have 3–4 sets.
    - Do NOT use time-based units.
    - Do NOT include units like "lbs", "bodyweight", etc.
    - Return only valid JSON
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1250,
    });

    const rawText = response.choices[0].message.content.trim();
    const parsedWorkout = JSON.parse(rawText);

    if (!parsedWorkout?.exercises?.length) {
      throw new Error("Invalid workout format");
    }
    return res.status(200).json(parsedWorkout);
  } catch (error) {
    console.error("Workout generation error:", error);
    return res.status(500).json({
      error: "Failed to generate workout",
      fallback: FALLBACK_WORKOUT,
    });
  }
}