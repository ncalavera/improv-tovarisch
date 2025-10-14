# Quick Start Guide - Format Research Export

## What You Have

✅ **49 improv formats** exported and ready for research
✅ **3 export formats**: JSON (for AI), Markdown (for humans), and AI prompt
✅ **Import script** to bring enriched data back

## Files You Need

1. **`formats-export-for-research.json`** - Main export file (87KB)
2. **`research-prompt.md`** - Instructions for AI research
3. **`import-enriched-data.js`** - Import script

## Quick Start Options

### Option 1: AI Research (Recommended)
```bash
# 1. Copy formats-export-for-research.json content
# 2. Open Claude/ChatGPT/other AI
# 3. Paste the research-prompt.md content
# 4. Upload or paste the JSON file
# 5. Ask: "Research format #1 (Harold) and enrich the data"
# 6. Save the enriched JSON back to the file
# 7. Run: node import-enriched-data.js formats-export-for-research.json
```

### Option 2: Manual Research
```bash
# 1. Open formats-research.md
# 2. Research each format using Google/YouTube
# 3. Edit formats-export-for-research.json with findings
# 4. Run: node import-enriched-data.js formats-export-for-research.json
```

### Option 3: External App
```bash
# 1. Import formats-export-for-research.json into your app
# 2. Research and enrich data there
# 3. Export enriched JSON back
# 4. Run: node import-enriched-data.js exported-file.json
```

## What to Research (Priority Order)

High Priority:
1. Harold (#1)
2. Armando (#2)
3. Монтаж (#3)
4. Deconstruction (#4)
5. Monoscene (#47)

## What to Add

For each format:
- ✅ Video links (YouTube performances)
- ✅ Creator/origin information
- ✅ Related resources (books, articles)
- ✅ Tips and common mistakes
- ✅ Prerequisites and similar formats

## Search Tips

YouTube: `"[format name] improv performance"`
Web: `site:improvencyclopedia.org "[format name]"`
Books: "Truth in Comedy" (Harold), "Impro" (Johnstone)

## Import When Ready

```bash
cd /Users/nsolovev/Documents/improv-tovarisch/data
node import-enriched-data.js formats-export-for-research.json
```

Script will:
- Validate data
- Create backup
- Import enriched data
- Show statistics

## Questions?

See `README.md` in this directory for full documentation.

---

**Ready?** Start with researching Harold - it's the most important format! 🎭
