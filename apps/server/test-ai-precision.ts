import { AICategorization } from './src/module/ai-categorization/service';

// Comprehensive test cases for AI categorization accuracy
const testCases = [
	// Street Lighting
	{
		title: "Broken streetlight on Main Street",
		description: "The streetlight outside 123 Main Street has been flickering and completely went out last night. It's very dark and unsafe for pedestrians.",
		address: "123 Main Street",
		expected: "Street Lighting"
	},
	{
		title: "Dark street needs lighting",
		description: "Street lamp is completely out, no light at all during night time",
		address: "Oak Avenue",
		expected: "Street Lighting"
	},
	
	// Road & Infrastructure  
	{
		title: "Large pothole damaging cars",
		description: "Massive pothole on Highway 1 near the bridge is causing flat tires and vehicle damage to multiple cars daily.",
		address: "Highway 1",
		expected: "Road & Infrastructure"
	},
	{
		title: "Road surface cracking",
		description: "Asphalt is cracking and creating dangerous driving conditions",
		address: "Industrial Blvd",
		expected: "Road & Infrastructure"
	},

	// Graffiti & Vandalism
	{
		title: "Graffiti vandalism on school wall",
		description: "Someone spray painted inappropriate messages and drawings on the side of the elementary school building overnight.",
		address: "Elementary School",
		expected: "Graffiti & Vandalism"
	},
	{
		title: "Vandalized bus stop",
		description: "Bus shelter has been tagged with graffiti and glass is broken",
		address: "Bus Stop Plaza",
		expected: "Graffiti & Vandalism"
	},

	// Waste Management
	{
		title: "Overflowing garbage bin",
		description: "The trash can at the bus stop is completely full and garbage is spilling onto the sidewalk creating a mess.",
		address: "Bus Stop",
		expected: "Waste Management"
	},
	{
		title: "Missed garbage collection",
		description: "Garbage truck missed our street pickup and bins are overflowing for days",
		address: "Residential Street",
		expected: "Waste Management"
	},

	// Noise & Disturbances
	{
		title: "Loud music from neighbor",
		description: "Neighbor is playing extremely loud music every night until 3 AM, disturbing the whole neighborhood and preventing sleep.",
		address: "Residential Area",
		expected: "Noise & Disturbances"
	},
	{
		title: "Construction noise complaint",
		description: "Construction work starting at 5 AM with heavy machinery making excessive noise",
		address: "Downtown Area",
		expected: "Noise & Disturbances"
	},

	// Water & Drainage
	{
		title: "Water leak flooding street",
		description: "Broken water main is flooding the entire street and causing water damage",
		address: "Water Street",
		expected: "Water & Drainage"
	},
	{
		title: "Clogged storm drain",
		description: "Storm drain is completely blocked causing flooding during rain",
		address: "Low lying area",
		expected: "Water & Drainage"
	},

	// Public Safety
	{
		title: "Dangerous intersection",
		description: "Stop sign is missing and cars are not stopping, multiple near accidents reported",
		address: "Main & Oak intersection",
		expected: "Public Safety"
	},
	{
		title: "Broken fence security risk",
		description: "Fence around playground is broken allowing unauthorized access to children's area",
		address: "Community Park",
		expected: "Public Safety"
	},

	// Building Maintenance
	{
		title: "Crumbling building facade",
		description: "Concrete chunks falling from old building facade onto sidewalk below",
		address: "Downtown Building",
		expected: "Building Maintenance"
	},

	// Traffic & Parking
	{
		title: "Illegal parking blocking access",
		description: "Cars parked in no parking zone blocking emergency vehicle access",
		address: "Fire Lane",
		expected: "Traffic & Parking"
	},

	// Sidewalks & Walkways
	{
		title: "Broken sidewalk trip hazard",
		description: "Sidewalk has large cracks and uneven surfaces causing people to trip and fall",
		address: "Pedestrian Walkway",
		expected: "Sidewalks & Walkways"
	},

	// Public Transportation
	{
		title: "Bus stop shelter damaged",
		description: "Bus stop roof is leaking and seating is broken making waiting uncomfortable",
		address: "Main Bus Terminal",
		expected: "Public Transportation"
	}
];

async function testAICategorization() {
	console.log("🧪 Testing AI Categorization Precision & Accuracy...\n");

	let correct = 0;
	let total = testCases.length;
	const results: any[] = [];

	for (const testCase of testCases) {
		console.log(`Testing: "${testCase.title}"`);
		console.log(`Description: "${testCase.description}"`);
		console.log(`Expected: ${testCase.expected}`);
		
		try {
			const result = await AICategorization.categorizeExperience({
				title: testCase.title,
				description: testCase.description,
				address: testCase.address
			});
			
			const isCorrect = result === testCase.expected;
			if (isCorrect) correct++;
			
			console.log(`AI Result: ${result}`);
			console.log(`${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
			console.log('---');
			
			results.push({
				...testCase,
				aiResult: result,
				correct: isCorrect
			});
		} catch (error) {
			console.error(`❌ Error: ${error}`);
			results.push({
				...testCase,
				aiResult: 'ERROR',
				correct: false
			});
		}
	}

	// Summary
	const accuracy = (correct / total) * 100;
	console.log(`\n📊 ACCURACY RESULTS:`);
	console.log(`✅ Correct: ${correct}/${total}`);
	console.log(`📈 Accuracy: ${accuracy.toFixed(1)}%`);
	
	if (accuracy >= 90) {
		console.log(`🎉 EXCELLENT: AI categorization is highly accurate!`);
	} else if (accuracy >= 80) {
		console.log(`👍 GOOD: AI categorization is reasonably accurate`);
	} else if (accuracy >= 70) {
		console.log(`⚠️ FAIR: AI categorization needs improvement`);
	} else {
		console.log(`❌ POOR: AI categorization needs significant improvement`);
	}

	// Show incorrect predictions for analysis
	const incorrect = results.filter(r => !r.correct);
	if (incorrect.length > 0) {
		console.log(`\n🔍 INCORRECT PREDICTIONS TO REVIEW:`);
		incorrect.forEach(item => {
			console.log(`- "${item.title}" → Expected: ${item.expected}, Got: ${item.aiResult}`);
		});
	}
}

// Only run if OPENAI_API_KEY is set
if (process.env.OPENAI_API_KEY) {
	testAICategorization().catch(console.error);
} else {
	console.log("⚠️ OPENAI_API_KEY not set. Add it to your .env file to test AI categorization.");
	console.log("Example: OPENAI_API_KEY=sk-proj-...");
}