jQuery.noConflict();

var editor;
var storage;
var currentFile;
var currentContent;

// ---------------- Storage class ----------------
// This is a wrapper for HTML5's localStorage. It lets us use file paradigm
// instead of key-value pair.

var Storage = function() {
	var filePrefix = 'file_';

	function keyForFilename(filename) {
		return filePrefix + filename;
	}
	
	this.files = [];
	
	var len = localStorage.length;
	for (var i = 0; i < len; i++) {
		var key = localStorage.key(i);
		if (key.indexOf(filePrefix) == 0) {
			var prefixLen = filePrefix.length;
			var filename = key.substr(prefixLen, key.length - prefixLen);
			var file = new File(filename);
			file.storage = this;
			this.files.push(file);
		}
	}

	this.addFile = function(file) {
		var key = keyForFilename(file.name);
		localStorage.setItem(key, JSON.stringify(file.content));
		file.storage = this;
		this.files.push(file);
	}
	
	this.updateFile = function(file) {
		var key = keyForFilename(file.name);
		localStorage.setItem(key, JSON.stringify(file.content));
	}
	
	this.fillContent = function(file) {
		var key = keyForFilename(file.name);
		file.content = JSON.parse(localStorage.getItem(key));
	}
	
	this.hasFilename = function(filename) {
		var key = keyForFilename(filename);
		return localStorage.getItem(key) !== null;
	}
	
	this.getFile = function(filename) {
		for (var i = 0; i < this.files.length; i++) {
			if (this.files[i].name == filename)
				return this.files[i];
		}
		return null;
	}
	
	this.removeFile = function(file) {
		var key = keyForFilename(file.name);
		localStorage.removeItem(key);
		for (var i = 0; i < this.files.length; i++) {
			if (this.files[i].name == file.name) {
				this.files.splice(i, 1);
				break;
			}
		}
	}
}

// ---------------- File class ----------------
// A file consists of name, content, and storage. Storage is where the file belongs to.
// It's possible that a file may not have a storage, such as files that are newly created
// and haven't been saved yet, e.g. "untitled.py".

var File = function(filename) {
	this.name = filename;
	this.content = {'text':''};
	this.loadedContent = false;
	this.storage = null;
	
	this.getContent = function() {
		if (!this.loadedContent) {
			this.storage.fillContent(this);
			this.loadedContent = true;
		}
		return this.content;
	}
	
	this.setContent = function(content) {
		this.content = content;
		this.loadedContent = true;
	}
	
	this.save = function() {
		if (this.storage) {
			this.storage.updateFile(this);
		}
	};
	
	this.saveAs = function(filename, defaultStorage) {
		if (this.storage) {
			if (!this.storage.hasFilename(filename)) {
				file = new File(filename);
				file.setContent(this.content);
				this.storage.addFile(file);
				return file;
			} else {
				alert("File named " + filename + " already existed.");
			}
		} else {
			if (!defaultStorage.hasFilename(filename)) {
				this.name = filename;
				defaultStorage.addFile(this);
				return null;
			} else {
				alert("File named " + filename + " already existed.");
			}
		}
		return null;
	};
	
	this.remove = function() {
		if (this.storage) {
			this.storage.removeFile(this);
		} else {
			this.storage = 1; // hacky, to make the file browser remove it
		}
	}
};

// ---------------- File Browser ----------------
// The file browser shows a list of files. It maintains a list of storages and a list of files that
// are not in any storage (tempFiles). It is possible that a file that was once in the tempFiles
// may move to a storage. (For example, we may save "untitled.py" to a storage.)
// In that case, we remove it from the tempFiles list.

var browser = new function() {
	this.storages = [];
	this.tempFiles = [];
	this.files = [];
	
	this.addStorage = function(storage) {
		this.storages.push(storage);
	}
	
	this.addTempFile = function(file) {
		this.tempFiles.push(file);
	};
	
	this.removeTempFile = function(file) {
		for (var i = 0; i < this.tempFiles.length; i++) {
			if (this.tempFiles[i].name == file.name) {
				this.tempFiles.splice(i, 1);
				break;
			}
		}
	}
	
	var sortFunction = function(x, y) {
		var a = x.name.toLowerCase(), b = y.name.toLowerCase();
		if (a > b) return 1;
		if (a < b) return -1;
		return 0;
	};
	
	this.reload = function() {
		var files = [];
		
		// add files that are in storages
		for (var i = 0; i < this.storages.length; i++)
			files = files.concat(this.storages[i].files);
			
		// add files that are not in storage (if it is in a storage, we remove it from the list)
		for (var i = this.tempFiles.length-1; i >= 0; i--) {
			var file = this.tempFiles[i];
			if (file.storage) {
				this.tempFiles.splice(i, 1);
			} else {
				files.push(file);
			}
		}
		
		// sort alphabetically
		files = files.sort(sortFunction);
		
		this.files = files;

		var tmp = "<ul>";
		for (var i = 0; i < files.length; i++) {
			var cls = "";
			if (files[i] == currentFile)
				cls = "class='selected' ";
			tmp += "<li " + cls +
					"onclick=\"showFile(browser.files[" + i + "])\" " +
					"oncontextmenu=\"showContextMenu(event, browser.files[" + i + "])\">" +
					"<img src='img/document.png'> " +
					files[i].name + "</li>";
		}
		tmp += "</ul>";
		document.getElementById("browser").innerHTML = tmp;
	};
}

// ---------------- Guide Box ----------------

var guide = new function() {
	var shows = false;

	this.setText = function(text) {
		document.getElementById("guide").innerHTML = text;
	}
	
	this.show = function() {
		if (!shows) {
			shows = true;
			document.getElementById("guide-outer").style.display = 'block';
			document.getElementById("editor").style.right = '300px';
		}
	}
	
	this.hide = function() {
		if (shows) {
			shows = false;
			document.getElementById("guide-outer").style.display = 'none';
			document.getElementById("editor").style.right = '0';
		}
	}
};

// ---------------- Console ----------------

var console = new function() {
	this.setText = function(text) {
		text = text.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
		document.getElementById("console").innerHTML = text;
	}
}

// ---------------- Utilities ----------------

function updateCurrentContent() {
	currentContent.text = editor.getSession().getValue();
}

// ---------------- main menu actions ----------------

function run() {
	var text = editor.getSession().getValue();
	var originalText = text;
	
	if (currentContent.inject) {
		text = currentContent.inject + text;
	}
	
	var output = python.execute(text);
	console.setText(output);
	editor.focus();
	
	if (currentContent.callback) {
		f = eval(currentContent.callback);
		if (f(originalText, output)) {
			currentContent.state = 1;
		} else {
			currentContent.state = 0;
		}
		reloadGuide();
	}
	
	if (currentFile.storage)
		save();
}

var newFileCounter = 0;

function createNewFile() {
	newFileCounter++;
	var filename = newFileCounter > 1 ? ("untitled-" + newFileCounter + ".py") : "untitled.py";
	var file = new File(filename);
	file.setContent({'text':''});
	browser.addTempFile(file);
	showFile(file);
}

function save() {
	if (currentFile.storage) {
		updateCurrentContent();
		currentFile.setContent(currentContent);
		currentFile.save();
	} else {
		saveAs();
	}
}

function saveAs() {
	updateCurrentContent();
	currentFile.setContent(currentContent);
	var filename = prompt("Save as:", ".py");
	if (filename) {
		newFile = currentFile.saveAs(filename, storage);
		if (newFile)
			currentFile = newFile;
		browser.reload();
	}
}

function clearLocalStorage() {
	localStorage.clear();
	window.location = self.location;
}

function acknowledgements() {
	window.open("http://www.jitouch.com/pycloud/acknowledgements.txt");
}

// ---------------- context menu actions ----------------

var contextMenuFile;

function deleteFile() {
	if (confirm("Are you sure you want to delete " + contextMenuFile.name + "?")) {
		contextMenuFile.remove();
		browser.reload();
		if (currentFile == contextMenuFile) {
			if (browser.files.length > 0)
				showFile(browser.files[0]);
			else
				createNewFile();
		}
	}
}

function showContextMenu(e, file) {
	contextMenuFile = file;
	jQuery('#contextmenu').offset({'top': e.clientY, 'left': e.clientX});
	jQuery('#contextmenu li').trigger('click');
	e.preventDefault();
}

// ---------------- other stuffs ----------------

function showFile(file) {
	if (currentFile) {
		updateCurrentContent();
		currentFile.setContent(currentContent);
	}
	currentFile = file;
	currentContent = file.getContent();
	editor.getSession().setValue(currentContent.text);
	browser.reload();
	
	if (currentContent.guide) {
		guide.show();
		reloadGuide();
	} else {
		guide.hide();
	}
}

function reloadGuide() {
	var guideText = currentContent.guide;
	if (currentContent.state !== undefined) {
		if (currentContent.state == 1) {
			guideText += "<br><br>" +
				"<font color=blue>" + currentContent.right + "</font>";
			if (currentContent.next) {
				guideText += "<br><br>" + "Go to the " +
					"<a href=\"javascript:showFile(storage.getFile('" + currentContent.next + "'))\">next lesson</a>.";
			}
		} else if (currentContent.state == 0) {
			guideText += "<br><br>" +
				"<font color=red>" + currentContent.wrong + "</font>";
		}
	}
	guide.setText(guideText);
}

function createDefaultFiles() {
	if (localStorage.getItem("created-default-files") == null) {
		localStorage.setItem("created-default-files", "1");
		for (var i = 0; i < lessons.length; i++) {
			var file = new File(lessons[i].name);
			file.setContent(lessons[i].content);
			storage.addFile(file);
		}
		localStorage.setItem("recent-file", lessons[0].name);
		browser.reload();
	}
}

function setupEditor() {
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/textmate");
	editor.setShowPrintMargin(false);
	editor.getSession().setUseSoftTabs(false);
	var PythonMode = require("ace/mode/python").Mode;
	editor.getSession().setMode(new PythonMode());
	var canon = require('pilot/canon')
	/*
	canon.addCommand({
		name: 'run',
		bindKey: {win: 'Ctrl-R', mac: 'Command-R', sender: 'editor'},
		exec: function() {run();}
	});
	*/
	canon.addCommand({
		name: 'new',
		bindKey: {win: 'Ctrl-N', mac: 'Command-N', sender: 'editor'},
		exec: function() {createNewFile();}
	});
	canon.addCommand({
		name: 'save',
		bindKey: {win: 'Ctrl-S', mac: 'Command-S', sender: 'editor'},
		exec: function() {save();}
	});
}

function setupEditorForMobileDevices() {
	var $ = jQuery;
	editor = new function() {
		this.value = "";
		this.session = new function() {
			this.getValue = function() {
				editor.value = document.getElementById("editor").value;
				return editor.value;
			};
			this.setValue = function(value) {
				value = value.replace(/\t/g, '    ')
				editor.value = value;
				document.getElementById("editor").value = value;
			};
		};
		this.getSession = function() {
			return this.session;
		};
		this.focus = function() {};
		this.undo = function() {};
		this.redo = function() {};
		this.find = function() {};
	};
	$("#editor").replaceWith("<textarea id='editor' class='textarea' autocorrect='off' autocapitalize='off'></textarea>");
}

function setupMenus() {
	var $ = jQuery;
	var commands = {
		run: run,
		newFile: createNewFile,
		save: save,
		saveAs: saveAs,
		clearLocalStorage: clearLocalStorage,
		deleteFile: deleteFile,
		undo: function() {editor.undo();},
		redo: function() {editor.redo();},
		find: function() {var needle = prompt("Find:"); editor.find(needle);},
		findNext: function() {editor.findNext();},
		goToLine: function() {
			var line = parseInt(prompt("Enter line number:"));
			if (!isNaN(line))
				editor.gotoLine(line);
		},
		toggleLineNumbers: function() {
			editor.renderer.setShowGutter(!editor.renderer.getShowGutter());
		},
		acknowledgements: acknowledgements
	};
	$('#menu').clickMenu({
		onClick: function() {
			var a = $(this).find('>a');
			if (a.length) {
				href = a.attr('href');
				commands[href]();
				$('#menu').trigger('closemenu');
			}
			return false;
		}
	});
	$('#contextmenu').clickMenu({
		onClick: function() {
			var a = $(this).find('>a');
			if (a.length) {
				href = a.attr('href');
				commands[href]();
				$('#contextmenu').trigger('closemenu');
			}
			return false;
		}
	});
}

function setupControl() {
	var $ = jQuery;
	$('#control-run').click(run);
	$('#control-run').mousedown(function() {
		$(this).addClass("pushed");
	});
	$('#control-run').mouseup(function() {
		$(this).removeClass("pushed");
	});

	$('#control-redo').click(function() {
		editor.redo();
	});
	$('#control-redo').mousedown(function() {
		$(this).addClass("pushed");
	});
	$('#control-redo').mouseup(function() {
		$(this).removeClass("pushed");
	});
	
	$('#control-undo').click(function() {
		editor.undo();
	});
	$('#control-undo').mousedown(function() {
		$(this).addClass("pushed");
	});
	$('#control-undo').mouseup(function() {
		$(this).removeClass("pushed");
	});
}

jQuery(document).ready(function($){
	// set up editor
	if (navigator.userAgent.match(/like Mac OS X/i) || navigator.userAgent.indexOf("ndroid") != -1) {
		setupEditorForMobileDevices();
	} else {
		setupEditor();
	}

	// set up main menu & context menu
	setupMenus();
	
	// set up control bar
	setupControl();
	
	// set up file browser & storage
	storage = new Storage();
	browser.addStorage(storage);
	createDefaultFiles();
	if (storage.files.length == 0) {
		createNewFile();
	} else {
		var recentFilename = localStorage.getItem('recent-file');
		if (recentFilename && storage.hasFilename(recentFilename)) {
			showFile(storage.getFile(recentFilename));
		} else {
			showFile(storage.files[0]);
		}
	}
});

window.onbeforeunload = function() {
	localStorage.setItem('recent-file', currentFile.name);
	//TODO: warn user to save files
}
