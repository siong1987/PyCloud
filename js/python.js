var orig = Module._PyRun_SimpleStringFlags;
var RAN_ALREADY;
QDb = function() {
	if (!RAN_ALREADY) {
		RAN_ALREADY = true;
		throw "halting, since this is the first run";
	}
	orig.apply(null, arguments);
}

// print function which the Python engine will call
var _lines = [], _printed = false;

function print(text, force) {
	_lines.push(text);
	_printed = true;
}

var python = {
	'execute': function(text) {
		_lines = [];
		_printed = false;
		
		var ptr = Module.Pointer_make(Module.intArrayFromString(text), 0, 2, 'i8'); // leak!
		try {
			Module._PyRun_SimpleStringFlags(ptr, 0);
		} catch(e) {
			if (e === 'halting, since this is the first run') {
				return null;
			}
			return 'JS crash:\n\n' + e + '\n\nPlease let us know about this problem!\n' + element.value;
		}
		
		if (_printed) {
			return _lines.join('\n') + '\n';
		}
		
		return "";
	}
};

(function() {
	var args = ['-S', '-c', 'print 5'];
	try {
		Module.run(args);
	} catch (e) {
		if (e !== 'halting, since this is the first run') {
			throw e;
		}
	}
})();
