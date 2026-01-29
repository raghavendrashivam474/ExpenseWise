document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderTransactions();
    renderCategoryGrid();
    initChart();
});

function openModal() { document.getElementById('modalOverlay').classList.add('active'); }
function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }

document.getElementById('transactionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const desc = document.getElementById('desc').value;
    const cat = document.getElementById('category').value;

    if (!cat) return alert("Select a category");

    transactions.unshift({
        id: generateId(),
        type,
        amount,
        desc,
        category: cat,
        date: new Date().toISOString()
    });

    saveTransactions();
    closeModal();
    updateStats();
    renderTransactions();
    initChart();
    document.getElementById('transactionForm').reset();
});

function renderTransactions() {
    const list = document.getElementById('transactionsList');
    if (transactions.length === 0) { list.innerHTML = '<p class="empty-state">No transactions yet.</p>'; return; }
    list.innerHTML = transactions.slice(0, 5).map(t => `
        <div class="transaction-item">
            <div><strong>${t.desc}</strong><br><small>${new Date(t.date).toLocaleDateString()}</small></div>
            <div class="transaction-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${formatMoney(t.amount)}</div>
        </div>
    `).join('');
}

function updateStats() {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    document.getElementById('totalIncome').textContent = formatMoney(inc);
    document.getElementById('totalExpenses').textContent = formatMoney(exp);
    document.getElementById('totalBalance').textContent = formatMoney(inc - exp);
    document.getElementById('txCount').textContent = transactions.length;
}

let chartInstance = null;
function initChart() {
    const ctx = document.getElementById('expenseChart');
    if (chartInstance) chartInstance.destroy();

    const exp = transactions.filter(t => t.type === 'expense');
    const data = {};
    exp.forEach(t => { data[t.category] = (data[t.category] || 0) + t.amount; });

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{ data: Object.values(data), backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#a855f7'], borderWidth: 0 }]
        }
    });
}