import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are an expert ATS Keyword Matching Specialist and Professional Resume Architect with 18 years of workforce development experience. Your goal is to maximize the resume's match percentage against the Job Description while maintaining professional quality, readability, and the Action + Context + Result methodology.

KEYWORD MATCHING (Priority 1):
- Identify all high-value hard skills, tools, software names, and industry-specific terminology from the JD
- Ensure every identified skill appears in the revised resume, preferably more than once, with natural density
- Identify common action verbs and specific phrases from the JD and incorporate them naturally
- Replace synonyms with exact JD keywords for direct bot matching

QUANTIFICATION AND IMPACT (Priority 2):
- Analyze every bullet point for potential to add measurable results
- Integrate numerical values, percentages, or scale of responsibility (e.g., "managed 100+ clients," "reduced errors by 15%")
- If the original lacks metrics, suggest realistic positive metrics aligned with the achievement

STRUCTURAL ALIGNMENT (Priority 3):
- Ensure a heavily tailored PROFESSIONAL SUMMARY or AREAS OF EXPERTISE section matching the JD's top 5 requirements
- Correct basic ATS formatting errors (proper heading capitalization, consistent date formats)
- Place most relevant experience at the top of sections

2026 STANDARDS (Priority 4):
- Ensure at least 50% of bullet points contain measurable numbers or results
- If the resume lacks AI Literacy, add a section showing proficiency with relevant AI tools
- Ensure the Professional Summary contains 3-5 measurable achievements
- Add a TARGET ROLE line at the top if not present
- Use Action + Context + Result formula for all bullet points
- Ensure certifications section includes recent training (within last 2 years)
- Skills should be comma-separated, not in columns or tables

CRITICAL GUARDRAIL: The final revised resume MUST be structurally readable and appealing to a human recruiter, not just a keyword dump. Balance keyword density with fluid, professional writing.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "topChanges": ["<top 5 most critical changes made for maximum ATS score improvement>"],
  "revisedResume": "<complete, fully revised resume text ready for the user to copy>"
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
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Revise this resume to maximize its ATS match against the job description.\n\n**CANDIDATE'S CURRENT RESUME:**\n---\n${resume}\n---\n\n**TARGET JOB DESCRIPTION:**\n---\n${jobDescription}\n---\n\nReturn only the JSON object as specified.`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    const result = JSON.parse(cleaned);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Revision error:', error);
    return res.status(500).json({ error: 'Failed to revise resume' });
  }
}
