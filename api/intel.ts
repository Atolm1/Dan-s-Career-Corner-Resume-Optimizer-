import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are an experienced recruiter and career coach with 18 years of workforce development experience. You read job descriptions the way hiring managers write them — you see the subtext, the priorities, and the red flags that candidates miss.

Your job is to generate specific, actionable recruiter tips for a candidate based on their resume and a target job description. These tips should feel like insider advice from someone who has worked both sides of the hiring table — not generic career advice.

Return ONLY a valid JSON array of 5-6 tip objects. No markdown, no explanation, just the JSON array:
[
  {
    "icon": "<single relevant emoji>",
    "headline": "<short bold label, 3-6 words>",
    "tip": "<specific actionable advice, 2-4 sentences, tied directly to THIS job description>"
  }
]`;

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
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Based on the job description provided, generate 5-6 specific, actionable recruiter tips for this candidate. Think like an experienced recruiter and career coach with 18 years of workforce development experience.

Include tips about:
- Company culture signals in the job description and how to mirror them in a cover letter or interview
- Any software or tools mentioned they should research or learn before applying
- Salary negotiation insight if compensation is mentioned
- Transferable skills the candidate has that map to stated requirements
- What the hiring manager likely cares most about based on how the JD is written
- 1-2 competitor or industry research suggestions relevant to this specific employer

Be specific to THIS job description — not generic career advice.

**CANDIDATE'S RESUME:**
---
${resume}
---

**JOB DESCRIPTION:**
---
${jobDescription}
---

Return only the JSON array as specified.`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    const tips = JSON.parse(cleaned);

    return res.status(200).json(tips);
  } catch (error) {
    console.error('Intel error:', error);
    return res.status(500).json({ error: 'Failed to generate recruiter intel' });
  }
}
