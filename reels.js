window.addEventListener('DOMContentLoaded', () => {
    
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

    const savedPfp = localStorage.getItem("codesnap_user_pfp");
    let userAvatarHTML = `<i class='bx bxs-user-circle' style='font-size:28px; color:#0077ff;'></i>`;
    if (savedPfp) {
        userAvatarHTML = `<img src="${savedPfp}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    const reelCards = document.querySelectorAll('.reel-viewport-card');
    
    reelCards.forEach(card => {
        const commentBtn = card.querySelector('.reel-comment-btn');
        const commentDrawer = card.querySelector('.reel-comment-drawer');
        const closeCommentBtn = card.querySelector('.reel-comment-drawer .reel-comment-close');
        const submitCommentBtn = card.querySelector('.reel-comment-submit-btn');
        const commentInput = card.querySelector('.reel-comment-input-row input');
        const commentsList = card.querySelector('.reel-comments-list');
        const commentCounter = card.querySelector('.comment-counter');

        const codeBtn = card.querySelector('.reel-code-view-btn');
        const codeDrawer = card.querySelector('.reel-code-drawer');
        const closeCodeBtn = card.querySelector('.reel-code-drawer .reel-comment-close');
        const copyCodeBtn = card.querySelector('.reel-code-copy-btn');
        const codeElement = card.querySelector('.reel-code-view-area code');

        if (commentBtn && commentDrawer && closeCommentBtn) {
            commentBtn.addEventListener('click', () => {
                if (codeDrawer) codeDrawer.classList.remove('open'); 
                commentDrawer.classList.add('open');
            });
            closeCommentBtn.addEventListener('click', () => {
                commentDrawer.classList.remove('open');
            });
        }

        if (submitCommentBtn && commentInput && commentsList) {
            submitCommentBtn.addEventListener('click', () => {
                const commentText = commentInput.value.trim();
                if (commentText === "") return;

                const newCommentNode = document.createElement('div');
                newCommentNode.className = 'reel-comment-item';
                newCommentNode.innerHTML = `
                    <a href="profile.html" class="reel-comment-pfp-link" title="View Profile">
                        ${userAvatarHTML}
                    </a>
                    <div class="reel-comment-text-block">
                        <strong>@you</strong>
                        <p>${commentText}</p>
                    </div>
                `;
                commentsList.appendChild(newCommentNode);

                if (commentCounter) {
                    let currentCount = parseInt(commentCounter.textContent) || 0;
                    commentCounter.textContent = currentCount + 1;
                }
                commentInput.value = "";
                commentsList.scrollTop = commentsList.scrollHeight;
            });

            commentInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitCommentBtn.click();
                }
            });
        }

        if (codeBtn && codeDrawer && closeCodeBtn) {
            codeBtn.addEventListener('click', () => {
                if (commentDrawer) commentDrawer.classList.remove('open'); 
                codeDrawer.classList.add('open');
            });
            closeCodeBtn.addEventListener('click', () => {
                codeDrawer.classList.remove('open');
            });
        }

        if (copyCodeBtn && codeElement) {
            copyCodeBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(codeElement.textContent).then(() => {
                    copyCodeBtn.innerHTML = `<i class='bx bx-check' style='color:#00ff88;'></i> Copied!`;
                    copyCodeBtn.style.borderColor = "#00ff88";
                    
                    setTimeout(() => {
                        copyCodeBtn.innerHTML = `<i class='bx bx-copy'></i> Copy`;
                        copyCodeBtn.style.borderColor = "#2a2a30";
                    }, 2000);
                });
            });
        }
    });
});
