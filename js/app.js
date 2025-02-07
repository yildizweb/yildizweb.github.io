document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.getElementById("navLinks");
    const hamburgerIcon = document.getElementById("hamburgerIcon");
    const closeIcon = document.getElementById("closeIcon");

    function toggleMenu() {
        if (navLinks.classList.contains("menu-open")) {
            // Hide menu
            navLinks.classList.remove("menu-open");
            closeIcon.classList.remove("visible");
            hamburgerIcon.classList.add("visible");
        } else {
            // Show menu
            navLinks.classList.add("menu-open");
            closeIcon.classList.add("visible");
            hamburgerIcon.classList.remove("visible");
        }
    }

    // Attach toggleMenu to both hamburger and close icons
    hamburgerIcon.addEventListener("click", toggleMenu);
    closeIcon.addEventListener("click", toggleMenu);


});
