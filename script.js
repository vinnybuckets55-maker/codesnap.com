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

// --- 2. LOGIC FOR THE HOMEPAGE (index.html) ---
const mainFeed = document.getElementById('mainFeed');
if (mainFeed) {
    // Activate upvotes on default posts
    const existingButtons = mainFeed.querySelectorAll('.upvote-btn');
    existingButtons.forEach(btn => setupUpvoteButton(btn));

    // Pull custom posts from memory
    const savedPosts = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

    // Prepend saved posts to the feed
    savedPosts.forEach(post => {
        let tagsHTML = '';
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(singleTag => {
                tagsHTML += `<span class="tag">${singleTag}</span>`;
            });
        } else {
            tagsHTML = `<span class="tag">general</span>`;
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
    });

    // --- SEARCH BAR TOKEN CHIPS LOGIC ---
    let activeSearchTags = []; // Holds all currently active filter tags
    const searchInput = document.querySelector('.top-ribbon input[type="text"]');
    const searchTagsList = document.getElementById('searchTagsList');

    // Central filtering execution function
    function filterFeedPosts() {
        const postCards = mainFeed.querySelectorAll('.post-card');
        
        postCards.forEach(card => {
            // Get all tags pinned on this specific post
            const postTags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim().toLowerCase());
            
            // Check if every single active search filter matches something on this post
            const matchesAllFilters = activeSearchTags.every(filterTag => postTags.includes(filterTag));

            if (activeSearchTags.length === 0 || matchesAllFilters) {
                card.style.display = 'block'; // Match found, show post
            } else {
                card.style.display = 'none';  // Missing a tag, hide post
            }
        });
    }

    if (searchInput && searchTagsList) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const tagText = searchInput.value.trim().toLowerCase();

                // Prevent blank or duplicate filter tags
                if (tagText !== "" && !activeSearchTags.includes(tagText)) {
                    activeSearchTags.push(tagText);

                    // Create a clickable tag bubble chip under the search bar
                    const searchChip = document.createElement('span');
                    searchChip.className = 'tag';
                    searchChip.style.cursor = 'pointer';
                    searchChip.title = 'Click to remove filter';
                    // Adds a little 'x' icon next to the word
                    searchChip.innerHTML = `${tagText} <i class='bx bx-x' style='margin-left: 4px; vertical-align: middle; font-size: 11px;'></i>`;

                    // If a user clicks the bubble, delete it and recalculate search feed
                    searchChip.addEventListener('click', () => {
                        activeSearchTags = activeSearchTags.filter(t => t !== tagText);
                        searchChip.remove();
                        filterFeedPosts();
                    });

                    searchTagsList.appendChild(searchChip);
                    filterFeedPosts();
                }
                
                // Clear the textbox completely so they can type another tag immediately
                searchInput.value = "";
            }
        });
    }
}
