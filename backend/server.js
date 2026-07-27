const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// API اصلی
app.get('/', (req, res) => {
    res.json({ status: '✅ DANI OS API', version: '2.0' });
});

// ساخت پروژه
app.post('/api/projects', (req, res) => {
    const { name, type } = req.body;
    res.json({
        success: true,
        message: `پروژه "${name}" از نوع ${type} ساخته شد!`,
        project: { id: Date.now(), name, type, status: 'active' }
    });
});

// دریافت لیست ربات‌ها
app.get('/api/bots', (req, res) => {
    res.json({
        bots: [
            { id: 1, name: 'ربات اصلی', token: '***', status: 'online' },
            { id: 2, name: 'ربات پشتیبانی', token: '***', status: 'offline' }
        ]
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 سرور روی پورت ${port} اجرا شد!`);
});
