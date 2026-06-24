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
    // Activate upvotes on the hardcoded C++ and Python posts
    const existingButtons = mainFeed.querySelectorAll('.upvote-btn');
    existingButtons.forEach(btn => setupUpvoteButton(btn));

    // Pull any custom posts stored inside the browser's localStorage save-file
    const savedPosts = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

    // Loop through your saved items and prepend them to the top of the feed
    savedPosts.forEach(post => {
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
                    <span class="tag">user-snap</span>
                    <span class="tag">local-db</span>
                </div>
                <div class="post-actions">
                    <button class="upvote-btn" title="Upvote"><i class='bx bx-upvote'></i> <span class="upvote-count">0</span></button>
                    <button title="Reply/Debug"><i class='bx bx-code-alt'></i></button>
                </div>
            </div>
        `;
        mainFeed.prepend(customPostCard);

        // Turn on upvote tracking for this newly rendered custom post
        const newUpvoteBtn = customPostCard.querySelector('.upvote-btn');
        setupUpvoteButton(newUpvoteBtn);
    });
}

// --- 3. LOGIC FOR THE CREATION PAGE (create-post.html) ---
const submitPostBtn = document.querySelector('.submit-post-btn');
if (submitPostBtn) {
    submitPostBtn.addEventListener('click', () => {
        const titleText = document.getElementById('postTitle').value.trim();
        const bodyText = document.getElementById('postBody').value.trim();

        if (titleText === "" || bodyText === "") {
            alert("Yo, fill out both the title and description before snapping!");
            return;
        }

        // Get the current list of posts from storage, or start a clean empty array
        const currentDatabase = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

        // Bundle your text inputs into a tidy JavaScript object block
        const newPostData = {
            title: titleText,
            body: bodyText
        };

        // Push the new item into our database array
        currentDatabase.push(newPostData);

        // Write the updated database back into the browser's localStorage disk
        localStorage.setItem('codesnap_local_db', JSON.stringify(currentDatabase));

        // Router redirect: smooth hop right back to your homepage feed!
        window.location.href = 'index.html';
    });
}
