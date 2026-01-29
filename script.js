document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particles');
    if(container) {
        for(let i=0; i<30; i++) {
            const p = document.createElement('div');
            p.style.position = 'absolute';
            p.style.width = Math.random() * 5 + 'px';
            p.style.height = p.style.width;
            p.style.background = '#6366f1';
            p.style.opacity = Math.random() * 0.5;
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.borderRadius = '50%';
            container.appendChild(p);
        }
    }
});