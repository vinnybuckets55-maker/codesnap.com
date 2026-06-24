const submitPostBtn = document.querySelector('.submit-post-btn');

if (submitPostBtn) {
    submitPostBtn.addEventListener('click', () => {
        const titleText = document.getElementById('postTitle').value.trim();
        const bodyText = document.getElementById('postBody').value.trim();

        // Prevent empty submissions
        if (titleText === "" || bodyText === "") {
            alert("Yo, fill out both the title and description before snapping!");
            return;
        }

        // Pull existing data from browser save-file
        const currentDatabase = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

        // Bundle inputs into an object
        const newPostData = {
            title: titleText,
            body: bodyText
        };

        // Push and save to localStorage
        currentDatabase.push(newPostData);
        localStorage.setItem('codesnap_local_db', JSON.stringify(currentDatabase));

        // Redirect back to the home feed
        window.location.href = 'index.html';
    });
}
