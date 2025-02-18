document.addEventListener("DOMContentLoaded", function () {
    // Tab Navigation
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

            // Update the carousel image list based on the active tab
            updateCarouselImages(target);
        });
    });

    // Modal Carousel
    let currentSlide = 0;
    let activeImages = [];
    const modal = document.getElementById("carouselModal");
    const modalImage = document.getElementById("carouselImage");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    // Function to Update Active Carousel Images
    function updateCarouselImages(activeTab) {
        activeImages = Array.from(document.querySelector(`#${activeTab}`).querySelectorAll(".project-image img"));

        // Add click events to images inside active tab
        activeImages.forEach((img, index) => {
            img.onclick = function () {
                openCarousel(index);
            };
        });
    }

    // Function to Open Carousel
    function openCarousel(index) {
        if (activeImages.length === 0) return;
        currentSlide = index;
        modalImage.src = activeImages[currentSlide].src;
        modal.style.display = "flex";
    }

    // Function to Close Carousel
    function closeCarousel() {
        modal.style.display = "none";
    }

    // Function to Change Slide
    function changeSlide(direction) {
        if (activeImages.length === 0) return;
        currentSlide = (currentSlide + direction + activeImages.length) % activeImages.length;
        modalImage.src = activeImages[currentSlide].src;
    }

    // Event Listeners
    closeBtn.addEventListener("click", closeCarousel);
    prevBtn.addEventListener("click", () => changeSlide(-1));
    nextBtn.addEventListener("click", () => changeSlide(1));

    // Close Modal When Clicking Outside the Image
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeCarousel();
        }
    });

    // Keyboard Navigation for Carousel
    document.addEventListener("keydown", function (event) {
        if (modal.style.display === "flex") {
            if (event.key === "ArrowLeft") {
                changeSlide(-1); // Left arrow key
            } else if (event.key === "ArrowRight") {
                changeSlide(1); // Right arrow key
            } else if (event.key === "Escape") {
                closeCarousel(); // Escape key
            }
        }
    });

    // Initialize carousel with default active tab images
    updateCarouselImages(document.querySelector(".tab-button.active").getAttribute("data-tab"));

    // Expose functions globally
    window.openCarousel = openCarousel;
    window.closeCarousel = closeCarousel;
    window.changeSlide = changeSlide;
});
