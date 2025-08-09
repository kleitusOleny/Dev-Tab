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

// Chức năng lưu ghi chú bằng cách gọi API
async function saveNote() {
    const noteContent = notesTextarea.value;
    const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: noteContent })
    });
    if (response.ok) {
        console.log('Ghi chú đã được lưu vào file note.json');
    }
}

// Chức năng tải ghi chú khi trang tải
async function loadNote() {
    try {
        const response = await fetch('/api/notes');
        if (response.ok) {
            const data = await response.json();
            notesTextarea.value = data.content;
        }
    } catch (error) {
        console.error('Lỗi khi tải ghi chú:', error);
    }
}

setInterval(updateClock, 1000);
updateClock();
loadNote();

saveNoteBtn.addEventListener('click', saveNote);