#!/bin/bash

echo "🚀 DANI OS - نصب خودکار"
echo "========================="

# به‌روزرسانی
sudo apt update && sudo apt upgrade -y

# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# نصب Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash

# باز کردن پورت‌ها
sudo ufw allow 22,80,443,3000,8000/tcp
sudo ufw --force enable

# نمایش IP
IP=$(curl -s ifconfig.me)
echo ""
echo "✅ نصب کامل شد!"
echo "🌐 داشبورد: http://$IP:8000"
echo "📱 ربات: http://$IP:3000"
