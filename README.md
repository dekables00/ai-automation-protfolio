# AI Automation Portfolio

Static portfolio website for an AI Automation Virtual Assistant, Workflow & Integration Specialist.

## Structure

```text
AI Automation Portfolio/
+-- index.html
+-- README.md
+-- scripts/
|   +-- dev-server.js
+-- assets/
    +-- css/
    |   +-- styles.css
    +-- images/
    |   +-- agent-dex-logo.svg
    |   +-- automation-command-center.png
    |   +-- dex-profile-mug.png
    |   +-- dex-profile-transparent.png
    +-- js/
        +-- main.js
```

- `index.html` contains the page content and semantic sections.
- `assets/css/styles.css` contains design tokens, shared layout styles, section styles, and responsive rules.
- `assets/js/main.js` contains the mobile navigation behavior.
- `assets/images/automation-command-center.png` is the generated hero background.
- `assets/images/agent-dex-logo.svg` is the original Agent Dex logo mark.
- `assets/images/dex-profile-mug.png` is the edited profile portrait.
- `assets/images/dex-profile-transparent.png` is the transparent-background hero portrait.
- `scripts/dev-server.js` runs a lightweight local preview server.

## Preview

```bash
node scripts/dev-server.js
```

Then open `http://127.0.0.1:4173` in your browser.

## Customize

Update the contact links in `index.html`:

- Replace `hello@example.com` with your email address.
- Replace `https://calendly.com/` with your booking link.
