const submitPostBtn = document.querySelector('.submit-post-btn');
const addTagBtn = document.getElementById('addTagBtn');
const tagInput = document.getElementById('tagInput');
const tagsList = document.getElementById('tagsList');

// New File Attachment Selectors
const uploadFileBtn = document.getElementById('uploadFileBtn');
const codeFilePicker = document.getElementById('codeFilePicker');
const postCodeSnippet = document.getElementById('postCodeSnippet');

let currentTags = [];

// --- FILE EXPLORER IMPORTER LOGIC ---
if (uploadFileBtn && codeFilePicker) {
    // Click custom button -> triggers hidden native window explorer
    uploadFileBtn.addEventListener('click', () => {
        codeFilePicker.click();
    });

    // Run when a file is chosen
    codeFilePicker.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile) {
            const reader = new FileReader();
            
            // Once file data is loaded into memory, drop it inside the code container
            reader.onload = function(e) {
                postCodeSnippet.value = e.target.result;
            };
            
            // Read the binary file directly as text strings
            reader.readAsText(selectedFile);
        }
    });
}

// --- TAG HANDLER ---
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

// --- SUBMISSION STORAGE MATRIX ---
if (submitPostBtn) {
    submitPostBtn.addEventListener('click', () => {
        const titleText = document.getElementById('postTitle').value.trim();
        const bodyText = document.getElementById('postBody').value.trim();
        const codeText = postCodeSnippet.value.trim(); // Reads code draft

        if (titleText === "" || bodyText === "") {
            alert("Yo, fill out both the title and description before snapping!");
            return;
        }

        const currentDatabase = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

        const newPostData = {
            title: titleText,
            body: bodyText,
            code: codeText, // Embedded code snippet string
            tags: currentTags 
        };

        currentDatabase.push(newPostData);
        localStorage.setItem('codesnap_local_db', JSON.stringify(currentDatabase));

        window.location.href = 'index.html';
    });
}
