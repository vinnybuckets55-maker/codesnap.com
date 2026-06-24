const submitPostBtn = document.querySelector('.submit-post-btn');
const addTagBtn = document.getElementById('addTagBtn');
const tagInput = document.getElementById('tagInput');
const tagsList = document.getElementById('tagsList');

let currentTags = []; // Stores our active tag words for this current draft

// Listen for the tag "+" button
if (addTagBtn) {
    addTagBtn.addEventListener('click', () => {
        const tagText = tagInput.value.trim().toLowerCase(); // keeps tag cases uniform
        

        if (tagText !== "" && !currentTags.includes(tagText)) {
            currentTags.push(tagText);
            
            // Build the visual tag bubble on screen inside the creation card
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tagText;
            tagsList.appendChild(tagSpan);
            
            // Wipe the input clean for your next tag
            tagInput.value = "";
        }
    });
}

if (submitPostBtn) {
    submitPostBtn.addEventListener('click', () => {
        const titleText = document.getElementById('postTitle').value.trim();
        const bodyText = document.getElementById('postBody').value.trim();

        if (titleText === "" || bodyText === "") {
            alert("Yo, fill out both the title and description before snapping!");
            return;
        }

        const currentDatabase = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

        // Save everything including our dynamic tags list
        const newPostData = {
            title: titleText,
            body: bodyText,
            tags: currentTags 
        };

        currentDatabase.push(newPostData);
        localStorage.setItem('codesnap_local_db', JSON.stringify(currentDatabase));

        window.location.href = 'index.html';
    });
}
