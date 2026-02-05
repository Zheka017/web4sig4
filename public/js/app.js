// App Logic
let currentFilter = 'all';
let currentEditingTaskId = null;
let allTasks = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (api.isAuthenticated()) {
        showAppScreen();
        loadUserInfo();
        loadTasks();
    } else {
        showAuthScreen();
    }
});

// Auth Handlers
function switchToRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

function switchToLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    if (!email || !password) {
        showError(errorDiv, 'Заполните все поля');
        return;
    }

    try {
        await api.login(email, password);
        showNotification('✅ Успешный вход!');
        setTimeout(() => {
            showAppScreen();
            loadUserInfo();
            loadTasks();
        }, 500);
    } catch (error) {
        showError(errorDiv, error.message);
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');

    if (!name || !email || !password) {
        showError(errorDiv, 'Заполните все поля');
        return;
    }

    if (password.length < 6) {
        showError(errorDiv, 'Пароль должен быть минимум 6 символов');
        return;
    }

    try {
        await api.register(email, password, name);
        showNotification('✅ Регистрация успешна!');
        setTimeout(() => {
            showAppScreen();
            loadUserInfo();
            loadTasks();
        }, 500);
    } catch (error) {
        showError(errorDiv, error.message);
    }
}

async function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        await api.logout();
        showNotification('👋 Вы вышли');
        setTimeout(() => {
            showAuthScreen();
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
        }, 500);
    }
}

// Load User Info
async function loadUserInfo() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('userEmail').textContent = user.email;
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

// Task Handlers
async function handleCreateTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const errorDiv = document.getElementById('createError');

    if (!title || !description) {
        showError(errorDiv, 'Заполните все поля');
        return;
    }

    try {
        await api.createTask(title, description);
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        errorDiv.classList.remove('show');
        showNotification('✅ Задача создана!');
        loadTasks();
    } catch (error) {
        showError(errorDiv, error.message);
    }
}

async function loadTasks() {
    try {
        allTasks = await api.getTasks();
        renderTasks();
    } catch (error) {
        showNotification('❌ ' + error.message, true);
    }
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    
    let filteredTasks = allTasks;
    if (currentFilter !== 'all') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = '<div class="empty-state">📝 Нет задач</div>';
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.status}">
            <div class="task-content">
                <span class="task-status ${task.status}">
                    ${getStatusLabel(task.status)}
                </span>
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <p class="task-description">${escapeHtml(task.description)}</p>
                <p class="task-date">
                    Создана: ${formatDate(task.createdAt)}<br>
                    Обновлена: ${formatDate(task.updatedAt)}
                </p>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="openEditModal('${task.id}', '${task.status}')">
                    Изменить
                </button>
                <button class="btn-delete" onclick="handleDeleteTask('${task.id}')">
                    Удалить
                </button>
            </div>
        </div>
    `).join('');
}

function filterTasks(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks();
}

function openEditModal(taskId, currentStatus) {
    currentEditingTaskId = taskId;
    document.getElementById('editStatus').value = currentStatus;
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditingTaskId = null;
}

async function handleUpdateTask(event) {
    event.preventDefault();
    
    const newStatus = document.getElementById('editStatus').value;
    
    try {
        await api.updateTask(currentEditingTaskId, newStatus);
        closeEditModal();
        showNotification('✅ Задача обновлена!');
        loadTasks();
    } catch (error) {
        showNotification('❌ ' + error.message, true);
    }
}

async function handleDeleteTask(taskId) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        try {
            await api.deleteTask(taskId);
            showNotification('✅ Задача удалена!');
            loadTasks();
        } catch (error) {
            showNotification('❌ ' + error.message, true);
        }
    }
}

// UI Helpers
function showAuthScreen() {
    document.getElementById('authScreen').classList.add('active');
    document.getElementById('appScreen').classList.remove('active');
}

function showAppScreen() {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function showNotification(message, isError = false) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');
    if (isError) {
        notif.classList.add('error');
    } else {
        notif.classList.remove('error');
    }
    
    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

// Utility Functions
function getStatusLabel(status) {
    const labels = {
        'pending': '⏳ Ожидание',
        'in-progress': '⚙️ В процессе',
        'completed': '✅ Завершено'
    };
    return labels[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}
