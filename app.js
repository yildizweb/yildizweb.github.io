document.addEventListener("DOMContentLoaded", function() {
    var navLinks = document.getElementById("navLinks");
    
    // Define the showMenu function
    function showMenu() {
        navLinks.style.right = "0";
    }

    // Define the hideMenu function
    function hideMenu() {
        navLinks.style.right = "-200px";
    }

    // Attach the functions to the global window object
    window.showMenu = showMenu;
    window.hideMenu = hideMenu;
});
