# System Prompt Customization Guide

## How the Gemini API Key Works

The application uses the Gemini API key from environment variables:

```typescript
// In server/services/gemini.ts
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```

## Current Enhanced System Prompt

The system prompt has been optimized for:
- **Bold formatting** for important information
- **Bullet points** for easy scanning
- **Short paragraphs** (2-3 sentences max)
- **Direct, actionable advice**
- **Specific numbers, times, and prices**

## Customizing the System Prompt

### Location
File: `server/services/gemini.ts`
Variable: `SYSTEM_PROMPT`

### Current Structure
```typescript
const SYSTEM_PROMPT = `
You are Saanchari, an expert travel assistant for Andhra Pradesh tourism. Your responses must be:

FORMATTING RULES:
- Use **bold** for all important information (places, prices, times, key tips)
- Use bullet points (•) for easy scanning
- Keep paragraphs short (2-3 sentences max)
- Start with the most important info first
- Use clear headings when needed

RESPONSE STYLE:
- Direct and to-the-point
- Actionable advice only
- No long introductions
- Highlight key details in **bold**
- Use specific numbers, times, and prices when possible

CONTENT FOCUS:
- Andhra Pradesh tourism expertise
- Local insights (food, festivals, hidden gems)
- Practical travel tips (budget, transport, timing)
- Quick recommendations over long explanations

EXAMPLES:
Instead of: "Tirupati is a wonderful place to visit and there are many things to see..."
Write: "**Tirupati** - Best visited **Oct-Feb**. **Must-see**: Tirumala Temple, **timing**: 6 AM-10 PM. **Budget**: ₹2000-3000/day."

Always prioritize useful, scannable information over lengthy descriptions.
`;
```

## Response Format Examples

### Before Enhancement (Lengthy)
```
"Tirupati is a wonderful place to visit in Andhra Pradesh. There are many things to see and do there. The temple is very famous and attracts millions of visitors every year. You should plan your visit carefully to make the most of your time there."
```

### After Enhancement (Focused & Bold)
```
**Tirupati** - Best visited **Oct-Feb**

**Must-see**: Tirumala Temple
• **Timing**: 6 AM-10 PM
• **Wait time**: 2-8 hours (book online to skip)
• **Budget**: ₹2000-3000/day

**Quick Tips**:
• Book **TTD accommodation** in advance
• Carry **valid ID** for darshan
• Avoid **festival days** for shorter queues
```

## Advanced Customization Options

### 1. Tone Adjustment
```typescript
// For more formal tone
"You are a professional tourism consultant..."

// For more casual tone
"You're a friendly local guide who knows Andhra Pradesh inside out..."

// For more urgent/direct tone
"You're a quick-response travel expert. Give immediate, actionable advice..."
```

### 2. Response Length Control
```typescript
// For ultra-brief responses
"Keep all responses under 100 words. Use only bullet points."

// For detailed responses
"Provide comprehensive information but organize it clearly with headings and bullet points."
```

### 3. Specialized Focus
```typescript
// For budget travelers
"Focus on budget options, free attractions, and money-saving tips."

// For luxury travelers
"Emphasize premium experiences, luxury accommodations, and exclusive activities."

// For adventure seekers
"Highlight adventure activities, trekking, and off-beat destinations."
```

### 4. Local Expertise Enhancement
```typescript
// Add specific local knowledge
"Include local dialect terms, insider tips from locals, and hidden gems that only residents know about."
```

## Testing Your Prompt Changes

1. **Edit the prompt** in `server/services/gemini.ts`
2. **Save the file** (auto-reloads in development)
3. **Test with sample questions**:
   - "Best places to visit in Visakhapatnam"
   - "Food recommendations in Hyderabad"
   - "Budget travel tips for Andhra Pradesh"

## Message Formatting Support

The frontend supports:
- **Bold text**: `**text**` → **text**
- **Bullet points**: `•` → Properly formatted bullets
- **Line breaks**: Automatic paragraph formatting
- **Language prefixes**: `[हिंदी]` and `[తెలుగు]`

## Best Practices

1. **Test incrementally** - Make small changes and test
2. **Use examples** - Include specific examples in your prompt
3. **Be specific** - Clear instructions produce better results
4. **Consider your audience** - Adjust tone for your target users
5. **Monitor responses** - Check if the AI follows your formatting rules

## Common Issues & Solutions

### Problem: Responses too long
**Solution**: Add "Keep responses under X words" to your prompt

### Problem: No bold formatting
**Solution**: Add explicit examples of bold usage in your prompt

### Problem: Inconsistent tone
**Solution**: Be more specific about desired tone and style

### Problem: Missing local details
**Solution**: Add specific requirements for local insights

## Environment Variables

Remember to set your Gemini API key in your environment:

```bash
# In .env file
GEMINI_API_KEY=your_actual_api_key_here
```

The system will automatically load this in development mode.