PyCloud
=========

PyCloud is a Python editor and compiler in the web browser. Everything runs on the client side, including compiling. It also has interactive Python tutorials.

Using PyCloud, you can

* run Python in your web browser
* teach students how to code. No installation required.
* work with Python in iOS
* work with Python in Chrome OS

Features
--------

* Edit Python code in web browser
* Compile Python code in web browser
* Interactive Python tutorials
* Syntax highlighting
* HTML5 local storage
* HTML5 offline caching
* No server connection needed
* Work on iOS devices

How it works
------------

We use [emscripten](http://github.com/kripken/emscripten/wiki) for compiling Python. It basically translates [CPython](http://en.wikipedia.org/wiki/CPython)'s LLVM assembly into JavaScript.

We use [Ace](https://github.com/ajaxorg/ace) for syntax highlighting.

We use [clickMenu](http://p.sohei.org/jquery-plugins/clickmenu/) for displaying menu.

Notes
-----

* It doesn't support importing modules.
* It doesn't work with Internet Explorer.

License
-------

PyCloud is MIT licensed.