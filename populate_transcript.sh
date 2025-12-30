#!/bin/bash

# Populate the HTML UI with transcript content
# This script reads the transcript and updates the standalone.html file

echo "=================================================="
echo "Populating Transcript UI"
echo "=================================================="
echo ""

TRANSCRIPT_FILE="/Users/jeremypotts/guiding-idiots/transcripts/Guiding Idiots.txt"
HTML_FILE="/Users/jeremypotts/guiding-idiots/jsu-component-library/examples/standalone.html"
PYTHON_SCRIPT="/Users/jeremypotts/guiding-idiots/populate_transcript.py"

# Check if transcript exists
if [ ! -f "$TRANSCRIPT_FILE" ]; then
    echo "ERROR: Transcript file not found at: $TRANSCRIPT_FILE"
    echo "Run the transcription script first: bash /Users/jeremypotts/guiding-idiots/transcribe_audio.sh"
    exit 1
fi

# Check if HTML template exists
if [ ! -f "$HTML_FILE" ]; then
    echo "ERROR: HTML file not found at: $HTML_FILE"
    exit 1
fi

echo "Transcript file: $TRANSCRIPT_FILE"
echo "HTML file: $HTML_FILE"
echo ""

# Create Python script to intelligently segment and populate
cat > "$PYTHON_SCRIPT" << 'EOFPYTHON'
#!/usr/bin/env python3
import re
import html

# Read transcript
with open('/Users/jeremypotts/guiding-idiots/transcripts/Guiding Idiots.txt', 'r') as f:
    transcript = f.read()

# Simple segmentation (you can make this smarter based on actual content)
# Split into paragraphs
paragraphs = [p.strip() for p in transcript.split('\n\n') if p.strip()]

# Distribute paragraphs across 6 sections intelligently
total_paras = len(paragraphs)
section_size = max(1, total_paras // 6)

sections = {
    1: paragraphs[0:section_size],
    2: paragraphs[section_size:section_size*2],
    3: paragraphs[section_size*2:section_size*3],
    4: paragraphs[section_size*3:section_size*4],
    5: paragraphs[section_size*4:section_size*5],
    6: paragraphs[section_size*5:]
}

# Read HTML template
with open('/Users/jeremypotts/guiding-idiots/jsu-component-library/examples/standalone.html', 'r') as f:
    html_content = f.read()

# Function to escape HTML
def escape_html(text):
    return html.escape(text)

# Function to format paragraphs
def format_section(paras):
    formatted = []
    for i, para in enumerate(paras):
        # Check if it looks like a heading (short, no punctuation at end)
        if len(para) < 100 and not para.endswith('.'):
            formatted.append(f'<h4>{escape_html(para)}</h4>')
        else:
            formatted.append(f'<p>{escape_html(para)}</p>')
    return '\n'.join(formatted)

# Replace placeholders in each section
for section_num in range(1, 7):
    section_id = f'section-{section_num}'

    # Find the section content area
    pattern = rf'(<section id="{section_id}".*?<div class="section-content">)(.*?)(</div>\s*</section>)'

    if section_num in sections and sections[section_num]:
        new_content = format_section(sections[section_num])
    else:
        new_content = '<p><em>No content for this section</em></p>'

    # Replace the section content
    html_content = re.sub(
        pattern,
        rf'\1\n{new_content}\n\3',
        html_content,
        flags=re.DOTALL
    )

# Remove the "Transcription in Progress" box
html_content = re.sub(
    r'<div class="highlight-box">.*?</div>',
    '',
    html_content,
    flags=re.DOTALL
)

# Write updated HTML
with open('/Users/jeremypotts/guiding-idiots/jsu-component-library/examples/standalone.html', 'w') as f:
    f.write(html_content)

print("✓ HTML updated successfully!")
print(f"Total paragraphs processed: {total_paras}")
print(f"Distributed across 6 sections")
EOFPYTHON

# Run Python script
python3 "$PYTHON_SCRIPT"

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "✓ Transcript UI populated successfully!"
    echo "=================================================="
    echo ""
    echo "Open in browser: $HTML_FILE"
    echo ""

    # Clean up Python script
    rm "$PYTHON_SCRIPT"

    # Optionally open in browser
    read -p "Open in browser now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$HTML_FILE"
    fi
else
    echo ""
    echo "ERROR: Failed to populate HTML"
    exit 1
fi
