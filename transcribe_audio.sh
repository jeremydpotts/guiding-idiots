#!/bin/bash

# Guiding Idiots Audio Transcription Script
# This script runs independently to transcribe the audio file

echo "=================================================="
echo "Guiding Idiots - Audio Transcription"
echo "=================================================="
echo ""

# Configuration
AUDIO_FILE="/Users/jeremypotts/Desktop/Guiding Idiots.m4a"
OUTPUT_DIR="/Users/jeremypotts/guiding-idiots/transcripts"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if audio file exists
if [ ! -f "$AUDIO_FILE" ]; then
    echo "ERROR: Audio file not found at: $AUDIO_FILE"
    exit 1
fi

echo "Audio file: $AUDIO_FILE"
echo "File size: $(du -h "$AUDIO_FILE" | cut -f1)"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Check if whisper is installed
if ! command -v whisper &> /dev/null; then
    echo "ERROR: Whisper is not installed or not in PATH"
    echo "Install with: pip install openai-whisper"
    exit 1
fi

echo "Starting transcription..."
echo "Model: base (faster, good accuracy)"
echo "This may take several minutes for a 14MB file..."
echo ""

# Run whisper transcription
whisper "$AUDIO_FILE" \
    --model base \
    --output_format txt \
    --output_format json \
    --output_format srt \
    --output_dir "$OUTPUT_DIR" \
    --language en \
    --verbose True

# Check if transcription was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "✓ Transcription completed successfully!"
    echo "=================================================="
    echo ""
    echo "Output files:"
    ls -lh "$OUTPUT_DIR/Guiding Idiots."*
    echo ""
    echo "Text file: $OUTPUT_DIR/Guiding Idiots.txt"
    echo "JSON file: $OUTPUT_DIR/Guiding Idiots.json"
    echo "SRT file: $OUTPUT_DIR/Guiding Idiots.srt"
    echo ""

    # Show preview of transcript
    if [ -f "$OUTPUT_DIR/Guiding Idiots.txt" ]; then
        echo "Preview (first 20 lines):"
        echo "---"
        head -20 "$OUTPUT_DIR/Guiding Idiots.txt"
        echo "---"
        echo ""

        # Count words
        WORD_COUNT=$(wc -w < "$OUTPUT_DIR/Guiding Idiots.txt")
        echo "Total words: $WORD_COUNT"
        echo ""
    fi

    echo "Next step: Run the populate script to update the HTML with transcript content"
    echo "Command: bash /Users/jeremypotts/guiding-idiots/populate_transcript.sh"
else
    echo ""
    echo "=================================================="
    echo "✗ Transcription failed"
    echo "=================================================="
    echo ""
    echo "Check the error messages above for details"
    exit 1
fi
