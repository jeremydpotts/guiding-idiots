# Guiding Idiots

A repository documenting technical discussions, solutions, and lessons learned.

## Purpose

This repository serves as a historical record of technical problem-solving discussions and potential solutions that can guide future decision-making.

## Contents

### Current Documentation

- [**LEAPS_QUANT_TOOL_DISCUSSION.md**](LEAPS_QUANT_TOOL_DISCUSSION.md) - Comprehensive discussion recap organized by topics including:
  - Project status and achievements
  - Testing & CI/CD implementation strategies
  - Infrastructure & deployment approaches (PostgreSQL, Docker, config management)
  - Trading features (live data integration, position monitoring, paper trading)
  - User experience & polish (UI improvements, documentation, sample strategies)
  - Decision framework and recommended implementation paths

- [**LEAPS_QUANT_TOOL_SESSION_TRANSCRIPT.md**](LEAPS_QUANT_TOOL_SESSION_TRANSCRIPT.md) - Full ChatGPT session export documenting the build of a quant-level LEAPS options strategy tool including:
  - Complete requirements and architecture
  - Quant decision engine (HOLD/REDUCE/EXIT logic)
  - Full codebase with all modules (data providers, features, backtesting, ML, execution, monitoring)
  - Streamlit UI implementation
  - Walk-forward optimization and out-of-sample validation
  - Configuration examples and deployment notes

- [**jsu-component-library/**](jsu-component-library/) - Jacksonville State University themed UI component library:
  - Official JSU brand colors and design system (JSU Red #CC0000)
  - Reusable components: buttons, cards, forms, navigation, modals, tables, alerts
  - Interactive JavaScript components with validation
  - Responsive grid system and utilities
  - Complete documentation and live examples
  - Ready for integration into student portals, university websites, and applications

- [**Audio Transcription UI**](jsu-component-library/examples/standalone.html) - Interactive transcript viewer for "Guiding Idiots" discussion:
  - JSU-themed UI with smooth navigation
  - 6 organized sections: Introduction, Topics, Technical Deep Dive, Solutions, Takeaways, Action Items
  - Transcribed using OpenAI Whisper
  - See [TRANSCRIPTION_GUIDE.md](TRANSCRIPTION_GUIDE.md) for setup instructions

### Transcription Tools

- [**transcribe_audio.sh**](transcribe_audio.sh) - Standalone script to transcribe audio files using Whisper
- [**populate_transcript.sh**](populate_transcript.sh) - Script to populate UI with transcript content
- [**TRANSCRIPTION_GUIDE.md**](TRANSCRIPTION_GUIDE.md) - Complete guide for audio transcription workflow

### Planned Content

- Additional technical approaches and solutions
- Lessons learned documentation

## Repository Structure

```
guiding-idiots/
├── README.md                               # This file
├── TRANSCRIPTION_GUIDE.md                  # Audio transcription workflow guide
├── transcribe_audio.sh                     # Whisper transcription script
├── populate_transcript.sh                  # UI population script
├── LEAPS_QUANT_TOOL_DISCUSSION.md         # LEAPS quant tool discussion recap
├── LEAPS_QUANT_TOOL_SESSION_TRANSCRIPT.md # ChatGPT session export with full codebase
├── transcripts/                            # Audio transcription outputs
│   ├── Guiding Idiots.txt                 # Plain text transcript
│   ├── Guiding Idiots.json                # JSON with timestamps
│   └── Guiding Idiots.srt                 # Subtitle format
├── jsu-component-library/                 # JSU themed UI component library
│   ├── README.md                          # Component library documentation
│   ├── css/                               # Stylesheets (theme + components)
│   ├── js/                                # Interactive JavaScript
│   ├── examples/
│   │   └── standalone.html                # Audio transcript viewer UI
│   └── assets/                            # Images, logos, fonts
└── [Additional documentation as developed]
```

## Getting Started

Browse the documentation files to review technical discussions and recommended implementation approaches for various development scenarios.
