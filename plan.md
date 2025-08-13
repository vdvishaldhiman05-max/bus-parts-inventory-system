```markdown
# Detailed Implementation Plan

This plan details the creation of a mobile web application for bus parts inventory management with CSV upload, QR code generation, and QR scanning functionality using free open-source libraries. The app will use Next.js with TypeScript, modern responsive UI, and localStorage for data persistence.

---

## 1. Dependency Installation and Package Updates

- **Modify package.json:**
  - Add the following dependencies:
    - "papaparse" (for CSV parsing)
    - "qrcode" (for QR code generation)
    - "qr-scanner" (for QR code scanning via camera)
  - Ensure your scripts (e.g., `"dev"`, `"build"`) are in place.
- **Run:**  
  ```bash
  npm install papaparse qrcode qr-scanner
  ```

---

## 2. Project Structure & File Overview

- **Pages:**
  - `src/app/page.tsx`: Landing page with navigation links.
  - `src/app/upload/page.tsx`: CSV file upload page.
  - `src/app/generate/page.tsx`: Inventory display and QR code generation page.
  - `src/app/scan/page.tsx`: Mobile QR scanning page.
- **Components:** (Create new files in `src/components`)
  - `CSVUpload.tsx`: Component for CSV file selection, parsing with PapaParse, error handling, and storing data in localStorage.
  - `QRCodeGenerator.tsx`: Component that accepts a unique part ID, generates a QR code using the qrcode library, displays it in an `<img>` tag, and provides a “Download” button.
  - `QRScanner.tsx`: Component that uses getUserMedia and the qr-scanner library to access the camera, scans QR codes, includes flash toggle functionality (with capability check), and handles permission errors.
  - `InventoryTable.tsx`: Component to render a modern styled table of inventory records (loaded from localStorage) with a “Generate QR” button for each row.
- **Public Assets:**
  - `public/sample.csv`: A sample CSV file with header and sample rows (e.g., `id,manufacturer,manufacturing_date,condition,transaction_date`).

- **Global Styles:**
  - `src/app/globals.css`: Update with modern typography, spacing, and mobile-responsive styles.

---

## 3. File-by-File Implementation Steps

### a. package.json
- **Changes:**
  - Add new dependency entries for `"papaparse"`, `"qrcode"`, and `"qr-scanner"`.
- **Error Handling:**
  - Ensure version compatibility; review install logs for warnings.

### b. public/sample.csv
- **Content Example:**
  ```csv
  id,manufacturer,manufacturing_date,condition,transaction_date
  BP001,Acme Corp,2020-01-01,brand new,2020-02-15
  BP002,Acme Corp,2019-12-15,used,2021-03-20
  BP003,BestParts,2021-05-10,repaired,2022-01-10
  ```

### c. src/app/page.tsx (Landing Page)
- **Implement:**
  - Create a simple modern landing page with navigation links to "Upload CSV", "Generate QR", and "Scan QR".
  - Use clean typography and spacing.
- **UI Considerations:**
  - Use `<a>` or Next.js `<Link>` for routing.
  - Example: A main `<div>` with three large, clickable boxes styled with CSS.

### d. src/app/upload/page.tsx (CSV Upload Page)
- **Implement:**
  - Import and render the `CSVUpload` component.
- **UI Considerations:**
  - Use clear instructions, a prominent file input button, and a feedback message area.
- **Error Handling:**
  - Display an error message if CSV parsing fails.

### e. src/components/CSVUpload.tsx
- **Implementation Details:**
  - Render an `<input type="file" accept=".csv">`.
  - Use FileReader to read the file and process it with PapaParse.
  - Validate CSV format and structure.
  - Upon successful parsing, save the JSON stringified data to localStorage (e.g., key: `"inventoryData"`).
  - Include try-catch blocks and display user-friendly error messages.
- **Best Practices:**
  - Clean up FileReader event listeners after use.

### f. src/app/generate/page.tsx (QR Code Generation / Inventory List)
- **Implement:**
  - Import and render `InventoryTable` to list all parsed inventory items.
  - Allow each row to have a "Generate QR" button.
- **UI Considerations:**
  - Use a responsive table design with clear borders, spacing, and text alignment.

### g. src/components/InventoryTable.tsx
- **Implementation Details:**
  - Read inventory data from localStorage and map it into table rows.
  - For each record, display details (ID, manufacturer, dates, condition).
  - When "Generate QR" button is clicked, render the `QRCodeGenerator` component inline for that record.
- **Error Handling:**
  - Check for empty or missing localStorage data and prompt the user to upload a CSV.

### h. src/components/QRCodeGenerator.tsx
- **Implementation Details:**
  - Accept a prop (the unique ID string).
  - Use the `qrcode` library’s `toDataURL` method to generate the QR code image.
  - Render an `<img>` with the generated data URI.
  - Provide a “Download QR Code” button using an `<a>` tag with the `download` attribute.
- **Error Handling:**
  - Use try-catch around QR generation; if an error occurs, display a fallback message.

### i. src/app/scan/page.tsx (QR Scanning Page)
- **Implement:**
  - Import and render the `QRScanner` component.
  - After a QR code is detected, retrieve the unique ID from the scan result.
  - Query localStorage for corresponding inventory data.
  - Display the part details in a well-styled card, using clear typography and spacing.
  - Provide a “Rescan” button to restart the scanning process.
- **UI Considerations:**
  - Create a simple mobile-friendly layout with large buttons and readable text.

### j. src/components/QRScanner.tsx
- **Implementation Details:**
  - Integrate the `qr-scanner` library to process the video stream.
  - Initiate camera access using getUserMedia and render a `<video>` element.
  - Implement a flash toggle: use the MediaStreamTrack API to check for `torch` capability; if available, display a toggle button.
- **Error Handling:**
  - Handle camera permission denial gracefully, with a user-friendly message.
  - Check and disable the flash toggle if not supported.
  - Clean up video stream on component unmount.

### k. src/app/globals.css
- **Update:**
  - Add global typography rules, color schemes, and spacing that give a modern, minimalist look.
  - Ensure mobile responsiveness and proper layout across devices.
  - Define utility classes for margins, paddings, and button styling.

### l. README.md
- **Updates:**
  - Provide clear instructions on how to run the app (install dependencies, run `npm run dev`).
  - Include directions to test with the provided `sample.csv`.
  - Document the user flows: CSV upload → QR generation → QR scanning.
  - Include deployment and GitHub hosting instructions.

---

## 4. Testing and Error Handling

- **CSV Upload Testing:**
  - Use the `public/sample.csv` to verify parsing and localStorage update.
- **QR Code Generation Testing:**
  - Verify that each unique string generates a correct QR code.
  - Test the Download button to ensure the image downloads as expected.
- **QR Scanning Testing:**
  - Test on mobile or using browser emulation to confirm camera access.
  - Validate that scanning returns the correct unique ID and displays part details.
  - Use curl if needed to simulate backend API calls for file download, though most interactions are client-side.
- **General:**
  - Implement try-catch blocks and display error messages on failures (e.g., CSV format errors, camera permission issues).

---

## 5. GitHub Hosting

- **Repository Setup:**
  - Initialize a Git repository.
  - Commit all changes and push to GitHub.
- **Documentation:**
  - Update README.md with detailed setup and testing instructions.
- **Deployment:**
  - Optionally deploy the app via Vercel or GitHub Pages for testing.
  
---

## Summary

- The plan creates a mobile web application using Next.js and TypeScript, integrating Papaparse for CSV parsing, qrcode for QR generation, and qr-scanner for camera-based QR scanning.  
- CSV data is uploaded via a dedicated page and stored in localStorage, then displayed in a table with QR code generation enabled per part.  
- The QR scanning page accesses the camera with proper permission and flash toggle, reading QR codes to display inventory details.  
- Modern, minimalist, mobile-responsive UI elements are implemented using custom CSS in globals.css with clear controls and error handling.  
- All dependent files and components are detailed, and instructions for testing and GitHub hosting are provided.
