(() => {
  const waves = Array.from(document.querySelectorAll(".wave"));
  if (!waves.length) return;

  // lightweight throttle (no external deps)
  const throttle = (fn, delay = 16) => {
    let last = 0;
    let pendingArgs = null;
    let timeoutId = null;
    const invoke = (ctx, args) => {
      last = Date.now();
      fn.apply(ctx, args);
    };
    return function throttled(...args) {
      const now = Date.now();
      const remaining = delay - (now - last);
      pendingArgs = args;
      if (remaining <= 0) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        invoke(this, pendingArgs);
        pendingArgs = null;
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          timeoutId = null;
          invoke(this, pendingArgs);
          pendingArgs = null;
        }, remaining);
      }
    };
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const computeShiftFromClientX = (el, clientX) => {
    const rect = el.getBoundingClientRect();
    const elementWidth = Math.max(1, rect.width);
    const documentWidth = Math.max(
      1,
      window.innerWidth || document.documentElement.clientWidth
    );

    // Cursor position across full document (0..1)
    const cursorProgress = clamp(clientX, 0, documentWidth) / documentWidth;

    // Maximum shift is element width (edge to edge)
    const maxShiftPx = elementWidth;

    // Map cursor progress to element shift (-maxShiftPx/2 to +maxShiftPx/2)
    return (cursorProgress - 0.2) * maxShiftPx;
  };

  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.add(entry.target);
        } else {
          visible.delete(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  waves.forEach((el) => io.observe(el));

  const onPointerMove = throttle((e) => {
    if (visible.size === 0) return;
    visible.forEach((el) => {
      const shift = computeShiftFromClientX(el, e.clientX);
      el.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`;
    });
  }, 16); // ~60fps max

  // Initialize from element centers
  (() => {
    const documentWidth = Math.max(
      1,
      window.innerWidth || document.documentElement.clientWidth
    );
    const centerX = documentWidth / 2;
    waves.forEach((el) => {
      const shift = computeShiftFromClientX(el, centerX);
      el.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`;
    });
  })();

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("resize", () => {
    const documentWidth = Math.max(
      1,
      window.innerWidth || document.documentElement.clientWidth
    );
    const centerX = documentWidth / 2;
    waves.forEach((el) => {
      const shift = computeShiftFromClientX(el, centerX);
      el.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`;
    });
  });
})();
