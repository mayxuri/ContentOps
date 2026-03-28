# ContentOps Signal — Chrome Extension

## Load in Chrome (Developer Mode)

1. Open Chrome → go to `chrome://extensions`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked**
4. Select this `extension/` folder
5. Pin the extension from the toolbar

## Usage

### Quick Brief (Popup)
- Click the extension icon in the toolbar
- Fill in topic + details → **Generate Brief**
- This hits your local ContentOps backend and starts the pipeline

### Capture from any webpage
- Select any text on any webpage (minimum 20 characters)
- A **"📋 Capture to ContentOps"** tooltip appears near your cursor
- Click it → text is saved and the extension badge shows `!`
- Open the popup → the captured text is prefilled in Key Details

### Right-click capture
- Select text → right-click → **"📋 Capture to ContentOps"**
- Same as above, opens popup with prefilled text

### Signals tab
- Shows the top trending topics in your niche
- Click any signal → switches to Quick Brief with topic prefilled

### Recent tab
- Shows your last 5 pipeline runs from the ContentOps backend
- Requires ContentOps server running at `localhost:3001`

## Requirements
- ContentOps backend running: `cd server && npm run dev`
- ContentOps frontend (optional): `npm run dev` (for **Open ContentOps ↗** button)

## Status Indicator (top-right dot)
- 🟡 Yellow pulsing = connecting
- 🟢 Green = connected to backend
- 🔴 Red = backend offline
