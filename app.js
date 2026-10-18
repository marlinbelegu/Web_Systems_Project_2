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

})();