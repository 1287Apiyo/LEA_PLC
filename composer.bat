@echo off
rem LEA Labs Composer wrapper - loads the zip extension for Composer
php -d extension=zip "%~dp0composer.phar" %*
