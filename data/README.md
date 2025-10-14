# Data Directory - Research Export Guide

This directory contains the improv formats database and tools for enriching it through research.

## Files Overview

### Active Data
- **`formats.json`** - The main database used by the application (49 formats)

### Export Files (for research)
- **`formats-export-for-research.json`** - Full export with research instructions and TODO fields
- **`formats-research.md`** - Human-readable markdown version for easy research
- **`research-prompt.md`** - Detailed AI prompt for conducting research

### Tools
- **`import-enriched-data.js`** - Script to import researched data back into the app

## Research Workflow

### Step 1: Export (Already Done!)
The formats have been exported to two files:
- `formats-export-for-research.json` - For AI tools (Claude, ChatGPT, etc.)
- `formats-research.md` - For human research

### Step 2: Conduct Research
Use the exported files to research each format. You can:

**Option A: Manual Research**
1. Open `formats-research.md`
2. For each format, search for:
   - Video examples on YouTube
   - Historical information (creator, origin)
   - Related resources (books, articles, workshops)
   - Tips and common mistakes
3. Fill in the checkboxes and add notes

**Option B: AI-Assisted Research**
1. Load `formats-export-for-research.json` into an AI tool (Claude, ChatGPT)
2. Use the prompt from `research-prompt.md`
3. Ask the AI to research specific formats
4. The AI will return enriched JSON data

**Option C: Use Another App**
1. Copy `formats-export-for-research.json` to another application
2. Use that app's tools to research and enrich the data
3. Export the enriched data back to JSON

### Step 3: Import Enriched Data
Once you've enriched the data, import it back:

```bash
cd data
node import-enriched-data.js formats-export-for-research.json
```

This will:
- Validate the enriched data
- Create a backup of the current `formats.json`
- Import the enriched data
- Show statistics about what was added

## Research Priorities

Focus on these formats first (most important):
1. **Harold** (#1) - The foundational long-form format
2. **Armando** (#2) - Monologue-inspired scenes
3. **Монтаж/Montage** (#3) - Quick scene format
4. **Deconstruction** (#4) - Del Close's complex format
5. **Monoscene** (#47) - Single continuous scene

## What to Research

For each format, try to find:

### 1. Video Examples
- Look on YouTube for actual performances
- Prioritize videos from: iO Chicago, UCB, Second City
- Format: `https://youtube.com/watch?v=...`

### 2. Historical Context
- Who created this format?
- When and where?
- What was the original philosophy?

### 3. Learning Resources
- Books that discuss this format
- Articles and blog posts
- Workshops that teach it
- Expert interviews/podcasts

### 4. Practical Information
- Common mistakes and how to avoid them
- Prerequisites (what to learn first)
- Variations of the format
- Tips from experienced improvisers

### 5. Relationships
- Similar formats (add IDs to `similarTo`)
- Variations (add IDs to `variations`)
- Prerequisites (add IDs to `prerequisites`)

## Research Resources

### English Resources
- **improvencyclopedia.org** - Comprehensive wiki
- **www.learnimprov.com** - Learning resources
- **YouTube** - Search "[Format Name] improv"
- Books:
  - "Truth in Comedy" (Harold, by Del Close & Charna Halpern)
  - "Improvise: Scene from the Inside Out" (by Mick Napier)
  - "Impro" (by Keith Johnstone)

### Russian Resources
- **impropedia.ru** - Russian improv wiki
- **agilemasters.ru** - Agile & Improv
- **humorpedia.ru** - Humor and improv

## Example: Before and After

### Before Research
```json
{
  "id": "1",
  "name": "Harold",
  "sourceVideos": [],
  "notes": "Требует опыта в импровизации."
}
```

### After Research
```json
{
  "id": "1",
  "name": "Harold",
  "sourceVideos": [
    "https://youtube.com/watch?v=example1",
    "https://youtube.com/watch?v=example2"
  ],
  "notes": "Требует опыта в импровизации. Created by Del Close at iO Chicago. Described in 'Truth in Comedy' book. Common mistakes: forcing connections, ignoring the opening, playing games too long. The format emphasizes pattern recognition and organic connection-making.",
  "prerequisites": ["basic-scenework"],
  "similarTo": ["6", "20", "46"]
}
```

## Tips for Efficient Research

1. **Batch by type**: Research all videos first, then all historical info, etc.
2. **Use AI tools**: They can search and summarize quickly
3. **Focus on quality**: One good video is better than five mediocre ones
4. **Verify information**: Check multiple sources for historical facts
5. **Be specific**: "UCB Harold team 2015" is better than "Harold video"

## Backup Strategy

The import script automatically creates backups:
- Format: `formats.backup.[timestamp].json`
- Location: Same directory as `formats.json`
- Keep recent backups in case you need to revert

## Questions?

If you need help with:
- **File format issues**: Check the TypeScript interface in `lib/formats.ts`
- **Import errors**: The script will show specific validation errors
- **Research strategy**: See `research-prompt.md` for detailed guidance

## Next Steps

1. Choose a research method (manual, AI-assisted, or external app)
2. Start with high-priority formats
3. Enrich the data with your findings
4. Import back using the script
5. Test in the app to make sure everything works

Good luck with your research! 🎭
