// script.js

const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const notesTextarea = document.getElementById('notes-content');
const saveNoteBtn = document.getElementById('save-note-btn');

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    timeElement.textContent = timeString;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('vi-VN', options);
    dateElement.textContent = dateString;
}

function renderCalendar() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = '';

    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'calendar-header';
    calendarHeader.textContent = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    calendarContainer.appendChild(calendarHeader);

    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const weekdayRow = document.createElement('div');
    weekdayRow.className = 'weekday-row';
    weekdays.forEach(day => {
        const weekdayCell = document.createElement('span');
        weekdayCell.textContent = day;
        weekdayRow.appendChild(weekdayCell);
    });
    calendarContainer.appendChild(weekdayRow);

    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('span');
        calendarGrid.appendChild(emptyCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('span');
        dayCell.textContent = i;
        if (i === now.getDate()) {
            dayCell.classList.add('current-day');
        }
        calendarGrid.appendChild(dayCell);
    }

    calendarContainer.appendChild(calendarGrid);
}

function saveNote() {
    localStorage.setItem('devtab-notes', notesTextarea.value);
}

setInterval(updateClock, 1000);
updateClock();
renderCalendar();

const savedNotes = localStorage.getItem('devtab-notes');
if (savedNotes) {
    notesTextarea.value = savedNotes;
}

saveNoteBtn.addEventListener('click', saveNote);