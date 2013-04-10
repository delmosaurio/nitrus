@echo off
set output=output
set cpackage=cases/package
set ppackage=cases/project
set bin=node ../bin/nitrus

if exist "%output%" (rmdir /s /q "%output%")

mkdir "%output%"
mkdir "%output%/package"
mkdir "%output%/project"
mkdir "%output%/new-project"
mkdir "%output%/new-package"

%bin% init project test "%output%/new-project"

%bin% init package test "%output%/new-package"

%bin% make package "%cpackage%"

%bin% install "%cpackage%/test.tgz" "%output%/new-project"