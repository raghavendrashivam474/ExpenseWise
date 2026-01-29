document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('fullHistory');
    if(transactions.length === 0) { list.innerHTML = '<p>No data.</p>'; return; }
    
    list.innerHTML = transactions.map(t => `
        <div class="history-item">
            <div>
                <strong>${t.desc}</strong>
                <span style="display:block; font-size:0.8rem; color:#aaa">${new Date(t.date).toLocaleString()}</span>
            </div>
            <div style="text-align:right">
                <span class="${t.type === 'income' ? 'income-color' : 'expense-color'}" style="font-weight:700">
                    ${t.type === 'income' ? '+' : '-'}${formatMoney(t.amount)}
                </span>
                <br>
                <button class="btn-small" onclick="deleteTx('${t.id}')" style="color:#ef4444; border:none; background:none; cursor:pointer;">Delete</button>
            </div>
        </div>
    `).join('');
});

function deleteTx(id) {
    if(confirm("Delete this transaction?")) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        location.reload();
    }
}