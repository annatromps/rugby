// AI-assisted sourcing: given a natural-language brief from the admin (e.g.
// "amateur rugby clubs in South Wales currently short on props" or
// "props based in New Zealand open to relocating"), ask Claude to search the
// web and propose a short list of real candidate clubs or players, each with
// a brief rationale and a source link the admin can verify by hand.
//
// This calls the Anthropic Messages API directly with the server-side web
// search tool, rather than routing through a heavier agent framework --
// there's exactly one job here (search, then structure results), so a
// single API call with a strict output schema is the simplest thing that
// can work and the easiest for a future maintainer to follow.
import "server-only";

// Model IDs change over time -- check https://docs.claude.com/en/docs/about-claude/models
// for the current recommended model and update ANTHROPIC_MODEL in .env if needed.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

export type SourcingCandidate = {
  name: string;
  summary: string;
  sourceUrl?: string;
  rawData?: Record<string, unknown>;
};

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      "ANTHROPIC_API_KEY is not set. Add it to your environment to enable AI-assisted sourcing (see README.md).",
    );
    this.name = "MissingApiKeyError";
  }
}

const CANDIDATE_LIST_TOOL = {
  name: "return_candidates",
  description:
    "Return the final list of candidate clubs or players found via web search.",
  input_schema: {
    type: "object" as const,
    properties: {
      candidates: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            name: { type: "string" as const, description: "Club or player name" },
            summary: {
              type: "string" as const,
              description:
                "2-3 sentences on why this looks like a fit for the brief, and any relevant detail (level, location, position, contact info if publicly available).",
            },
            sourceUrl: {
              type: "string" as const,
              description: "URL where this was found, so the admin can verify it.",
            },
          },
          required: ["name", "summary"],
        },
      },
    },
    required: ["candidates"],
  },
};

export async function runSourcingSearch(
  targetType: "CLUB" | "PLAYER",
  brief: string,
): Promise<SourcingCandidate[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }

  const targetLabel = targetType === "CLUB" ? "rugby clubs" : "rugby players";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      tools: [
        { type: "web_search_20250305", name: "web_search", max_uses: 8 },
        CANDIDATE_LIST_TOOL,
      ],
      messages: [
        {
          role: "user",
          content: [
            "You are helping a rugby player/club recruitment agency find real, currently-relevant leads.",
            `Search the web for ${targetLabel} matching this brief:`,
            `"${brief}"`,
            "",
            "Find up to 8 real, specific candidates (not generic advice). For each, note where you found it.",
            "Only include candidates you found real evidence for during your search -- never invent one.",
            "When you're done searching, call return_candidates with your final list.",
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Anthropic API error (${response.status}): ${body.slice(0, 500)}`);
  }

  const data = await response.json();

  const toolUse = (data.content ?? []).find(
    (block: { type: string; name?: string }) =>
      block.type === "tool_use" && block.name === "return_candidates",
  );

  if (!toolUse) {
    return [];
  }

  const candidates = (toolUse.input?.candidates ?? []) as SourcingCandidate[];
  return candidates;
}
