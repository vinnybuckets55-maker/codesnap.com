// --- 1. STATE CONFIGURATION FIELDS ---
let editModeActive = false;
let hasImageLoaded = false;
let targetedRedirectUrl = ""; 

// Permanent Storage Key Tags
const BIO_STORAGE_KEY = "codesnap_user_bio";
const PFP_STORAGE_KEY = "codesnap_user_pfp";

// DOM Selector Registry
const editProfileBtn = document.getElementById('editProfileBtn');
const bioTxtBox = document.getElementById('bioTxtBox');
const bioInputField = document.getElementById('bioInputField');
const pfpDivFrame = document.getElementById('pfpDivFrame');
const pfpFileLoader = document.getElementById('pfpFileLoader');
const userPfpDisplay = document.getElementById('userPfpDisplay');
const pfpPlaceholderImg = document.getElementById('pfpPlaceholderImg');

// Modal Overlays Registry
const cropperModal = document.getElementById('cropperModal');
const cropperSourcePreview = document.getElementById('cropperSourcePreview');
const pfpOptionsModal = document.getElementById('pfpOptionsModal');
const pfpConfirmRemovalModal = document.getElementById('pfpConfirmRemovalModal');
const dirtyWarningModal = document.getElementById('dirtyWarningModal');

// --- 2. RETRIEVE RECOVERY RETENTION SEED DATA ---
window.addEventListener('DOMContentLoaded', () => {
    const savedBio = localStorage.getItem(BIO_STORAGE_KEY);
    if (savedBio) bioTxtBox.textContent = savedBio;

    const savedPfp = localStorage.getItem(PFP_STORAGE_KEY);
    if (savedPfp) {
        userPfpDisplay.src = savedPfp;
        userPfpDisplay.style.display = 'block';
        pfpPlaceholderImg.style.display = 'none';
        hasImageLoaded = true;
    }
});

// Helper check function to find changes
function detectUnsavedChanges() {
    if (!editModeActive) return false;
    const currentTextInInput = bioInputField.value;
    const stableTextInBox = bioTxtBox.textContent;
    return currentTextInInput !== stableTextInBox;
}

// --- 3. DIRTY CHECK BAR NAVIGATION EXCLUSIONS SYSTEM ---
document.querySelectorAll('.sidebar a').forEach(anchorLink => {
    anchorLink.addEventListener('click', (event) => {
        if (detectUnsavedChanges()) {
            event.preventDefault(); // Halt page load transition jump!
            targetedRedirectUrl = anchorLink.getAttribute('href');
            dirtyWarningModal.classList.add('open'); // Raise warning panel card!
        }
    });
});

// Handle Warning Dialog Options
document.getElementById('dirtyDiscardBtn').addEventListener('click', () => {
    dirtyWarningModal.classList.remove('open');
    window.location.href = targetedRedirectUrl; // Continue redirect routing jump
});

document.getElementById('dirtySaveBtn').addEventListener('click', () => {
    localStorage.setItem(BIO_STORAGE_KEY, bioInputField.value.trim());
    dirtyWarningModal.classList.remove('open');
    window.location.href = targetedRedirectUrl;
});


// --- 4. TOGGLE ACTION RUNNERS FOR WORKSPACE EDIT ---
editProfileBtn.addEventListener('click', () => {
    editModeActive = !editModeActive;

    if (editModeActive) {
        // Switch into Edit Mode
        editProfileBtn.innerHTML = `<i class='bx bx-check' style='color:#00ff88;'></i>`;
        editProfileBtn.style.borderColor = "#00ff88";
        
        bioInputField.value = bioTxtBox.textContent;
        bioTxtBox.style.display = 'none';
        bioInputField.style.display = 'block';
        pfpDivFrame.classList.add('edit-active');
    } else {
        // Save and Commit Changes
        editProfileBtn.innerHTML = `<i class='bx bx-pencil'></i>`;
        editProfileBtn.style.borderColor = "#2a2a30";
        
        bioTxtBox.textContent = bioInputField.value.trim();
        localStorage.setItem(BIO_STORAGE_KEY, bioTxtBox.textContent);
        
        bioTxtBox.style.display = 'block';
        bioInputField.style.display = 'none';
        pfpDivFrame.classList.remove('edit-active');
    }
});


// --- 5. FILE SYSTEM LOADER STREAM & WORKSPACE CROP MATRIX ---
pfpDivFrame.addEventListener('click', () => {
    if (!editModeActive) return; // Ignore if edit mode isn't open

    if (!hasImageLoaded) {
        // Scenario 1: Empty Placeholder -> Fire File Explorer Explorer Directly
        pfpFileLoader.click();
    } else {
        // Scenario 2: Active image loaded -> Open intermediate management pop panel
        pfpOptionsModal.classList.add('open');
    }
});

// Capture image loaded from file explorer disk row array
pfpFileLoader.addEventListener('change', (e) => {
    const chosenImgFile = e.target.files[0];
    if (chosenImgFile) {
        const streamReader = new FileReader();
        streamReader.onload = function(evt) {
            cropperSourcePreview.src = evt.target.result;
            cropperModal.classList.add('open'); // Launch cropping bounding window
        };
        streamReader.readAsText;
        streamReader.readAsDataURL(chosenImgFile);
    }
});

// Intermediate Modal Choices Handling
document.getElementById('optCancelBtn').addEventListener('click', () => pfpOptionsModal.classList.remove('open'));
document.getElementById('optChangeBtn').addEventListener('click', () => {
    pfpOptionsModal.classList.remove('open');
    pfpFileLoader.click();
});
document.getElementById('optRemoveBtn').addEventListener('click', () => {
    pfpOptionsModal.classList.remove('open');
    pfpConfirmRemovalModal.classList.add('open');
});

// Destructive Action Affirmation Assertions Execution
document.getElementById('denyRemovalBtn').addEventListener('click', () => pfpConfirmRemovalModal.classList.remove('open'));
document.getElementById('assertRemovalBtn').addEventListener('click', () => {
    localStorage.removeItem(PFP_STORAGE_KEY);
    userPfpDisplay.src = "";
    userPfpDisplay.style.display = 'none';
    pfpPlaceholderImg.style.display = 'block';
    hasImageLoaded = false;
    pfpConfirmRemovalModal.classList.remove('open');
});

// Crop Frame Termination Commits Handling
document.getElementById('cancelCropBtn').addEventListener('click', () => {
    cropperModal.classList.remove('open');
    pfpFileLoader.value = ""; // Clear file registry string cache memory
});

document.getElementById('saveCropBtn').addEventListener('click', () => {
    const rawCroppedStringUrl = cropperSourcePreview.src;
    localStorage.setItem(PFP_STORAGE_KEY, rawCroppedStringUrl);
    
    userPfpDisplay.src = rawCroppedStringUrl;
    userPfpDisplay.style.display = 'block';
    pfpPlaceholderImg.style.display = 'none';
    hasImageLoaded = true;
    
    cropperModal.classList.remove('open');
});


// --- 6. EXPANDABLE SECTION SUB-TAB CONTROLLERS ---
document.querySelectorAll('.profile-tab-btn').forEach(tabButton => {
    tabButton.addEventListener('click', () => {
        document.querySelectorAll('.profile-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane-content').forEach(pane => pane.classList.remove('active'));

        tabButton.classList.add('active');
        const connectedPaneId = tabButton.getAttribute('data-target');
        document.getElementById(connectedPaneId).classList.add('active');
    });
});
