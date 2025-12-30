# Guiding Idiots - Audio Transcription Guide

This guide explains how to transcribe and display the "Guiding Idiots" audio discussion.

## Quick Start

### Step 1: Transcribe the Audio

Run the transcription script (works independently, even if you hit token limits):

```bash
cd /Users/jeremypotts/guiding-idiots
bash transcribe_audio.sh
```

This will:
- Process the audio file: `/Users/jeremypotts/Desktop/Guiding Idiots.m4a`
- Use OpenAI Whisper (base model) for transcription
- Generate 3 output formats:
  - `transcripts/Guiding Idiots.txt` - Plain text
  - `transcripts/Guiding Idiots.json` - JSON with timestamps
  - `transcripts/Guiding Idiots.srt` - Subtitle format

**Time estimate:** 5-10 minutes for a 14MB file

### Step 2: Populate the UI

Once transcription is complete, update the HTML with the transcript content:

```bash
bash populate_transcript.sh
```

This will:
- Read the transcript text file
- Intelligently segment it into 6 sections
- Update the HTML UI with actual content
- Replace animated placeholders with real text

### Step 3: View the Result

Open the final UI in your browser:

```bash
open jsu-component-library/examples/standalone.html
```

Or navigate to: `/Users/jeremypotts/guiding-idiots/jsu-component-library/examples/standalone.html`

## UI Sections

The transcript is organized into:

1. **Introduction & Context** - Opening discussion and background
2. **Main Discussion Topics** - Primary subjects covered
3. **Technical Deep Dive** - Detailed technical analysis
4. **Solutions & Approaches** - Proposed solutions and methodologies
5. **Key Takeaways** - Important points and lessons
6. **Action Items & Next Steps** - Follow-up actions and plans

## Manual Transcription (Alternative)

If the scripts don't work, you can transcribe manually:

```bash
cd /Users/jeremypotts/Desktop
whisper "Guiding Idiots.m4a" \
    --model base \
    --output_format txt \
    --output_dir /Users/jeremypotts/guiding-idiots/transcripts
```

## File Locations

```
guiding-idiots/
├── transcribe_audio.sh           # Step 1: Run transcription
├── populate_transcript.sh         # Step 2: Populate UI
├── TRANSCRIPTION_GUIDE.md         # This file
├── transcripts/                   # Output directory
│   ├── Guiding Idiots.txt        # Generated transcript
│   ├── Guiding Idiots.json       # With timestamps
│   └── Guiding Idiots.srt        # Subtitle format
└── jsu-component-library/
    └── examples/
        └── standalone.html        # Final UI (view in browser)
```

## Troubleshooting

### Whisper not found

Install Whisper:
```bash
pip install openai-whisper
```

Or with conda:
```bash
conda install -c conda-forge openai-whisper
```

### Python not found

The populate script uses Python 3. Check your installation:
```bash
python3 --version
```

### Transcript files not generated

Check the transcripts directory:
```bash
ls -la /Users/jeremypotts/guiding-idiots/transcripts/
```

### Want to re-transcribe with better quality?

Use a larger model (slower but more accurate):

```bash
whisper "/Users/jeremypotts/Desktop/Guiding Idiots.m4a" \
    --model medium \
    --output_dir /Users/jeremypotts/guiding-idiots/transcripts
```

Available models (fastest → most accurate):
- `tiny` - Fastest, least accurate
- `base` - Good balance (default)
- `small` - Better accuracy
- `medium` - High accuracy
- `large` - Best accuracy, slowest

## Features

### UI Features
- ✅ JSU-themed design (Red #CC0000)
- ✅ Sticky navigation
- ✅ Table of contents with smooth scrolling
- ✅ 6 organized sections
- ✅ Responsive mobile design
- ✅ Clean, readable typography

### Transcription Features
- ✅ Multiple output formats (TXT, JSON, SRT)
- ✅ Automatic language detection
- ✅ Timestamp tracking
- ✅ Speaker diarization support (in JSON)

## Next Steps

After transcription and UI population:

1. **Review and Edit** - The transcript may need manual cleanup for accuracy
2. **Add Context** - Update section titles based on actual content
3. **Commit to Repo** - Save your work:
   ```bash
   cd /Users/jeremypotts/guiding-idiots
   git add .
   git commit -m "Add Guiding Idiots audio transcription and UI"
   git push
   ```

## Notes

- The transcription runs independently and won't stop if you reach token limits
- The UI has animated placeholders while waiting for content
- Both scripts are designed to be re-runnable
- All paths are absolute to avoid confusion

---

**Ready to start?**

```bash
bash /Users/jeremypotts/guiding-idiots/transcribe_audio.sh
```
