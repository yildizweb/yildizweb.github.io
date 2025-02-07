const tabs = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".project-image-container");

tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
        // Remove 'active' class from all tabs and hide all containers
        tabs.forEach((t) => t.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active-tab"));

        // Add 'active' class to the clicked tab and its corresponding container
        const target = tab.getAttribute("data-tab");
        tab.classList.add("active");
        document.getElementById(target).classList.add("active-tab");
    });
});



// Variables
let currentSlide = 0;
const imageList = document.querySelectorAll(".project-image img");
const modal = document.getElementById("carouselModal");
const modalImage = document.getElementById("carouselImage");

// Function to open the modal and display the clicked image
function openCarousel(index) {
    currentSlide = index;
    modalImage.src = imageList[currentSlide].src; // Set the modal image to the clicked image
    modal.style.display = "flex"; // Show the modal
}

// Function to close the modal
function closeCarousel() {
    modal.style.display = "none"; // Hide the modal
}

// Function to navigate between slides
function changeSlide(direction) {
    currentSlide = (currentSlide + direction + imageList.length) % imageList.length; // Handle wrapping
    modalImage.src = imageList[currentSlide].src; // Update the modal image
}

// Expose functions to the global scope (important for inline event handlers)
window.openCarousel = openCarousel;
window.closeCarousel = closeCarousel;
window.changeSlide = changeSlide;

// Optional: Close modal when clicking outside the image
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeCarousel();
    }
});
