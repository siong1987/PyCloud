PyCloud
=========

PyCloud is a Python editor and compiler in web browser. Everything runs at the client side, even compiling!

Using PyCloud, you can

* run Python in your web browser
* teach students how to write programs. No installation required.
* work with Python in Chrome OS

Features
--------

* Edit Python code in web browser
* Compile Python code in web browser
* interactive Python tutorial
* Syntax highlighting
* HTML5 local storage
* HTML5 offline caching
* No server required

How it works
------------

We use [emscripten](http://github.com/kripken/emscripten/wiki) for compiling Python. It basically translates [CPython](http://en.wikipedia.org/wiki/CPython) into JavaScript. To use it, just include cpython.js and python.js, then use `output = python.execute(code)`.

We use [Ace](https://github.com/ajaxorg/ace) for syntax highlighting.

We use [clickMenu](http://p.sohei.org/jquery-plugins/clickmenu/) for displaying menu.

To-do
-----

* Python lessons
* Improve UI

Notes
-----

* emscripten uses global variable `$`. If you want to use `$` in jQuery, you must declare it as a local variable, i.e. `var $ = jQuery;`.
