/**
 * Launches a burst of confetti particles from a given DOM element.
 *
 * Pure vanilla JS + CSS — no external dependencies.
 * Automatically respects prefers-reduced-motion by skipping the animation.
 *
 * @param {HTMLElement} originEl  The element to burst confetti from (its center is used)
 * @param {object}      options
 * @param {number}      options.count    Number of particles (default 18)
 * @param {string[]}    options.colors   Array of hex/css colors
 */
export function launchConfetti(originEl, { count = 18, colors } = {}) {
  // Respect user motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const palette = colors ?? [
    '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#a855f7',
    '#ec4899', '#ffffff',
  ];

  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2 + window.scrollY;

  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: visible;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    const color = palette[Math.floor(Math.random() * palette.length)];
    const angle = (360 / count) * i + Math.random() * 20 - 10;
    const distance = 40 + Math.random() * 50; // px
    const size = 5 + Math.random() * 5;       // px
    const duration = 500 + Math.random() * 300; // ms
    const shape = Math.random() > 0.5 ? '50%' : '2px'; // circle or rect

    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance;

    particle.style.cssText = `
      position: absolute;
      left: ${cx}px;
      top: ${cy}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape};
      transform: translate(-50%, -50%);
      animation: confetti-fly ${duration}ms ease-out forwards;
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;
    container.appendChild(particle);
  }

  // Inject keyframes once
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fly {
        0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.3) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Clean up after animation
  setTimeout(() => container.remove(), 900);
}
