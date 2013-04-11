# Nitrus - under development

 Nitrus is a package-template engine written in [Node.js](http://nodejs.org/) to create dynamic projects from a model using [scriptme](https://github.com/delmosaurio/scriptme) template engine

### npm install

```
npm install nitrus
```

## Nitrus usage

### init a new project

Initialize a new project into the current folder or into the `[path]`

```
$ nitrus init project <name> [options] [path]

Optional arguments:
	
```

The `init` command creates the files and folders for the project work  like:

```
root
  |-nitrus
       |-packages
       |-cache
       |-project.json
```

Install a new package for the project

```
$ nitrus install <package> [options] [path]

<package> argument:
	- package.gzip
	- path/from/package
	- http://mypackages.com/package.gzip
```

The `install` command add a package into the project  like:

```
project/nitrus/packages
	|-package
		|- * package files
```

Add a new package into the project for editing

```
$ nitrus add <packagename> [options] [path]

Optional arguments:

```

The `add` command creates the files and folders to make a new package like:

```
project/nitrus/packages
	|-packagename
		|-.nsignore
		|-nspackage.json
```

Make the project

```
$ nitrus make <all|package> [options] [path]

arguments:
	all                make all packages
	package            make the <package> installed in the project
	
Optional arguments:
	--force   Force to override all output files.
```

## more information

Nitrus like Nitrous Oxide because helps to make projects faster and the packages are the bottles of nitrous, 
more bottles more speed.

When I started thinking on this tool, I did it because I worked on projects with different langs
and I saw that  the source code are different to another in little changes and if you think one solution
for a program or a module or a function, why you need write every time its precondition changes 
or when the technology change?, so i started thinking in intelligent templates with inputs params
to get an usefull output, imagine if you can make an index.html template for your web projects and 
when you start a new web project copy its template and change only the title, this tool help to make this
task easily and you can also use this tool for change the title at runtime too.
I worked on developing an Personal ORM and use this formula for it but this project is writen in C#.Net and
is not multiplataform and i wanted share this tool on this lang but would be leaving out to many people and 
then i discovered Node.js and i loved.
So i'm here writing js code i not so good (a little newbie) but i will try to give the best.

NOTE: Sorry for my bad english i working on it but, i'm write source code nothing else matters.

## license 

(The MIT License)

Copyright (c) 2013 Delmo Carrozzo &lt;dcardev@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.