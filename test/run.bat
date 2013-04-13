@echo off
set output=./output
set bin=node ./../bin/nitrus

if exist "%output%" (rmdir /s /q "%output%")

mkdir "%output%"
