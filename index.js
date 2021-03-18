document.querySelectorAll(".timer .timer-input-wrapper").forEach((timerInputWrapper) => {
  const durationInputMinutes = timerInputWrapper
      .getElementsByClassName("time-remaining-minutes")[0];
  const durationInputSeconds = timerInputWrapper
      .getElementsByClassName("time-remaining-seconds")[0];

  timerInputWrapper.addEventListener("focusout", () => {
    let timerDurationMinutes;
    let timerDurationSeconds;
    try {
      timerDurationMinutes = BigInt(durationInputMinutes.value);
      timerDurationSeconds = BigInt(durationInputSeconds.value);
    } catch {
      timerDurationMinutes = 0n;
      timerDurationSeconds = 0n;
    }

    const totalTimerDuration = timerDurationMinutes * 60n + timerDurationSeconds;
    timerInputWrapper.parentNode.dataset.duration = totalTimerDuration;
    durationInputMinutes.value = String(totalTimerDuration / 60n).padStart(2, "0");
    durationInputSeconds.value = String(totalTimerDuration % 60n).padStart(2, "0");
    // changing value via JS doesn't trigger oninput, so manually change input width
    durationInputMinutes.style.width = `${durationInputMinutes.value.length}ch`;
    durationInputSeconds.style.width = `${durationInputSeconds.value.length}ch`;
  });
});

document.querySelectorAll(".timer input").forEach((timerInput) => {
  timerInput.addEventListener("keypress", (event) => {
    if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
      event.preventDefault();
    }
  });

  timerInput.addEventListener("input", () => {
    timerInput.style.transition = "border-bottom-color 0.2s";
    if (timerInput.value === "") {
      timerInput.style.width = "2em";  
    } else {
      timerInput.style.width = `${timerInput.value.length}ch`;
    }
    setTimeout(() => {
      timerInput.style.transition = "width 0.2s, border-bottom-color 0.2s";
    }, 0);
  });
});

[...document.getElementsByClassName("timer")].forEach((timerElem) => {
  timerElem.getElementsByClassName("start-stop-timer")[0]
      .addEventListener("click", (event) => {
        const durationInputMinutes = timerElem
            .getElementsByClassName("time-remaining-minutes")[0];
        const durationInputSeconds = timerElem
            .getElementsByClassName("time-remaining-seconds")[0];

        if (timerElem.dataset.paused === "true") {
          // START COUNTING DOWN

          timerElem.classList.add("timer-running");
          durationInputMinutes.readOnly = true;
          durationInputSeconds.readOnly = true;
          event.target.textContent = "Pause";
          timerElem.dataset.paused = "false";
        } else {
          // STOP COUNTING DOWN

          timerElem.classList.remove("timer-running");
          durationInputMinutes.readOnly = false;
          durationInputSeconds.readOnly = false;
          event.target.textContent = "Start";
          timerElem.dataset.paused = "true";
        }
      });
})
