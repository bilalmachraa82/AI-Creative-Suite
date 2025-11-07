# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Product Photoshoot Studio is a React-based web application that uses Google's Gemini AI models to generate professional product photography from user-uploaded images. The app supports multiple AI-powered features including product photoshoots, batch processing, image editing, text-to-image generation, video generation, and marketing content creation.

## Development Commands

**Setup:**
```bash
npm install
```

**Environment Configuration:**
Create a `.env.local` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Development Server:**
```bash
npm run dev  # Runs on http://localhost:3000
```

**Build:**
```bash
npm run build      # Production build
npm run preview    # Preview production build
```

## Architecture

### Application Structure

The app follows a standard React architecture with clear separation of concerns:

- **App.tsx** (330 lines): Main application entry point containing:
  - Tab-based navigation for 6 features: Photoshoot, Batch Processing, Edit, Generate Image, Generate Video, Generate Content
  - State management for images, loading states, and UI (toast notifications, welcome modal)
  - Integration with AI Studio's `window.aistudio` API for API key selection (Veo video generation)
  - Portuguese (PT-PT) UI language

- **components/**: Presentational React components
  - `BatchProcessor.tsx`: Handles concurrent processing of multiple images (4 concurrent limit)
  - `ImageUploader.tsx`: Drag-and-drop file upload interface
  - `GeneratedImagesGrid.tsx`: Display grid for generated images
  - `VideoResult.tsx`, `TextResult.tsx`: Result displays for different content types
  - `Header.tsx`, `Tabs.tsx`, `Loader.tsx`, `WelcomeModal.tsx`: UI components

- **services/geminiService.ts**: Centralized API integration with Google GenAI
  - Uses multiple Gemini models for different tasks
  - All API calls accept base64-encoded images with mimeType
  - Video generation includes polling logic (5-second intervals) until operation completes

- **utils/**: Helper utilities
  - `fileUtils.ts`: Converts File objects to base64 strings (strips data URI prefix)
  - `zipUtils.ts`: Creates downloadable ZIP files for batch processing results

### Gemini API Integration

The app integrates with multiple Google GenAI models:

1. **gemini-2.5-flash-image**: Product photoshoot generation and image editing (returns images via `responseModalities: [Modality.IMAGE]`)
2. **imagen-4.0-generate-001**: Text-to-image generation
3. **veo-3.1-fast-generate-preview**: Video generation from images (async operation with polling)
4. **gemini-2.5-pro**: Marketing content generation (text output)

**Key Implementation Details:**
- API key accessed via `process.env.API_KEY` (injected by Vite config from `GEMINI_API_KEY`)
- All image inputs are base64-encoded without the data URI prefix
- Video generation returns a download URI that requires the API key as a query parameter
- Product photoshoot generates 5 predefined variants: studio white background, lifestyle, male model, female model, closeup texture

### State Management

The app uses React hooks for state management (no external state library):
- `useState` for component-local state
- `useCallback` for memoized callbacks
- `useMemo` for computed values (BatchProcessor uses this for progress calculations)
- `useEffect` for side effects (toast auto-dismiss, API key checking, welcome modal)

### Concurrent Processing

BatchProcessor implements a worker pool pattern:
- `CONCURRENT_LIMIT = 4`: Processes 4 images simultaneously
- Uses Promise.all with worker functions that consume from a shared queue
- Each file tracks its status: 'queued' | 'processing' | 'completed' | 'error'

## Important Patterns

### Image Data Flow
1. User uploads File → converted to base64 (utils/fileUtils)
2. base64 + mimeType passed to geminiService functions
3. API returns base64 image data
4. Displayed as data URIs: `data:${mimeType};base64,${base64Data}`

### Error Handling
- All API calls wrapped in try-catch blocks
- Errors displayed via toast notifications (4-second auto-dismiss)
- Specific error message for missing Veo API key
- BatchProcessor continues processing remaining files on individual failures

### Video Generation Flow
Video generation is async and requires polling:
1. Initial API call returns an operation object
2. Poll every 5 seconds using `ai.operations.getVideosOperation()`
3. When `operation.done === true`, download video from returned URI
4. Convert blob to object URL for display

### TypeScript Configuration
- Path alias `@/*` maps to root directory (configured in tsconfig.json and vite.config.ts)
- `experimentalDecorators: true` and `useDefineForClassFields: false` for decorator support
- React 19 with new JSX transform (`jsx: "react-jsx"`)

## Environment Variables

The Vite config (vite.config.ts:14-15) exposes the Gemini API key as both:
- `process.env.API_KEY`
- `process.env.GEMINI_API_KEY`

This is set from the `GEMINI_API_KEY` environment variable loaded from `.env.local`.

## AI Studio Integration

The app includes special integration with AI Studio (Google's hosted environment):
- `window.aistudio.hasSelectedApiKey()`: Check if Veo API key is selected
- `window.aistudio.openSelectKey()`: Prompt user to select API key
- This is specifically for video generation which requires explicit key selection

## Testing and Debugging

The app includes console.error logging for:
- API errors with full error objects
- File conversion errors
- Veo key checking errors

When debugging Gemini API issues:
1. Check the API key is set in .env.local
2. Verify the base64 encoding is correct (should not include data URI prefix)
3. Check browser console for detailed error messages
4. For video generation, ensure operation polling completes (watch for 5-second intervals)
