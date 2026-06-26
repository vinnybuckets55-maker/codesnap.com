// --- REELS INTERACTION CONTROL SYSTEM MATRIX ---
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. GLOBAL LIKE BUTTON CONTROLLERS
    const likeButtons = document.querySelectorAll('.reel-like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const counterSpan = btn.nextElementSibling;
            let isK = counterSpan.textContent.includes('k');
            let currentNum = parseFloat(counterSpan.textContent);

            btn.classList.toggle('liked');

            if (btn.classList.contains('liked')) {
                btn.innerHTML = `<i class='bx bxs-heart'></i>`;
                currentNum = isK ? currentNum + 0.1 : currentNum + 1;
            } else {
                btn.innerHTML = `<i class='bx bx-heart'></i>`;
                currentNum = isK ? currentNum - 0.1 : currentNum - 1;
            }
            counterSpan.textContent = isK ? currentNum.toFixed(1) + 'k' : currentNum;
        });
    });

    // 2. ISOLATED COMMENT DRAWER PROCESSES PER SHORTS VIEWPORT CARD
    const reelCards = document.querySelectorAll('.reel-viewport-card');
    
    reelCards.forEach(card => {
        const commentBtn = card.querySelector('.reel-comment-btn');
        const commentDrawer = card.querySelector('.reel-comment-drawer');
        const closeDrawerBtn = card.querySelector('.reel-comment-close');
        
        const submitCommentBtn = card.querySelector('.reel-comment-submit-btn');
        const commentInput = card.querySelector('.reel-comment-input-row input');
        const commentsList = card.querySelector('.reel-comments-list');
        const commentCounter = card.querySelector('.comment-counter');

        // Toggle visibility triggers
        if (commentBtn && commentDrawer && closeDrawerBtn) {
            commentBtn.addEventListener('click', () => {
                commentDrawer.classList.add('open');
            });

            closeDrawerBtn.addEventListener('click', () => {
                commentDrawer.classList.remove('open');
            });
        }

        // Live submission appending runner
        if (submitCommentBtn && commentInput && commentsList) {
            submitCommentBtn.addEventListener('click', () => {
                const commentText = commentInput.value.trim();
                if (commentText === "") return;

                // Build text bubble element row
                const newCommentNode = document.createElement('div');
                newCommentNode.className = 'reel-comment-item';
                newCommentNode.innerHTML = `<strong>@you:</strong> ${commentText}`;
                commentsList.appendChild(newCommentNode);

                // Increment node sidebar digit label count metric text strings
                if (commentCounter) {
                    let currentCount = parseInt(commentCounter.textContent) || 0;
                    commentCounter.textContent = currentCount + 1;
                }

                commentInput.value = ""; // Clear input slot text lines
                commentsList.scrollTop = commentsList.scrollHeight; // Focus scroll row alignment down
            });

            // Let users submit fixes via the Enter key too
            commentInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitCommentBtn.click();
                }
            });
        }
    });
});
