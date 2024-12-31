import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";

const TASKS_FILE = "tasks.json";

const loadTasks = () => {
    try {
        const tasks = fs.readFileSync(TASKS_FILE, "utf8");
        return JSON.parse(tasks);
    } catch (error) {
        return [];
    }
};

const saveTasks = (tasks) => {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

const addTask = async () => {
    const tasks = loadTasks();
    const { description, dueDate } = await inquirer.prompt([
        {
            type: "input",
            name: "description",
            message: "Enter the task description:",
        },
        {
            type: "input",
            name: "dueDate",
            message: "Enter the due date (optional):",
        },
    ]);
    tasks.push({ description, status: "pending", dueDate: dueDate || "N/A" });
    saveTasks(tasks);
    console.log(chalk.green("Task added successfully!"));
};

const updateTask = async () => {
    const tasks = loadTasks();
    const { taskIndex } = await inquirer.prompt([
        {
            type: "list",
            name: "taskIndex",
            message: "Select the task to update:",
            choices: tasks.map(
                (task, index) => `${index + 1}. ${task.description}`
            ),
        },
    ]);
    const index = parseInt(taskIndex.split(".")[0]) - 1;
    const { description, status, dueDate } = await inquirer.prompt([
        {
            type: "input",
            name: "description",
            message: "Update description:",
            default: tasks[index].description,
        },
        {
            type: "list",
            name: "status",
            message: "Update status:",
            choices: ["pending", "in-progress", "done"],
            default: tasks[index].status,
        },
        {
            type: "input",
            name: "dueDate",
            message: "Update due date:",
            default: tasks[index].dueDate,
        },
    ]);
    tasks[index] = { description, status, dueDate };
    saveTasks(tasks);
    console.log(chalk.green("Task updated successfully!"));
};

const deleteTask = async () => {
    const tasks = loadTasks();
    const { taskIndex } = await inquirer.prompt([
        {
            type: "list",
            name: "taskIndex",
            message: "Select the task to delete:",
            choices: tasks.map(
                (task, index) => `${index + 1}. ${task.description}`
            ),
        },
    ]);
    const index = parseInt(taskIndex.split(".")[0]) - 1;
    tasks.splice(index, 1);
    saveTasks(tasks);
    console.log(chalk.green("Task deleted successfully!"));
};

const listTasks = (filter) => {
    const tasks = loadTasks();
    const filteredTasks = filter
        ? tasks.filter((task) => task.status === filter)
        : tasks;
    if (filteredTasks.length === 0) {
        console.log(chalk.yellow("No tasks found."));
        return;
    }
    filteredTasks.forEach((task, index) => {
        console.log(
            `${index + 1}. ${task.description} [Status: ${chalk.blue(
                task.status
            )}, Due: ${chalk.cyan(task.dueDate)}]`
        );
    });
};

const main = async () => {
    console.log(chalk.green("Welcome to the Enhanced Task Manager!"));

    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "Add a task",
                    "Update a task",
                    "Delete a task",
                    "List all tasks",
                    "List done tasks",
                    "List not done tasks",
                    "List in-progress tasks",
                    "Exit",
                ],
            },
        ]);

        if (action === "Add a task") {
            await addTask();
        } else if (action === "Update a task") {
            await updateTask();
        } else if (action === "Delete a task") {
            await deleteTask();
        } else if (action === "List all tasks") {
            listTasks();
        } else if (action === "List done tasks") {
            listTasks("done");
        } else if (action === "List not done tasks") {
            listTasks("pending");
            listTasks("in-progress");
        } else if (action === "List in-progress tasks") {
            listTasks("in-progress");
        } else {
            console.log(chalk.green("Goodbye!"));
            break;
        }
    }
};

main();
