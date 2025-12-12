// task.js

async function fetchTasks() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3001/api/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayTasks(data.tasks); // Update the task list dynamically
    } else {
      console.error("Failed to fetch tasks:", data.message);
      alert("Failed to load tasks");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Function to display tasks on the page
function displayTasks(tasks) {
  const pendingTaskList = document.getElementById("pending-task-list");
  const completedTaskList = document.getElementById("completed-task-list");
  const paraCounterCompleted = document.getElementById("counter-completed");
  const paraCounterPending = document.getElementById("counter-pending");
  const paraCounterTotal = document.getElementById("counter-total");
  let counterCompleted = 0;
  let counterPending = 0;

  pendingTaskList.innerHTML = ""; // Clear previous pending tasks
  completedTaskList.innerHTML = ""; // Clear previous completed tasks

  if (tasks.length === 0) {
    pendingTaskList.innerHTML = "<li>No tasks found</li>";
    completedTaskList.innerHTML = "<li>No tasks found</li>";
  }

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "list-group-item";
    taskItem.id = `task-${task.id}`;
    // necessario para nao comparar objeto a string
    const taskDate = new Date(task.date);
    const today = new Date();
    let inserirBadgeAtraso = "";

    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate < today && task.status === "pending") {
      // Calcula a diferença em Milissegundos
      const diffMilliseconds = today - taskDate;

      //  Converte Milissegundos para Dias
      const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

      inserirBadgeAtraso = `<span class="badge bg-danger">${diffDays} day(s) off</span>`;

      taskItem.classList.add("list-group-item-danger");
    } else if (
      taskDate.getTime() === today.getTime() &&
      task.status === "pending"
    ) {
      inserirBadgeAtraso = `<span class="badge bg-warning text-dark">Must do today</span>`;

      taskItem.classList.add("list-group-item-warning");
    }

    taskItem.innerHTML = `
        <strong>${task.title}</strong> - ${task.description}
        <span class="task-details">
          <span class="badge bg-${
            task.status === "completed" ? "success" : "warning"
          }">${task.status}</span>
          <span class="badge bg-info">${new Date(
            task.date
          ).toLocaleDateString()}</span> 
          ${inserirBadgeAtraso}
        </span>
        <div class="btn-group btn-group-sm float-right">
          <button class="btn btn-info" onclick="openEditModal(${task.id}, '${
      task.title
    }', '${task.description}', '${task.status}', '${task.date}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteTask(${
            task.id
          })">Delete</button>
        </div>
      `;

    if (task.status === "pending") {
      pendingTaskList.appendChild(taskItem);
      counterPending++;
    } else {
      completedTaskList.appendChild(taskItem);
      counterCompleted++;
    }
    let counterTotal = counterCompleted + counterPending;

    paraCounterCompleted.innerHTML = `<p>Completed Tasks: <strong>${counterCompleted}</strong></p>`;
    paraCounterPending.innerHTML = `<p>Pending Tasks: <strong>${counterPending}</strong></p>`;
    paraCounterTotal.innerHTML = `<h5><p>Total Tasks: <strong>${counterTotal}</strong></p></h5>`;
  });
}

function openEditModal(id, title, description, status, date) {
  document.getElementById("task-id").value = id;
  document.getElementById("task-title").value = title;
  document.getElementById("task-desc").value = description;
  document.getElementById("task-status").value = status;
  document.getElementById("task-date").value = date;

  const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));
  taskModal.show();

  // Bind the form submission event
  document.getElementById("task-form").onsubmit = function (event) {
    event.preventDefault();
    updateTask(id); // Update task and refresh the list
  };
}

// Function to add a new task
async function addTask() {
  const token = localStorage.getItem("token");
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;
  const date = document.getElementById("task-date").value;

  if (!title || !description || !date) {
    alert("Please fill in all fields.");
    return;
  }

  const newTask = {
    title: title,
    description: description,
    status: status,
    date: date,
  };

  try {
    const response = await fetch("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    document.getElementById("task-form").reset(); // Clear the form
    fetchTasks(); // Refresh the task list
    const taskModal = bootstrap.Modal.getInstance(
      document.getElementById("taskModal")
    );
    taskModal.hide(); // Close the modal
  } catch (error) {
    console.error("Failed to add task:", error);
  }
}

// Function to delete a task
async function deleteTask(id) {
  // TODO: Retrieve the token from localStorage.
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    fetchTasks();
  } catch (error) {
    console.error(`Failed to delete task:`, error);
  }
  // TODO: Send a DELETE request to `http://localhost:3001/api/tasks/${id}`.
  //       - Include the Authorization header with the Bearer token.

  // TODO: Check if the response is successful.
  // TODO: If successful, refresh the task list (e.g., call fetchTasks()).
  // TODO: Handle and log any errors that occur during the request.
}

// Function to update an existing task
async function updateTask(id) {
  // TODO: Retrieve the token from localStorage.
  const token = localStorage.getItem("token");

  // TODO: Get the task details (title, description, status, date) from form fields.
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;
  const date = document.getElementById("task-date").value;

  // TODO: Validate that all required fields are filled in.
  if (!title || !description || !date) {
    alert("Please fill in all fields.");
    return;
  }
  // TODO: Create an object containing the updated task data.
  const updatedTask = {
    title: title,
    description: description,
    status: status,
    date: date,
  };
  // TODO: Send a PUT request to `http://localhost:3001/api/tasks/${id}`.
  //       - Include the Content-Type and Authorization headers.
  //       - Include the updated task data in the request body as JSON.
  // TODO: Check if the response is successful.
  // TODO: If successful:
  //       - Clear the form.
  //       - Refresh the task list.
  //       - Close the modal window.
  // TODO: Handle and log any errors that occur during the request.

  try {
    //console.log(newTask);
    const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Failed to update task.");
    }

    document.getElementById("task-form").reset(); // Clear the form
    fetchTasks(); // Refresh the task list
    const taskModal = bootstrap.Modal.getInstance(
      document.getElementById("taskModal")
    );
    taskModal.hide(); // Close the modal
  } catch (error) {
    console.error("Fail to update task", error);
  }
}

const filtro = document.getElementById("filtroStatus");

filtro.addEventListener("change", function () {
  const statusSelecionado = filtro.value;

  const listaCompleta = document.getElementById("completed-task-list");
  const listaPendente = document.getElementById("pending-task-list");
  const h4Completa = document.getElementById("h4-completed");
  const h4Pendente = document.getElementById("h4-pending");

  if (statusSelecionado == "pending") {
    listaPendente.style.display = "block";
    h4Pendente.style.display = "block";
    listaCompleta.style.display = "none";
    h4Completa.style.display = "none";
  } else if (statusSelecionado == "completed") {
    listaPendente.style.display = "none";
    listaCompleta.style.display = "block";
    h4Completa.style.display = "block";
    h4Pendente.style.display = "none";
  } else {
    listaPendente.style.display = "block";
    listaCompleta.style.display = "block";
    h4Pendente.style.display = "block";
    h4Completa.style.display = "block";
  }
});
