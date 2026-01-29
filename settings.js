document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    // Attach Event Listeners
    document.getElementById('profileForm').addEventListener('submit', saveProfile);
    document.getElementById('budgetForm').addEventListener('submit', saveBudget);
});

// Load existing settings from LocalStorage
function loadSettings() {
    const config = JSON.parse(localStorage.getItem('expensewise_settings')) || {};
    
    // Profile
    document.getElementById('userName').value = config.userName || '';
    document.getElementById('userEmail').value = config.userEmail || '';
    document.getElementById('userCurrency').value = config.currency || '$';
    
    // Budget
    document.getElementById('monthlyLimit').value = config.monthlyLimit || '';
}

// Save Profile Function
function saveProfile(e) {
    e.preventDefault();
    
    const currentConfig = JSON.parse(localStorage.getItem('expensewise_settings')) || {};
    
    const newConfig = {
        ...currentConfig,
        userName: document.getElementById('userName').value,
        userEmail: document.getElementById('userEmail').value,
        currency: document.getElementById('userCurrency').value
    };
    
    localStorage.setItem('expensewise_settings', JSON.stringify(newConfig));
    showToast('Profile updated successfully!', 'success');
}

// Save Budget Function
function saveBudget(e) {
    e.preventDefault();
    
    const currentConfig = JSON.parse(localStorage.getItem('expensewise_settings')) || {};
    
    const newConfig = {
        ...currentConfig,
        monthlyLimit: parseFloat(document.getElementById('monthlyLimit').value)
    };
    
    localStorage.setItem('expensewise_settings', JSON.stringify(newConfig));
    showToast('Monthly budget updated!', 'success');
}