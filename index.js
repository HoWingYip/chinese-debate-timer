window.addEventListener("load", () => {
  restoreTimers();

  // if timer names or durations change, save them
  for (const timerInput of document.querySelectorAll("input[type='text']")) {
    timerInput.addEventListener("input", () => {
      saveTimers();
    });
  }
});

document.getElementById("ring-bell").addEventListener("click", () => {
  playBellSound();
});
