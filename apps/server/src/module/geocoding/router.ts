import Elysia from 'elysia';

export const geocodingRouter = new Elysia({ prefix: '/geocoding' })
	.get('/reverse', async ({ query }) => {
		const { lat, lng } = query;
		
		if (!lat || !lng) {
			return { error: 'Latitude and longitude are required' };
		}

		try {
			console.log(`🌍 Reverse geocoding for: ${lat}, ${lng}`);
			
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
				{
					headers: {
						'User-Agent': 'BrokenExperiences/1.0 (https://brokenexperiences.com)',
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Nominatim API error: ${response.statusText}`);
			}

			const data = await response.json();
			console.log(`✅ Geocoding successful for: ${lat}, ${lng}`);
			
			return data;
		} catch (error) {
			console.error('❌ Geocoding error:', error);
			return { 
				error: 'Failed to reverse geocode location',
				details: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	});