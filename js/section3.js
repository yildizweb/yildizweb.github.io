// Variables
let currentSlide = 0;
const images = document.querySelectorAll(".project-image img");
const modal = document.getElementById("carouselModal");
const modalImage = document.getElementById("carouselImage");

// Function to open the modal and display the clicked image
function openCarousel(index) {
    currentSlide = index;
    modalImage.src = images[currentSlide].src; // Set the modal image to the clicked image
    modal.style.display = "flex"; // Show the modal
}

// Function to close the modal
function closeCarousel() {
    modal.style.display = "none"; // Hide the modal
}

// Function to navigate between slides
function changeSlide(direction) {
    currentSlide = (currentSlide + direction + images.length) % images.length; // Handle wrapping
    modalImage.src = images[currentSlide].src; // Update the modal image
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
