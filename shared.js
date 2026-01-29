// ============================================
// DATA STORES & CONFIGURATION
// ============================================

// Load core data immediately
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Categories Configuration
const categories = [
    { id: 'food', name: 'Food', icon: 'fas fa-utensils', color: '#ef4444' },
    { id: 'salary', name: 'Salary', icon: 'fas fa-money-bill', color: '#10b981' },
    { id: 'transport', name: 'Transport', icon: 'fas fa-car', color: '#3b82f6' },
    { id: 'shopping', name: 'Shopping', icon: 'fas fa-shopping-bag', color: '#a855f7' },
    { id: 'entertainment', name: 'Fun', icon: 'fas fa-gamepad', color: '#ec4899' },
    { id: 'bills', name: 'Bills', icon: 'fas fa-file-invoice', color: '#f59e0b' },
    { id: 'health', name: 'Health', icon: 'fas fa-heartbeat', color: '#14b8a6' },
    { id: 'other', name: 'Other', icon: 'fas fa-circle', color: '#6b7280' }
];

// ============================================
// INITIALIZATION (Runs on every page load)
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Highlight Active Sidebar Link
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    
    document.querySelectorAll('.nav-item').forEach(link => {
        // Remove active class first
        link.classList.remove('active');
        // Add active if href matches current page filename
        if(link.getAttribute('href') === page) {
            link.classList.add('active');
        }
    });

    // 2. Mobile Menu Toggles
    const toggle = document.getElementById('sidebarToggle');
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if(toggle) toggle.onclick = () => sidebar.classList.toggle('collapsed');
    if(menuBtn) menuBtn.onclick = () => sidebar.classList.toggle('open');
    
    // 3. Set Date in Header
    const dateEl = document.getElementById('currentDate');
    if(dateEl) dateEl.textContent = new Date().toLocaleDateString();
});

// ============================================
// CORE DATA FUNCTIONS
// ============================================
function saveTransactions() { 
    localStorage.setItem('transactions', JSON.stringify(transactions)); 
}

function saveGoals() { 
    localStorage.setItem('goals', JSON.stringify(goals)); 
}

function generateId() { 
    return Date.now().toString(36) + Math.random().toString(36).substr(2); 
}

function formatMoney(amount) {
    // Read user setting or default to $
    const config = JSON.parse(localStorage.getItem('expensewise_settings')) || {};
    const symbol = config.currency || '$';
    return symbol + parseFloat(amount).toFixed(2);
}

function getCategoryInfo(id) {
    return categories.find(c => c.id === id) || categories[categories.length - 1]; // Default to 'Other'
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// UI RENDERERS
// ============================================
function renderCategoryGrid() {
    const grid = document.getElementById('categoryGrid');
    if(!grid) return;
    
    grid.innerHTML = categories.map(c => `
        <div class="category-item" data-id="${c.id}">
            <i class="${c.icon}" style="color:${c.color}"></i>
            <span>${c.name}</span>
        </div>
    `).join('');

    // Attach click listeners
    const items = grid.querySelectorAll('.category-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active from all
            items.forEach(i => i.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            // Update hidden input
            const input = document.getElementById('category');
            if(input) input.value = this.dataset.id;
        });
    });
}

function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if(existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// DATA MANAGEMENT (Export, Import, Sample)
// ============================================
function addSampleData() {
    const samples = [
        { id: generateId(), type: 'income', amount: 5000, desc: 'Salary', category: 'salary', date: new Date().toISOString() },
        { id: generateId(), type: 'expense', amount: 150, desc: 'Groceries', category: 'food', date: new Date().toISOString() },
        { id: generateId(), type: 'expense', amount: 55, desc: 'Gas', category: 'transport', date: new Date().toISOString() },
        { id: generateId(), type: 'expense', amount: 120, desc: 'Internet', category: 'bills', date: new Date().toISOString() },
    ];
    
    transactions = [...samples, ...transactions];
    saveTransactions();
    showToast('Sample data added!', 'success');
    setTimeout(() => location.reload(), 1000);
}

function clearAllData() {
    if(confirm('Are you sure? This will delete ALL transactions and settings.')) {
        localStorage.clear();
        location.href = 'index.html';
    }
}

function exportData() {
    const data = {
        transactions,
        goals,
        settings: JSON.parse(localStorage.getItem('expensewise_settings'))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expensewise_backup.json';
    a.click();
    showToast('Data exported!', 'success');
}

// Make functions globally available for inline onclick attributes
window.addSampleData = addSampleData;
window.clearAllData = clearAllData;
window.exportData = exportData;
window.showToast = showToast;