const submitPostBtn = document.querySelector('.submit-post-btn');
const addTagBtn = document.getElementById('addTagBtn');
const tagInput = document.getElementById('tagInput');
const tagsList = document.getElementById('tagsList');

const uploadFileBtn = document.getElementById('uploadFileBtn');
const codeFilePicker = document.getElementById('codeFilePicker');
const postCodeSnippet = document.getElementById('postCodeSnippet');

let currentTags = [];

if (uploadFileBtn && codeFilePicker) {
    uploadFileBtn.addEventListener('click', () => {
        codeFilePicker.click();
    });

    codeFilePicker.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                postCodeSnippet.value = e.target.result;
            };
            reader.readAsText(selectedFile);
        }
    });
}

if (addTagBtn) {
    addTagBtn.addEventListener('click', () => {
        const tagText = tagInput.value.trim().toLowerCase();
        if (tagText !== "" && !currentTags.includes(tagText)) {
            currentTags.push(tagText);
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tagText;
            tagsList.appendChild(tagSpan);
            tagInput.value = "";
        }
    });
}

if (submitPostBtn) {
    submitPostBtn.addEventListener('click', () => {
        const titleText = document.getElementById('postTitle').value.trim();
        const bodyText = document.getElementById('postBody').value.trim();
        const codeText = postCodeSnippet.value.trim();

        if (titleText === "" || bodyText === "") {
            alert("Yo, fill out both the title and description before snapping!");
            return;
        }

        const currentDatabase = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];
        const newPostData = {
            title: titleText,
            body: bodyText,
            code: codeText,
            tags: currentTags 
        };

        currentDatabase.push(newPostData);
        localStorage.setItem('codesnap_local_db', JSON.stringify(currentDatabase));
        window.location.href = 'index.html';
    });
}
