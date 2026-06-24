// 1. Tell the browser to find all the upvote buttons on the page
const upvoteButtons = document.querySelectorAll('.upvote-btn');

// 2. Loop through each button so they all listen for clicks individually
upvoteButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Find the specific number tracker inside the clicked button
        const countSpan = button.querySelector('.upvote-count');
        // Convert the text (like "0") into a real code number
        let currentCount = parseInt(countSpan.textContent);
        
        // Check if the user has already clicked this button
        if (button.classList.contains('active')) {
            // If already active, undo the upvote
            button.classList.remove('active');
            currentCount--;
            button.style.backgroundColor = "#1a1a1e"; // Reset back to dark grey
            button.style.color = "#8e8e93";
        } else {
            // If not active, add the upvote and turn it blue!
            button.classList.add('active');
            currentCount++;
            button.style.backgroundColor = "#0077ff"; // Change background to blue
            button.style.color = "#ffffff"; // Change text/icon to white
        }
        
        // Send the updated number back to the HTML screen
        countSpan.textContent = currentCount;
    });
});
