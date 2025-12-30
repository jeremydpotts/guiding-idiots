# Guiding Idiots

A repository documenting technical discussions, solutions, and lessons learned.

## Purpose

This repository serves as a historical record of technical problem-solving discussions and potential solutions that can guide future decision-making.

## Contents

### Current Documentation

- [**jsu-component-library/**](jsu-component-library/) - Jacksonville State University themed UI component library:
  - Official JSU brand colors and design system (JSU Red #CC0000)
  - Reusable components: buttons, cards, forms, navigation, modals, tables, alerts
  - Interactive JavaScript components with validation
  - Responsive grid system and utilities
  - Complete documentation and live examples
  - Ready for integration into student portals, university websites, and applications

- [**Audio Transcription UI**](jsu-component-library/examples/standalone.html) - Interactive transcript viewer for "Guiding Idiots" discussion:
  - JSU-themed UI with smooth navigation
  - Full transcript of JSU Black Alumni Network discussion
  - Topics: Alumni engagement, scholarship fundraising, organizational structure, event planning
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
├── transcripts/                            # Audio transcription outputs
│   ├── Guiding Idiots.txt                 # Plain text transcript
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

To view the audio transcript, open [jsu-component-library/examples/standalone.html](jsu-component-library/examples/standalone.html) in your browser.
