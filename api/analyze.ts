import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are an expert ATS analyst and career coach with 18 years of workforce development experience. You think like a recruiter — not just an algorithm. Your analysis follows the 2026 resume standard where success means showing clear, relevant impact for both AI systems and fast human review.

Analyze the resume against the job description and score the following categories:

1. Hard Skills (0-100): Job-specific technical knowledge and qualifications
2. Soft Skills (0-100): Communication, collaboration, adaptability signals
3. Tech Skills (0-100): Software, tools, platforms mentioned vs. required
4. Metrics Density (0-100): What percentage of bullet points contain measurable numbers or results? Target is 50% or higher. Count total bullets and bullets with metrics. Flag specific bullets that could be quantified.
5. Professional Summary (0-100): Does it function as a "metadata section" — containing 3-5 key achievements with measurable results that signal strengths to both AI and recruiters?
6. Target Role Clarity (0-100): Is there a clear target role or headline at the top of the resume?
7. AI Literacy (0-100): Does the resume mention proficiency with AI tools (ChatGPT, Copilot, Gemini, etc.)? This is a 2026 differentiator.
8. Formatting (0-100): Is the resume ATS-safe? No columns, graphics, tables, or fancy design elements that break parsing?

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "overallScore": <weighted average: Hard 25%, Soft 15%, Tech 20%, Metrics 20%, Summary 10%, TargetRole 5%, AI 3%, Formatting 2%>,
  "hardSkills": { "score": <0-100>, "feedback": "<concise feedback>" },
  "softSkills": { "score": <0-100>, "feedback": "<concise feedback>" },
  "techSkills": { "score": <0-100>, "feedback": "<concise feedback>" },
  "metricsScore": { "score": <0-100>, "feedback": "<specific bullets that could be quantified>" },
  "summaryScore": { "score": <0-100>, "feedback": "<concise feedback>" },
  "targetRoleScore": { "score": <0-100>, "feedback": "<concise feedback>" },
  "aiLiteracyScore": { "score": <0-100>, "feedback": "<concise feedback>" },
  "formattingScore": { "score": <0-100>, "feedback": "<concise feedback>" },
  "metricsPercentage": <actual calculated % of bullets with numbers, e.g. 42>,
  "bulletCount": <total bullet points counted>,
  "metricsPassFail": <true if metricsPercentage >= 50, else false>,
  "recommendations": [
    "<5-7 specific, actionable recommendations using Action + Context + Result formula>"
  ]
}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { resume, jobDescription } = req.body as { resume: string; jobDescription: string };

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'resume and jobDescription are required' });
  }

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this resume against the job description.\n\n**RESUME:**\n---\n${resume}\n---\n\n**JOB DESCRIPTION:**\n---\n${jobDescription}\n---\n\nReturn only the JSON object as specified.`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    const result = JSON.parse(cleaned);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze resume' });
  }
}
