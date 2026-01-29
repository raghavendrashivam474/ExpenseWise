document.addEventListener('DOMContentLoaded', renderGoals);

function addGoal() {
    const name = prompt("Goal Name:");
    const target = prompt("Target Amount:");
    if(name && target) {
        goals.push({ id: generateId(), name, target: parseFloat(target), saved: 0 });
        saveGoals();
        renderGoals();
    }
}

function renderGoals() {
    const list = document.getElementById('goalsList');
    if(goals.length === 0) { list.innerHTML = '<p class="empty-state">No goals yet.</p>'; return; }
    list.innerHTML = goals.map(g => {
        const pct = Math.min(100, (g.saved / g.target) * 100).toFixed(1);
        return `
        <div class="goal-card">
            <div class="goal-header"><h3>${g.name}</h3></div>
            <div class="goal-body">
                <p>${formatMoney(g.saved)} / ${formatMoney(g.target)}</p>
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div class="goal-actions">
                    <button class="btn-small" onclick="addFunds('${g.id}')">Add Funds</button>
                    <button class="btn-small" onclick="deleteGoal('${g.id}')" style="color:red">Delete</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function addFunds(id) {
    const amt = parseFloat(prompt("Amount to add:"));
    const goal = goals.find(g => g.id === id);
    if(goal && amt) {
        goal.saved += amt;
        saveGoals();
        renderGoals();
    }
}

function deleteGoal(id) {
    if(confirm("Delete Goal?")) {
        goals = goals.filter(g => g.id !== id);
        saveGoals();
        renderGoals();
    }
}