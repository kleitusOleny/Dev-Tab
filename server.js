const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API để tải ghi chú
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'note.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Lỗi khi đọc file ghi chú.');
        }
        res.json(JSON.parse(data));
    });
});

// API để lưu ghi chú
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.writeFile(path.join(__dirname, 'data', 'note.json'), JSON.stringify(newNote, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Lỗi khi lưu ghi chú.');
        }
        res.status(200).send('Đã lưu ghi chú thành công!');
    });
});

// API để tải lịch sử
app.get('/api/history', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'history.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Lỗi khi đọc file lịch sử.');
        }
        res.json(JSON.parse(data));
    });
});

// API để lưu lịch sử
app.post('/api/history', (req, res) => {
    const newHistory = req.body;
    fs.writeFile(path.join(__dirname, 'data', 'history.json'), JSON.stringify(newHistory, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Lỗi khi lưu lịch sử.');
        }
        res.status(200).send('Đã lưu lịch sử thành công!');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Devtab server đang chạy tại http://localhost:${port}`);
});