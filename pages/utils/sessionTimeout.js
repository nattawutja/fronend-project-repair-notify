
export function setupSessionTimeout(onTimeout, timeoutMs = 5 * 60 * 1000) {
  let timeoutId;

  function startTimer() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      onTimeout(); // เรียกฟังก์ชัน logout
    }, timeoutMs);
  }

  function resetTimer() {
    startTimer();
  }

  function init() {
    startTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);
  }

  function cleanup() {
    if (timeoutId) clearTimeout(timeoutId);
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("keydown", resetTimer);
    window.removeEventListener("scroll", resetTimer);
    window.removeEventListener("click", resetTimer);
  }

  return { init, cleanup };
}
