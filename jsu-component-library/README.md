# Jacksonville State University Component Library

A comprehensive, reusable UI component library themed around Jacksonville State University's official branding and colors.

## Purpose

This component library is designed to be logged and categorized for future reference, providing ready-to-use JSU-themed UI components for web applications, marketing materials, student portals, and university projects.

## Official Branding

### Colors

**Primary:**
- JSU Red: `#CC0000` (RGB: 204, 0, 0)
- Pantone: PMS 2347 C

**Secondary:**
- White: `#FFFFFF`

**Extended Palette:**
- Red Dark: `#990000`
- Red Darker: `#660000`
- Red Light: `#E63939`
- Red Lighter: `#FF6666`
- Red Pale: `#FFE6E6`

### Mascot

**Gamecocks** - The vintage "Fightin' Gamecock" logo was brought back as part of the 2025 brand refresh.

## Library Structure

```
jsu-component-library/
├── README.md                    # This file
├── css/
│   ├── jsu-theme.css           # Core theme variables and utilities
│   └── jsu-components.css      # Component styles
├── js/
│   └── jsu-components.js       # Interactive JavaScript components
├── examples/
│   └── index.html              # Live demo of all components
└── assets/                     # Images, logos, fonts (to be added)
```

## Installation

### Basic Setup

1. Include the CSS files in your HTML `<head>`:

```html
<link rel="stylesheet" href="path/to/jsu-theme.css">
<link rel="stylesheet" href="path/to/jsu-components.css">
```

2. Include the JavaScript file before closing `</body>`:

```html
<script src="path/to/jsu-components.js"></script>
```

### Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My JSU Project</title>
  <link rel="stylesheet" href="css/jsu-theme.css">
  <link rel="stylesheet" href="css/jsu-components.css">
</head>
<body>
  <div class="jsu-container">
    <h1>Go Gamecocks!</h1>
    <button class="jsu-btn jsu-btn-primary">Get Started</button>
  </div>

  <script src="js/jsu-components.js"></script>
</body>
</html>
```

## Available Components

### 1. Buttons

Multiple button styles and sizes themed to JSU branding.

```html
<!-- Primary Button -->
<button class="jsu-btn jsu-btn-primary">Primary</button>

<!-- Secondary Button -->
<button class="jsu-btn jsu-btn-secondary">Secondary</button>

<!-- Outline Button -->
<button class="jsu-btn jsu-btn-outline">Outline</button>

<!-- Ghost Button -->
<button class="jsu-btn jsu-btn-ghost">Ghost</button>

<!-- Sizes -->
<button class="jsu-btn jsu-btn-primary jsu-btn-sm">Small</button>
<button class="jsu-btn jsu-btn-primary">Medium</button>
<button class="jsu-btn jsu-btn-primary jsu-btn-lg">Large</button>
```

### 2. Cards

Flexible card components for content organization.

```html
<!-- Standard Card -->
<div class="jsu-card">
  <div class="jsu-card-header">
    <h3 class="jsu-card-title">Card Title</h3>
  </div>
  <div class="jsu-card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="jsu-card-footer">
    <button class="jsu-btn jsu-btn-primary jsu-btn-sm">Action</button>
  </div>
</div>

<!-- JSU Red Branded Card -->
<div class="jsu-card jsu-card-red">
  <div class="jsu-card-header">
    <h3 class="jsu-card-title">JSU Card</h3>
  </div>
  <div class="jsu-card-body">
    <p>Branded with JSU red.</p>
  </div>
</div>
```

### 3. Badges

Small status indicators and labels.

```html
<span class="jsu-badge jsu-badge-red">New</span>
<span class="jsu-badge jsu-badge-white">Featured</span>
<span class="jsu-badge jsu-badge-gray">Draft</span>
```

### 4. Alerts

Contextual feedback messages.

```html
<div class="jsu-alert jsu-alert-success">Success message</div>
<div class="jsu-alert jsu-alert-warning">Warning message</div>
<div class="jsu-alert jsu-alert-error">Error message</div>
<div class="jsu-alert jsu-alert-info">Info message</div>
```

**Dynamic Alerts (JavaScript):**

```javascript
JSU.Alert.success('Operation successful!', 3000);
JSU.Alert.error('Something went wrong!', 5000);
JSU.Alert.warning('Please verify this information');
JSU.Alert.info('Registration opens soon');
```

### 5. Forms

Complete form components with validation.

```html
<form id="myForm">
  <div class="jsu-form-group">
    <label class="jsu-form-label" for="name">Name</label>
    <input type="text" id="name" class="jsu-form-input" required>
    <span class="jsu-form-help">Your full name</span>
  </div>

  <div class="jsu-form-group">
    <label class="jsu-form-label" for="email">Email</label>
    <input type="email" id="email" class="jsu-form-input" required>
  </div>

  <div class="jsu-form-group">
    <label class="jsu-form-label" for="program">Program</label>
    <select id="program" class="jsu-form-select">
      <option>Select...</option>
      <option>Undergraduate</option>
      <option>Graduate</option>
    </select>
  </div>

  <button type="submit" class="jsu-btn jsu-btn-primary">Submit</button>
</form>
```

**Form Validation (JavaScript):**

```javascript
document.getElementById('myForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (JSU.Form.validate(this)) {
    // Form is valid
    console.log('Valid!');
  }
});
```

### 6. Navigation

Branded navigation bar.

```html
<nav class="jsu-nav">
  <div class="jsu-container" style="display: flex; width: 100%;">
    <a href="#" class="jsu-nav-brand">JSU</a>
    <ul class="jsu-nav-links">
      <li><a href="#" class="jsu-nav-link active">Home</a></li>
      <li><a href="#" class="jsu-nav-link">About</a></li>
      <li><a href="#" class="jsu-nav-link">Contact</a></li>
    </ul>
  </div>
</nav>
```

### 7. Hero Section

Eye-catching hero banner with JSU branding.

```html
<section class="jsu-hero">
  <div class="jsu-container">
    <h1 class="jsu-hero-title">Go Gamecocks!</h1>
    <p class="jsu-hero-subtitle">Welcome to JSU</p>
    <div class="jsu-hero-actions">
      <button class="jsu-btn jsu-btn-primary jsu-btn-lg">Get Started</button>
      <button class="jsu-btn jsu-btn-secondary jsu-btn-lg">Learn More</button>
    </div>
  </div>
</section>
```

### 8. Tables

Styled data tables.

```html
<table class="jsu-table jsu-table-striped">
  <thead>
    <tr>
      <th>Name</th>
      <th>Major</th>
      <th>GPA</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Smith</td>
      <td>Computer Science</td>
      <td>3.8</td>
    </tr>
  </tbody>
</table>
```

### 9. Modal

Accessible modal dialogs.

```html
<!-- Modal Trigger -->
<button onclick="JSU.Modal.open('myModal')">Open Modal</button>

<!-- Modal Structure -->
<div id="myModal" class="jsu-modal">
  <div class="jsu-modal-content">
    <div class="jsu-modal-header">
      <h3 class="jsu-modal-title">Modal Title</h3>
      <button class="jsu-modal-close">&times;</button>
    </div>
    <div class="jsu-modal-body">
      <p>Modal content here.</p>
    </div>
    <div class="jsu-modal-footer">
      <button class="jsu-btn jsu-btn-outline" onclick="JSU.Modal.close('myModal')">Cancel</button>
      <button class="jsu-btn jsu-btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### 10. Grid System

Responsive grid layouts.

```html
<!-- 2 Column Grid -->
<div class="jsu-grid jsu-grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 3 Column Grid -->
<div class="jsu-grid jsu-grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- 4 Column Grid -->
<div class="jsu-grid jsu-grid-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
</div>
```

### 11. Loading Spinners

Animated loading indicators.

```html
<div class="jsu-spinner jsu-spinner-sm"></div>  <!-- Small -->
<div class="jsu-spinner"></div>                 <!-- Medium -->
<div class="jsu-spinner jsu-spinner-lg"></div>  <!-- Large -->
```

### 12. Footer

Branded footer component.

```html
<footer class="jsu-footer">
  <div class="jsu-container">
    <div class="jsu-footer-content">
      <div class="jsu-footer-section">
        <h4>About JSU</h4>
        <p>Content here...</p>
      </div>
    </div>
    <div class="jsu-footer-bottom">
      &copy; 2025 Jacksonville State University
    </div>
  </div>
</footer>
```

## Utility Classes

### Spacing

```html
<!-- Margin Bottom -->
<div class="jsu-mb-xs">Extra Small</div>
<div class="jsu-mb-sm">Small</div>
<div class="jsu-mb-md">Medium</div>
<div class="jsu-mb-lg">Large</div>
<div class="jsu-mb-xl">Extra Large</div>

<!-- Margin Top -->
<div class="jsu-mt-xs">Extra Small</div>
<!-- ... same pattern -->

<!-- Padding -->
<div class="jsu-p-xs">Extra Small</div>
<div class="jsu-p-sm">Small</div>
<!-- ... etc -->
```

### Colors

```html
<!-- Text Colors -->
<span class="jsu-text-red">Red Text</span>
<span class="jsu-text-white">White Text</span>
<span class="jsu-text-gray">Gray Text</span>

<!-- Background Colors -->
<div class="jsu-bg-red">Red Background</div>
<div class="jsu-bg-white">White Background</div>
<div class="jsu-bg-gray">Gray Background</div>
<div class="jsu-bg-dark">Dark Background</div>
```

### Text Alignment

```html
<div class="jsu-text-center">Centered</div>
<div class="jsu-text-left">Left Aligned</div>
<div class="jsu-text-right">Right Aligned</div>
```

## CSS Variables

All theme values are defined as CSS custom properties for easy customization:

```css
:root {
  /* Official Colors */
  --jsu-red: #CC0000;
  --jsu-white: #FFFFFF;

  /* Extended Palette */
  --jsu-red-dark: #990000;
  --jsu-red-light: #E63939;

  /* Typography */
  --jsu-font-family-primary: 'Helvetica Neue', Arial, sans-serif;
  --jsu-font-size-base: 1rem;

  /* Spacing */
  --jsu-spacing-sm: 0.5rem;
  --jsu-spacing-md: 1rem;

  /* And many more... */
}
```

## JavaScript API

### Modal

```javascript
JSU.Modal.open('modalId');   // Open modal
JSU.Modal.close('modalId');  // Close modal
```

### Alert

```javascript
JSU.Alert.success(message, duration);
JSU.Alert.error(message, duration);
JSU.Alert.warning(message, duration);
JSU.Alert.info(message, duration);
```

### Form

```javascript
JSU.Form.validate(formElement);  // Returns true/false
JSU.Form.reset(formElement);     // Clears form
```

### Smooth Scroll

```javascript
JSU.smoothScroll('#target', duration);
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Demo

Open `examples/index.html` in your browser to see all components in action.

## Future Enhancements

- [ ] Add official JSU logo assets
- [ ] Include official university fonts
- [ ] Add more complex components (accordions, tabs, carousels)
- [ ] Create React/Vue component versions
- [ ] Add dark mode support
- [ ] Include accessibility improvements (ARIA labels, keyboard navigation)

## Resources

- [JSU Official Website](https://www.jsu.edu)
- [JSU Brand Guide](https://www.jsu.edu/designlicensing/brandguide/)
- [JSU Athletics Branding](https://jaxstatesports.com)

## Notes

This component library is designed for **reference and reuse**. It can be integrated into:

- Student portals and dashboards
- University marketing websites
- Event registration systems
- Academic tools and applications
- Alumni platforms
- Athletics websites

All components follow modern web standards and are fully responsive.

---

**Go Gamecocks!** 🐓
