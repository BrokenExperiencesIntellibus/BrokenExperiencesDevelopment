import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Available categories that match the database schema
const AVAILABLE_CATEGORIES = [
	'Building Maintenance',
	'Environmental Issues',
	'Graffiti & Vandalism',
	'Noise & Disturbances',
	'Parks & Recreation',
	'Public Safety',
	'Public Transportation',
	'Road & Infrastructure',
	'Sidewalks & Walkways',
	'Street Lighting',
	'Traffic & Parking',
	'Waste Management',
	'Water & Drainage',
	'Other'
];

export class AICategorization {
	/**
	 * Determines the most appropriate category for a broken experience using AI
	 * Analyzes text (title, description, address) and optionally images
	 */
	static async categorizeExperience(options: {
		title: string;
		description: string;
		address?: string;
		imageUrls?: string[];
	}): Promise<string> {
		// Check if OpenAI API key is configured
		if (!process.env.OPENAI_API_KEY) {
			console.warn('⚠️ OPENAI_API_KEY not configured, AI categorization disabled');
			throw new Error('AI categorization not available - OpenAI API key not configured');
		}

		try {
			const { title, description, address, imageUrls } = options;
			
			// Combine all available text for analysis
			const experienceText = [title, description, address].filter(Boolean).join(' ');
			
			// Create messages array with text and potentially images
			const messages: any[] = [];
			
			if (imageUrls && imageUrls.length > 0) {
				// Use GPT-4 Vision for image analysis
				const content = [
					{
						type: "text",
						text: `You are an AI assistant that categorizes community-reported issues and broken experiences.

Based on the following description AND the provided image(s), determine the most appropriate category from this list:
${AVAILABLE_CATEGORIES.map(cat => `- ${cat}`).join('\n')}

Issue Description: "${experienceText}"

Instructions:
1. Analyze BOTH the text description AND the image(s) to understand what type of issue is being reported
2. Use the visual information from the image to confirm or refine your categorization
3. Select the SINGLE most appropriate category from the provided list
4. If the issue doesn't clearly fit any specific category, choose "Other"
5. Respond with ONLY the category name, nothing else

Category:`
					},
					...imageUrls.slice(0, 3).map(url => ({ // Limit to 3 images for cost control
						type: "image_url",
						image_url: {
							url: url,
							detail: "low" // Use low detail for faster/cheaper processing
						}
					}))
				];
				
				messages.push({
					role: 'user',
					content: content
				});
			} else {
				// Text-only analysis
				const prompt = `
You are an AI assistant that categorizes community-reported issues and broken experiences.

Based on the following description of a community issue, determine the most appropriate category from this list:
${AVAILABLE_CATEGORIES.map(cat => `- ${cat}`).join('\n')}

Issue Description: "${experienceText}"

Instructions:
1. Analyze the content to understand what type of issue is being reported
2. Select the SINGLE most appropriate category from the provided list
3. If the issue doesn't clearly fit any specific category, choose "Other"
4. Respond with ONLY the category name, nothing else

Category:`;

				messages.push({
					role: 'user',
					content: prompt
				});
			}

			const completion = await openai.chat.completions.create({
				model: imageUrls && imageUrls.length > 0 ? 'gpt-4o-mini' : 'gpt-4o-mini', // Use vision model for images
				messages: messages,
				max_tokens: 50,
				temperature: 0.1, // Low temperature for consistent categorization
			});

			const suggestedCategory = completion.choices[0]?.message?.content?.trim();
			
			// Validate that the AI returned a valid category
			if (suggestedCategory && AVAILABLE_CATEGORIES.includes(suggestedCategory)) {
				console.log(`AI categorized "${title}" as: ${suggestedCategory}`);
				return suggestedCategory;
			} else {
				console.warn(`⚠️ AI returned invalid category "${suggestedCategory}", falling back to "Other"`);
				return 'Other';
			}
		} catch (error) {
			console.error('❌ AI categorization failed:', error);
			// Fallback to 'Other' if AI fails
			return 'Other';
		}
	}

	/**
	 * Get the category ID for a given category name
	 */
	static async getCategoryId(categoryName: string): Promise<string | null> {
		try {
			const { db } = await import('@server/db');
			const { category } = await import('@server/db/schema');
			const { eq } = await import('drizzle-orm');

			const categoryRecord = await db
				.select({ id: category.id })
				.from(category)
				.where(eq(category.name, categoryName))
				.limit(1);

			return categoryRecord[0]?.id || null;
		} catch (error) {
			console.error('❌ Failed to get category ID:', error);
			return null;
		}
	}

	/**
	 * Main function to categorize an experience and return the category ID
	 */
	static async categorizeAndGetId(options: {
		title: string;
		description: string;
		address?: string;
		imageUrls?: string[];
	}): Promise<string> {
		try {
			// Get AI-suggested category
			const categoryName = await this.categorizeExperience(options);
			
			// Get the category ID from database
			const categoryId = await this.getCategoryId(categoryName);
			
			if (!categoryId) {
				// If category doesn't exist in DB, fall back to "Other"
				const otherCategoryId = await this.getCategoryId('Other');
				if (otherCategoryId) {
					console.warn(`⚠️ Category "${categoryName}" not found in DB, using "Other"`);
					return otherCategoryId;
				} else {
					throw new Error('Unable to find any valid category in database');
				}
			}
			
			return categoryId;
		} catch (error) {
			console.error('❌ Failed to categorize and get ID:', error);
			throw error;
		}
	}
}