'use strict';

const { animate, stagger, spring } = require('motion');

/* ─── Easing presets ─── */

const EASING = {
    smooth: [0.22, 1, 0.36, 1],
    out: [0, 0, 0.2, 1],
    springGentle: spring({ stiffness: 180, damping: 22 }),
    springSnappy: spring({ stiffness: 320, damping: 24 }),
    springSlide: spring({ stiffness: 220, damping: 28 }),
};

/* ─── Duration presets (seconds) ─── */

const DURATION = {
    fast: 0.12,
    normal: 0.28,
    slow: 0.4,
};

/* ─── Helpers ─── */

function resetStyle(element) {
    element.style.opacity = '';
    element.style.transform = '';
}

/* ─── Reusable animations ─── */

function fadeIn(target, options) {
    const opts = options || {};
    const y = opts.y != null ? opts.y : 10;
    const duration = opts.duration || DURATION.normal;

    return animate(
        target,
        { opacity: [0, 1], transform: ['translateY(' + y + 'px)', 'translateY(0px)'] },
        { duration: duration, easing: EASING.smooth }
    );
}

function fadeOut(target, options) {
    const opts = options || {};
    const y = opts.y != null ? opts.y : -4;
    const duration = opts.duration || DURATION.fast;

    return animate(
        target,
        { opacity: [1, 0], transform: ['translateY(0px)', 'translateY(' + y + 'px)'] },
        { duration: duration, easing: EASING.out }
    );
}

function staggerIn(target, options) {
    const opts = options || {};
    const y = opts.y != null ? opts.y : 10;
    const interval = opts.interval || 0.04;
    const duration = opts.duration || DURATION.normal;

    return animate(
        target,
        { opacity: [0, 1], transform: ['translateY(' + y + 'px)', 'translateY(0px)'] },
        { duration: duration, delay: stagger(interval), easing: EASING.smooth }
    );
}

function springPop(target, options) {
    const opts = options || {};
    const from = opts.from != null ? opts.from : 0.93;

    return animate(
        target,
        { transform: ['scale(' + from + ')', 'scale(1)'] },
        { easing: EASING.springSnappy }
    );
}

/**
 * Subtle elastic slide — Vercel-style smooth glide with gentle width pulse.
 * The indicator stretches slightly mid-transit, then settles with soft spring.
 */
function elasticSlide(target, fromX, fromW, toX, toW) {
    const fX = Math.round(fromX);
    const fW = Math.round(fromW);
    const tX = Math.round(toX);
    const tW = Math.round(toW);

    animate(
        target,
        { transform: ['translateX(' + fX + 'px)', 'translateX(' + tX + 'px)'] },
        { easing: EASING.springSlide }
    );

    animate(
        target,
        { width: [fW + 'px', tW + 'px'] },
        { easing: EASING.springSlide }
    );
}

function setTheme(providerId) {
    document.body.dataset.provider = providerId;
}

module.exports = {
    DURATION,
    EASING,
    animate,
    elasticSlide,
    fadeIn,
    fadeOut,
    resetStyle,
    setTheme,
    springPop,
    stagger,
    staggerIn,
};
