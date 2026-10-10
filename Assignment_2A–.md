# Assignment 2A
## Architecture, User Journey & Semantic Component Decomposition

**System 2: Greenhouse Sensor Logger UI**

---

## 4.1 The Less-than-equal-4-Click User Journey Funnel

### Starting State

When the application loads, the dashboard displays the greenhouse sensor log interface with a header, an empty telemetry dashboard on the left, and the sensor input form on the right. The dashboard displays a message indicating that no sensor readings have been recorded yet, while previously saved readings are loaded from `localStorage` if they exist.

### Action 1: Data Entry & Real-Time Constraint Check

The greenhouse technician enters the bay information and sensor readings into the form fields for pH, Electrical Conductivity (EC), temperature, and relative humidity. Each numeric input uses HTML constraints such as `min`, `max`, `step`, and `required`, while JavaScript input event listeners provide immediate visual feedback when a value exceeds the acceptable range.

### Action 2: Log Submission

The user clicks the **Record Reading** button to submit the completed form. A JavaScript `submit` event listener validates the data, determines the environmental status using the required classification rules, creates a new telemetry record, adds it to the in-memory collection, saves the updated collection to `localStorage`, and creates a new telemetry card in the dashboard.

### Action 3: Output Telemetry Inspection

After submission, the empty dashboard state is replaced or updated with a collection of telemetry cards. Each card displays the recorded bay, sensor values, timestamp, and calculated environmental status such as **Optimal**, **Warning**, or **Critical Hazard**.

### Action 4: Output Resolution

The user can interact with individual telemetry cards to remove resolved records. A **Clear All Logs** control allows the operations supervisor to purge the entire active log history. When a record is removed, JavaScript updates both the visible dashboard and the persistent `localStorage` data.

### Terminal State

After the user finishes interacting with the application, the dashboard contains the currently active telemetry records as individual cards. The records remain available after refreshing the browser because the active collection is persisted using `localStorage`. If all records are removed, the dashboard returns to its empty-state message.

---

# 4.2 Don Norman Usability & Constraint Audit

| Norman Principle / Concept | System Context | Concrete Implementation Mechanism |
|---|---|---|
| **Gulf of Execution** | Typing numeric sensor metrics including pH, EC, temperature, and humidity. | Each form field has a visible `<label>` describing the measurement and its unit. For example, the pH field identifies pH as unitless, EC displays `mS/cm`, temperature displays `°F`, and humidity displays `%`. Placeholder text can provide an example of the expected value. The inputs also use `type="number"` with `min`, `max`, and `step` attributes to communicate the expected numeric format directly through the browser interface. |
| **Gulf of Evaluation** | Ingesting sensor values after clicking **Record Reading**. | JavaScript immediately calculates the environmental classification after submission. The generated telemetry card displays a status label of **Optimal**, **Warning**, or **Critical Hazard**, allowing the user to immediately understand the result of the submitted readings. |
| **System Constraint** | Water pH boundaries of `0.0 <= pH <= 14.0` and physical bounds for the other sensor measurements. | Native HTML constraints are placed directly on each numeric input using `min`, `max`, `step`, and `required`. JavaScript also validates the values before adding them to the application's data collection so invalid values cannot enter the application state. |
| **Visual Feedback State** | Real-time input errors when a sensor value is outside its acceptable range. | `input` event listeners monitor the numeric fields while the user types. When a value violates the permitted range, JavaScript adds an error class or updates an associated feedback element. The affected field can visually indicate the invalid state and display a short error message before submission. |
| **Error Recovery** | Accidental or test data submissions. | Each dynamically generated telemetry card contains a delete control that allows an individual record to be removed. A **Clear All Logs** control allows the user to purge the entire queue. JavaScript updates the in-memory collection, the DOM, and `localStorage` after either operation. |

### Input Constraint Design

The application uses the physical-reality constraints provided in the assignment before calculating environmental status.

| Input | Unit | Constraint |
|---|---|---|
| pH | Unitless | `0.0 – 14.0` |
| Electrical Conductivity (EC) | mS/cm | `0.0 – 5.0` |
| Air Temperature | °F | `32 – 120` |
| Relative Humidity | % | `0 – 100` |

These constraints prevent clearly invalid physical values from entering the application's state. The assignment specifically requires pH to remain between `0.0` and `14.0`; the other fields are constrained to practical ranges so that negative or impossible values are rejected before being stored.

### Environmental Classification

After valid values are submitted, JavaScript evaluates the sensor readings according to the classification rules specified in the assignment.

**Critical Hazard**

```text
(pH < 5.0 OR pH > 7.5)
AND
(Temp < 55°F OR Temp > 95°F)
AND
(EC < 0.2 OR EC > 4.5)
AND
(RH < 30 OR RH > 90)
```

**Optimal**

```text
(5.5 <= pH <= 6.5)
AND
(64.4°F <= Temp <= 71.6°F)
AND
(1.0 <= EC <= 2.0)
AND
(50 <= RH <= 70)
```

**Warning**

```text
NOT Critical AND NOT Optimal
```

The classification is calculated immediately when a valid reading is submitted and is stored as part of the telemetry record displayed in the dashboard.

---

# 4.3 Component, DOM Tree & Event Target Architecture

The following tree represents the semantic HTML architecture of the greenhouse sensor logger. `[STATIC]` means the element exists in the initial HTML document. `[DYNAMIC]` means JavaScript creates or modifies the element based on application state.

## DOM Component Tree

- `<body>` [STATIC]
  - `<header class="site-header">` [STATIC]
    - `<section class="brand">` [STATIC]
      - `<img class="site-logo">` [STATIC]
      - `<section class="brand-text">` [STATIC]
        - `<h1>` [STATIC]
          - Text: `Greenhouse Sensor Logger`
        - `<p>` [STATIC]
          - Text: `Environmental Telemetry Dashboard`
    - `<nav class="site-navigation">` [STATIC]
      - `<a>` [STATIC]
        - Text: `Dashboard`
      - `<a>` [STATIC]
        - Text: `Sensor Logs`
      - `<a>` [STATIC]
        - Text: `About`
  
  - `<main class="dashboard-layout">` [STATIC]
    - **CSS:** `display: grid; grid-template-columns: 2fr 1fr; gap: ...;`
    
    - `<section class="telemetry-panel">` [STATIC]
      - `<header class="panel-header">` [STATIC]
        - `<h2>` [STATIC]
          - Text: `Telemetry Dashboard`
        - `<button id="clear-logs">` [STATIC]
          - Text: `Clear All Logs`
          - **Event:** `click`
      
      - `<section id="telemetry-list" class="telemetry-list">` [STATIC]
        - **CSS:** `display: grid; grid-template-columns: repeat(2, 1fr); gap: ...;`
        - **Purpose:** Container where telemetry cards are dynamically inserted.
        
        - `<p class="empty-state">` [DYNAMIC]
          - Text: `No sensor readings recorded yet.`
        
        - `<article class="telemetry-card">` [DYNAMIC]
          - `<header class="telemetry-card-header">` [DYNAMIC]
            - `<h3>` [DYNAMIC]
              - Text: `Bay 01`
            - `<span class="status-tag">` [DYNAMIC]
              - Text: `Optimal / Warning / Critical Hazard`
          
          - `<section class="sensor-values">` [DYNAMIC]
            - `<p>` [DYNAMIC]
              - Text: `pH: 6.1`
            - `<p>` [DYNAMIC]
              - Text: `EC: 1.5 mS/cm`
            - `<p>` [DYNAMIC]
              - Text: `Temperature: 68°F`
            - `<p>` [DYNAMIC]
              - Text: `Humidity: 62%`
          
          - `<footer class="telemetry-card-footer">` [DYNAMIC]
            - `<time>` [DYNAMIC]
              - Text: Recorded timestamp
            - `<button class="delete-log">` [DYNAMIC]
              - Text: `Delete`
              - **Event:** `click`

    - `<section class="input-panel">` [STATIC]
      - **CSS:** `display: flex; flex-direction: column;`
      
      - `<header class="input-panel-header">` [STATIC]
        - `<h2>` [STATIC]
          - Text: `Record Sensor Reading`
        - `<p>` [STATIC]
          - Text: `Enter current greenhouse telemetry.`
      
      - `<form id="sensor-form">` [STATIC]
        - **Event:** `submit`
        
        - `<fieldset>` [STATIC]
          - `<legend>` [STATIC]
            - Text: `Greenhouse Sensor Data`
          
          - `<label for="bay">` [STATIC]
            - Text: `Greenhouse Bay`
          - `<input id="bay" name="bay" type="text" required>` [STATIC]
          
          - `<label for="ph">` [STATIC]
            - Text: `pH`
          - `<input id="ph" name="ph" type="number" min="0" max="14" step="0.1" required>` [STATIC]
          - `<small id="ph-feedback">` [DYNAMIC]
            - Text: Validation feedback
          
          - `<label for="ec">` [STATIC]
            - Text: `Electrical Conductivity (mS/cm)`
          - `<input id="ec" name="ec" type="number" min="0" max="5" step="0.1" required>` [STATIC]
          - `<small id="ec-feedback">` [DYNAMIC]
            - Text: Validation feedback
          
          - `<label for="temperature">` [STATIC]
            - Text: `Air Temperature (°F)`
          - `<input id="temperature" name="temperature" type="number" min="32" max="120" step="0.1" required>` [STATIC]
          - `<small id="temperature-feedback">` [DYNAMIC]
            - Text: Validation feedback
          
          - `<label for="humidity">` [STATIC]
            - Text: `Relative Humidity (%)`
          - `<input id="humidity" name="humidity" type="number" min="0" max="100" step="1" required>` [STATIC]
          - `<small id="humidity-feedback">` [DYNAMIC]
            - Text: Validation feedback
        
        - `<button id="record-reading" type="submit">` [STATIC]
          - Text: `Record Reading`
      
      - `<section id="form-status" class="form-status">` [DYNAMIC]
        - Text: Submission or validation feedback

  - `<footer class="site-footer">` [STATIC]
    - `<img class="footer-logo">` [STATIC]
    - `<p>` [STATIC]
      - Text: `Greenhouse Sensor Logger — Environmental telemetry monitoring system.`
    - `<small>` [STATIC]
      - Text: `Sensor data is stored locally in this browser.`

---

## Event Target Architecture

### 1. Sensor Form Submission

**Target:**

```text
<form id="sensor-form">
```

**Event:**

```text
submit
```

**JavaScript behavior:**

1. Prevent the browser's default form submission.
2. Validate the entered values.
3. Reject invalid values.
4. Calculate the environmental status.
5. Create a telemetry object.
6. Add the object to the in-memory collection.
7. Save the collection to `localStorage`.
8. Create a new telemetry card.
9. Add the card to `#telemetry-list`.
10. Reset the form.

---

### 2. Real-Time Numeric Validation

**Targets:**

```text
#ph
#ec
#temperature
#humidity
```

**Event:**

```text
input
```

**JavaScript behavior:**

As the user changes a numeric value, JavaScript checks whether it remains within its defined constraint. If the value is invalid, the corresponding input receives an error state and its feedback element displays a message. When the value becomes valid again, the error state is removed.

---

### 3. Individual Log Deletion

**Target:**

```text
.delete-log
```

**Event:**

```text
click
```

**JavaScript behavior:**

The event identifies the telemetry record associated with the clicked card, removes that record from the in-memory collection, updates `localStorage`, and removes the corresponding `<article>` from the DOM.

---

### 4. Clear All Logs

**Target:**

```text
#clear-logs
```

**Event:**

```text
click
```

**JavaScript behavior:**

The application empties the telemetry collection, clears the stored records from `localStorage`, removes the dynamically generated cards, and restores the empty dashboard state.

---

### DOM Mutation Summary

| Element | Initial State | Mutation |
|---|---|---|
| `#telemetry-list` | Static empty container | Receives dynamically generated telemetry cards |
| `.empty-state` | Dynamic empty-state message | Removed when records exist; restored when the collection is empty |
| `.telemetry-card` | Not present initially | Created by JavaScript for every valid record |
| `.status-tag` | Not present initially | Created with calculated status |
| `.sensor-values` | Not present initially | Created from submitted sensor data |
| `.delete-log` | Not present initially | Created with each telemetry card |
| `#ph-feedback` | Static container / dynamic content | Updated during real-time validation |
| `#ec-feedback` | Static container / dynamic content | Updated during real-time validation |
| `#temperature-feedback` | Static container / dynamic content | Updated during real-time validation |
| `#humidity-feedback` | Static container / dynamic content | Updated during real-time validation |
| `#form-status` | Static container / dynamic content | Displays submission or validation feedback |

---

# 4.4 Data Schema

The application stores each submitted greenhouse sensor reading as a JavaScript object. Multiple objects are maintained in an array representing the active telemetry log.

```javascript
const sensorReadingSchema = {
    id: "String",              // Unique identifier for the telemetry record
    bay: "String",             // Greenhouse bay identifier
    ph: "Number",              // pH measurement, 0.0–14.0
    ec: "Number",              // Electrical conductivity in mS/cm
    temperature: "Number",     // Air temperature in degrees Fahrenheit
    humidity: "Number",        // Relative humidity percentage
    status: "String",          // Optimal, Warning, or Critical Hazard
    timestamp: "String"       // Date/time when the reading was recorded
};
```

The application's in-memory collection can be represented as:

```javascript
const sensorReadings = [
    {
        id: "String",
        bay: "String",
        ph: "Number",
        ec: "Number",
        temperature: "Number",
        humidity: "Number",
        status: "String",
        timestamp: "String"
    }
];
```

The same collection is serialized with `JSON.stringify()` and stored in browser `localStorage`. When the application loads, JavaScript retrieves the stored JSON data with `localStorage.getItem()`, converts it back into JavaScript objects, and renders the saved records into the telemetry dashboard.

### Data Flow

```text
HTML Form
    ↓
User Input
    ↓
Real-Time Validation
    ↓
Submit Event
    ↓
JavaScript Validation
    ↓
Status Classification
    ↓
Telemetry Object
    ↓
In-Memory Array
    ↓
localStorage
    ↓
Dynamic DOM Card
```

This architecture allows the application to maintain the active sensor history even after the browser page is refreshed, satisfying the offline session persistence requirement.