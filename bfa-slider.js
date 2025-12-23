'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('before-after-slider');
    if (!slider) return; // page doesn't have the slider → do nothing (fixes offsetWidth null)

    const before = document.getElementById('before-image');
    const resizer = document.getElementById('resizer');
    const beforeImage = before?.getElementsByTagName('img')[0];

    // If any required element is missing, exit cleanly (prevents addEventListener undefined)
    if (!before || !beforeImage || !resizer) return;

    // --- your original implementation starts here (unchanged) ---

    // Example of minimal best-practice tweaks that don't alter behavior:
    const setWidth = () => {
        // safe because slider exists
        beforeImage.style.width = slider.offsetWidth + 'px';
    };
    setWidth();

    // passive listeners where we don't call preventDefault
    window.addEventListener('resize', setWidth, { passive: true });

    resizer.addEventListener('mousedown', () => {
        active = true;
        resizer.classList.add('resize');
    }, { passive: true });

    document.body.addEventListener('mouseup', () => {
        active = false;
        resizer.classList.remove('resize');
    }, { passive: true });

    document.body.addEventListener('mousemove', (e) => {
        if (!active) return;
        slideIt(e.pageX);
    }, { passive: true });

    resizer.addEventListener('touchstart', () => {
        active = true;
        resizer.classList.add('resize');
    }, { passive: true });

    document.body.addEventListener('touchend', () => {
        active = false;
        resizer.classList.remove('resize');
    }, { passive: true });

    document.body.addEventListener('touchmove', (e) => {
        if (!active) return;
        const t = e.changedTouches?.[0];
        if (!t) return;
        slideIt(t.pageX);
    }, { passive: true });

    // keep your existing slideIt/active vars exactly as you had them
    function slideIt(x) {
        const rect = slider.getBoundingClientRect();
        const pos = Math.max(0, Math.min(x - rect.left, slider.offsetWidth));
        before.style.width = pos + 'px';
        resizer.style.left = pos + 'px';
    }

    let active = false;
});
