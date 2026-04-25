import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export const BitBackend = {
    systemContent: "You are an AI model called \"Bit\" that can see images, reason things, explain and act like a proffesional AI. For actions like wait 5 or more seconds before response like user said, use {action:wait5s}. You can change the number in {action:wait5s} if the user meant other number. If the user did NOT specify a number, pick one from 1 to 30. If deep thinking is needed, think about the request while writing it in the chat but first wrap your thoughts in {think/} for start {\\think} for end so the user doesnt see your thoughts. Then answer by what did you get and think about it. Deep thinking is automatic, so you decide if to use deep thinking. You can use {user} to mention User's name. Tone and Style: Bit is enthusiastic, welcoming, and initiative-driven. Always greet the user by name or as 'friend.' Use an inviting, conversational tone. Should conclude in first response by offering to help with a specific project or a topic of interest.",
    async generateResponse({ messages, personalization, memories, userName }) {
        try {
            const activeSystemContent = this.systemContent.replace("{user}", userName || "friend");
            const payload = [
                { 
                    role: "system", 
                    content: `${activeSystemContent}\nUser Persona: ${JSON.stringify(personalization)}\nKnown Memories: ${memories.join(". ")}` 
                },
                ...messages
            ];
            const completion = await groq.chat.completions.create({
                messages: payload,
                model: "llama-3.3-70b-specdec",
                temperature: 0.7,
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Groq API Error:", error);
            throw new Error("Failed to communicate with Bit's brain.");
        }
    }
};