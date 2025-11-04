# AI-Powered Automatic Categorization

This document describes the AI-powered automatic categorization feature for broken experiences.

## Overview

The system now uses OpenAI's GPT-3.5-turbo model to automatically categorize user-reported issues when no manual category is selected. This improves the user experience by removing the requirement for users to select categories themselves.

## How It Works

### 1. User Experience
- **Web App**: Category selector now shows "Auto-AI" as placeholder with tooltip explaining automatic categorization
- **Mobile App**: Shows "AI will categorize automatically" when no categories are selected
- Users can still manually select categories if they prefer

### 2. Backend Processing
When a new experience is created without a categoryId:
1. The system calls `AICategorization.categorizeAndGetId()`
2. AI analyzes the title, description, and address
3. Returns the most appropriate category from predefined options
4. Falls back to "Other" if categorization fails

### 3. Available Categories
The AI can categorize issues into these predefined categories:
- Building Maintenance
- Environmental Issues  
- Graffiti & Vandalism
- Noise & Disturbances
- Parks & Recreation
- Public Safety
- Public Transportation
- Road & Infrastructure
- Sidewalks & Walkways
- Street Lighting
- Traffic & Parking
- Waste Management
- Water & Drainage
- Other

## Configuration

### Environment Variables
Add to your `.env` file:
```
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

### API Usage
The system uses GPT-3.5-turbo with:
- Low temperature (0.1) for consistent results
- Max 50 tokens for category name only
- Validation against predefined category list

## Files Modified

### Backend
- `apps/server/src/module/ai-categorization/service.ts` - New AI categorization service
- `apps/server/src/module/experience/service.ts` - Updated to use AI when categoryId not provided
- `apps/server/src/module/experience/schema.ts` - Made categoryId optional
- `apps/server/package.json` - Added openai dependency

### Frontend
- `apps/web/src/app/(core)/(dashboard)/home/features/create-experience-card.tsx` - Updated UI and validation
- `apps/mobile/src/modules/reporting/components/experience-form.tsx` - Updated mobile form

## Testing

Run the test script to verify AI categorization:
```bash
cd apps/server
bun run test-ai-categorization.ts
```

## Error Handling

The system gracefully handles AI failures:
- If OpenAI API is unavailable, falls back to requiring manual category selection
- If AI returns invalid category, uses "Other" as fallback
- All errors are logged for monitoring

## Performance Considerations

- AI categorization adds ~1-2 seconds to experience creation
- Uses GPT-3.5-turbo for speed and cost efficiency
- Caching could be added for common phrases in the future

## Future Enhancements

1. **Learning System**: Train on user corrections to improve accuracy
2. **Caching**: Cache results for similar descriptions
3. **Confidence Scoring**: Show AI confidence level to users
4. **Multi-language**: Support for categorization in multiple languages
5. **Custom Categories**: Allow communities to define their own categories