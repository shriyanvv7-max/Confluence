export function initEventCountdown(): void {
  const root = document.querySelector<HTMLElement>('[data-event-countdown]');
  if (!root) return;

  const startAt = Date.parse(root.dataset.startAt ?? '');
  const endAt = Date.parse(root.dataset.endAt ?? '');
  const state = root.querySelector<HTMLElement>('[data-countdown-state]');
  const units = root.querySelector<HTMLElement>('[data-countdown-units]');
  const days = root.querySelector<HTMLElement>('[data-countdown-days]');
  const hours = root.querySelector<HTMLElement>('[data-countdown-hours]');
  const minutes = root.querySelector<HTMLElement>('[data-countdown-minutes]');
  const seconds = root.querySelector<HTMLElement>('[data-countdown-seconds]');

  if (!Number.isFinite(startAt) || !Number.isFinite(endAt) || !state || !units || !days || !hours || !minutes || !seconds) return;

  let timer = 0;
  let previousState = '';
  const update = (): void => {
    const now = Date.now();

    if (now >= endAt) {
      if (previousState !== 'concluded') state.textContent = 'Event concluded';
      previousState = 'concluded';
      units.hidden = true;
      window.clearInterval(timer);
      return;
    }

    if (now >= startAt) {
      if (previousState !== 'started') state.textContent = 'The buildathon has started';
      previousState = 'started';
      units.hidden = true;
      return;
    }

    const remaining = startAt - now;
    const totalSeconds = Math.floor(remaining / 1000);
    if (previousState !== 'countdown') state.textContent = 'Countdown to start';
    previousState = 'countdown';
    units.hidden = false;
    days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, '0');
    hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0');
    minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    seconds.textContent = String(totalSeconds % 60).padStart(2, '0');
  };

  update();
  if (Date.now() < endAt) timer = window.setInterval(update, 1000);
  window.addEventListener('pagehide', () => window.clearInterval(timer), { once: true });
}
