// Contract Details
const contractAddress = "0x743E3d314CEdE6A14DB92ED19af7Ad327c7b0fE5";
const response = await fetch('abi.json');
const contractABI = await response.json();

// Initialize Web3 and Contract
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Elements
const taskList = document.getElementById("taskList");
const createTaskForm = document.getElementById("createTaskForm");
const editTaskForm = document.getElementById("editTaskForm");
const completeTaskForm = document.getElementById("completeTaskForm");
const deleteTaskForm = document.getElementById("deleteTaskForm");
const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("taskInput");
const globalTasksList = document.getElementById("globalTasksList");

// Local storage for tasks
let tasks = [];

// Utility function to display tasks in the UI
function displayTasks(taskArray, targetElement) {
    targetElement.innerHTML = ""; // Clear the target element
    taskArray.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.textContent = `ID: ${task.id}, Description: ${task.description}, 
            Completed: ${task.isComplete ? "✅" : "❌"}, 
            Active: ${task.isActive ? "Yes" : "No"}`;
        targetElement.appendChild(taskItem);
    });

    if (taskArray.length === 0) {
        const noTasksMessage = document.createElement("li");
        noTasksMessage.textContent = "No tasks found.";
        targetElement.appendChild(noTasksMessage);
    }
}

// Add Task to Local List
addTaskButton.addEventListener("click", () => {
    const description = taskInput.value.trim();
    if (!description) {
        alert("Please enter a task description.");
        return;
    }

    tasks.push(description);

    // Display the task locally in the task list
    const taskItem = document.createElement("li");
    taskItem.textContent = description;
    taskList.appendChild(taskItem);

    // Clear the input field
    taskInput.value = "";
});

// Submit All Tasks to the Blockchain in One Transaction
createTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (tasks.length === 0) {
        alert("No tasks to submit. Please add tasks first.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();

        // Submit all tasks in one transaction
        await contract.methods.createTasks(tasks).send({ from: accounts[0] });

        alert("All tasks submitted successfully!");
        tasks = []; // Clear local tasks
        taskList.innerHTML = ""; // Clear UI list
        
    } catch (error) {
        if (error.code === 4001) {
            alert("Transaction canceled by the user.");
        } else {
            console.error("Error submitting tasks:", error);
            alert("Please Log into Metamask to submit tasks");
        }
    }
});

// Edit Task
editTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = document.getElementById("editTaskId").value;
    const newDescription = document.getElementById("editTaskDescription").value;

    if (!taskId || !newDescription) {
        alert("Please enter both the Task ID and the new description.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.editTask(taskId, newDescription).send({ from: accounts[0] });
        alert("Task updated successfully!");
        loadTasks();
    } catch (error) {
        console.error("Error editing task:", error);
        alert("An error occurred while editing the task. Please try again.");
    }
});

// Mark Task Complete
completeTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = document.getElementById("completeTaskId").value;

    if (!taskId) {
        alert("Please enter the Task ID.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.markTaskComplete(taskId).send({ from: accounts[0] });
        alert("Task marked as complete!");
        loadTasks();
    } catch (error) {
        console.error("Error marking task complete:", error);
        alert("An error occurred while marking the task as complete. Please try again.");
    }
});

// Delete Task
deleteTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = document.getElementById("deleteTaskId").value;

    if (!taskId) {
        alert("Please enter the Task ID.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.deleteTask(taskId).send({ from: accounts[0] });
        alert("Task deleted successfully!");
        loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task. Please try again.");
    }
});

// Fetch All Tasks
document.getElementById("fetchAllTasksButton").addEventListener("click", async () => {
    try {
        const tasks = await contract.methods.getAllTasks().call();
        displayTasks(tasks, globalTasksList);
    } catch (error) {
        console.error("Error fetching global tasks:", error);
        alert("An error occurred while fetching global tasks. Please try again.");
    }
});

async function loadTasks() {
    try {
        const tasks = await contract.methods.getAllTasks().call();
        const activeTasks = tasks.filter((task) => task.isActive);
        displayTasks(tasks, globalTasksList);
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert("An error occurred while loading tasks. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const titleElement = document.getElementById("animatedTitle");
    const titleText = "todoApp";

   
    titleElement.textContent = titleText;

    
    setTimeout(() => {
        titleElement.style.animation = "none";
    }, 2000); 
});


