# Contributing to Premium Calculator

All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome.

## How to Contribute

### 🐛 Reporting Bugs

If you find a bug, please open an [issue](https://github.com/niteshyadav07-hub/Calculator/issues) with the following information:

- A clear and descriptive title
- Steps to reproduce the bug
- Expected behavior vs. actual behavior
- Browser and OS information
- Screenshots if applicable

### 💡 Suggesting Enhancements

Have an idea to make the calculator better? Open an [issue](https://github.com/niteshyadav07-hub/Calculator/issues) and describe:

- The enhancement you'd like to see
- Why it would be useful
- Any examples or references

### 🔧 Submitting Changes

1. **Fork** the repository
2. **Clone** your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/Calculator.git
   ```
3. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and test them locally by opening `index.html` in a browser
5. **Commit** your changes with a clear message
   ```bash
   git commit -m "Add: description of your change"
   ```
6. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against the `main` branch

## Development Setup

This project uses **vanilla HTML, CSS, and JavaScript** — no build tools or dependencies required.

1. Clone the repository
2. Open `index.html` in your browser
3. Edit the files and refresh to see changes

### Project Structure

```
calculator/
├── index.html          # Main HTML structure
├── style.css           # Glassmorphism styling & animations
├── script.js           # Calculator logic & interactions
├── LICENSE             # Apache 2.0 License
├── CODE_OF_CONDUCT.md  # Community guidelines
├── CONTRIBUTING.md     # Contribution guidelines
└── README.md           # Project documentation
```

## Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include unique, descriptive `id` attributes on interactive elements
- Keep the structure clean and well-indented

### CSS
- Follow the existing design system using CSS custom properties (`:root` variables)
- Maintain the glassmorphism aesthetic
- Ensure all animations are smooth (use `ease`, `cubic-bezier`)
- Keep the design responsive

### JavaScript
- Use descriptive variable and function names
- Add comments for complex logic
- Ensure keyboard accessibility
- Test all calculator operations after changes

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. We are committed to providing a welcoming and inclusive experience for everyone.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).

---

Thank you for contributing! 🎉
