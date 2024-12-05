// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ToDoList {
    struct Task {
        uint id;
        string description;
        bool isComplete;
        bool isActive;
        uint256 creationDate;
    }

    // Mapping from an address to their tasks
    mapping(address => Task[]) private tasks;

    // Function to create a task
    function createTask(string memory description) public {
        uint taskId = tasks[msg.sender].length;
        tasks[msg.sender].push(Task(taskId, description, false, true, block.timestamp));
    }

    // Function to edit a task description
    function editTask(uint taskId, string memory newDescription) public {
        require(taskId < tasks[msg.sender].length, "Task does not exist.");
        tasks[msg.sender][taskId].description = newDescription;
    }

    // Function to mark a task as complete
    function markTaskComplete(uint taskId) public {
        require(taskId < tasks[msg.sender].length, "Task does not exist.");
        tasks[msg.sender][taskId].isComplete = true;
    }

    // Function to soft delete a task by marking it as inactive
    function deleteTask(uint taskId) public {
        require(taskId < tasks[msg.sender].length, "Task does not exist.");
        tasks[msg.sender][taskId].isActive = false;
    }

    // Function to retrieve all tasks of a user
    function getAllTasks(address user) public view returns (Task[] memory) {
        return tasks[user];
    }

    // Function to get details of a specific task
    function getTaskDetails(address user, uint taskId) public view returns (Task memory) {
        require(taskId < tasks[user].length, "Task does not exist.");
        return tasks[user][taskId];
    }
}
