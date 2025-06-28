// Admin Dashboard JavaScript
const API_BASE_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Event listeners
    document.getElementById('admin-login-form').addEventListener('submit', handleLogin);
    document.getElementById('user-search').addEventListener('input', debounce(searchUsers, 300));
    document.getElementById('user-filter').addEventListener('change', filterUsers);
});

// Check if user is authenticated and is admin
async function checkAuth() {
    if (!authToken) {
        showLoginModal();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            
            if (currentUser.role !== 'admin') {
                alert('Access denied. Admin privileges required.');
                logout();
                return;
            }
            
            hideLoginModal();
            loadDashboard();
        } else {
            showLoginModal();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLoginModal();
    }
}

// Handle admin login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role: 'admin' })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            
            if (currentUser.role !== 'admin') {
                alert('Access denied. Admin privileges required.');
                return;
            }
            
            hideLoginModal();
            loadDashboard();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Show/Hide login modal
function showLoginModal() {
    document.getElementById('login-modal').classList.add('show');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.remove('show');
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    showLoginModal();
}

// Load dashboard data
async function loadDashboard() {
    try {
        await loadDashboardStats();
        await loadUsers();
        await loadServiceProviders();
        await loadDatabaseInfo();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data.data);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Update dashboard statistics display
function updateDashboardStats(stats) {
    document.getElementById('total-users').textContent = stats.users.total_users || 0;
    document.getElementById('total-providers').textContent = stats.providers.total_providers || 0;
    document.getElementById('active-users').textContent = stats.users.active_users || 0;
    document.getElementById('verified-providers').textContent = stats.providers.verified_providers || 0;

    // Update login activity
    document.getElementById('login-total').textContent = stats.loginActivity.total_attempts || 0;
    document.getElementById('login-success').textContent = stats.loginActivity.successful_logins || 0;
    document.getElementById('login-failed').textContent = stats.loginActivity.failed_attempts || 0;

    // Draw registration chart
    drawRegistrationChart(stats.recentRegistrations || []);
}

// Draw simple registration chart
function drawRegistrationChart(data) {
    const canvas = document.getElementById('registrationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (data.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No registration data available', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Simple bar chart
    const maxCount = Math.max(...data.map(d => d.count));
    const barWidth = canvas.width / data.length;
    const barMaxHeight = canvas.height - 40;

    data.forEach((item, index) => {
        const barHeight = (item.count / maxCount) * barMaxHeight;
        const x = index * barWidth;
        const y = canvas.height - barHeight - 20;

        // Draw bar
        ctx.fillStyle = '#667eea';
        ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

        // Draw count
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.count, x + barWidth / 2, y - 5);

        // Draw date
        ctx.fillText(
            new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            x + barWidth / 2,
            canvas.height - 5
        );
    });
}

// Load users data
async function loadUsers(page = 1) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&limit=10`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayUsers(data.data.users);
            displayUsersPagination(data.data.pagination);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="status-badge status-${user.role}">${user.role}</span></td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>
                ${user.email_verified ? '✅' : '❌'} Email<br>
                ${user.phone_verified ? '✅' : '❌'} Phone
            </td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td>
                <select onchange="updateUserStatus(${user.id}, this.value)" class="btn btn-sm">
                    <option value="">Change Status</option>
                    <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    <option value="pending" ${user.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Display users pagination
function displayUsersPagination(pagination) {
    const container = document.getElementById('users-pagination');
    container.innerHTML = '';

    for (let i = 1; i <= pagination.total_pages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === pagination.current_page ? 'active' : '';
        button.onclick = () => loadUsers(i);
        container.appendChild(button);
    }
}

// Update user status
async function updateUserStatus(userId, statusName) {
    if (!statusName) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ statusName })
        });

        if (response.ok) {
            alert('User status updated successfully');
            loadUsers();
        } else {
            alert('Failed to update user status');
        }
    } catch (error) {
        console.error('Error updating user status:', error);
        alert('Error updating user status');
    }
}

// Load service providers
async function loadServiceProviders() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/service-providers`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayServiceProviders(data.data);
        }
    } catch (error) {
        console.error('Error loading service providers:', error);
    }
}

// Display service providers
function displayServiceProviders(providers) {
    const tbody = document.getElementById('providers-tbody');
    tbody.innerHTML = '';

    providers.forEach(provider => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provider.id}</td>
            <td>${provider.full_name}</td>
            <td>${provider.email}</td>
            <td>${provider.service_category}</td>
            <td>${provider.location}</td>
            <td><span class="status-badge status-${provider.verification_status}">${provider.verification_status}</span></td>
            <td>${provider.average_rating}/5.0</td>
            <td>${provider.total_jobs}</td>
            <td>
                <select onchange="updateProviderVerification(${provider.id}, this.value)" class="btn btn-sm">
                    <option value="">Change Status</option>
                    <option value="pending" ${provider.verification_status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="verified" ${provider.verification_status === 'verified' ? 'selected' : ''}>Verified</option>
                    <option value="rejected" ${provider.verification_status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update provider verification status
async function updateProviderVerification(providerId, verificationStatus) {
    if (!verificationStatus) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/service-providers/${providerId}/verify`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ verificationStatus })
        });

        if (response.ok) {
            alert('Provider verification status updated successfully');
            loadServiceProviders();
        } else {
            alert('Failed to update provider verification status');
        }
    } catch (error) {
        console.error('Error updating provider verification:', error);
        alert('Error updating provider verification');
    }
}

// Load database information
async function loadDatabaseInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/database/info`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayDatabaseInfo(data.data);
        }
    } catch (error) {
        console.error('Error loading database info:', error);
    }
}

// Display database information
function displayDatabaseInfo(dbInfo) {
    document.getElementById('db-name').textContent = `Database: ${dbInfo.database_name}`;
    document.getElementById('total-tables').textContent = `Total Tables: ${dbInfo.total_tables}`;

    const tablesGrid = document.getElementById('tables-grid');
    tablesGrid.innerHTML = '';

    dbInfo.tables.forEach(table => {
        const tableCard = document.createElement('div');
        tableCard.className = 'table-card';
        tableCard.innerHTML = `
            <h5>${table.table_name}</h5>
            <div class="record-count">${table.record_count}</div>
            <div class="columns-count">${table.columns} columns</div>
        `;
        tablesGrid.appendChild(tableCard);
    });
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });
    event.target.closest('li').classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        users: 'User Management',
        providers: 'Service Providers',
        database: 'Database Information'
    };
    document.getElementById('page-title').textContent = titles[sectionName];
}

// Search and filter functions
function searchUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const rows = document.querySelectorAll('#users-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterUsers() {
    const filterValue = document.getElementById('user-filter').value;
    const rows = document.querySelectorAll('#users-tbody tr');
    
    rows.forEach(row => {
        if (!filterValue) {
            row.style.display = '';
        } else {
            const statusCell = row.querySelector('td:nth-child(6)');
            const status = statusCell.textContent.toLowerCase();
            row.style.display = status.includes(filterValue) ? '' : 'none';
        }
    });
}

// Refresh data
async function refreshData() {
    const currentSection = document.querySelector('.content-section.active').id;
    
    switch (currentSection) {
        case 'dashboard':
            await loadDashboardStats();
            break;
        case 'users':
            await loadUsers();
            break;
        case 'providers':
            await loadServiceProviders();
            break;
        case 'database':
            await loadDatabaseInfo();
            break;
    }
    
    alert('Data refreshed successfully');
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
