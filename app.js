(function () {
  "use strict";

  // Local storage key
  const STORAGE_KEY = "agrosens_telemetry_records_v1";

  // DOM elements
  const sensorForm = document.getElementById("sensor-form");
  const errorBanner = document.getElementById("form-error-banner");
  const recordsList = document.getElementById("records-list");
  const readingCount = document.getElementById("reading-count");
  const emptyState = document.getElementById("empty-state");
  const btnClearAll = document.getElementById("btn-clear-all");

  // Form inputs
  const inputBay = document.getElementById("bay");
  const inputPH = document.getElementById("ph");
  const inputEC = document.getElementById("ec");
  const inputTemperature = document.getElementById("temperature");
  const inputHumidity = document.getElementById("humidity");

  // Field feedback elements
  const phFeedback = document.getElementById("ph-feedback");
  const ecFeedback = document.getElementById("ec-feedback");
  const temperatureFeedback = document.getElementById("temperature-feedback");
  const humidityFeedback = document.getElementById("humidity-feedback");

  const feedbackFields = [
    { input: inputBay, feedback: null },
    { input: inputPH, feedback: phFeedback },
    { input: inputEC, feedback: ecFeedback },
    { input: inputTemperature, feedback: temperatureFeedback },
    { input: inputHumidity, feedback: humidityFeedback }
  ];

  // Load saved records
  let records = loadRecords();

  // Initial dashboard render
  render();

  // Read records from localStorage
  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to load sensor records:", error);
      return [];
    }
  }

  // Save records to localStorage
  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error("Failed to save sensor records:", error);
      displayError("Unable to save records. Check your browser storage.");
      return false;
    }
  }

  // Validate form input
  function validateInput(data) {
    const errors = [];

    if (!data.bay.trim()) {
      errors.push({
        field: inputBay,
        message: "Greenhouse Bay is required."
      });
    }

    if (
      !Number.isFinite(data.ph) ||
      data.ph < 0 ||
      data.ph > 14
    ) {
      errors.push({
        field: inputPH,
        message: "pH must be a number between 0 and 14."
      });
    }

    if (
      !Number.isFinite(data.ec) ||
      data.ec < 0 ||
      data.ec > 5
    ) {
      errors.push({
        field: inputEC,
        message: "EC must be between 0 and 5 mS/cm."
      });
    }

    if (
      !Number.isFinite(data.temperature) ||
      data.temperature < 32 ||
      data.temperature > 120
    ) {
      errors.push({
        field: inputTemperature,
        message: "Temperature must be between 32°F and 120°F."
      });
    }

    if (
      !Number.isFinite(data.humidity) ||
      data.humidity < 0 ||
      data.humidity > 100
    ) {
      errors.push({
        field: inputHumidity,
        message: "Humidity must be between 0% and 100%."
      });
    }

    return errors;
  }

  // Classify environmental conditions using Assignment 2A rules
  function evaluateStatus(ph, temperature, ec, humidity) {
    const critical =
      (ph < 5.0 || ph > 7.5) &&
      (temperature < 55 || temperature > 95) &&
      (ec < 0.2 || ec > 4.5) &&
      (humidity < 30 || humidity > 90);

    if (critical) {
      return {
        level: "critical",
        label: "Critical Hazard"
      };
    }

    const optimal =
      ph >= 5.5 && ph <= 6.5 &&
      temperature >= 64.4 && temperature <= 71.6 &&
      ec >= 1.0 && ec <= 2.0 &&
      humidity >= 50 && humidity <= 70;

    if (optimal) {
      return {
        level: "optimal",
        label: "Optimal"
      };
    }

    return {
      level: "warning",
      label: "Warning"
    };
  }

  // Read current values from the form
  function getFormData() {
    return {
      bay: inputBay.value,
      ph: inputPH.value.trim() === "" ? NaN : Number(inputPH.value),
      ec: inputEC.value.trim() === "" ? NaN : Number(inputEC.value),
      temperature:
        inputTemperature.value.trim() === ""
          ? NaN
          : Number(inputTemperature.value),
      humidity:
        inputHumidity.value.trim() === ""
          ? NaN
          : Number(inputHumidity.value)
    };
  }

  // Display a form error message
  function displayError(message) {
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
  }

  // Hide the form error message
  function hideError() {
    errorBanner.textContent = "";
    errorBanner.classList.add("hidden");
  }

  // Update validation styling and messages
  function updateValidation() {
    const data = getFormData();
    const errors = validateInput(data);

    feedbackFields.forEach(function (item) {
      item.input.classList.remove("input-invalid");

      if (item.feedback) {
        item.feedback.textContent = "";
      }
    });

    errors.forEach(function (error) {
      error.field.classList.add("input-invalid");

      const feedback = feedbackFields.find(function (item) {
        return item.input === error.field;
      });

      if (feedback && feedback.feedback) {
        feedback.feedback.textContent = error.message;
      }
    });

    if (errors.length > 0) {
      displayError(
        errors.map(function (error) {
          return error.message;
        }).join(" ")
      );
    } else {
      hideError();
    }

    return errors;
  }

  // Real-time input validation
  sensorForm.addEventListener("input", function () {
    updateValidation();
  });

  // Handle form submission
  sensorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = getFormData();
    const validationErrors = updateValidation();

    if (validationErrors.length > 0) {
      return;
    }

    // Add record details
    formData.id = crypto.randomUUID();
    formData.timestamp = new Date().toLocaleString();

    // Classify the environmental conditions
    formData.status = evaluateStatus(
      formData.ph,
      formData.temperature,
      formData.ec,
      formData.humidity
    );

    // Add newest reading first
    records.unshift(formData);

    // Save and update the dashboard
    if (!saveRecords()) {
      records.shift();
      return;
    }

    render();
    sensorForm.reset();

    // Clear validation styling and feedback
    feedbackFields.forEach(function (item) {
      item.input.classList.remove("input-invalid");

      if (item.feedback) {
        item.feedback.textContent = "";
      }
    });

    hideError();
    inputBay.focus();
  });

  // Delete an individual record using event delegation
  recordsList.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(".btn-delete");

    if (!deleteButton) {
      return;
    }

    const recordId = deleteButton.dataset.id;
    const previousRecords = records;

    records = records.filter(function (record) {
      return record.id !== recordId;
    });

    if (!saveRecords()) {
      records = previousRecords;
      return;
    }

    render();
  });

  // Clear all records
  btnClearAll.addEventListener("click", function () {
    if (records.length === 0) {
      return;
    }

    if (confirm("Are you sure you want to delete all sensor readings?")) {
      const previousRecords = records;
      records = [];

      if (!saveRecords()) {
        records = previousRecords;
        return;
      }

      render();
    }
  });

  // Render the dashboard
  function render() {
    readingCount.textContent = records.length;

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
      recordsList.innerHTML = "";
      return;
    }

    emptyState.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    records.forEach(function (record) {
      const li = document.createElement("li");
      li.className = "sensor-card status-" + record.status.level;

      li.innerHTML = `
        <div class="card-top">
          <div>
            <div class="bay-name">${escapeHtml(record.bay)}</div>
            <div class="timestamp">
              Logged at ${escapeHtml(record.timestamp)}
            </div>
          </div>
          <span class="status-badge ${record.status.level}">
            ${escapeHtml(record.status.label)}
          </span>
        </div>

        <div class="sensor-stats">
          <div class="stat-item">
            <span>pH</span>
            <strong>${record.ph.toFixed(1)}</strong>
          </div>
          <div class="stat-item">
            <span>Conductivity</span>
            <strong>${record.ec.toFixed(1)} mS/cm</strong>
          </div>
          <div class="stat-item">
            <span>Temperature</span>
            <strong>${record.temperature.toFixed(1)} °F</strong>
          </div>
          <div class="stat-item">
            <span>Humidity</span>
            <strong>${record.humidity}%</strong>
          </div>
        </div>

        <button
          type="button"
          class="btn-delete"
          data-id="${escapeHtml(record.id)}"
          aria-label="Delete reading for ${escapeHtml(record.bay)}"
        >
          Delete Reading
        </button>
      `;

      fragment.appendChild(li);
    });

    recordsList.innerHTML = "";
    recordsList.appendChild(fragment);
  }

  // Escape user-provided text before inserting it into HTML
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entities[character];
    });
  }
})();