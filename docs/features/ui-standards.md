# UI standards (Astro)

These rules apply to all Astro frontends (`apps/web`, `apps/admin`).

## Required
1. Tailwind CSS utility classes are the default for styling.
2. WebCoreUI is the component library for:
   - Buttons
   - Tables
   - Inputs
   - Modals
   - Toasts
   - Navigation
3. Custom CSS is avoided except for:
   - Fonts
   - CSS variables
   - Minimal overrides

## Usage
- If a WebCoreUI component exists, use it instead of custom markup.
- Favor utility classes for spacing, typography, and layout.
- Keep UI text-forward and minimal in decoration.
