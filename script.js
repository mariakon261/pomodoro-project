let timerDisplay = document.getElementById("timer-display");
let startBtn = document.getElementById("start-button");
let resetBtn = document.getElementById("reset-button");

let isBreak = false; //check if user is on short break
let isRunning = false; //ensure that new intervals will not start in case the user clicks on the start button multiple times.
let interval;
let totalTime = 25*60; //1500 secs = 25 mins //60 secs * mins you want
let timeLeft = totalTime;

let progressBar = document.getElementById('progress-bar');
let progressBarStatus = document.getElementById('progress-bar-status');
let ambientRainSounds = new Audio('soft-rain-ambient-111154.mp3');
 // Set the audio to loop
ambientRainSounds.loop = true;
startBtn.addEventListener('click',() => {
    if (!isRunning) { 
        startTimer();
        ambientRainSounds.play(); // auto start ambient rain sounds 
        startBtn.textContent = "Pause";
        // console.log(ambientRainSounds.play());  debugging purposes
    }
    else {
        clearInterval(interval);
        isRunning = false;  
        ambientRainSounds.pause();
        startBtn.textContent = "Start";
    }
});
resetBtn.addEventListener('click',resetTimer);

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let formattedTime = [minutes,seconds]
                       .map(num => num.toString().padStart(2, '0'))
                    .join(":"); //putting mins and secs in an array to manipulate them using the map array method and format them like this -> mins:secs
    timerDisplay.textContent = formattedTime;
    //console.log(formattedTime);

   let progressBarPercent = ((totalTime - timeLeft) / totalTime) * 100;
   progressBarStatus.textContent = Math.floor(progressBarPercent) + "%";
   progressBar.style.width = progressBarPercent + "%";
    

}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    interval = setInterval(() => {
        if (timeLeft === 0) {
            clearInterval(interval);
            isRunning = false;
            ambientRainSounds.pause(); //because pomodoro ended
            if (!isBreak) {
                // Switch to break
                isBreak = true;
                totalTime = 5 * 60;
                timeLeft = totalTime;
                startBtn.textContent = "Pause"; //because the timer is running again
                updateTimer();
                startTimer(); // automatically start break timer
            } else {
                // switch back to pomodoro
                isBreak = false;
                totalTime = 25 * 60;
                timeLeft = totalTime;
                startBtn.textContent = "Start"; // because the timer is not running
                updateTimer();
            }
        } else {
            timeLeft--;
            updateTimer();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    timeLeft = totalTime; // Use current mode's totalTime
    startBtn.textContent = "Start"; // Reset button text
    updateTimer();
}
/*nav link active state switching */
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // prevents page reload if href="#"
    
    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('nav-link-active'));
    
    // Add active class to the clicked link
    link.classList.add('nav-link-active');
     if(link.classList.contains('nav-link-pomodoro')) {
        totalTime = 25 * 60;
    } else if(link.classList.contains('nav-link-shortbreak')) {
        totalTime = 5 * 60;
    } else if(link.classList.contains('nav-link-longbreak')) {
        totalTime = 15 * 60; 
    }
    // Update timeLeft and display
    timeLeft = totalTime;
    updateTimer();

    // Stop any running timer
    clearInterval(interval);
    isRunning = false;
    startBtn.textContent = "Start"; // reset start button text
  });
});

let tasksContainer = document.getElementById('tasks-container');
let newTaskInput = document.getElementById('new-task-input');
let addNewTaskButton = document.getElementById('add-new-task-button');
let tasksList = document.getElementById("tasks-list");

//TASKS - TODO LIST FOR POMODORO
function openTaskManager() {
    console.log("Editing icon has been clicked.");
    tasksContainer.classList.toggle('hidden');
}

//click on add button or Enter -> add new task
addNewTaskButton.addEventListener('click',addNewTask);
newTaskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' ) {
        event.preventDefault();
        console.log("keydown pressed!");
        addNewTask();
    }
}) 
//to add a new task, we just take the value of the input field(string) and after creating an li element, append it to the tasksList 
function addNewTask() {
    if (newTaskInput.value.trim() === '') {
        console.log('String is empty');
        return;
    }
    const li = document.createElement('li');
    li.textContent = newTaskInput.value;

    //click on li -> delete it
    li.addEventListener('click', () => {
        removeTask(li);
    })
   

    tasksList.appendChild(li);
    newTaskInput.value = '';
}
function removeTask(item) {
    item.classList.toggle('completed-task');
    setTimeout(() => {
        item.remove();
    },2000);
}

//fullscreen mode 
const fullscreenModeIcon = document.getElementById("fullscreen-mode");
let elem = document.documentElement;

//open fullscreen mode
const requestFullscreen = () => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
};

//exit full screen mode 
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
};

fullscreenModeIcon.addEventListener('click', () => {
    if (isFullscreen()) {
        exitFullscreen();
    }
    else {
        requestFullscreen();
    }});


const isFullscreen = () => {
  return document.fullscreenElement || 
         document.mozFullScreenElement || 
         document.webkitFullscreenElement || 
         document.msFullscreenElement;
};

// Toggle fullscreen on button click
fullscreenModeIcon.addEventListener('click', () => {
  if (isFullscreen()) {
    fullscreenModeIcon.src = 'C:/Users/maria/OneDrive/Desktop/maria_sxoli/projects/pomodoro/icons/fullscreen_exit_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg';
    exitFullscreen();
    
  } else {
    requestFullscreen();
    fullscreenModeIcon.src = 'C:/Users/maria/OneDrive/Desktop/maria_sxoli/projects/pomodoro/icons/fullscreen_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'
  }
});

//settings modal code 
const settingsIcon = document.getElementById('settings');
const updateButton = document.getElementById("update-settings-modal-button");
const settingsModal = document.getElementById('settings-modal')

settingsIcon.addEventListener('click', () => {
  console.log("Settings were clicked.");
  settingsModal.showModal();
})

//close modal if user clicks anywhere outisde of the modal
document.addEventListener('click' ,(event) => {
  if (settingsModal.open && !settingsModal.contains(event.target) && event.target !== settingsIcon) { // check if the event (click) did NOT happen INSIDE the settingsModal
    settingsModal.close();
  }
}) 

updateButton.addEventListener('click', () => {
//actually update the changes.
  console.log("Updates changed.")
  settingsModal.close()
})