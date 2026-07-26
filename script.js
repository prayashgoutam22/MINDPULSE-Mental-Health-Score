/* =========================================================
   Mental Health Prediction — script.js
   Handles client-side validation, API request, the animated
   progress-loader result, theme toggling, and small UX extras.
   ========================================================= */

// ---------- Config ----------
const API_URL = "http://127.0.0.1:8000/predict";

// The model's prediction is treated as a score out of MAX_SCORE (e.g. a
// raw value like 6.82 reads as 68.2% "completed"). Change this if your
// model's actual output range is different (e.g. 100 for a 0-100 score).
const MAX_SCORE = 10;

// ---------- DOM References ----------
const form = document.getElementById("predictionForm");
const predictBtn = document.getElementById("predictBtn");
const btnText = predictBtn.querySelector(".btn-text");
const spinner = document.getElementById("spinner");
const apiError = document.getElementById("apiError");

const resultCard = document.getElementById("resultCard");
const meterTrack = document.getElementById("meterTrack");
const meterFill = document.getElementById("meterFill");
const progressPercent = document.getElementById("progressPercent");
const rawScoreEl = document.getElementById("rawScore");
const scoreLabel = document.getElementById("scoreLabel");
const resetBtn = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");

// Field references, keyed by the FastAPI payload key
const fields = {
  age: document.getElementById("age"),
  gender: document.getElementById("gender"),
  country: document.getElementById("country"),
  academic_Level: document.getElementById("academicLevel"),
  most_Used_Platform: document.getElementById("platform"),
  purpose_Of_Use: document.getElementById("purpose"),
  avg_Daily_Usage_Hours: document.getElementById("usageHours"),
  daily_Unlocks: document.getElementById("dailyUnlocks"),
  study_Hours: document.getElementById("studyHours"),
  physical_Activity_Hours: document.getElementById("activityHours"),
  sleep_Hours_Per_Night: document.getElementById("sleepHours"),
  stress_Level: document.getElementById("stressLevel"),
};

// Maps field key -> error <span> id suffix used in HTML
const errorElementMap = {
  age: "age",
  gender: "gender",
  country: "country",
  academic_Level: "academicLevel",
  most_Used_Platform: "platform",
  purpose_Of_Use: "purpose",
  avg_Daily_Usage_Hours: "usageHours",
  daily_Unlocks: "dailyUnlocks",
  study_Hours: "studyHours",
  physical_Activity_Hours: "activityHours",
  sleep_Hours_Per_Night: "sleepHours",
  stress_Level: "stressLevel",
};

// ---------- Validation Rules ----------
// Each rule returns an error string, or "" if the value is valid.
const validators = {
  age: (v) => {
    if (v === "") return "Age is required.";
    const n = Number(v);
    if (n < 10 || n > 100) return "Age must be between 10 and 100.";
    return "";
  },
  gender: (v) => (v === "" ? "Please select a gender." : ""),
  country: (v) => (v.trim() === "" ? "Country is required." : ""),
  academic_Level: (v) => (v === "" ? "Please select an academic level." : ""),
  most_Used_Platform: (v) => (v === "" ? "Please select a platform." : ""),
  purpose_Of_Use: (v) => (v === "" ? "Please select a purpose." : ""),
  avg_Daily_Usage_Hours: (v) => {
    if (v === "") return "Usage hours are required.";
    const n = Number(v);
    if (n < 0 || n > 24) return "Must be between 0 and 24.";
    return "";
  },
  daily_Unlocks: (v) => {
    if (v === "") return "Daily unlocks are required.";
    const n = Number(v);
    if (n < 0) return "Must be 0 or greater.";
    return "";
  },
  study_Hours: (v) => {
    if (v === "") return "Study hours are required.";
    const n = Number(v);
    if (n < 0 || n > 24) return "Must be between 0 and 24.";
    return "";
  },
  physical_Activity_Hours: (v) => {
    if (v === "") return "Physical activity hours are required.";
    const n = Number(v);
    if (n < 0 || n > 24) return "Must be between 0 and 24.";
    return "";
  },
  sleep_Hours_Per_Night: (v) => {
    if (v === "") return "Sleep hours are required.";
    const n = Number(v);
    if (n < 0 || n > 24) return "Must be between 0 and 24.";
    return "";
  },
  stress_Level: (v) => (v === "" ? "Please select a stress level." : ""),
};

/**
 * Validates a single field, updates its error message + invalid styling.
 * Returns true if valid, false otherwise.
 */
function validateField(key) {
  const el = fields[key];
  const errorEl = document.getElementById(`error-${errorElementMap[key]}`);
  const message = validators[key](el.value);

  if (message) {
    el.classList.add("invalid");
    errorEl.textContent = message;
    return false;
  } else {
    el.classList.remove("invalid");
    errorEl.textContent = "";
    return true;
  }
}

/** Validates all fields. Returns true only if every field passes. */
function validateAll() {
  let allValid = true;
  for (const key of Object.keys(fields)) {
    const valid = validateField(key);
    if (!valid) allValid = false;
  }
  return allValid;
}

/** Builds the JSON payload FastAPI expects from current form values. */
function buildPayload() {
  return {
    age: Number(fields.age.value),
    gender: fields.gender.value,
    country: fields.country.value.trim(),
    academic_Level: fields.academic_Level.value,
    most_Used_Platform: fields.most_Used_Platform.value,
    purpose_Of_Use: fields.purpose_Of_Use.value,
    avg_Daily_Usage_Hours: Number(fields.avg_Daily_Usage_Hours.value),
    daily_Unlocks: Number(fields.daily_Unlocks.value),
    study_Hours: Number(fields.study_Hours.value),
    physical_Activity_Hours: Number(fields.physical_Activity_Hours.value),
    sleep_Hours_Per_Night: Number(fields.sleep_Hours_Per_Night.value),
    stress_Level: fields.stress_Level.value,
  };
}

function showApiError(message) {
  apiError.textContent = message;
  apiError.hidden = false;
}

function hideApiError() {
  apiError.hidden = true;
  apiError.textContent = "";
}

/** Toggles the predict button's loading state. */
function setLoading(isLoading) {
  predictBtn.disabled = isLoading;
  spinner.hidden = !isLoading;
  btnText.textContent = isLoading ? "Predicting..." : "Predict Mental Score";
}

// ---------- Circular progress-loader ----------

// Color stops the ring sweeps through as it fills, low (red) -> high (emerald).
// Two variants of the same palette: dark theme uses slightly brighter values
// so the text stays legible against a near-black card.
const COLOR_STOPS_LIGHT = [
  { stop: 0, rgb: [184, 72, 61] },    // muted brick red — needs attention
  { stop: 33, rgb: [166, 116, 42] },  // warm gold — fair
  { stop: 66, rgb: [90, 140, 110] },  // sage — good
  { stop: 100, rgb: [36, 86, 75] },   // deep pine — excellent
];

const COLOR_STOPS_DARK = [
  { stop: 0, rgb: [226, 136, 124] },
  { stop: 33, rgb: [221, 174, 99] },
  { stop: 66, rgb: [141, 191, 166] },
  { stop: 100, rgb: [111, 195, 169] },
];

const SCORE_LABELS = [
  { max: 25, text: "Needs Attention" },
  { max: 50, text: "Fair" },
  { max: 75, text: "Good" },
  { max: 100, text: "Excellent" },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

/** Interpolates an RGB color for a given percent (0-100), theme-aware for contrast. */
function colorForPercent(percent) {
  const stops = getCurrentTheme() === "dark" ? COLOR_STOPS_DARK : COLOR_STOPS_LIGHT;
  const p = Math.max(0, Math.min(100, percent));
  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (p >= stops[i].stop && p <= stops[i + 1].stop) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.stop - lower.stop || 1;
  const t = (p - lower.stop) / range;
  const r = Math.round(lerp(lower.rgb[0], upper.rgb[0], t));
  const g = Math.round(lerp(lower.rgb[1], upper.rgb[1], t));
  const b = Math.round(lerp(lower.rgb[2], upper.rgb[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}

function labelForPercent(percent) {
  const match = SCORE_LABELS.find((zone) => percent <= zone.max);
  return (match || SCORE_LABELS[SCORE_LABELS.length - 1]).text;
}

// ---------- Semicircle meter geometry ----------
// Pivot at (150,150), arc sweeps from -90deg (left, 0%) through 0deg (top,
// 50%) to +90deg (right, 100%) — a standard top-facing semicircle.
const METER_CX = 150;
const METER_CY = 150;
const METER_RADIUS = 118;
const METER_START_ANGLE = -90;
const METER_END_ANGLE = 90;

/** Standard polar-to-cartesian helper: 0deg = top, 90deg = right (clockwise). */
function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

/** Builds an SVG arc "d" path between two angles (deg) on the meter circle. */
function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

// Draw the full background track once, on load.
meterTrack.setAttribute(
  "d",
  describeArc(METER_CX, METER_CY, METER_RADIUS, METER_START_ANGLE, METER_END_ANGLE)
);

let currentMeterPercent = 0;

/**
 * Animates the meter's filled arc from its current percent to a target
 * percent, growing left-to-right across the dial — like a loading bar
 * bent into a semicircle — and "sticks" once it reaches the final value.
 */
function animateMeterTo(targetPercent, duration = 1100) {
  const from = currentMeterPercent;
  const delta = targetPercent - from;
  const startTime = performance.now();

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const value = from + delta * eased;
    const endAngle = METER_START_ANGLE + (value / 100) * (METER_END_ANGLE - METER_START_ANGLE);

    meterFill.setAttribute("d", describeArc(METER_CX, METER_CY, METER_RADIUS, METER_START_ANGLE, endAngle));
    progressPercent.textContent = `${value.toFixed(1)}%`;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      currentMeterPercent = targetPercent;
    }
  }

  requestAnimationFrame(step);
}

/** Renders the result card: meter fill, raw score, and qualitative label. */
function showResult(rawScore) {
  const percent = Math.max(0, Math.min(100, (rawScore / MAX_SCORE) * 100));

  resultCard.hidden = false;
  resultCard.style.animation = "none";
  void resultCard.offsetWidth; // force reflow to restart the entrance animation
  resultCard.style.animation = "fadeInUp 0.6s ease both";

  // Reset the meter to zero so every new prediction fills up from scratch.
  currentMeterPercent = 0;
  meterFill.setAttribute("d", describeArc(METER_CX, METER_CY, METER_RADIUS, METER_START_ANGLE, METER_START_ANGLE));
  progressPercent.textContent = "0%";

  rawScoreEl.textContent = `Score: ${rawScore.toFixed(2)} / ${MAX_SCORE}`;
  const label = labelForPercent(percent);
  scoreLabel.textContent = label;
  scoreLabel.style.color = colorForPercent(percent);

  // Slight delay so the reset-to-zero state is visible before it fills.
  requestAnimationFrame(() => {
    setTimeout(() => animateMeterTo(percent), 80);
  });

  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/** Parses FastAPI's default validation error shape (422) into a readable string. */
function parseFastApiValidationError(errorBody) {
  if (!errorBody || !errorBody.detail) return "Validation failed. Please check your inputs.";

  if (Array.isArray(errorBody.detail)) {
    return errorBody.detail
      .map((err) => {
        const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : "field";
        return `${field}: ${err.msg}`;
      })
      .join(" | ");
  }

  return String(errorBody.detail);
}

// ---------- Live validation on blur/input ----------
Object.keys(fields).forEach((key) => {
  const el = fields[key];
  el.addEventListener("blur", () => validateField(key));
  el.addEventListener("input", () => {
    if (el.classList.contains("invalid")) validateField(key);
  });
});

// ---------- Form submit ----------
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideApiError();
  resultCard.hidden = true;

  const isValid = validateAll();
  if (!isValid) {
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const payload = buildPayload();
  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch (_) {
        // response wasn't JSON — fall through with generic message
      }
      showApiError(parseFastApiValidationError(errorBody));
      return;
    }

    const data = await response.json();
    showResult(data.prediction_mental_score);
  } catch (err) {
    showApiError("Unable to connect to API. Please make sure FastAPI server is running.");
  } finally {
    setLoading(false);
  }
});

// ---------- Reset / New Prediction ----------
resetBtn.addEventListener("click", () => {
  form.reset();
  hideApiError();
  resultCard.hidden = true;

  Object.keys(fields).forEach((key) => {
    fields[key].classList.remove("invalid");
    document.getElementById(`error-${errorElementMap[key]}`).textContent = "";
  });

  form.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------- Theme toggle (light / dark) ----------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("mh-theme", theme);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");

  if (!resultCard.hidden) {
    scoreLabel.style.color = colorForPercent(currentMeterPercent);
  }
});

// ---------- Button ripple effect ----------
function attachRipple(button) {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

[predictBtn, resetBtn].forEach(attachRipple);
