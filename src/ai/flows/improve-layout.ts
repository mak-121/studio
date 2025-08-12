// src/ai/flows/improve-layout.ts
'use server';
/**
 * @fileOverview A flow that uses AI to improve the layout of HTML/CSS for PDF generation.
 *
 * - improveLayout - A function that enhances HTML/CSS layout for better PDF rendering.
 * - ImproveLayoutInput - The input type for the improveLayout function.
 * - ImproveLayoutOutput - The return type for the improveLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveLayoutInputSchema = z.object({
  html: z
    .string()
    .describe('The HTML content to improve.'),
  css: z
    .string()
    .optional()
    .describe('The CSS styles to apply to the HTML content.'),
});
export type ImproveLayoutInput = z.infer<typeof ImproveLayoutInputSchema>;

const ImproveLayoutOutputSchema = z.object({
  improvedHtml: z.string().describe('The improved HTML content.'),
  improvedCss: z
    .string()
    .optional()
    .describe('The improved CSS styles.'),
});
export type ImproveLayoutOutput = z.infer<typeof ImproveLayoutOutputSchema>;

export async function improveLayout(input: ImproveLayoutInput): Promise<ImproveLayoutOutput> {
  return improveLayoutFlow(input);
}

const improveLayoutPrompt = ai.definePrompt({
  name: 'improveLayoutPrompt',
  input: {schema: ImproveLayoutInputSchema},
  output: {schema: ImproveLayoutOutputSchema},
  prompt: `You are an AI layout expert whose job is to improve HTML and CSS code for PDF generation. 

  Specifically, you should focus on fixing layout issues, overflow problems, and improving the overall appearance of the generated PDF. 

  Return the improved HTML and CSS code.

  Here is the HTML code:
  \`\`\`html
  {{{html}}
  \`\`\`

  Here is the CSS code:
  \`\`\`css
  {{{css}}
  \`\`\`
  `,
});

const improveLayoutFlow = ai.defineFlow(
  {
    name: 'improveLayoutFlow',
    inputSchema: ImproveLayoutInputSchema,
    outputSchema: ImproveLayoutOutputSchema,
  },
  async input => {
    const {output} = await improveLayoutPrompt(input);
    return output!;
  }
);
