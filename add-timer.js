const timerSectionsDiv = document.getElementById("timer-sections");
const addNormalTimerButton = document.getElementById("add-normal-timer");
const addChessClockTimerButton = document.getElementById("add-chess-clock-timer");

const addNormalTimer = (timer = { leftTimer: {}, rightTimer: {} }) => {
  const { leftTimer, rightTimer } = timer;
  const numExistingTimerSections = timerSectionsDiv.children.length;

  // TODO: extract to helper function
  const leftTimerName = leftTimer.name ||
    `Section ${numExistingTimerSections + 1} Timer 1`;
  const leftTimerDuration = leftTimer.durationStr ? BigInt(leftTimer.durationStr) : 0n;
  const leftTimerMinutes = leftTimerDuration / 60n;
  const leftTimerSeconds = leftTimerDuration % 60n;
  const leftTimerMinutesStr = String(leftTimerMinutes);
  const leftTimerSecondsStr = String(leftTimerSeconds).padStart(2, "0");

  const rightTimerName = rightTimer.name ||
    `Section ${numExistingTimerSections + 1} Timer 2`;
  const rightTimerDuration = rightTimer.durationStr ? BigInt(rightTimer.durationStr) : 0n;
  const rightTimerMinutes = rightTimerDuration / 60n;
  const rightTimerSeconds = rightTimerDuration % 60n;
  const rightTimerMinutesStr = String(rightTimerMinutes);
  const rightTimerSecondsStr = String(rightTimerSeconds).padStart(2, "0");

  timerSectionsDiv.insertAdjacentHTML(
    "beforeend",
    `<div class="normal-timer">
      <div class="timer-left">
        <input type="text" class="timer-name" value="${leftTimerName}">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="${leftTimerMinutesStr}">m
            <input type="text" class="time-remaining-seconds" value="${leftTimerSecondsStr}">s
          </div>
          <button class="start-stop-timer"></button>
        </div>
      </div>

      <div class="timer-separator"></div>
      <div class="timer-right">
        <input type="text" class="timer-name" value="${rightTimerName}">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="${rightTimerMinutesStr}">m
            <input type="text" class="time-remaining-seconds" value="${rightTimerSecondsStr}">s
          </div>
          <button class="start-stop-timer"></button>
        </div>
      </div>
      <div class="delete-button-container">
        <button class="delete"></button>
      </div>
    </div>`,
  );

  const addedTimerSection = timerSectionsDiv.children[timerSectionsDiv
    .children.length - 1];

  addDeleteButtonListener(addedTimerSection);
  for (const timerElem of addedTimerSection.getElementsByClassName("timer")) {
    addTimerEventListeners(timerElem);
  }
};

const addChessClockTimer = (timer = { leftTimer: {}, rightTimer: {} }) => {
  const { leftTimer, rightTimer } = timer;
  const numExistingTimerSections = timerSectionsDiv.children.length;

  const chessTimerName = timer.name ||
    `Chess Clock ${numExistingTimerSections + 1}`;

  // TODO: extract to helper function
  const leftTimerDuration = leftTimer.durationStr ? BigInt(leftTimer.durationStr) : 0n;
  const leftTimerMinutes = leftTimerDuration / 60n;
  const leftTimerSeconds = leftTimerDuration % 60n;
  const leftTimerMinutesStr = String(leftTimerMinutes);
  const leftTimerSecondsStr = String(leftTimerSeconds).padStart(2, "0");

  const rightTimerDuration = rightTimer.durationStr ? BigInt(rightTimer.durationStr) : 0n;
  const rightTimerMinutes = rightTimerDuration / 60n;
  const rightTimerSeconds = rightTimerDuration % 60n;
  const rightTimerMinutesStr = String(rightTimerMinutes);
  const rightTimerSecondsStr = String(rightTimerSeconds).padStart(2, "0");

  timerSectionsDiv.insertAdjacentHTML(
    "beforeend",
    `<div class="chess-timer">
    <input type="text" class="timer-name" value="${chessTimerName}">

    <div class= "chess-timer-internal-container">
      <div class="chess-timer-left-${numExistingTimerSections + 1} timer-left">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="${leftTimerMinutesStr}">m
            <input type="text" class="time-remaining-seconds" value="${leftTimerSecondsStr}">s
          </div>
          <button class="start-stop-timer"></button>
        </div>
      </div>
  
      <div class="timer-separator"></div>
      <div class="chess-timer-right-${numExistingTimerSections + 1} timer-right">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="${rightTimerMinutesStr}">m
            <input type="text" class="time-remaining-seconds" value="${rightTimerSecondsStr}">s
          </div>
          <button class="start-stop-timer"></button>
        </div>
      </div>
    </div>

    <div class="button-panel">
      <button class="clear">Clear</button>
      <button class="swap">Swap</button>
      <button class="chess-clock-pause">Pause</button>
    </div>
    <div class="delete-button-container">
      <button class="delete"></button>
    </div>
  </div>`,
  );

  const addedChessTimerSection = timerSectionsDiv.children[timerSectionsDiv
    .children.length - 1];

  addChessTimerEventListeners(addedChessTimerSection);
};

addNormalTimerButton.addEventListener("click", () => {
  addNormalTimer();
  saveTimers();
});

addChessClockTimerButton.addEventListener("click", () => {
  addChessClockTimer();
  saveTimers();
});
