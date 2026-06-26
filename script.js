// --- 1. REUSABLE UPVOTE HANDLER ---
function setupUpvoteButton(button) {
    button.addEventListener('click', () => {
        const countSpan = button.querySelector('.upvote-count');
        let currentCount = parseInt(countSpan.textContent);
        
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            currentCount--;
            button.style.backgroundColor = "#1a1a1e";
            button.style.color = "#8e8e93";
        } else {
            button.classList.add('active');
            currentCount++;
            button.style.backgroundColor = "#0077ff";
            button.style.color = "#ffffff";
        }
        countSpan.textContent = currentCount;
    });
}

// --- 2. CLIPBOARD COPY BUTTON CONTROLLER ---
function setupCopyButton(container) {
    const copyBtn = container.querySelector('.copy-code-btn');
    const codeBlock = container.querySelector('code');
    
    if (copyBtn && codeBlock) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyBtn.innerHTML = `<i class='bx bx-check' style='color:#00ff88;'></i> Copied!`;
                copyBtn.style.borderColor = "#00ff88";
                setTimeout(() => {
                    copyBtn.innerHTML = `<i class='bx bx-copy'></i> Copy`;
                    copyBtn.style.borderColor = "#2a2a30";
                }, 2000);
            });
        });
    }
}

// --- 3. REUSABLE DEBUG COMMENTS PANEL HANDLER ---
function setupDebugPanel(card, postTitleForDatabase = null) {
    const debugBtn = card.querySelector('.debug-btn');
    const debugPanel = card.querySelector('.debug-panel');
    const submitReplyBtn = card.querySelector('.submit-reply-btn');
    const replyInput = card.querySelector('.reply-input-row input');
    const repliesList = card.querySelector('.replies-list');

    if (debugBtn && debugPanel) {
        debugBtn.addEventListener('click', () => {
            debugPanel.classList.toggle('open');
            if (debugPanel.classList.contains('open')) {
                debugBtn.style.color = "#0077ff";
            } else {
                debugBtn.style.color = "#8e8e93";
            }
        });
    }

    if (submitReplyBtn && replyInput && repliesList) {
        submitReplyBtn.addEventListener('click', () => {
            const replyText = replyInput.value.trim();
            if (replyText === "") return;

            const newReplyItem = document.createElement('div');
            newReplyItem.className = 'reply-item';
            newReplyItem.innerHTML = `<strong>@you:</strong> ${replyText}`;
            repliesList.appendChild(newReplyItem);

            if (postTitleForDatabase) {
                const savedPosts = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];
                const updatedPosts = savedPosts.map(p => {
                    if (p.title === postTitleForDatabase) {
                        if (!p.replies) p.replies = [];
                        p.replies.push(replyText);
                    }
                    return p;
                });
                localStorage.setItem('codesnap_local_db', JSON.stringify(updatedPosts));
            }

            replyInput.value = "";
            repliesList.scrollTop = repliesList.scrollHeight;
        });
    }
}

// --- 4. HOMEPAGE FEED BUILDER ---
const mainFeed = document.getElementById('mainFeed');
if (mainFeed) {
    const defaultCards = mainFeed.querySelectorAll('.post-card');
    defaultCards.forEach(card => {
        const upBtn = card.querySelector('.upvote-btn');
        if (upBtn) setupUpvoteButton(upBtn);
        setupDebugPanel(card);
    });

    const savedPosts = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];
    
    // FETCH SAVED PROFILE PICTURE FOR HOME FEED POSTS
    const savedPfp = localStorage.getItem("codesnap_user_pfp");
    let userPfpHTML = `<i class='bx bx-user-circle'></i>`;
    if (savedPfp) {
        userPfpHTML = `<img src="${savedPfp}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">`;
    }

    savedPosts.forEach(post => {
        let tagsHTML = '';
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(singleTag => {
                tagsHTML += `<span class="tag">${singleTag}</span>`;
            });
        } else {
            tagsHTML = `<span class="tag">general</span>`;
        }

        let codeSectionHTML = '';
        if (post.code && post.code !== '') {
            codeSectionHTML = `
                <div class="code-editor-container" style="background-color: #111114; border: 1px solid #2a2a30; border-radius: 8px; margin: 12px 0; position: relative;">
                    <div style="display:flex; justify-content:space-between; align-items:center; background-color:#16161a; padding: 6px 12px; border-bottom:1px solid #2a2a30; border-radius: 8px 8px 0 0;">
                        <span style="font-family:monospace; font-size:12px; color:#8e8e93;">source-file</span>
                        <button class="copy-code-btn" style="background:none; border:1px solid #2a2a30; color:#8e8e93; font-size:11px; padding:3px 8px; border-radius:4px; cursor:pointer; display:flex; align-items:center; gap:4px;"><i class='bx bx-copy'></i> Copy</button>
                    </div>
                    <pre style="margin:0; padding:12px; overflow-x:auto;"><code style="font-family:monospace; font-size:13px; color:#a9b7c6; white-space:pre;">${post.code}</code></pre>
                </div>
            `;
        }

        let repliesHTML = '';
        if (post.replies && post.replies.length > 0) {
            post.replies.forEach(rep => {
                repliesHTML += `<div class="reply-item"><strong>@you:</strong> ${rep}</div>`;
            });
        }

        const customPostCard = document.createElement('div');
        customPostCard.className = 'post-card';
        customPostCard.innerHTML = `
            <div class="post-header">
                <button class="profile-link" title="View Profile" style="display:flex; align-items:center; justify-content:center; padding:0; border:none; background:none; cursor:pointer; color:#0077ff; font-size:32px;">
                    ${userPfpHTML}
                </button>
                <h3 class="post-title">${post.title}</h3>
            </div>
            <div class="post-body">
                <p>${post.body}</p>
                ${codeSectionHTML} 
            </div>
            <div class="post-footer">
                <div class="tags-container">
                    ${tagsHTML}
                </div>
                <div class="post-actions">
                    <button class="upvote-btn" title="Upvote"><i class='bx bx-upvote'></i> <span class="upvote-count">0</span></button>
                    <button class="debug-btn" title="Reply/Debug"><i class='bx bx-code-alt'></i></button>
                </div>
            </div>
            <div class="debug-panel">
                <div class="replies-list">
                    ${repliesHTML}
                </div>
                <div class="reply-input-row">
                    <input type="text" placeholder="Suggest a debug fix...">
                    <button class="submit-reply-btn">Submit Fix</button>
                </div>
            </div>
        `;
        mainFeed.prepend(customPostCard);

        const newUpvoteBtn = customPostCard.querySelector('.upvote-btn');
        setupUpvoteButton(newUpvoteBtn);
        if (post.code && post.code !== '') setupCopyButton(customPostCard);
        setupDebugPanel(customPostCard, post.title);
    });

    // --- SEARCH BAR ENGINE ---
    let activeSearchTags = [];
    const searchInput = document.querySelector('.top-ribbon input[type="text"]');
    const searchTagsList = document.getElementById('searchTagsList');

    function filterFeedPosts() {
        const postCards = mainFeed.querySelectorAll('.post-card');
        postCards.forEach(card => {
            const postTags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim().toLowerCase());
            const matchesAllFilters = activeSearchTags.every(filterTag => postTags.includes(filterTag));
            if (activeSearchTags.length === 0 || matchesAllFilters) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput && searchTagsList) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const tagText = searchInput.value.trim().toLowerCase();
                if (tagText !== "" && !activeSearchTags.includes(tagText)) {
                    activeSearchTags.push(tagText);
                    const searchChip = document.createElement('span');
                    searchChip.className = 'tag';
                    searchChip.style.cursor = 'pointer';
                    searchChip.title = 'Click to remove filter';
                    searchChip.innerHTML = `${tagText} <i class='bx bx-x' style='margin-left: 4px; vertical-align: middle; font-size: 11px;'></i>`;
                    searchChip.addEventListener('click', () => {
                        activeSearchTags = activeSearchTags.filter(t => t !== tagText);
                        searchChip.remove();
                        filterFeedPosts();
                    });
                    searchTagsList.appendChild(searchChip);
                    filterFeedPosts();
                }
                searchInput.value = "";
            }
        });
    }
}
