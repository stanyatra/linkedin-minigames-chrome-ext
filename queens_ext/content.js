(function () {

    if (window.queensLoaded) {
        return;
    }

    window.queensLoaded = true;

    const cells = document.querySelectorAll("div[data-cell-index]");

    alert("Cells found: " + cells.length);

})();