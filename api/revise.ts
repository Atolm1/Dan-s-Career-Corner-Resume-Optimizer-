import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import type { MetricsData } from '../types';

const SYSTEM_PROMPT = `You are an expert ATS Keyword Matching Specialist and Professional Resume Architect with 18 years of workforce development experience. Your goal is to maximize the resume's match percentage against the Job Description while maintaining professional quality, readability, and the Action + Context + Result methodology.

KEYWORD MATCHING (Priority 1):
- Identify all high-value hard skills, tools, software names, and industry-specific terminology from the JD
- Ensure every identified skill appears in the revised resume, preferably more than once, with natural density
- Identify common action verbs and specific phrases from the JD and incorporate them naturally
- Replace synonyms with exact JD keywords for direct bot matching

QUANTIFICATION AND IMPACT (Priority 2):
- Analyze every bullet point for potential to add measurable results
- Use ONLY numbers from the CANDIDATE'S REAL METRICS section if provided — never fabricate numbers
- Where no real metric exists, insert [#] or [X]% as a placeholder — do NOT append any explanatory text like "(Add your real number here)" after placeholders; the placeholders alone are sufficient

STRUCTURAL ALIGNMENT (Priority 3):
- Heavily tailor PROFESSIONAL SUMMARY and CORE SKILLS to the JD's top 5 requirements
- Correct basic ATS formatting errors (proper heading capitalization, consistent date formats)
- Place most relevant experience at the top of sections

SECTION ORDER (mandatory — output sections in exactly this sequence):
1. Contact Information — include a LinkedIn placeholder: linkedin.com/in/[your-linkedin-handle]
2. Target Role (a single clear headline, e.g. "Workforce Development Specialist | Career Coach")
3. Professional Summary (3-5 sentences with measurable achievements)
4. Core Skills (comma-separated list, ATS-safe — absolutely no bullets, columns, or tables; hard maximum of 12 skills — prioritize exact keyword matches from the JD first, then the candidate's strongest transferable skills; if trimming is needed, cut the most generic ones last, e.g. "Administrative Support" or "Data Entry" are lower priority than specific JD matches; do NOT pad with generic soft skills like "Team Player" or "Hard Worker")
5. Professional Experience (reverse chronological)
6. Education
7. Certifications & Continuous Learning
8. AI Literacy (tools the candidate uses or is proficient with)

2026 STANDARDS (Priority 4):
- Ensure at least 50% of bullet points contain measurable numbers or results (real or placeholder)
- Ensure the Professional Summary contains 3-5 measurable achievements
- Use Action + Context + Result formula for all bullet points
- Skills must be comma-separated, not in columns or tables

CRITICAL — CERTIFICATIONS & CONTINUOUS LEARNING: Only include certifications, courses, or training that explicitly appear in the candidate's original resume. Do NOT add, invent, or suggest certifications that are not present in the source document. If no certifications exist in the original resume, either omit this section entirely or add a single placeholder line: [Add any relevant certifications or recent training here]

AI LITERACY: Only include AI tools the candidate explicitly mentions in their original resume. Do not fabricate AI proficiency. If no AI tools are mentioned in the source resume, add this placeholder line only: [Add any AI tools you use: e.g., ChatGPT, Copilot, Gemini — with a brief description of how you use them]

CRITICAL GUARDRAIL: The final revised resume MUST be structurally readable and appealing to a human recruiter, not just a keyword dump. Balance keyword density with fluid, professional writing.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "topChanges": ["<top 5 most critical changes made for maximum ATS score improvement>"],
  "revisedResume": "<complete, fully revised resume text ready for the user to copy>"
}`;

function buildMetricsBlock(metrics: MetricsData | null, skipped: boolean): string {
  if (skipped || !metrics) {
    return `\n\nMETRICS INSTRUCTIONS: The candidate did not provide specific numbers. Insert [#] or [X]% placeholders throughout all bullet points that could benefit from metrics. Do not append any explanatory text after placeholders. Do not fabricate any numbers.`;
  }

  const entries = [
    metrics.peopleServed && `- People/clients/customers served: ${metrics.peopleServed}`,
    metrics.processImprovement && `- Process improvements: ${metrics.processImprovement}`,
    metrics.workVolume && `- Work volume: ${metrics.workVolume}`,
    metrics.teamSize && `- Team size: ${metrics.teamSize}`,
    metrics.accuracyScores && `- Accuracy/satisfaction scores: ${metrics.accuracyScores}`,
    metrics.budgetImpact && `- Budget/cost/revenue impact: ${metrics.budgetImpact}`,
  ].filter(Boolean);

  if (entries.length === 0) {
    return `\n\nMETRICS INSTRUCTIONS: No specific numbers were provided. Insert [#] or [X]% placeholders throughout all bullet points that could benefit from metrics. Do not append any explanatory text after placeholders. Do not fabricate any numbers.`;
  }

  return `\n\nCANDIDATE'S REAL METRICS (use ONLY these numbers — do not fabricate others):\n${entries.join('\n')}\n\nFor any bullet where no matching metric was provided, insert [#] or [X]% as a placeholder only — no explanatory text after the placeholder.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { resume, jobDescription, metrics, skipped } = req.body as {
    resume: string;
    jobDescription: string;
    metrics: MetricsData | null;
    skipped: boolean;
  };

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'resume and jobDescription are required' });
  }

  try {
    const client = new Anthropic({ apiKey });
    const metricsBlock = buildMetricsBlock(metrics, skipped);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Revise this resume to maximize its ATS match against the job description.\n\n**CANDIDATE'S CURRENT RESUME:**\n---\n${resume}\n---\n\n**TARGET JOB DESCRIPTION:**\n---\n${jobDescription}\n---${metricsBlock}\n\nReturn only the JSON object as specified.`,
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
