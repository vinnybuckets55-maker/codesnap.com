// --- 1. STATE CONFIGURATION FIELDS ---
let editModeActive = false;
let hasImageLoaded = false;
let targetedRedirectUrl = ""; 

const BIO_STORAGE_KEY = "codesnap_user_bio";
const PFP_STORAGE_KEY = "codesnap_user_pfp";

const editProfileBtn = document.getElementById('editProfileBtn');
const bioTxtBox = document.getElementById('bioTxtBox');
const bioInputField = document.getElementById('bioInputField');
const pfpDivFrame = document.getElementById('pfpDivFrame');
const pfpFileLoader = document.getElementById('pfpFileLoader');
const userPfpDisplay = document.getElementById('userPfpDisplay');
const pfpPlaceholderImg = document.getElementById('pfpPlaceholderImg');

const cropperModal = document.getElementById('cropperModal');
const cropperSourcePreview = document.getElementById('cropperSourcePreview');
const pfpOptionsModal = document.getElementById('pfpOptionsModal');
const pfpConfirmRemovalModal = document.getElementById('pfpConfirmRemovalModal');
const dirtyWarningModal = document.getElementById('dirtyWarningModal');

// --- INTERACTIVE SUB-ELEMENT INITIALIZERS ---
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

// --- 2. LOAD PROFILE AVATAR & METADATA RAW ---
const savedBio = localStorage.getItem(BIO_STORAGE_KEY);
if (savedBio) bioTxtBox.textContent = savedBio;

const savedPfp = localStorage.getItem(PFP_STORAGE_KEY);
if (savedPfp) {
    userPfpDisplay.src = savedPfp;
    userPfpDisplay.style.display = 'block';
    pfpPlaceholderImg.style.display = 'none';
    hasImageLoaded = true;
}

// --- 3. DYNAMIC TARGET LOADING FOR PROFILE POSTS TAB ---
const panePosts = document.getElementById('panePosts');
const savedPosts = JSON.parse(localStorage.getItem('codesnap_local_db')) || [];

if (panePosts && savedPosts.length > 0) {
    panePosts.innerHTML = ""; // Snaps placeholder text completely out of existence!

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
                <div class="code-editor-container" style="background-color: #111114; border: 1px solid #2a2a30; border-radius: 8px; margin: 12px 0; position: relative; text-align: left;">
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
                repliesHTML += `<div class="reply-item" style="text-align: left;"><strong>@you:</strong> ${rep}</div>`;
            });
        }

        const customPostCard = document.createElement('div');
        customPostCard.className = 'post-card';
        customPostCard.style.marginBottom = "20px";
        customPostCard.innerHTML = `
            <div class="post-header" style="text-align: left;">
                <a href="profile.html" class="profile-link" title="View Profile" style="display:flex; align-items:center; justify-content:center; padding:0; border:none; background:none; cursor:pointer; color:#0077ff; font-size:32px; text-decoration:none;">
                    ${userPfpHTML}
                </a>
                <h3 class="post-title">${post.title}</h3>
            </div>
            <div class="post-body" style="text-align: left;">
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
        panePosts.prepend(customPostCard);

        const newUpvoteBtn = customPostCard.querySelector('.upvote-btn');
        setupUpvoteButton(newUpvoteBtn);
        if (post.code && post.code !== '') setupCopyButton(customPostCard);
        setupDebugPanel(customPostCard, post.title);
    });
}

// --- 4. DIRTY CHECK SYSTEM ---
function detectUnsavedChanges() {
    if (!editModeActive) return false;
    return bioInputField.value !== bioTxtBox.textContent;
}

document.querySelectorAll('.sidebar a').forEach(anchorLink => {
    anchorLink.addEventListener('click', (event) => {
        if (detectUnsavedChanges()) {
            event.preventDefault(); 
            targetedRedirectUrl = anchorLink.getAttribute('href');
            dirtyWarningModal.classList.add('open'); 
        }
    });
});

document.getElementById('dirtyDiscardBtn').addEventListener('click', () => {
    dirtyWarningModal.classList.remove('open');
    window.location.href = targetedRedirectUrl; 
});

document.getElementById('dirtySaveBtn').addEventListener('click', () => {
    localStorage.setItem(BIO_STORAGE_KEY, bioInputField.value.trim());
    dirtyWarningModal.classList.remove('open');
    window.location.href = targetedRedirectUrl;
});

// --- 5. EDIT MODE TOGGLE ---
editProfileBtn.addEventListener('click', () => {
    editModeActive = !editModeActive;

    if (editModeActive) {
        editProfileBtn.innerHTML = `<i class='bx bx-check' style='color:#00ff88;'></i>`;
        editProfileBtn.style.borderColor = "#00ff88";
        bioInputField.value = bioTxtBox.textContent;
        bioTxtBox.style.display = 'none';
        bioInputField.style.display = 'block';
        pfpDivFrame.classList.add('edit-active');
    } else {
        editProfileBtn.innerHTML = `<i class='bx bx-pencil'></i>`;
        editProfileBtn.style.borderColor = "#2a2a30";
        bioTxtBox.textContent = bioInputField.value.trim();
        localStorage.setItem(BIO_STORAGE_KEY, bioTxtBox.textContent);
        bioTxtBox.style.display = 'block';
        bioInputField.style.display = 'none';
        pfpDivFrame.classList.remove('edit-active');
        window.location.reload();
    }
});

// --- 6. FILE CHIPS MANAGEMENT & SELECTION SYSTEM ---
pfpDivFrame.addEventListener('click', () => {
    if (!editModeActive) return; 
    if (!hasImageLoaded) {
        pfpFileLoader.click();
    } else {
        pfpOptionsModal.classList.add('open');
    }
});

pfpFileLoader.addEventListener('change', (e) => {
    const chosenImgFile = e.target.files[0];
    if (chosenImgFile) {
        const streamReader = new FileReader();
        streamReader.onload = function(evt) {
            cropperSourcePreview.src = evt.target.result;
            cropperModal.classList.add('open'); 
        };
        streamReader.readAsDataURL(chosenImgFile);
    }
});

document.getElementById('optCancelBtn').addEventListener('click', () => pfpOptionsModal.classList.remove('open'));
document.getElementById('optChangeBtn').addEventListener('click', () => {
    pfpOptionsModal.classList.remove('open');
    pfpFileLoader.click();
});
document.getElementById('optRemoveBtn').addEventListener('click', () => {
    pfpOptionsModal.classList.remove('open');
    pfpConfirmRemovalModal.classList.add('open');
});

document.getElementById('denyRemovalBtn').addEventListener('click', () => pfpConfirmRemovalModal.classList.remove('open'));
document.getElementById('assertRemovalBtn').addEventListener('click', () => {
    localStorage.removeItem(PFP_STORAGE_KEY);
    pfpConfirmRemovalModal.classList.remove('open');
    window.location.reload();
});

document.getElementById('cancelCropBtn').addEventListener('click', () => {
    cropperModal.classList.remove('open');
    pfpFileLoader.value = ""; 
});

document.getElementById('saveCropBtn').addEventListener('click', () => {
    localStorage.setItem(PFP_STORAGE_KEY, cropperSourcePreview.src);
    cropperModal.classList.remove('open');
    window.location.reload();
});

// --- 7. TAB CONTROL SWITCHES SYSTEM ---
document.querySelectorAll('.profile-tab-btn').forEach(tabButton => {
    tabButton.addEventListener('click', () => {
        document.querySelectorAll('.profile-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane-content').forEach(pane => pane.classList.remove('active'));

        tabButton.classList.add('active');
        const connectedPaneId = tabButton.getAttribute('data-target');
        document.getElementById(connectedPaneId).classList.add('active');
    });
});
