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
            // Write text content directly to user's computer clipboard
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyBtn.innerHTML = `<i class='bx bx-check' style='color:#00ff88;'></i> Copied!`;
                copyBtn.style.borderColor = "#00ff88";
                
                // Reset button back to original state after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = `<i class='bx bx-copy'></i> Copy`;
                    copyBtn.style.borderColor = "#2a2a30";
                }, 2000);
            });
        });
    }
}

// --- 3. HOMEPAGE FEED BUILDER ---
const mainFeed = document.getElementById('mainFeed');
if (mainFeed) {
    const existingButtons = mainFeed.querySelectorAll('.upvote-btn');
    existingButtons.forEach(btn => setupUpvoteButton(btn));

    const savedPosts = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

    savedPosts.forEach(post => {
        let tagsHTML = '';
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(singleTag => {
                tagsHTML += `<span class="tag">${singleTag}</span>`;
            });
        } else {
            tagsHTML = `<span class="tag">general</span>`;
        }

        // Custom verification: If post contains code, assemble a professional dark syntax viewer container
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

        const customPostCard = document.createElement('div');
        customPostCard.className = 'post-card';
        customPostCard.innerHTML = `
            <div class="post-header">
                <button class="profile-link" title="View Profile"><i class='bx bx-user-circle'></i></button>
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
                    <button title="Reply/Debug"><i class='bx bx-code-alt'></i></button>
                </div>
            </div>
        `;
        mainFeed.prepend(customPostCard);

        const newUpvoteBtn = customPostCard.querySelector('.upvote-btn');
        setupUpvoteButton(newUpvoteBtn);

        // Turn on clipboard tracking if this custom card features code lines
        if (post.code && post.code !== '') {
            setupCopyButton(customPostCard);
        }
    });

    // --- SEARCH BAR SYSTEM ---
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
