document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API and render them
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Render activities using the template
      renderActivities(activities);

      // Populate activity select dropdown
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
      Object.keys(activities).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Render activities using the template in index.html
  function renderActivities(activities) {
    const container = document.getElementById("activities-list");
    const template = document.getElementById("activity-card-template");
    container.innerHTML = "";
    Object.entries(activities).forEach(([name, info]) => {
      const card = template.content.cloneNode(true);
      card.querySelector(".activity-name").textContent = name;
      card.querySelector(".activity-description").textContent = info.description;
      card.querySelector(".activity-schedule").textContent = info.schedule;
      card.querySelector(".activity-max").textContent = info.max_participants;
      card.querySelector(".activity-available").textContent = info.max_participants - (info.participants?.length || 0);
      const participantsList = card.querySelector(".participants-list");
      participantsList.innerHTML = "";
      if (info.participants && info.participants.length > 0) {
        info.participants.forEach((p) => {
          const li = document.createElement("li");
          li.textContent = p;
          participantsList.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.innerHTML = "<em>No participants yet</em>";
        participantsList.appendChild(li);
      }
      container.appendChild(card);
    });
  }

  // Initialize app
  fetchActivities();
});
