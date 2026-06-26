// --- REELS INTERACTION LOOP HANDLER ---
window.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.reel-like-btn');

    likeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const counterSpan = btn.nextElementSibling;
            
            // Check if it's currently a float string or regular count number
            let isK = counterSpan.textContent.includes('k');
            let currentNum = parseFloat(counterSpan.textContent);

            btn.classList.toggle('liked');

            if (btn.classList.contains('liked')) {
                // Liked active state rules
                btn.innerHTML = `<i class='bx bxs-heart'></i>`;
                currentNum = isK ? currentNum + 0.1 : currentNum + 1;
            } else {
                // Deactivated un-liked rules
                btn.innerHTML = `<i class='bx bx-heart'></i>`;
                currentNum = isK ? currentNum - 0.1 : currentNum - 1;
            }

            // Put string format back together cleanly
            counterSpan.textContent = isK ? currentNum.toFixed(1) + 'k' : currentNum;
        });
    });
});
