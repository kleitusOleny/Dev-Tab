// search.js

const searchInput = document.querySelector('.search-input');
const searchIcon = document.querySelector('.search-icon');
const suggestionsContainer = document.getElementById('suggestions-container');
const historyContainer = document.getElementById('history-container');

// Dữ liệu gợi ý mẫu
const sampleSuggestions = [
    "css box shadow gradient",
    "html css js tutorial",
    "javascript dom manipulation",
    "node.js express",
    "github profile",
    "youtube channel",
    "codeforces profile"
];

// Hàm để lưu lịch sử tìm kiếm bằng cách gọi API
async function saveSearchHistory(query) {
    let history;
    try {
        const loadResponse = await fetch('/api/history');
        if (loadResponse.ok) {
            history = await loadResponse.json();
        } else {
            history = [];
        }
    } catch (error) {
        console.error('Lỗi khi tải lịch sử:', error);
        history = [];
    }
    
    if (!history.includes(query)) {
        history.unshift(query);
    }
    
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    try {
        const saveResponse = await fetch('/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(history, null, 2)
        });

        if (saveResponse.ok) {
            console.log('Lịch sử đã được lưu vào file history.json');
        }
    } catch (error) {
        console.error('Lỗi khi lưu lịch sử:', error);
    }
}

// Hàm để hiển thị lịch sử tìm kiếm
async function renderSearchHistory() {
    const historyContainer = document.getElementById('history-container');
    let history = [];
    try {
        const response = await fetch('/api/history');
        if (response.ok) {
            history = await response.json();
        }
    } catch (error) {
        console.error('Lỗi khi tải lịch sử:', error);
    }
    
    historyContainer.innerHTML = '';
    
    if (history.length > 0 && searchInput.value.trim() === '') {
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const historyText = document.createElement('span');
            historyText.className = 'history-text';
            historyText.textContent = item;
            historyText.addEventListener('click', () => {
                searchInput.value = item;
                historyContainer.style.display = 'none';
            });
            
            const deleteBtn = document.createElement('i');
            deleteBtn.className = 'fas fa-times delete-history-btn';
            deleteBtn.addEventListener('click', async (event) => {
                event.stopPropagation();
                history.splice(index, 1);
                try {
                    const deleteResponse = await fetch('/api/history', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(history, null, 2)
                    });
                    if (deleteResponse.ok) {
                        renderSearchHistory();
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa lịch sử:', error);
                }
            });
            
            historyItem.appendChild(historyText);
            historyItem.appendChild(deleteBtn);
            historyContainer.appendChild(historyItem);
        });
        historyContainer.style.display = 'block';
    } else {
        historyContainer.style.display = 'none';
    }
}

// Chức năng thực hiện tìm kiếm
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        saveSearchHistory(query);
        searchInput.value = '';
        suggestionsContainer.style.display = 'none';
        historyContainer.style.display = 'none';
    }
}

// Chức năng hiển thị gợi ý tìm kiếm
function showSuggestions(query) {
    suggestionsContainer.innerHTML = '';
    historyContainer.style.display = 'none';

    if (query.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const filteredSuggestions = sampleSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredSuggestions.length > 0) {
        filteredSuggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                searchInput.value = suggestion;
                performSearch();
                suggestionsContainer.style.display = 'none';
            });
            suggestionsContainer.appendChild(item);
        });
        suggestionsContainer.style.display = 'block';
    }
}

// Lắng nghe sự kiện
searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.trim() === '') {
        renderSearchHistory();
    } else {
        showSuggestions(query);
    }
});

searchInput.addEventListener('focus', () => {
    renderSearchHistory();
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});
searchIcon.addEventListener('click', performSearch);

document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-bar')) {
        suggestionsContainer.style.display = 'none';
        historyContainer.style.display = 'none';
    }
});