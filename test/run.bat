@echo off

set bin=node ../../../bin/nitrus

cd "cases/movies"
%bin% apply all

cd ..
cd ..
