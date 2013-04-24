@echo off
set output=./output
set bin=node ./bin/nitrus

rem if exist "%output%" (rmdir /s /q "%output%")

rem mkdir "%output%"

cd 
%bin% apply all "./cases/plugin"
