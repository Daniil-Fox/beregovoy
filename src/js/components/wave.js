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
    return (cursorProgress - 0.2) * maxShiftPx * 2;
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

  const applyWaveTransform = (clientX) => {
    visible.forEach((el) => {
      const shift = computeShiftFromClientX(el, clientX);
      el.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`;
    });
  };

  const resetWaveTransform = () => {
    waves.forEach((el) => {
      el.style.transform = "";
    });
  };

  const onPointerMove = throttle((e) => {
    if (window.innerWidth <= 600) return;
    if (visible.size === 0) return;
    applyWaveTransform(e.clientX);
  }, 16); // ~60fps max

  // Initialize from element centers
  const initializeWaves = () => {
    if (window.innerWidth <= 600) {
      resetWaveTransform();
      return;
    }
    const documentWidth = Math.max(
      1,
      window.innerWidth || document.documentElement.clientWidth
    );
    const centerX = documentWidth / 2;
    applyWaveTransform(centerX);
  };

  initializeWaves();

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("resize", () => {
    const documentWidth = Math.max(
      1,
      window.innerWidth || document.documentElement.clientWidth
    );
    const centerX = documentWidth;
    waves.forEach((el) => {
      const shift = computeShiftFromClientX(el, centerX);
      el.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`;
    });
  });
})();
