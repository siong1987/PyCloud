var lessons = [
	{
		name: "Lesson 1",
		content: {
			text: "print \"Hello world\"\n",
			guide: "<b>Lesson 1</b><br><br>" +
					 "Welcome to PyCloud, a complete Python IDE in the browser!<br><br>" +
					 "In the next lessons, we will walk you through various features of PyCloud. Feel free to play with code and edit it as you want.<br><br>" +
					 "In the first lesson, let's get familiar with the user interface. Click the Run button and see the output in the console below.",
			callback: "(function(source, output) {return true;});",
			right: "Good job!",
			wrong: "Oops! Look like something is wrong. Try again.",
			next: "Lesson 2",
		}
	},
	{
		name: "Lesson 2",
		content: {
			text: "def fibo(x):\n" +
				"	if x == 0 or x == 1:\n" +
				"		return 1\n" +
				"	return fibo(x - 1) + fibo(x - 2)\n\n" +
				"print map(fibo, range(10))\n",
			guide: "<b>Lesson 2</b><br><br>" +
					"Now, we will show you a little more complicated code. You probably already know what this code does. Let's click Run to see the output.",
			callback: "(function(source, output) {return true;});",
			right: "Good job!",
			wrong: "Oops! Look like something is wrong. Try again.",
			next: "Lesson 3",
		}
	},
	
	{
		name: "Lesson 3",
		content: {
			text: "n = 8\n" +
					"for i in range(n):\n" +
					"	print (' ' * (n-i)) + ('*' * (i*2 + 1))\n",
			guide: "<b>Lesson 3</b><br><br>" +
					 "Now, let's try something cool. Click Run to see the output.",
			callback: "(function(source, output) {return true;});",
			right: "A pyramid! You can try changing variable <code>n</code> and see how the output changes.",
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
			right: "Good job!",
			wrong: "Oops! Look like something is wrong. Try again",
			next: "Lesson 5"
		}
	},
	{
		name: "Lesson 5",
		content: {
			text: "if 2 + 3 = 5:\n\tprint \"OK!\"\n",
			guide: "<b>Lesson 5</b><br><br>" +
					 "PyCloud also shows error messages when your program has a bug. It's very useful for debugging. For example, click Run to see the output of this script.",
			callback: "(function(source, output) {return output.indexOf('Error') == -1;});",
			right: "Good job!",
			wrong: "Good job! Now, try to make it run.<br><br>(Hint: <code>==</code> is a comparison operator.)",
			next: "Lesson 6"
		}
	},
	
	{
		name: "Lesson 6",
		content: {
			text: "def gen_primes(n):\n" +
					"	primes = []\n" +
					"	for i in range(2, n):\n" +
					"		is_prime = True\n" +
					"		for j in range(2, i/2+1):\n" +
					"			if i % j == 0:\n" +
					"				is_prime = False\n" +
					"				break\n" +
					"		if is_prime:\n" +
					"			primes.append(i)\n" +
					"	return primes\n\n" +
					"print gen_primes(20)\n",
			guide: "<b>Lesson 6</b><br><br>" +
					"Because everything in PyCloud runs at the client side, it works even when you are offline.<br><br>" +
					"What's better way to show it rather than trying it yourself? Let's try disconnecting an internet connection and then click Run.",
			callback: "(function(source, output) {return true;});",
			right: "Good job! If you are using Chrome or Safari, you can close the browser, open it again, and type in the URL of PyCloud (yes, even if you are offline). And it still works!",
			wrong: "Good job! Now, try to make it run.",
			next: "Lesson 7"
		}
	},
	
	{
		name: "Lesson 7",
		content: {
			text: "a = 12\nb = 4\nc = 5\n\n# edit here\nprint ...",
			guide: "<b>Lesson 7</b><br><br>" +
					"With PyCloud, you can create Python interactive tutorial to teach people how to code.<br><br>" +
					"For example, for this lesson, the values of <code>a</code>, <code>b</code>, and <code>c</code> are given. Can you write a code that prints the value of (<code>a</code>+<code>b</code>) × <code>c</code>?",
			callback: "(function(source, output) {return jQuery.trim(output) == '80';});",
			right: "Good job!",
			wrong: "Oops! Look like something is wrong. Try again",
			next: "Lesson 8"
		}
	},
	{
		name: "Lesson 8",
		content: {
			text: "x = rand()\ny = rand()\n\n# swap values of x and y\nx = y\ny = x\n",
			guide: "<b>Lesson 8</b><br><br>" +
					 "Let's try one more lesson. In this code, we want to swap values of <code>x</code> and <code>y</code>. But you can see that the given code is wrong (Why?). Can you fix it?",
			callback: "(function(source, output) {" +
						"var inject1 = \"_i = 392305\\ndef rand():\\n\\tglobal _i\\n\\t_i = _i-73904\\n\\treturn _i\\n\";" +
						"var inject2 = \"\\nprint str(x) + str(y)\\n\";" +
						"output = python.execute(inject1 + source + inject2);" +
						"return output.indexOf('244497318401') != -1;" +
						"});",
			right: "Good job!",
			wrong: "Oops! Look like something is wrong. Try again",
			next: "Lesson 9",
			inject: "_i = 5\ndef rand():\n\tglobal _i\n\t_i = _i+2\n\treturn _i\n"
		}
	},
	{
		name: "Lesson 9",
		content: {
			text: "",
			guide: "<b>Lesson 9</b><br><br>" +
					 "That's all for the lessons! You can explore other features of PyCloud by yourself. Enjoy!",
			callback: "(function(source, output) {return true;});",
			right: "",
			wrong: "Oops! Look like something is wrong. Try again"
		}
	},
];
