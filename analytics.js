document.addEventListener('DOMContentLoaded', () => {
    // 1. Calculate Totals
    calculateAnalytics();
    
    // 2. Render Charts
    renderAnalyticsCharts();
});

function calculateAnalytics() {
    if(!transactions || transactions.length === 0) return;

    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netBalance = totalIncome - totalExpense;
    
    // Calculate Savings Rate (Prevent division by zero)
    const savingsRate = totalIncome > 0 
        ? ((netBalance / totalIncome) * 100).toFixed(1) 
        : 0;

    // Update DOM Elements
    document.getElementById('anaIncome').textContent = formatMoney(totalIncome);
    document.getElementById('anaExpense').textContent = formatMoney(totalExpense);
    document.getElementById('anaBalance').textContent = formatMoney(netBalance);
    document.getElementById('anaSavings').textContent = savingsRate + '%';
}

function renderAnalyticsCharts() {
    if(!transactions || transactions.length === 0) return;

    // --- Prepare Data for Bar Chart (Income vs Expense) ---
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0);

    const ctxBar = document.getElementById('barChart');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Amount ($)',
                data: [totalIncome, totalExpense],
                backgroundColor: ['#10b981', '#ef4444'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                x: { grid: { display: false }, ticks: { color: '#fff' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // --- Prepare Data for Pie Chart (Expense Categories) ---
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};

    // Sum up amounts per category
    expenses.forEach(t => {
        if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
        categoryTotals[t.category] += parseFloat(t.amount);
    });

    // Map Category IDs to Names and Colors (from shared.js categories array)
    const labels = [];
    const data = [];
    const colors = [];

    Object.keys(categoryTotals).forEach(catId => {
        // Find category object in shared.js configuration
        const catObj = categories.find(c => c.id === catId);
        
        // Use object data or fallback if category ID changed
        labels.push(catObj ? catObj.name : catId);
        colors.push(catObj ? catObj.color : '#ccc');
        data.push(categoryTotals[catId]);
    });

    // If no expenses, show placeholder
    if(data.length === 0) {
        labels.push('No Expenses');
        data.push(1);
        colors.push('#374151');
    }

    const ctxPie = document.getElementById('pieChart');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right', labels: { color: '#fff' } }
            }
        }
    });
}