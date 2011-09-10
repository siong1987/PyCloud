var lessons = [
	{
		name: "Lesson 1",
		content: {
			text: "",
			guide: "<b>Lesson 1</b><br><br>" +
					 "Welcome to PyCloud, a complete Python IDE in the browser!<br><br>" +
					 "In this lesson, we will learn how to use <code>print</code>.<br><br>" +
					 "Type<blockquote><code>print \"Hello world\"</code></blockquote>and click Run.",
			callback: "(function(source, output) {return output.toLowerCase().indexOf('hello world') != -1;});",
			right: "Good job! You've learned how to use <code>print</code>.",
			wrong: "Oops! Look like something is wrong. Try again.",
			next: "Lesson 2",
		}
	},
	{
		name: "Lesson 2",
		content: {
			text: "a = 12\nb = 4\nc = 5\n\n# edit here\nprint ...\n",
			guide: "<b>Lesson 2</b><br><br>" +
					 "In this lesson, we will learn how to use mathematical operators.<br><br>" +
					 "The values of <code>a</code>, <code>b</code>, and <code>c</code> are given in the code (12, 4, and 5, respectively). " +
					 "Can you write a code that prints the value of (<code>a</code> + <code>b</code>) × <code>c</code>?",
			callback: "(function(source, output) {return jQuery.trim(output) == '80';});",
			right: "Good job! You can also try other mathematical opearators such as" +
					 " <code>-</code> and <code>/</code>.",
			wrong: "Oops! Look like something is wrong. Try again",
			next: "Lesson 3"
		}
	},
	{
		name: "Lesson 3",
		content: {
			text: "n = 8\n" +
					"for i in range(n):\n" +
					"	print (' ' * (n-i)) + ('*' * (i*2 + 1))\n",
			guide: "<b>Lesson 3</b><br><br>" +
					 "Let's try something cool. We already have code for you. Just click Run and see the output.",
			callback: "(function(source, output) {return true;});",
			right: "A pyramid! You can try changing variable <code>n</code> to other numbers and run it again.",
			wrong: "Oops! Look like something is wrong. Try again",
			next: "Lesson 4"
		}
	},
	{
		name: "Lesson 4",
		content: {
			text: "a = int(raw_input('a ='))\n" +
				  "b = int(raw_input('b ='))\n" +
				  "print a + b\n",
			guide: "<b>Lesson 4</b><br><br>" +
					 "You can get an input from the user with the <code>raw_input</code> function. In this example, we've created a simple program that takes two numbers and add them up. Click Run to try.",
			callback: "(function(source, output) {return true;});",
			right: "Good job! You can see that we use the <code>int</code> funtion here. That is because the input is a string, so we need to convert it to a number.",
			wrong: "Oops! Look like something is wrong. Try again",
			next: "Lesson 5"
		}
	},
	{
		name: "Lesson 5",
		content: {
			text: "def isEven(x):\n" +
				  "	# write your code here\n" +
				  "	\n" +
				  "	return True\n",
			guide: "<b>Lesson 5</b><br><br>" +
					 "In this lesson, we will write a function called <code>isEven</code>. " +
					 "It receives an argument called <code>x</code> and returns whether <code>x</code> is an even number or not.<br><br>" +
					 "As you can see, the given code is wrong. Can you fix it?<br><br>" +
					 "(Hint: use <code>x % y</code> to find the remainder from the division of <code>x</code> by <code>y</code>.)",
			callback: "(function(source, output) {" +
						"var inject = \"\\ndef f(n): return '0' if isEven(n)==True else '1' if isEven(n)==False else ''\\nprint f(0)+f(1)+f(2)+f(3)+f(4)+f(37)\";" +
						"output = python.execute(source + inject);" +
						"return output.indexOf('010101') != -1;" +
						"});",
			right: "Good job!",
			wrong: "Oops! Look like something is wrong. Try again",
			next: "Lesson 6"
		}
	},
	{
		name: "Lesson 6",
		content: {
			text: "x = rand()\ny = rand()\n\n# swap values of x and y\nx = y\ny = x\n",
			guide: "<b>Lesson 6</b><br><br>" +
					 "We've assigned two random numbers to <code>x</code> and <code>y</code> and want to swap their values.<br><br>" +
					 "But, as you can see, the given code is wrong. (Why?) Can you fix it?",
			callback: "(function(source, output) {" +
						"var inject1 = \"_i = 392305\\ndef rand():\\n\\tglobal _i\\n\\t_i = _i-73904\\n\\treturn _i\\n\";" +
						"var inject2 = \"\\nprint str(x) + str(y)\\n\";" +
						"output = python.execute(inject1 + source + inject2);" +
						"return output.indexOf('244497318401') != -1;" +
						"});",
			right: "Good job! No more lessons.",
			wrong: "Oops! Look like something is wrong. Try again",
			//next: "Lesson 7"
			inject: "_i = 5\ndef rand():\n\tglobal _i\n\t_i = _i+2\n\treturn _i\n"
		}
	},
];

/*
{
	var file = new File("fibo.py");
	file.setContent({
		text:
		"def fib(x):\n" +
		"	if x == 0 or x == 1:\n" +
		"		return 1\n" +
		"	return fib(x - 1) + fib(x - 2)\n" +
		"print map(fib, range(10))\n"
	});
	storage.addFile(file);
}
{
	var file = new File("pyramid.py");
	file.setContent({
		text:
		"n = 8\n" +
		"for i in range(n):\n" +
		"	print (' ' * (n-i)) + ('*' * (i*2 + 1))\n"
	});
	storage.addFile(file);
}
*/

