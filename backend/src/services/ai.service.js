const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// NOTE: Always use z.toJSONSchema() (Zod v4's native converter) here, not the third-party
// zodToJsonSchema() from the "zod-to-json-schema" package. That package was built for Zod v3's
// internal schema format and silently fails on Zod v4 schemas — instead of throwing an error,
// it just returns an empty shell like { "$schema": "..." } with no actual type/properties.
// When that happens, responseJsonSchema is effectively blank, Gemini ignores it and freelances
// its own JSON structure for the response, and the AI report fields end up empty/mismatched
// with no error anywhere in the pipeline. Cost a long debugging session to track down — don't
// reintroduce zod-to-json-schema here.




const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(3).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(3).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
    })).min(3).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).min(3).describe("A day-wise preparation plan for the candidate"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseJsonSchema: z.toJSONSchema(interviewReportSchema), // native Zod v4 conversion
            maxOutputTokens: 16000,
        },
    });

    return interviewReportSchema.parse(JSON.parse(response.text));
}

module.exports = {
    generateInterviewReport
};