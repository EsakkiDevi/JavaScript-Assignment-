 function validatePlanetName(name) {
      return /[aeiouAEIOU]/.test(name) && /\d/.test(name) && name.length >= 3;
    }

    function validateAntennaCount(count) {
      const num = parseInt(count);
      return !isNaN(num) && num >= 0 && num % 2 === 0;
    }

    function validateAlienId(id) {
      return /^[A-Z]{3}-[A-Z]{2}_\d{4}@[A-Z]{3}$/.test(id);
    }

    function validateFavoritePhrase(phrase) {
      const emoji = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{27BF}]/u.test(phrase);
      const punct = /[!@#$%^&*(),.?":{}|<>]/.test(phrase);
      return (emoji || punct) && phrase.length >= 3;
    }

    function validateLandingDate(date) {
      const d = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }

   
const form = document.getElementById("alienForm");
const submitBtn = document.getElementById("submitBtn");

const validators = {
  planetName: validatePlanetName,
  antennaCount: validateAntennaCount,
  alienId: validateAlienId,
  favoritePhrase: validateFavoritePhrase,
  landingDate: validateLandingDate
};

// Keep track of which fields are valid
const fieldStatus = {
  planetName: false,
  antennaCount: false,
  alienId: false,
  favoritePhrase: false,
  landingDate: false,
  eyeCount: false,
  visitPurpose: false,
  atmosphereType: false,
  emergencyContact: false
};

// Function to check all fields for enabling submit
function updateSubmitStatus() {
  submitBtn.disabled = !Object.values(fieldStatus).every(v => v);
}

// Add input/change listeners for each field
Object.keys(fieldStatus).forEach(id => {
  const field = document.getElementById(id);
  
  const validate = validators[id] || (value => value.trim() !== ""); // fallback for simple required fields

  field.addEventListener(id === "visitPurpose" || id === "atmosphereType" ? "change" : "input", () => {
    const isValid = validate(field.value);
    fieldStatus[id] = isValid;

    if (isValid) {
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
      const feedback = field.nextElementSibling;
      if(feedback) feedback.textContent = "✅ Looks good!";
    } else if(field.value.trim() !== "") {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      const feedback = field.nextElementSibling;
      if(feedback) feedback.textContent = "⚠️ Invalid input";
    } else {
      field.classList.remove("is-invalid", "is-valid");
      const feedback = field.nextElementSibling;
      if(feedback) feedback.textContent = "";
    }

    updateSubmitStatus();
  });
});

// Handle form submit
form.addEventListener("submit", e => {
  e.preventDefault();
  alert("🛸 Alien Registration Successful! Welcome to Earth!");
  form.reset();
  submitBtn.disabled = true;
  form.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
});
