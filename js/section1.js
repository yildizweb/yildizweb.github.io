// Select the images and the text container
const images = document.querySelectorAll('.hero-container img');
const textContainer = document.querySelector('.dynamic-text .hero-text');

// Array of texts corresponding to each image
const texts = [
    'Ihr Partner für Glasfaser und Hausanschlüsse.',
    'Kabelverlängerungen\nfür jede Anwendung.',
    'Individuelle Lösungen für MVT-Schränke.',
    'Hochwertige MFG-Schränke für Ihre Projekte.',
    'Innovative Lösungen für Schächte und Verlegung.',
    'Experten für Garten- und Landschaftsbau.',
];

// Initialize the current index
let currentIndex = 0;

// Function to animate the images and update the text
function animateImages() {
    // Remove 'animate' class from all images
    images.forEach((img) => img.classList.remove('animate'));

    // Add 'animate' class to the current image
    images[currentIndex].classList.add('animate');

    // Update the dynamic text
    textContainer.textContent = texts[currentIndex];

    // Move to the next image (loop back to the first image if at the end)
    currentIndex = (currentIndex + 1) % images.length;

    // Call this function recursively after 2 seconds
    setTimeout(animateImages, 2000);
}

// Start the animation loop when the page loads
document.addEventListener('DOMContentLoaded', () => {
    animateImages();
});
