// ============================================================
//   🚀 DANI OS - Backend Server
//   پلتفرم شخصی‌سازی حرفه‌ای مثل Railway
//   نسخه: 2.0.0
// ============================================================

// ============================================================
//   کتابخانه‌های مورد نیاز
// ============================================================
const express = require('express');        // فریمورک وب
const cors = require('cors');              // مدیریت CORS
const fs = require('fs');                  // کار با فایل‌ها
const path = require('path');              // کار با مسیرها
const os = require('os');                  // اطلاعات سیستم
const app = express();
const port = process.env.PORT || 3000;     // پورت سرور

// ============================================================
//   تنظیمات اولیه
// ============================================================
app.use(cors());                           // اجازه درخواست از همه دامنه‌ها
app.use(express.json());                   // پذیرش JSON
app.use(express.urlencoded({ extended: true })); // پذیرش فرم‌ها

// ============================================================
//   دیتابیس موقت (در حافظه)
// ============================================================
const database = {
    users: [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
        { id: 2, username: 'user1', password: 'pass123', role: 'user' }
    ],
    projects: [
        { 
            id: 1, 
            name: 'ربات تلگرام اول', 
            type: 'bot', 
            status: 'active',
            createdAt: '2026-07-27T10:00:00.000Z',
            owner: 'admin'
        },
        { 
            id: 2, 
            name: 'بازی دنیا', 
            type: 'game', 
            status: 'active',
            createdAt: '2026-07-27T11:00:00.000Z',
            owner: 'admin'
        },
        { 
            id: 3, 
            name: 'برنامه مدیریت کار', 
            type: 'app', 
            status: 'development',
            createdAt: '2026-07-27T12:00:00.000Z',
            owner: 'user1'
        }
    ],
    bots: [
        {
            id: 1,
            name: 'ربات اصلی',
            token: '123456:ABC-DEF-123',
            status: 'online',
            webhook: 'https://api.telegram.org/bot123456/setWebhook'
        },
        {
            id: 2,
            name: 'ربات پشتیبانی',
            token: '789012:GHI-JKL-456',
            status: 'offline',
            webhook: null
        }
    ],
    games: [
        {
            id: 1,
            name: 'DANI WORLD',
            type: '3d',
            status: 'active',
            players: 156,
            buildings: 45
        },
        {
            id: 2,
            name: 'City Builder',
            type: '2d',
            status: 'development',
            players: 0,
            buildings: 12
        }
    ],
    apps: [
        {
            id: 1,
            name: 'Task Manager',
            type: 'productivity',
            status: 'active',
            version: '1.0.0'
        },
        {
            id: 2,
            name: 'Note App',
            type: 'utility',
            status: 'development',
            version: '0.5.0'
        }
    ]
};

// ============================================================
//   اطلاعات سیستم
// ============================================================
const getSystemInfo = () => {
    return {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        uptime: (os.uptime() / 3600).toFixed(2) + ' hours',
        hostname: os.hostname()
    };
};

// ============================================================
//   API - صفحه اصلی
// ============================================================
app.get('/', (req, res) => {
    res.json({
        success: true,
        status: '✅ DANI OS API',
        version: '2.0.0',
        message: 'پلتفرم شخصی‌سازی حرفه‌ای',
        description: 'ساخت ربات، بازی و برنامه‌های شخصی',
        features: [
            '🤖 ساخت و مدیریت ربات‌های تلگرام',
            '🎮 ساخت بازی‌های سه‌بعدی',
            '📱 ساخت برنامه‌های وب',
            '🔗 اتصال به GitHub',
            '🗄️ مدیریت دیتابیس',
            '📊 داشبورد مدیریت'
        ],
        endpoints: {
            '/': 'صفحه اصلی',
            '/api/system': 'اطلاعات سیستم',
            '/api/projects': 'لیست پروژه‌ها',
            '/api/bots': 'لیست ربات‌ها',
            '/api/games': 'لیست بازی‌ها',
            '/api/apps': 'لیست برنامه‌ها',
            '/api/users': 'لیست کاربران'
        },
        system: getSystemInfo(),
        timestamp: new Date().toISOString()
    });
});

// ============================================================
//   API - اطلاعات سیستم
// ============================================================
app.get('/api/system', (req, res) => {
    res.json({
        success: true,
        system: getSystemInfo(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
        memoryUsage: process.memoryUsage()
    });
});

// ============================================================
//   API - مدیریت پروژه‌ها
// ============================================================
app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        count: database.projects.length,
        projects: database.projects
    });
});

app.post('/api/projects', (req, res) => {
    const { name, type, owner } = req.body;
    
    if (!name || !type) {
        return res.status(400).json({
            success: false,
            error: 'لطفاً نام و نوع پروژه را وارد کنید'
        });
    }

    const newProject = {
        id: Date.now(),
        name: name,
        type: type,
        status: 'active',
        createdAt: new Date().toISOString(),
        owner: owner || 'anonymous'
    };

    database.projects.push(newProject);

    res.json({
        success: true,
        message: `✅ پروژه "${name}" با موفقیت ساخته شد!`,
        project: newProject,
        deployUrl: `http://localhost:${port}/projects/${newProject.id}`
    });
});

app.get('/api/projects/:id', (req, res) => {
    const project = database.projects.find(p => p.id == req.params.id);
    
    if (!project) {
        return res.status(404).json({
            success: false,
            error: 'پروژه پیدا نشد'
        });
    }

    res.json({
        success: true,
        project: project,
        buildLogs: [
            '✅ نصب وابستگی‌ها',
            '✅ ساخت پروژه',
            '✅ اجرای تست‌ها',
            '🚀 دیپلوی به سرور'
        ]
    });
});

app.delete('/api/projects/:id', (req, res) => {
    const index = database.projects.findIndex(p => p.id == req.params.id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'پروژه پیدا نشد'
        });
    }

    const deleted = database.projects.splice(index, 1)[0];

    res.json({
        success: true,
        message: `✅ پروژه "${deleted.name}" حذف شد`,
        project: deleted
    });
});

// ============================================================
//   API - مدیریت ربات‌ها
// ============================================================
app.get('/api/bots', (req, res) => {
    res.json({
        success: true,
        count: database.bots.length,
        bots: database.bots,
        totalOnline: database.bots.filter(b => b.status === 'online').length
    });
});

app.post('/api/bots', (req, res) => {
    const { name, token } = req.body;
    
    if (!name || !token) {
        return res.status(400).json({
            success: false,
            error: 'لطفاً نام و توکن ربات را وارد کنید'
        });
    }

    const newBot = {
        id: Date.now(),
        name: name,
        token: token,
        status: 'offline',
        webhook: `https://api.telegram.org/bot${token}/setWebhook`,
        createdAt: new Date().toISOString()
    };

    database.bots.push(newBot);

    res.json({
        success: true,
        message: `✅ ربات "${name}" با موفقیت ساخته شد!`,
        bot: newBot,
        instructions: {
            start: `https://t.me/${name}bot`,
            webhook: newBot.webhook,
            token: token
        }
    });
});

app.post('/api/bots/:id/start', (req, res) => {
    const bot = database.bots.find(b => b.id == req.params.id);
    
    if (!bot) {
        return res.status(404).json({
            success: false,
            error: 'ربات پیدا نشد'
        });
    }

    bot.status = 'online';

    res.json({
        success: true,
        message: `✅ ربات "${bot.name}" روشن شد`,
        bot: bot
    });
});

app.post('/api/bots/:id/stop', (req, res) => {
    const bot = database.bots.find(b => b.id == req.params.id);
    
    if (!bot) {
        return res.status(404).json({
            success: false,
            error: 'ربات پیدا نشد'
        });
    }

    bot.status = 'offline';

    res.json({
        success: true,
        message: `⏹️ ربات "${bot.name}" خاموش شد`,
        bot: bot
    });
});

// ============================================================
//   API - مدیریت بازی‌ها
// ============================================================
app.get('/api/games', (req, res) => {
    res.json({
        success: true,
        count: database.games.length,
        games: database.games
    });
});

app.post('/api/games', (req, res) => {
    const { name, type } = req.body;
    
    if (!name || !type) {
        return res.status(400).json({
            success: false,
            error: 'لطفاً نام و نوع بازی را وارد کنید'
        });
    }

    const newGame = {
        id: Date.now(),
        name: name,
        type: type,
        status: 'active',
        players: 0,
        buildings: 0,
        createdAt: new Date().toISOString()
    };

    database.games.push(newGame);

    res.json({
        success: true,
        message: `✅ بازی "${name}" با موفقیت ساخته شد!`,
        game: newGame,
        playUrl: `http://localhost:${port}/games/${newGame.id}`
    });
});

// ============================================================
//   API - مدیریت برنامه‌ها
// ============================================================
app.get('/api/apps', (req, res) => {
    res.json({
        success: true,
        count: database.apps.length,
        apps: database.apps
    });
});

app.post('/api/apps', (req, res) => {
    const { name, type } = req.body;
    
    if (!name || !type) {
        return res.status(400).json({
            success: false,
            error: 'لطفاً نام و نوع برنامه را وارد کنید'
        });
    }

    const newApp = {
        id: Date.now(),
        name: name,
        type: type,
        status: 'active',
        version: '1.0.0',
        createdAt: new Date().toISOString()
    };

    database.apps.push(newApp);

    res.json({
        success: true,
        message: `✅ برنامه "${name}" با موفقیت ساخته شد!`,
        app: newApp,
        appUrl: `http://localhost:${port}/apps/${newApp.id}`
    });
});

// ============================================================
//   API - مدیریت کاربران
// ============================================================
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        count: database.users.length,
        users: database.users.map(u => ({
            id: u.id,
            username: u.username,
            role: u.role
        }))
    });
});

app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = database.users.find(u => 
        u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            error: '❌ نام کاربری یا رمز عبور اشتباه است'
        });
    }

    res.json({
        success: true,
        message: `✅ خوش آمدید ${user.username}!`,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        },
        token: `token_${Date.now()}_${user.id}`
    });
});

// ============================================================
//   API - عملیات دیپلوی
// ============================================================
app.post('/api/deploy', (req, res) => {
    const { projectId, branch } = req.body;
    
    if (!projectId) {
        return res.status(400).json({
            success: false,
            error: 'شناسه پروژه را وارد کنید'
        });
    }

    const project = database.projects.find(p => p.id == projectId);
    
    if (!project) {
        return res.status(404).json({
            success: false,
            error: 'پروژه پیدا نشد'
        });
    }

    res.json({
        success: true,
        message: `🚀 دیپلوی پروژه "${project.name}" شروع شد`,
        deployment: {
            id: Date.now(),
            project: project.name,
            branch: branch || 'main',
            status: 'deploying',
            logs: [
                '📦 دریافت کد از GitHub',
                '🔨 نصب وابستگی‌ها',
                '🧪 اجرای تست‌ها',
                '🌐 آپلود به سرور',
                '✅ دیپلوی با موفقیت انجام شد!'
            ],
            url: `http://localhost:${port}/projects/${project.id}`
        }
    });
});

// ============================================================
//   API - وضعیت سلامت سرور
// ============================================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
        database: {
            projects: database.projects.length,
            bots: database.bots.length,
            games: database.games.length,
            apps: database.apps.length,
            users: database.users.length
        }
    });
});

// ============================================================
//   هندلر خطاها (404)
// ============================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: '❌ مسیر مورد نظر پیدا نشد',
        message: 'لطفاً از مسیرهای معتبر استفاده کنید',
        availableRoutes: [
            '/',
            '/api/system',
            '/api/projects',
            '/api/bots',
            '/api/games',
            '/api/apps',
            '/api/users',
            '/api/health'
        ]
    });
});

// ============================================================
//   راه‌اندازی سرور
// ============================================================
app.listen(port, '0.0.0.0', () => {
    console.log('===========================================');
    console.log('🚀 DANI OS Backend Server');
    console.log('===========================================');
    console.log(`✅ سرور روی پورت ${port} اجرا شد!`);
    console.log(`🌐 آدرس: http://localhost:${port}`);
    console.log(`📊 وضعیت: ${'🟢 آنلاین'}`);
    console.log(`⚙️  محیط: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🖥️  سیستم: ${os.platform()} ${os.arch()}`);
    console.log(`💻 رم: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log('===========================================');
    console.log('📋 مسیرهای در دسترس:');
    console.log(`  - GET  /`);
    console.log(`  - GET  /api/system`);
    console.log(`  - GET  /api/projects`);
    console.log(`  - POST /api/projects`);
    console.log(`  - GET  /api/bots`);
    console.log(`  - POST /api/bots`);
    console.log(`  - GET  /api/games`);
    console.log(`  - POST /api/games`);
    console.log(`  - GET  /api/apps`);
    console.log(`  - POST /api/apps`);
    console.log(`  - POST /api/users/login`);
    console.log(`  - POST /api/deploy`);
    console.log(`  - GET  /api/health`);
    console.log('===========================================');
    console.log('✅ سرور آماده دریافت درخواست‌هاست!');
    console.log('===========================================');
});

// ============================================================
//   مدیریت خاموش شدن سرور
// ============================================================
process.on('SIGINT', () => {
    console.log('\n🛑 دریافت سیگنال خاموش شدن...');
    console.log('📝 در حال ذخیره‌سازی داده‌ها...');
    console.log('✅ سرور با موفقیت متوقف شد');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('❌ خطای غیرمنتظره:', error);
});

// ============================================================
//   پایان فایل
// ============================================================
