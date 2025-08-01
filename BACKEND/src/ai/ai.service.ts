import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface Slide {
  position: number;
  title: string;
  content: string;
}

export interface GenerateResponse {
  slides: Slide[];
  projectId?: number;
  projectTitle?: string;
}

export interface ChatResponse {
  edit: string;
  context: string;
  slideUpdates?: {
    title?: string;
    content?: string;
    heroImageUrl?: string;
    layout?: string;
  };
}

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  private buildPitchDeckPrompt(prompt: string) {
    const systemPrompt = `You are an expert pitch deck creator. Create a comprehensive pitch deck based on the user's outline. 
    
    IMPORTANT: You must return ONLY a valid JSON object with this exact structure:
    {
      "slides": [
        {
          "position": 1,
          "title": "Slide Title",
          "content": "Slide content with bullet points and key information"
        }
      ]
    }
    
    Do not include any text before or after the JSON. Do not include explanations or markdown formatting. Return ONLY the JSON object.
    
    Guidelines:
    - Create 8-12 slides
    - Start with an executive summary
    - Include problem statement, solution, market analysis, business model, competitive advantage, financial projections, team, and call to action
    - Make content concise but comprehensive
    - Use bullet points for readability
    - Ensure logical flow between slides
    - Each slide should have a clear, descriptive title`;

    const userPrompt = `Create a pitch deck based on this outline: ${prompt}`;

    return { systemPrompt, userPrompt };
  }

  private validatePitchDeckResponse(response: any): response is { slides: Slide[] } {
    if (!response || typeof response !== 'object') return false;
    if (!Array.isArray(response.slides)) return false;
    
    return response.slides.every((slide: any) => 
      typeof slide === 'object' &&
      typeof slide.position === 'number' &&
      typeof slide.title === 'string' &&
      typeof slide.content === 'string'
    );
  }

  private extractSlidesFromResponse(response: any): Slide[] {
    if (this.validatePitchDeckResponse(response)) {
      return response.slides;
    }
    return [];
  }

  private cleanJsonResponse(text: string): string {
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    return text;
  }

  private generateFallbackResponse(prompt: string): Slide[] {
    const promptPreview = prompt ? prompt.slice(0, 50) : 'your business idea';
    
    // Create more meaningful fallback slides based on the prompt
    const fallbackSlides = [
      {
        position: 1,
        title: "Executive Summary",
        content: `Overview of ${promptPreview} - A comprehensive summary of the business opportunity, market potential, and key value propositions.`
      },
      {
        position: 2,
        title: "The Problem",
        content: `Current market challenges and pain points that ${promptPreview} addresses. Understanding the problem is crucial for positioning the solution.`
      },
      {
        position: 3,
        title: "Our Solution",
        content: `How ${promptPreview} solves the identified problems. Key features, benefits, and unique value proposition.`
      },
      {
        position: 4,
        title: "Market Analysis",
        content: `Market size, target audience, and growth potential for ${promptPreview}. Total Addressable Market (TAM) and Serviceable Addressable Market (SAM).`
      },
      {
        position: 5,
        title: "Business Model",
        content: `Revenue streams, pricing strategy, and business model for ${promptPreview}. How the business will generate sustainable revenue.`
      },
      {
        position: 6,
        title: "Competitive Advantage",
        content: `Unique selling propositions and competitive moats for ${promptPreview}. What sets this apart from existing solutions.`
      },
      {
        position: 7,
        title: "Financial Projections",
        content: `Revenue projections, cost structure, and profitability timeline for ${promptPreview}. Key financial metrics and milestones.`
      },
      {
        position: 8,
        title: "Team",
        content: `Key team members and their expertise relevant to ${promptPreview}. Leadership experience and track record.`
      },
      {
        position: 9,
        title: "Go-to-Market Strategy",
        content: `Marketing and sales strategy for ${promptPreview}. Customer acquisition channels and growth tactics.`
      },
      {
        position: 10,
        title: "Call to Action",
        content: `Next steps and investment opportunity for ${promptPreview}. Funding requirements and partnership opportunities.`
      }
    ];
    
    return fallbackSlides;
  }

  async generatePitchDeck(prompt: string): Promise<Slide[]> {
    try {
      // Validate input
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        console.log('Invalid prompt provided, using fallback');
        return this.generateFallbackResponse('your business idea');
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.log('OpenAI API key not configured, using fallback slides');
        return this.generateFallbackResponse(prompt);
      }
      
      console.log('OpenAI API key found, attempting to generate slides...');

      const { systemPrompt, userPrompt } = this.buildPitchDeckPrompt(prompt);
      
      console.log('Making OpenAI API call...');
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });
      console.log('OpenAI API call completed successfully');
      
      const aiResponseText = response.choices[0]?.message?.content;
      console.log(`AI response: ${aiResponseText}`);
      
      if (!aiResponseText) {
        console.log('No AI response received, using fallback');
        return this.generateFallbackResponse(prompt);
      }
      
      try {
        // Clean the response to extract JSON if needed
        const cleanedResponse = this.cleanJsonResponse(aiResponseText);
        const aiResponse = JSON.parse(cleanedResponse);
        console.log(`Parsed AI response successfully`);
        
        const slides = this.extractSlidesFromResponse(aiResponse);
        if (slides.length > 0) {
          console.log(`Returning ${slides.length} slides`);
          return slides;
        } else {
          console.log("Response validation failed, using fallback");
          return this.generateFallbackResponse(prompt);
        }
      } catch (error) {
        console.log(`JSON parse error: ${error}`);
        return this.generateFallbackResponse(prompt);
      }
    } catch (error) {
      console.error(`Error generating pitch deck: ${error}`);
      return this.generateFallbackResponse(prompt);
    }
  }

  async chatEdit(prompt: string, context: string, slideData?: any): Promise<ChatResponse> {
    try {
      const systemPrompt = `You are an expert pitch deck editor and slide designer. Your role is to help users improve their slides by providing both suggestions and direct slide updates.

IMPORTANT: When the user requests changes, you should:
1. Provide helpful suggestions in natural language
2. Return specific slide updates in JSON format when appropriate
3. Only update fields that need to change
4. Maintain the slide's professional tone and structure

For slide updates, return a JSON object with only the fields that should be updated:
{
  "title": "Updated title if needed",
  "content": "Updated content if needed", 
  "heroImageUrl": "New image URL if needed",
  "layout": "Updated layout if needed"
}

If no updates are needed, return an empty object or omit the slideUpdates field.`;

      let userPrompt = `Context: ${context}\n\nUser request: ${prompt}`;
      
      if (slideData) {
        userPrompt = `Current Slide Data:
${JSON.stringify(slideData, null, 2)}

User request: ${prompt}

Please provide helpful suggestions and, if appropriate, return specific slide updates in JSON format.`;
      }
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });
      
      const aiResponse = response.choices[0]?.message?.content || "No response generated";
      
      // Try to extract JSON updates from the response
      let slideUpdates = undefined;
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const parsed = JSON.parse(jsonStr);
          if (parsed && typeof parsed === 'object') {
            slideUpdates = parsed;
          }
        }
      } catch (error) {
        console.log('No valid JSON updates found in response');
      }
      
      return {
        edit: aiResponse,
        context: context + "\n" + prompt,
        slideUpdates
      };
    } catch (error) {
      console.error(`Error in chat edit: ${error}`);
      return {
        edit: "I'm having trouble processing your request. Please try again.",
        context: context + "\n" + prompt
      };
    }
  }
} 