import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Store API key in .env
  dangerouslyAllowBrowser: true, // Required for client-side API calls
});

export async function generateWorkoutAI(goal, workoutType, level) {
  const prompt = `
  You are a personal trainer. Generate a structured workout for a user based on:
  - Goal: ${goal}
  - Workout Type: ${workoutType}
  - Fitness Level: ${level}
  - Provide 4-6 exercises.
  - Each exercise should have 3-4 sets.
  - Specify reps or duration, and weight if applicable.
  - Ensure the response is **valid JSON**.

  Format the response **exactly like this**:
  {
    "name": "<Workout Name>",
    "exercises": [
      {
        "name": "<Exercise Name>",
        "sets": [
          { "type": "reps" or "seconds", "value": "<value>", "weight": "<weight or 'bodyweight'>" }
        ]
      }
  }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for best results
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const rawText = response.choices[0].message.content.trim();
    console.log(rawText)

    // ✅ Try to parse response as JSON
    try {
      const generatedWorkout = JSON.parse(rawText);
      return generatedWorkout;
    } catch (jsonError) {

      console.log(JSON.parse(rawText));

      console.error("JSON Parsing Error:", jsonError);
      throw new Error("Invalid JSON response from OpenAI.");
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);

    // ✅ Return a default fallback workout if OpenAI fails
    return {
      name: "Fallback Workout",
      exercises: [
        {
          name: "Push-ups",
          sets: [{ type: "reps", value: "12", weight: "bodyweight" }],
        },
        {
          name: "Squats",
          sets: [{ type: "reps", value: "15", weight: "bodyweight" }],
        },
        {
          name: "Plank",
          sets: [{ type: "seconds", value: "60", weight: "" }],
        },
      ],
    };
  }
}
