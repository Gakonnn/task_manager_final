const apiUrl = 'http://localhost:8080';
let token = '';

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showAlert(text, isError = true) {
    const alertElement = document.getElementById('alert');
    alertElement.style.display = 'block';
    alertElement.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
    document.getElementById('alert-text').textContent = text;
    setTimeout(() => alertElement.style.display = 'none', 3000);
}

async function register(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) throw new Error('Registration failed');

        const data = await response.json();
        token = data.token;
        showSection('tasks');
        loadTasks();
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        token = data.token;
        showSection('tasks');
        loadTasks();
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function loadTasks() {
    try {
        const response = await fetch(`${apiUrl}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load tasks');

        const tasks = await response.json();
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${task.description} - ${task.deadline} - ${task.completed ? 'Complete' : 'Incomplete'}
                <button onclick="editTask('${task._id}', '${task.description}', '${task.deadline}', '${task.completed}')">Edit</button>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        showAlert(error.message);
    }
}

async function addTask() {
    const description = document.getElementById('task-desc').value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Failed to add task');
        }

        await response.json();
        loadTasks();
        showAlert('Task added successfully', false);
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function findTaskById() {
    const taskId = document.getElementById('task-id').value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to find task');

        const task = await response.json();
        showAlert(`Task: ${task.description}`, false);
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function updateTaskById() {
    const taskId = document.getElementById('task-id').value;
    const description = document.getElementById('task-desc').value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description })
        });

        if (!response.ok) throw new Error('Failed to update task');

        await response.json();
        loadTasks();
        showAlert('Task updated successfully', false);
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function deleteTaskById() {
    const taskId = document.getElementById('task-id').value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete task');

        await response.json();
        loadTasks();
        showAlert('Task deleted successfully', false);
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function updateProfile() {
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const age = document.getElementById('profile-age').value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, age })
        });

        if (!response.ok) throw new Error('Failed to update profile');

        await response.json();
        showAlert('Profile updated successfully', false);
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function deleteProfile() {
    try {
        showLoading();
        const response = await fetch(`${apiUrl}/users/me`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete profile');

        await response.json();
        token = '';
        showSection('login');
        showAlert('Profile deleted successfully', false);
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

async function logout() {
    try {
        showLoading();
        const response = await fetch(`${apiUrl}/users/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to logout');

        await response.json();
        token = '';
        showSection('login');
        showAlert('Logged out successfully', false);
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

function showRegister() {
    showSection('register');
}

function showLogin() {
    showSection('login');
}

function editTask(id, description, deadline, status) {
    document.getElementById('edit-task-id').value = id;
    document.getElementById('edit-task-desc').value = description;
    document.getElementById('edit-task-deadline').value = deadline;
    document.getElementById('edit-task-status').value = status ? 'complete' : 'incomplete';
    document.getElementById('edit-task-modal').style.display = 'block';
}

function closeEditTaskModal() {
    document.getElementById('edit-task-modal').style.display = 'none';
}

async function saveTask(event) {
    event.preventDefault();
    const id = document.getElementById('edit-task-id').value;
    const description = document.getElementById('edit-task-desc').value;
    const deadline = document.getElementById('edit-task-deadline').value;
    const status = document.getElementById('edit-task-status').value === 'complete';

    try {
        showLoading();
        const response = await fetch(`${apiUrl}/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description, deadline, completed: status })
        });

        if (!response.ok) throw new Error('Failed to update task');

        await response.json();
        loadTasks();
        showAlert('Task updated successfully', false);
        closeEditTaskModal();
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}


async function loadProfile() {
    try {
        showLoading();
        const response = await fetch(`${apiUrl}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load profile');

        const user = await response.json();
        document.getElementById('profile-name').value = user.name;
        document.getElementById('profile-email').value = user.email;
        document.getElementById('profile-age').value = user.age;
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
}

function showProfile() {
    showSection('profile');
    loadProfile();
}

window.onload = function() {
    showSection('login');
}
