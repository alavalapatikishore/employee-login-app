// Global variables for application state
let currentEmployee = null;
let clockInTime = null;
let totalWorkedMinutes = 0;
let sessionTimer = null;
let timeUpdateTimer = null;

// Sample employee database
const employees = {
  EMP001: { id: "EMP001", name: "John Doe", department: "Engineering" },
  EMP002: { id: "EMP002", name: "Jane Smith", department: "Marketing" },
  EMP003: { id: "EMP003", name: "Mike Johnson", department: "Sales" },
};

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
  updateCurrentTime();
  timeUpdateTimer = setInterval(updateCurrentTime, 1000);

  // Add event listener for login form
  const loginForm = document.getElementById("loginFormElement");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }
}

/**
 * Handle login form submission
 * @param {Event} e - Form submission event
 */
function handleLoginSubmit(e) {
  e.preventDefault();
  const empId = document.getElementById("employeeId").value.trim();
  const empName = document.getElementById("employeeName").value.trim();

  if (empId && empName) {
    login(empId, empName);
  }
}

/**
 * Update current time display
 */
function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleString();
  const timeElement = document.getElementById("currentTime");
  if (timeElement) {
    timeElement.textContent = `Current time: ${timeString}`;
  }
}

/**
 * Quick login function for pre-defined employees
 * @param {string} empId - Employee ID
 * @param {string} empName - Employee name
 */
function quickLogin(empId, empName) {
  document.getElementById("employeeId").value = empId;
  document.getElementById("employeeName").value = empName;
  login(empId, empName);
}

/**
 * Login function
 * @param {string} empId - Employee ID
 * @param {string} empName - Employee name
 */
function login(empId, empName) {
  // Create employee object
  currentEmployee = {
    id: empId,
    name: empName,
    department: employees[empId] ? employees[empId].department : "General",
  };

  // Reset daily data for new login session
  totalWorkedMinutes = 0;
  clockInTime = null;

  // Show dashboard
  showDashboard();

  console.log(`Employee ${empName} (${empId}) logged in successfully`);
}

/**
 * Show dashboard and hide login form
 */
function showDashboard() {
  const loginForm = document.getElementById("loginForm");
  const dashboard = document.getElementById("dashboard");

  if (loginForm && dashboard) {
    loginForm.classList.remove("active");
    dashboard.classList.add("active");

    updateEmployeeInfo();
    updateStatusCard();
    updateHoursSummary();
  }
}

/**
 * Update employee information display
 */
function updateEmployeeInfo() {
  const employeeInfoElement = document.getElementById("employeeInfo");
  if (employeeInfoElement && currentEmployee) {
    employeeInfoElement.innerHTML = `
            <strong>${currentEmployee.name}</strong><br>
            ID: ${currentEmployee.id}<br>
            Department: ${currentEmployee.department}
        `;
  }
}

/**
 * Clock in function
 */
function clockIn() {
  clockInTime = new Date();

  // Update button visibility
  const clockInBtn = document.getElementById("clockInBtn");
  const clockOutBtn = document.getElementById("clockOutBtn");

  if (clockInBtn && clockOutBtn) {
    clockInBtn.style.display = "none";
    clockOutBtn.style.display = "inline-block";
  }

  updateStatusCard();

  // Start session timer
  sessionTimer = setInterval(updateSessionTime, 1000);

  console.log(
    `${currentEmployee.name} clocked in at ${clockInTime.toLocaleTimeString()}`
  );
}

/**
 * Clock out function
 */
function clockOut() {
  if (clockInTime) {
    const clockOutTime = new Date();
    const sessionMinutes = Math.floor(
      (clockOutTime - clockInTime) / (1000 * 60)
    );
    totalWorkedMinutes += sessionMinutes;

    console.log(
      `${currentEmployee.name} clocked out. Session duration: ${Math.floor(
        sessionMinutes / 60
      )}h ${sessionMinutes % 60}m`
    );

    // Reset clock in time
    clockInTime = null;

    // Update button visibility
    const clockInBtn = document.getElementById("clockInBtn");
    const clockOutBtn = document.getElementById("clockOutBtn");

    if (clockInBtn && clockOutBtn) {
      clockInBtn.style.display = "inline-block";
      clockOutBtn.style.display = "none";
    }

    // Clear session timer
    if (sessionTimer) {
      clearInterval(sessionTimer);
      sessionTimer = null;
    }

    updateStatusCard();
    updateHoursSummary();
  }
}

/**
 * Update status card display
 */
function updateStatusCard() {
  const statusCard = document.getElementById("statusCard");
  const timeDisplay = document.getElementById("timeDisplay");

  if (statusCard && timeDisplay) {
    if (clockInTime) {
      statusCard.className = "status-card status-logged-in";
      timeDisplay.textContent = `Clocked in at ${clockInTime.toLocaleTimeString()}`;
    } else {
      statusCard.className = "status-card status-logged-out";
      timeDisplay.textContent = "Ready to clock in";
    }
  }
}

/**
 * Update session time display (called every second when clocked in)
 */
function updateSessionTime() {
  if (clockInTime) {
    const now = new Date();
    const sessionMinutes = Math.floor((now - clockInTime) / (1000 * 60));
    const hours = Math.floor(sessionMinutes / 60);
    const minutes = sessionMinutes % 60;

    const sessionTimeElement = document.getElementById("sessionTime");
    if (sessionTimeElement) {
      sessionTimeElement.textContent = `Current session: ${hours}h ${minutes}m`;
    }
  }
}

/**
 * Update hours summary display
 */
function updateHoursSummary() {
  const totalHours = Math.floor(totalWorkedMinutes / 60);
  const remainingMinutes = totalWorkedMinutes % 60;

  const todayHoursElement = document.getElementById("todayHours");
  if (todayHoursElement) {
    todayHoursElement.textContent = `Total hours worked: ${totalHours}h ${remainingMinutes}m`;
  }

  // Reset session time display if not clocked in
  if (!clockInTime) {
    const sessionTimeElement = document.getElementById("sessionTime");
    if (sessionTimeElement) {
      sessionTimeElement.textContent = "Current session: 0h 0m";
    }
  }
}

/**
 * Logout function
 */
function logout() {
  // Clock out if still clocked in
  if (clockInTime) {
    clockOut();
  }

  // Clear all timers
  if (sessionTimer) {
    clearInterval(sessionTimer);
    sessionTimer = null;
  }

  console.log(`${currentEmployee.name} logged out`);

  // Reset application state
  currentEmployee = null;
  totalWorkedMinutes = 0;
  clockInTime = null;

  // Clear form inputs
  const employeeIdInput = document.getElementById("employeeId");
  const employeeNameInput = document.getElementById("employeeName");

  if (employeeIdInput) employeeIdInput.value = "";
  if (employeeNameInput) employeeNameInput.value = "";

  // Show login form and hide dashboard
  const loginForm = document.getElementById("loginForm");
  const dashboard = document.getElementById("dashboard");

  if (loginForm && dashboard) {
    dashboard.classList.remove("active");
    loginForm.classList.add("active");
  }
}

/**
 * Format time for display
 * @param {number} minutes - Minutes to format
 * @returns {string} Formatted time string
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Get current date string
 * @returns {string} Current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Cleanup function when page unloads
window.addEventListener("beforeunload", function () {
  if (timeUpdateTimer) {
    clearInterval(timeUpdateTimer);
  }
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
});
