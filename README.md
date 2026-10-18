# Greenhouse Sensor Logger

## Project Overview

The Greenhouse Sensor Logger is a web-based dashboard designed to record and monitor environmental conditions in a greenhouse. Users can enter sensor readings for a specific greenhouse bay and view the results in an organized dashboard.

The application evaluates each reading and assigns a status of **Optimal**, **Warning**, or **Critical Hazard** based on predefined environmental conditions. It also saves readings in the browser so that data remains available after refreshing or reopening the page.

## Features

- **Sensor Data Entry:** Record the greenhouse bay, pH level, electrical conductivity (EC), air temperature, and relative humidity.
- **Input Validation:** Check that required fields are completed and sensor values fall within their accepted ranges. Invalid inputs are highlighted, with messages explaining the errors.
- **Environmental Classification:** Automatically classify readings as Optimal, Warning, or Critical Hazard using the project's predefined rules.
- **Dashboard Display:** Show saved readings as individual cards, including sensor values, timestamps, and status labels.
- **Record Management:** Delete individual readings or clear all saved readings.
- **Persistent Storage:** Use browser `localStorage` to retain readings between sessions.

## Technologies Used

- **HTML5:** Provides the structure of the dashboard and data-entry form.
- **CSS3:** Handles the layout, visual styling, form feedback, and status indicators.
- **Vanilla JavaScript:** Implements input validation, status classification, event handling, dynamic card creation, and record management.
- **Web Storage API:** Stores sensor readings locally in the browser.

No external JavaScript libraries or CSS frameworks are required.

## Environmental Status Classification

Each reading is evaluated using the following rules:

- **Critical Hazard:** All four sensor categories must be outside their defined critical thresholds.
- **Optimal:** All four sensor values must fall within their respective optimal ranges.
- **Warning:** Any reading that does not meet either of the above conditions is classified as Warning.

## Input Validation

The application validates the following fields:

| Field | Accepted Range |
|---|---|
| pH | 0–14 |
| Electrical Conductivity (EC) | 0–5 mS/cm |
| Air Temperature | 32–120°F |
| Relative Humidity | 0–100% |
| Greenhouse Bay | Required |

Invalid entries prevent submission until the errors are corrected.

## Getting Started

1. Download or clone the project repository.
2. Ensure that `index.html`, `styles.css`, and `app.js` are in the same project folder.
3. Open `index.html` in a modern web browser.
4. Enter the sensor readings and submit the form to add a record to the dashboard.

No additional installation or build process is necessary.

## Project Structure

```text
greenhouse-sensor-logger/
├── index.html
├── styles.css
├── app.js
└── README.md
```

- `index.html` — Contains the dashboard layout and sensor input form.
- `styles.css` — Defines the appearance and responsive layout of the application.
- `app.js` — Handles validation, classification, dashboard updates, record deletion, and local storage.
- `README.md` — Documents the project and explains how to use it.

## Data Storage

The application saves sensor readings in the browser's local storage. Saved readings are loaded when the dashboard opens again in the same browser.

Because the data is stored locally, it is not automatically shared between browsers or devices. Clearing the browser's site data may also remove saved readings.

## Purpose

This project demonstrates the use of semantic HTML, CSS styling, JavaScript functions, event listeners, DOM manipulation, form validation, and browser storage to create an interactive web application without relying on external frameworks.
