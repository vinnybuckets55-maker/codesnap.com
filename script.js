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

    // --- NEW: SEARCH ELEMENT FILTER LOGIC ---
    const searchInput = document.querySelector('.top-ribbon input[type="text"]');
    
    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            // Check if the user hit the Enter key
            if (event.key === 'Enter') {
                // Grab what they typed, make it lowercase, and split multiple words by spaces/commas
                const queryText = searchInput.value.trim().toLowerCase();
                const searchTerms = queryText.split(/[\s,]+/).filter(term => term !== "");

                // Grab all post cards currently sitting in the feed
                const postCards = mainFeed.querySelectorAll('.post-card');

                postCards.forEach(card => {
                    // Extract all the tag text strings inside this specific post card
                    const postTags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim().toLowerCase());

                    // Check if EVERY SINGLE term searched matches a tag inside this post
                    const matchesAllTerms = searchTerms.every(term => postTags.includes(term));

                    if (searchTerms.length === 0 || matchesAllTerms) {
                        card.style.display = 'block'; // Show it!
                    } else {
                        card.style.display = 'none';  // Hide it!
                    }
                });
            }
        });
    }
}
