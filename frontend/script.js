// CHECK LOGIN

if (
  window.location.pathname.includes("index.html")
) {

  const token =
    localStorage.getItem("token");

  if (!token) {

    window.location.href =
      "login.html";

  }

}


const API_URL =
  "https://digital-vision-board-goal-tracking-1.onrender.com/goals";


// FETCH ALL GOALS

async function fetchGoals() {

  try {

    const response =
      await fetch(API_URL);

    const goals =
      await response.json();

    displayGoals(goals);

  }

  catch (error) {

    console.log(error);

  }

}


// DISPLAY GOALS

function displayGoals(goals) {

  const goalContainer =
    document.getElementById(
      "goalContainer"
    );

  if (!goalContainer) return;

  goalContainer.innerHTML = "";


  // DASHBOARD STATS

  const totalGoals =
    document.getElementById(
      "totalGoals"
    );

  const completedGoalsText =
    document.getElementById(
      "completedGoals"
    );

  const progressGoalsText =
    document.getElementById(
      "progressGoals"
    );

  if (totalGoals) {

    totalGoals.innerText =
      goals.length;

  }

  const completedGoals =
    goals.filter(
      goal => goal.progress === 100
    );

  if (completedGoalsText) {

    completedGoalsText.innerText =
      completedGoals.length;

  }

  const progressGoals =
    goals.filter(
      goal => goal.progress < 100
    );

  if (progressGoalsText) {

    progressGoalsText.innerText =
      progressGoals.length;

  }


  goals.forEach((goal) => {

    const goalCard =
      document.createElement("div");

    goalCard.classList.add(
      "goal-card"
    );

    goalCard.innerHTML = `

      ${goal.image ? `
      <img src="${goal.image}">
      ` : ""}

      <div class="goal-content">

        <h2>${goal.title}</h2>

        <p>${goal.description}</p>

        <p class="deadline">
          Deadline:
          ${goal.deadline || "No Date"}
        </p>

        <div class="progress-bar">

          <div
            class="progress"
            style="width:${goal.progress}%">
          </div>

        </div>

        <p>
          ${goal.progress}% Completed
        </p>

        <button
          onclick="increaseProgress(
          '${goal._id}',
          ${goal.progress}
        )">

          Increase Progress

        </button>

        <button
          class="delete-btn"
          onclick="deleteGoal(
          '${goal._id}'
        )">

          Delete

        </button>

      </div>

    `;

    goalContainer.appendChild(
      goalCard
    );

  });


  // UPDATE CHART

  updateChart(
    completedGoals.length,
    progressGoals.length
  );

}


// ADD GOAL

async function addGoal() {

  const title =
    document.getElementById(
      "goalTitle"
    ).value;

  const description =
    document.getElementById(
      "goalDescription"
    ).value;

  const image =
    document.getElementById(
      "goalImage"
    ).value;

  const deadline =
    document.getElementById(
      "goalDeadline"
    ).value;

  if (
    title === "" ||
    description === ""
  ) {

    alert(
      "Please fill all fields"
    );

    return;

  }

  const goal = {

    title,

    description,

    image,

    deadline,

    progress: 0

  };

  try {

    await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(goal)

    });

    fetchGoals();

    document.getElementById(
      "goalTitle"
    ).value = "";

    document.getElementById(
      "goalDescription"
    ).value = "";

    document.getElementById(
      "goalImage"
    ).value = "";

    document.getElementById(
      "goalDeadline"
    ).value = "";

  }

  catch (error) {

    console.log(error);

  }

}


// DELETE GOAL

async function deleteGoal(id) {

  try {

    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );

    fetchGoals();

  }

  catch (error) {

    console.log(error);

  }

}


// UPDATE PROGRESS

async function increaseProgress(
  id,
  currentProgress
) {

  let newProgress =
    currentProgress + 10;

  if (newProgress > 100) {

    newProgress = 100;

  }

  try {

    await fetch(
      `${API_URL}/${id}`,
      {

        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          progress: newProgress

        })

      }
    );

    fetchGoals();

  }

  catch (error) {

    console.log(error);

  }

}


// SEARCH GOALS

async function searchGoals() {

  const searchInput =
    document.getElementById(
      "searchInput"
    );

  if (!searchInput) return;

  const searchText =
    searchInput.value
      .toLowerCase();

  const response =
    await fetch(API_URL);

  const goals =
    await response.json();

  const filteredGoals =
    goals.filter(goal =>

      goal.title
        .toLowerCase()
        .includes(searchText)

    );

  displayGoals(filteredGoals);

}


// FILTER COMPLETED

async function filterCompleted() {

  const response =
    await fetch(API_URL);

  const goals =
    await response.json();

  const filtered =
    goals.filter(goal =>
      goal.progress === 100
    );

  displayGoals(filtered);

}


// FILTER IN PROGRESS

async function filterProgress() {

  const response =
    await fetch(API_URL);

  const goals =
    await response.json();

  const filtered =
    goals.filter(goal =>
      goal.progress < 100
    );

  displayGoals(filtered);

}


// SIGNUP

async function signup() {

  const username =
    document.getElementById(
      "signupUsername"
    ).value;

  const email =
    document.getElementById(
      "signupEmail"
    ).value;

  const password =
    document.getElementById(
      "signupPassword"
    ).value;

  try {

    const response =
      await fetch(
        "https://digital-vision-board-goal-tracking-1.onrender.com/signup",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            username,
            email,
            password

          })

        }
      );

    const data =
      await response.json();

    alert(data.message);

    window.location.href =
      "login.html";

  }

  catch (error) {

    console.log(error);

  }

}


// LOGIN

async function login() {

  const email =
    document.getElementById(
      "loginEmail"
    ).value;

  const password =
    document.getElementById(
      "loginPassword"
    ).value;

  try {

    const response =
      await fetch(
        "https://digital-vision-board-goal-tracking-1.onrender.com/login",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            email,
            password

          })

        }
      );

    const data =
      await response.json();

    if (data.token) {

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "username",
        data.username
      );

      alert(
        "Login Successful"
      );

      window.location.href =
        "index.html";

    }

    else {

      alert(data.message);

    }

  }

  catch (error) {

    console.log(error);

  }

}


// SHOW USERNAME

const username =
  localStorage.getItem(
    "username"
  );

if (username) {

  const welcomeText =
    document.getElementById(
      "welcomeUser"
    );

  if (welcomeText) {

    welcomeText.innerText =
      `Welcome, ${username}`;

  }

}


// LOGOUT

function logout() {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "username"
  );

  window.location.href =
    "login.html";

}


// CHART

let goalChart;

function updateChart(
  completed,
  progress
) {

  const chartCanvas =
    document.getElementById(
      "goalChart"
    );

  if (!chartCanvas) return;

  const ctx =
    chartCanvas.getContext("2d");

  if (goalChart) {

    goalChart.destroy();

  }

  goalChart = new Chart(ctx, {

    type: "doughnut",

    data: {

      labels: [
        "Completed",
        "In Progress"
      ],

      datasets: [{

        data: [
          completed,
          progress
        ],

        backgroundColor: [
          "#00ff99",
          "#ffcc00"
        ],

        borderWidth: 1

      }]

    },

    options: {

      responsive: true

    }

  });

}


// LOAD GOALS

fetchGoals();