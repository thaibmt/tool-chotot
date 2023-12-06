@echo off

REM Đường dẫn của thư mục chứa tệp batch
set script_dir=%~dp0

REM Đường dẫn của ứng dụng của bạn
set app_path=%script_dir%index.js

REM Chạy ứng dụng với PM2
pm2 start %app_path%
