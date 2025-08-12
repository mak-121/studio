# **App Name**: PagePilot

## Core Features:

- Input Handling: Accept HTML and CSS as input through a file upload or text input.
- PDF Conversion: Utilize wkhtmltopdf (or a similar library) to render the HTML and CSS input as a PDF.
- PDF Preview: Display a preview of the generated PDF directly in the browser, without saving, so user can make informed decisions about regenerating the file.
- PDF Download: Offer a download button to save the generated PDF to the user's local machine.
- AI Layout Tool: Integrate an AI-powered "layout fixer" tool to intelligently adjust the layout, fix overflow issues, or improve the appearance of the generated PDF. This is intended as a fallback, in case wkhtmltopdf doesn't render as intended.
- Status Display: Display upload progress and any status messages, so user always knows what's going on.

## Style Guidelines:

- Primary color: A muted teal (#70A4A2) to suggest professionalism, reliability, and modern technology without being generic.
- Background color: A very light, desaturated tint of the primary color (#F0F4F4).
- Accent color: A slightly brighter, complementary teal (#5F9EA0), used to highlight important interactive elements like buttons and links.
- Font pairing: 'Inter' (sans-serif) for headings and 'Literata' (serif) for body text. This provides a clean, modern look with enhanced readability for potentially long bodies of text from the HTML content.
- A clean, single-page layout focused on ease of use, and an immediately understandable conversion flow.
- Use a consistent set of line icons (e.g. from FontAwesome or similar library) for upload, download, and other key actions. Use icons that are appropriate in size and weight for use in a professional setting.
- Subtle animations to indicate loading and progress, improving the user experience by providing feedback.