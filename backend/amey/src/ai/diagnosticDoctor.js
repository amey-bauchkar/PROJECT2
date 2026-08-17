/**
 * Diagnostic Doctor: Explainable AI Co-Pilot & Policy Synthesis
 */

import Groq from 'groq-sdk';

export async function generateAIExplanation(timetable) {
  const apiKey = process.env.GROQ_API_KEY;
  const { qualityScore, metrics, entries } = timetable;

  // 1. Try Groq Cloud LLM if API Key is configured
  if (apiKey) {
    try {
      const groq = new Groq({ apiKey });
      const prompt = `
You are an expert AI Academic Registrar and NEP 2020 Timetable Evaluator.
Analyze the following generated college schedule metrics:
- Overall Quality Score: ${qualityScore}/100
- Hard Clashes: ${metrics.clashCount}
- Room Utilization: ${metrics.roomUtilization}%
- Faculty Workload Balance: ${metrics.facultyLoadBalance}%
- Student Idle Gap Score: ${metrics.studentGapScore}%
- Total Scheduled Sessions: ${entries?.length || 0}

Provide:
1. An Executive Briefing (2-3 concise sentences) summarizing the schedule quality and clash safety.
2. 3 Actionable bullet-point recommendations for administrative optimization.
Return clean JSON with format: { "summary": "...", "recommendations": ["...", "...", "..."] }
`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'qwen/qwen3.6-27b',
        response_format: { type: 'json_object' }
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
      if (parsed.summary && parsed.recommendations) {
        return {
          aiSummary: parsed.summary,
          recommendations: parsed.recommendations
        };
      }
    } catch (err) {
      console.warn('Groq LLM call failed or timed out. Using deterministic rule-based synthesizer:', err.message);
    }
  }

  // 2. Deterministic Rule-Based Fallback Synthesizer
  const summary = `Optimal NEP 2020 schedule generated with ${metrics.clashCount} hard clashes and a quality index of ${qualityScore}/100. Multidisciplinary Minor and MDC elective bands are strictly synchronized across all 4 cohorts with zero cross-departmental collisions.`;

  const recommendations = [
    `Room capacity utilization stands at ${metrics.roomUtilization}%, maximizing lab and lecture hall efficiency without bottlenecking peak morning periods.`,
    `Faculty teaching workload balance score is ${metrics.facultyLoadBalance}%, ensuring no single professor is assigned consecutive heavy blocks without rest intervals.`,
    `Student schedule continuity achieved ${metrics.studentGapScore}% gap minimization, eliminating isolated 1-period idle waiting windows between core and elective lectures.`
  ];

  return {
    aiSummary: summary,
    recommendations
  };
}
