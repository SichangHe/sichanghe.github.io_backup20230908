var html = document.querySelector("html");
var themeToggleButton = document.getElementById("theme-toggle");
var themePopup = document.getElementById("theme-list");

function showThemes() {
    themePopup.style.display = "block";
    themeToggleButton.setAttribute("aria-expanded", true);
    themePopup.querySelector("button#" + get_theme()).focus();
}

function hideThemes() {
    themePopup.style.display = "none";
    themeToggleButton.setAttribute("aria-expanded", false);
    themeToggleButton.focus();
}

function get_theme() {
    var theme;
    try {
        theme = localStorage.getItem("mdbook-theme");
    } catch (e) { }
    if (theme === null || theme === undefined) {
        return default_theme;
    } else {
        return theme;
    }
}

function set_theme(theme, store = true) {
    var previousTheme = get_theme();

    if (store) {
        try {
            localStorage.setItem("mdbook-theme", theme);
        } catch (e) { }
    }

    html.classList.remove(previousTheme);
    html.classList.add(theme);
}

// Set theme
var theme = get_theme();

set_theme(theme, false);

themeToggleButton.addEventListener("click", function() {
    if (themePopup.style.display === "block") {
        hideThemes();
    } else {
        showThemes();
    }
});

themePopup.addEventListener("click", function(e) {
    var theme;
    if (e.target.className === "theme") {
        theme = e.target.id;
    } else if (e.target.parentElement.className === "theme") {
        theme = e.target.parentElement.id;
    } else {
        return;
    }
    set_theme(theme);
});

themePopup.addEventListener("focusout", function(e) {
    // e.relatedTarget is null in Safari and Firefox on macOS (see workaround below)
    if (
        !!e.relatedTarget &&
        !themeToggleButton.contains(e.relatedTarget) &&
        !themePopup.contains(e.relatedTarget)
    ) {
        hideThemes();
    }
});

// Should not be needed, but it works around an issue on macOS & iOS: https://github.com/rust-lang/mdBook/issues/628
document.addEventListener("click", function(e) {
    if (
        themePopup.style.display === "block" &&
        !themeToggleButton.contains(e.target) &&
        !themePopup.contains(e.target)
    ) {
        hideThemes();
    }
});

document.addEventListener("keydown", function(e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
    }
    if (!themePopup.contains(e.target)) {
        return;
    }

    switch (e.key) {
        case "Escape":
            e.preventDefault();
            hideThemes();
            break;
        case "ArrowUp":
            e.preventDefault();
            var li = document.activeElement.parentElement;
            if (li && li.previousElementSibling) {
                li.previousElementSibling
                    .querySelector("button")
                    .focus();
            }
            break;
        case "ArrowDown":
            e.preventDefault();
            var li = document.activeElement.parentElement;
            if (li && li.nextElementSibling) {
                li.nextElementSibling
                    .querySelector("button")
                    .focus();
            }
            break;
        case "Home":
            e.preventDefault();
            themePopup
                .querySelector("li:first-child button")
                .focus();
            break;
        case "End":
            e.preventDefault();
            themePopup
                .querySelector("li:last-child button")
                .focus();
            break;
    }
});
