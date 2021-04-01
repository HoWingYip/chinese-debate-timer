const timerSectionsDiv = document.getElementById("timer-sections");
const addNormalTimerButton = document.getElementById("add-normal-timer");
const addChessClockTimerButton = document.getElementById("add-chess-clock-timer");

const nodeIsElement = (node) => node.nodeType === Node.ELEMENT_NODE;

addNormalTimerButton.addEventListener("click", () => {
  const numExistingTimerSections = [...timerSectionsDiv.childNodes]
    .filter(nodeIsElement)
    .length;

  timerSectionsDiv.insertAdjacentHTML(
    "beforeend",
    `<div class="normal-timer">
      <div class="timer-left">
        <input type="text" class="timer-name" value="Section ${numExistingTimerSections + 1} Timer 1">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="0">m
            <input type="text" class="time-remaining-seconds" value="00">s
          </div>
          <button class="start-stop-timer"></button>
        </div>
      </div>

      <div class="timer-separator"></div>
      <div class="timer-right">
        <input type="text" class="timer-name" value="Section ${numExistingTimerSections + 1} Timer 2">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="0">m
            <input type="text" class="time-remaining-seconds" value="00">s
          </div>
          <button class="start-stop-timer"></button>
        </div>
      </div>
      <div class="delete-button-container">
        <button class="delete"></button>
      </div>
    </div>`,
  );

  const addedTimerSection = [...timerSectionsDiv.childNodes].reverse()
    .find(nodeIsElement);

  addDeleteButtonListener(addedTimerSection);
  for (const timerElem of addedTimerSection.getElementsByClassName("timer")) {
    addTimerEventListeners(timerElem);
  }
});

addChessClockTimerButton.addEventListener("click", () => {
  const numExistingTimerSections = [...timerSectionsDiv.childNodes]
    .filter(nodeIsElement)
    .length;

  timerSectionsDiv.insertAdjacentHTML(
    "beforeend",
    `<div class="chess-timer">
    <input type="text" class="timer-name" value="Chess Clock ${numExistingTimerSections + 1}">

    <div class= "chess-timer-internal-container">
      <div class="timer-left">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="0">m
            <input type="text" class="time-remaining-seconds" value="00">s
          </div>
          <button class="start-stop-timer"></button>
        </div>
      </div>
  
      <div class="timer-separator"></div>
      <div class="timer-right">
        <div class="timer" data-running="false">
          <div class="timer-input-wrapper">
            <input type="text" class="time-remaining-minutes" value="0">m
            <input type="text" class="time-remaining-seconds" value="00">s
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


  for (const chessTimerElem of document.getElementsByClassName("chess-timer")) {
    addChessTimerEventListeners(chessTimerElem);
  }
});
