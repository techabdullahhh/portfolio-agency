# Portfolio Website

A beautiful, modern, and fully responsive portfolio website built with HTML, CSS, and JavaScript.

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth scrolling and animations
- 🎯 Interactive navigation with active section highlighting
- 💼 Projects showcase section
- 🛠️ Skills and technologies section
- 📧 Contact form
- 🌐 Social media links

## Sections

1. **Hero Section** - Eye-catching introduction with call-to-action buttons
2. **About** - Personal information and statistics
3. **Projects** - Portfolio of featured projects
4. **Skills** - Technical skills with animated progress bars
5. **Contact** - Contact information and form

## Getting Started

### Prerequisites

No dependencies required! Just a modern web browser.

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! No build process needed.

### Customization

To personalize the portfolio:

1. **Update Personal Information**:
   - Edit the name in `index.html` (search for "Your Name")
   - Update the subtitle and description in the hero section
   - Modify the about section text

2. **Add Your Projects**:
   - Update project cards in the projects section
   - Add real project images (replace placeholder divs)
   - Update project links (Live Demo and GitHub)

3. **Update Skills**:
   - Modify skill items and progress percentages
   - Add or remove skills as needed

4. **Contact Information**:
   - Update email, phone, and location in the contact section
   - Configure form submission (currently shows an alert)
   - Add your social media links

5. **Add Your Photo**:
   - Replace the placeholder SVG in the about section
   - Add an `<img>` tag with your photo

6. **Styling**:
   - Colors can be customized in `style.css` using CSS variables
   - Fonts are loaded from Google Fonts (Inter)

## File Structure

```
portfolio/
├── index.html      # Main HTML file
├── style.css       # Stylesheet with all styling
├── script.js       # JavaScript for interactivity
└── README.md       # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

### Animations
- Fade-in animations on scroll
- Skill bar progress animations
- Project card hover effects
- Smooth page transitions

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile devices
- Flexible grid layouts
- Optimized typography for all screen sizes

### Interactive Elements
- Active navigation highlighting
- Smooth scroll navigation
- Animated counters for statistics
- Form validation and submission

## Customization Guide

### Changing Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... other colors */
}
```

### Adding Projects

Add a new project card:

```html
<div class="project-card">
    <div class="project-image">
        <img src="path-to-image.jpg" alt="Project Name">
    </div>
    <div class="project-content">
        <h3 class="project-title">Project Name</h3>
        <p class="project-description">Project description...</p>
        <div class="project-tags">
            <span class="tag">Technology</span>
        </div>
        <div class="project-links">
            <a href="#" class="project-link">Live Demo</a>
            <a href="#" class="project-link">GitHub</a>
        </div>
    </div>
</div>
```

### Setting Up Contact Form

The contact form currently shows an alert. To make it functional:

1. Set up a backend service (e.g., Formspree, Netlify Forms, or your own server)
2. Update the form action in `index.html`
3. Modify the form submission handler in `script.js`

## License

This project is open source and available for personal and commercial use.

## Credits

- Font: [Inter](https://fonts.google.com/specimen/Inter) by Google Fonts
- Icons: SVG icons (no external dependencies)

---

**Enjoy your beautiful portfolio!** 🚀

