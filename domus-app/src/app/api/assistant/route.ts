import OpenAI from "openai";
import type { Expense, Property } from "@/lib/mock-data";

type RequestBody = {
  message: string;
  language: string;
  plan: string;
  context: {
    expenses: Expense[];
    properties: Property[];
  };
};

function buildSystemPrompt(
  language: string,
  plan: string,
  expenses: Expense[],
  properties: Property[]
): string {
  const it = language === "it";
  const isPro = plan === "Pro";

  const pendingExpenses = expenses.filter((e) => e.status === "PENDING");
  const paidExpenses = expenses.filter((e) => e.status === "PAID");
  const expensesWithPdf = expenses.filter((e) => e.invoicePdf);

  const contextBlock = JSON.stringify(
    {
      properties,
      all_expenses: expenses,
      pending_expenses: pendingExpenses,
      paid_expenses: paidExpenses,
      expenses_with_invoice_pdf: expensesWithPdf,
    },
    null,
    2
  );

  const planRules = isPro
    ? `The user has a PRO plan with full access:
- Provide detailed answers referencing specific expenses, amounts, due dates, and properties.
- Analyze spending by category, property, and deadline.
- Reference invoice/PDF metadata when available.
- Give personalized, data-driven suggestions.`
    : `The user has a BASIC plan with limited access:
- Keep answers general and high-level.
- You may mention how many unpaid expenses exist, but do not list details.
- Do not break down expenses by property or category.
- Do not reference invoices or PDF documents.
- If the user asks for detailed analysis, invoice details, or property breakdowns, respond with exactly:
  ${it
    ? '"Questa funzionalità è disponibile nel piano Pro. Passa a Pro per analisi dettagliate, fatture e automazioni AI."'
    : '"This feature is available in the Pro plan. Upgrade to Pro for detailed analysis, invoices and AI automations."'
  }`;

  return `You are DomusAI Assistant, an intelligent property and expense management assistant embedded in the DomusAI app.

## Your expertise
You are an expert in home expenses, property organization, bills, deadlines, and financial documents related to real estate.

## Your mission
Help users understand and organize their property expenses using only the app data provided below. Never invent data.

## Core rules
1. ONLY use data from the "App Data" section below. Never invent amounts, due dates, supplier names, IBANs, invoice numbers, property names, or any other factual data.
2. If the information needed to answer is not present in the app data, clearly say it is not available in the app.
3. Give practical suggestions, but avoid asserting legal or financial certainty.
4. For tax or legal questions, recommend the user consult official sources or a qualified professional.
5. Be concise and clear. Format lists with bullet points when listing multiple items.
6. Always respond in ${it ? "Italian" : "English"}.

## Plan rules
${planRules}

## App Data
${contextBlock}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ fallback: true });
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { message, language, plan, context } = body;

  try {
    const client = new OpenAI({ apiKey });

    const systemPrompt = buildSystemPrompt(
      language,
      plan,
      context.expenses,
      context.properties
    );

    const response = await client.responses.create({
      model: "gpt-4o",
      instructions: systemPrompt,
      input: message,
    });

    return Response.json({ reply: response.output_text });
  } catch (err) {
    console.error("[assistant] OpenAI error:", err);
    return Response.json({ fallback: true });
  }
}
