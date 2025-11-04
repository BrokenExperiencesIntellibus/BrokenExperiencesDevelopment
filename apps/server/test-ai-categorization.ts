import { AICategorization } from './src/module/ai-categorization/service';

// Test cases for AI categorization
const testCases = [
	{
		title: "Broken streetlight on Main Street",
		description: "The streetlight outside 123 Main Street has been flickering and completely went out last night. It's very dark and unsafe.",
		address: "123 Main Street",
		expected: "Street Lighting"
	},
	{
		title: "Pothole causing car damage",
		description: "Large pothole on Highway 1 near the bridge is damaging cars. Multiple vehicles have gotten flat tires.",
		address: "Highway 1",
		expected: "Road & Infrastructure"
	},
	{
		title: "Graffiti on school wall",
		description: "Someone spray painted inappropriate messages on the side of the elementary school building.",
		address: "Elementary School",
		expected: "Graffiti & Vandalism"
	},
	{
		title: "Overflowing garbage bin",
		description: "The trash can at the bus stop is completely full and garbage is spilling onto the sidewalk.",
		address: "Bus Stop",
		expected: "Waste Management"
	},
	{
		title: "Loud music from neighbor",
		description: "Neighbor is playing extremely loud music every night until 3 AM, disturbing the whole neighborhood.",
		address: "Residential Area",
		expected: "Noise & Disturbances"
	}
];

async function testAICategorization() {
	console.log("Testing AI Categorization Service...\n");

	for (const testCase of testCases) {
		console.log(`Testing: "${testCase.title}"`);
		console.log(`Expected: ${testCase.expected}`);
		
		try {
			const result = await AICategorization.categorizeExperience({
				title: testCase.title,
				description: testCase.description,
				address: testCase.address
			});
			
			console.log(`AI Result: ${result}`);
			console.log(`✅ ${result === testCase.expected ? 'MATCH' : 'DIFFERENT'}\n`);
		} catch (error) {
			console.error(`❌ Error: ${error}\n`);
		}
	}
}

// Only run if OPENAI_API_KEY is set
if (process.env.OPENAI_API_KEY) {
	testAICategorization();
} else {
	console.log("⚠️ OPENAI_API_KEY not set. Add it to your .env file to test AI categorization.");
	console.log("Example: OPENAI_API_KEY=sk-proj-...");
}