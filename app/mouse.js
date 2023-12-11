// Right click event
var x, y;
document.body.addEventListener('contextmenu', function (e) {
    // When right clicked, show context menu
    // But if touched the border of body, fix the position of context menu to another side of the mouse
    // Touched right border: show context menu on the left side of the mouse;
    // Touched bottom border: show context menu on the top side of the mouse;
    // The context menu should be on the left bottom side of the mouse by default
    var menu = document.getElementById('contextMenu');
    menu.style.animation = 'none';
    x = e.clientX;
    y = e.clientY;
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (x + menu.offsetWidth > w) {
        x -= menu.offsetWidth;
    }
    if (y + menu.offsetHeight > h) {
        y -= menu.offsetHeight;
    }
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'block';
    menu.style.opacity = '1';
    // Solve the problem that the context menu shown as one up and one down
    // If the context menu is shown as one up and one down, change the position of the context menu
    // If the context menu is shown as one left and one right, do nothing
    if (menu.offsetTop + menu.offsetHeight > h) {
        menu.style.top = h - menu.offsetHeight + 'px';
    }
    if (menu.offsetLeft + menu.offsetWidth > w) {
        menu.style.left = w - menu.offsetWidth + 'px';
    }

    // Prevent default right click event
    e.preventDefault();
    // Add animation
    menu.style.animation = 'fadein 0.1s ease-in-out';
});
// Remove context menu
document.body.addEventListener('click', function (e) {
    // Remove context menu if clicked outside
    var menu = document.getElementById('contextMenu');
    if (e.target != menu) {
        menu.style.display = 'none';
        menu.style.opacity = '0';
        // Remove animation(fadein) to context menu with css (animation: fadein 0.3s ease-in-out;)
        menu.style.animation = 'none';
    }
});

document.body.addEventListener('dblclick', function (e) {
    // Fullscreen
    if (e.target.id === 'albumArt') {
        return;
    }
    fullscreenElectronApp();
});
