'use strict';

/**
 * Custom title bar for frameless window.
 *
 * Provides pin / minimize / maximize-restore / close controls that
 * call the Eagle window API, and wires up double-click-to-maximize
 * on the drag region (standard Windows behaviour).
 */
function createTitlebar() {
    var controls = document.getElementById('titlebarControls');

    if (!controls) {
        return {};
    }

    var pinBtn       = controls.querySelector('[data-titlebar="pin"]');
    var minimizeBtn  = controls.querySelector('[data-titlebar="minimize"]');
    var maximizeBtn  = controls.querySelector('[data-titlebar="maximize"]');
    var closeBtn     = controls.querySelector('[data-titlebar="close"]');
    var iconMaximize = maximizeBtn.querySelector('.titlebar-icon-maximize');
    var iconRestore  = maximizeBtn.querySelector('.titlebar-icon-restore');
    var header       = document.querySelector('.header');

    /* ── Maximize state ── */

    function syncMaximizeState() {
        eagle.window.isMaximized().then(function (isMaximized) {
            iconMaximize.style.display = isMaximized ? 'none' : '';
            iconRestore.style.display  = isMaximized ? '' : 'none';
            maximizeBtn.title          = isMaximized ? 'Restore' : 'Maximize';
        });
    }

    function toggleMaximize() {
        eagle.window.isMaximized().then(function (isMaximized) {
            var action = isMaximized
                ? eagle.window.unmaximize()
                : eagle.window.maximize();

            action.then(syncMaximizeState);
        });
    }

    /* ── Pin (always on top) ── */

    function togglePin() {
        eagle.window.isAlwaysOnTop().then(function (isPinned) {
            eagle.window.setAlwaysOnTop(!isPinned).then(function () {
                pinBtn.classList.toggle('pinned', !isPinned);
                pinBtn.title = !isPinned ? 'Unpin from top' : 'Pin on top';
            });
        });
    }

    /* ── Button handlers ── */

    pinBtn.addEventListener('click', function () {
        togglePin();
    });

    minimizeBtn.addEventListener('click', function () {
        eagle.window.minimize();
    });

    maximizeBtn.addEventListener('click', function () {
        toggleMaximize();
    });

    closeBtn.addEventListener('click', function () {
        window.close();
    });

    /* ── Double-click drag region to toggle maximize ── */

    if (header) {
        header.addEventListener('dblclick', function (e) {
            if (e.target.closest('.titlebar-controls')) {
                return;
            }

            toggleMaximize();
        });
    }

    /* ── Track OS-level maximize / restore (e.g. Win+Up) ── */

    window.addEventListener('resize', syncMaximizeState);

    /* ── Initial state ── */

    syncMaximizeState();

    return { syncMaximizeState: syncMaximizeState };
}

module.exports = { createTitlebar: createTitlebar };
