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

// Hàm để lưu lịch sử tìm kiếm vào localStorage
function saveSearchHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(query)) {
        history.unshift(query);
    }
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

// Hàm để hiển thị lịch sử tìm kiếm
function renderSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
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
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteSearchHistoryItem(index);
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

// Hàm để xóa một mục trong lịch sử tìm kiếm
function deleteSearchHistoryItem(index) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    renderSearchHistory();
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

// Lắng nghe sự kiện để hiển thị lịch sử hoặc gợi ý
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

// Chức năng tìm kiếm: Nhấn Enter hoặc click icon
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});
searchIcon.addEventListener('click', performSearch);

// Ẩn gợi ý và lịch sử khi click ra ngoài
document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-bar')) {
        suggestionsContainer.style.display = 'none';
        historyContainer.style.display = 'none';
    }
});