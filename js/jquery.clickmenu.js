/* clickMenu - v0.1.6
 * Copyright (c) 2007 Roman Weich
 * http://p.sohei.org
 */

(function($)
{
	var defaults = {
		onClick: function(){
			$(this).find('>a').each(function(){
				if ( this.href )
				{
					window.location = this.href;
				}
			});
		},
		arrowSrc: '',
		subDelay: 300,
		mainDelay: 10
	};

	$.fn.clickMenu = function(options) 
	{
		var shown = false;
		var liOffset = 2;

		var settings = $.extend({}, defaults, options);

		var hideDIV = function(div, delay)
		{
			//a timer running to show the div?
			if ( div.timer && !div.isVisible )
			{
				clearTimeout(div.timer);
			}
			else if (div.timer)
			{
				return; //hide-timer already running
			}
			if ( div.isVisible )
			{
				div.timer = setTimeout(function()
				{
					//remove events
					$(getAllChilds(getOneChild(div, 'UL'), 'LI')).unbind('mouseover', liHoverIn).unbind('mouseout', liHoverOut).unbind('click', settings.onClick);
					//hide it
					$(div).hide();
					div.isVisible = false;
					div.timer = null;
				}, delay);
			}
		};

		var showDIV = function(div, delay)
		{
			if ( div.timer )
			{
				clearTimeout(div.timer);
			}
			if ( !div.isVisible )
			{
				div.timer = setTimeout(function()
				{
					//check if the mouse is still over the parent item - if not dont show the submenu
					if ( !checkClass(div.parentNode, 'hover') )
					{
						return;
					}
					//assign events to all div>ul>li-elements
					$(getAllChilds(getOneChild(div, 'UL'), 'LI')).mouseover(liHoverIn).mouseout(liHoverOut).click(settings.onClick);
					//positioning
					if ( !checkClass(div.parentNode, 'main') )
					{
						$(div).css('left', div.parentNode.offsetWidth - liOffset);
					}
					//show it
					div.isVisible = true; //we use this over :visible to speed up traversing
					$(div).show();
					div.timer = null;
				}, delay);
			}
		};

		//same as hover.handlehover in jquery - just can't use hover() directly - need the ability to unbind only the one hover event
		var testHandleHover = function(e)
		{
			// Check if mouse(over|out) are still within the same parent element
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			// Traverse up the tree
			while ( p && p != this )
			{
				try
				{ 
					p = p.parentNode;
				}
				catch(e)
				{ 
					p = this;
				}
			}
			// If we actually just moused on to a sub-element, ignore it
			if ( p == this )
			{
				return false;
			}
			return true;
		};
		
		var mainHoverIn = function(e)
		{
			//no need to test e.target==this, as no child has the same event binded
			//its possible, that a main menu item still has hover (if it has no submenu) - thus remove it
			var lis = getAllChilds(this.parentNode, 'LI');
			var pattern = new RegExp("(^|\\s)hover(\\s|$)");
			for (var i = 0; i < lis.length; i++)
			{
				if ( pattern.test(lis[i].className) )
				{
					$(lis[i]).removeClass('hover');
				}
			}
			$(this).addClass('hover');
			if ( shown )
			{
				hoverIn(this, settings.mainDelay);
			}
		};

		var liHoverIn = function(e)
		{
			if ( !testHandleHover(e) )
			{
				return false;
			}
			if ( e.target != this )
			{
				//look whether the target is a direct child of this (maybe an image)
				if ( !isChild(this, e.target) )
				{
					return;
				}
			}
			hoverIn(this, settings.subDelay);
		};

		var hoverIn = function(li, delay)
		{
			var innerDiv = getOneChild(li, 'DIV');
			//stop running timers from the other menus on the same level - a little faster than $('>*>div', li.parentNode)
			var n = li.parentNode.firstChild;
			for ( ; n; n = n.nextSibling ) 
			{
				if ( n.nodeType == 1 && n.nodeName.toUpperCase() == 'LI' )
				{
					var div = getOneChild(n, 'DIV');
					if ( div && div.timer && !div.isVisible ) //clear show-div timer
					{
						clearTimeout(div.timer);
						div.timer = null;
					}
				}
			}
			//is there a timer running to hide one of the parent divs? stop it
			var pNode = li.parentNode;
			for ( ; pNode; pNode = pNode.parentNode ) 
			{
				if ( pNode.nodeType == 1 && pNode.nodeName.toUpperCase() == 'DIV' )
				{
					if (pNode.timer)
					{
						clearTimeout(pNode.timer);
						pNode.timer = null;
						$(pNode.parentNode).addClass('hover');
					}
				}
			}
			//highlight the current element
			$(li).addClass('hover');
			//is the submenu already visible?
			if ( innerDiv && innerDiv.isVisible )
			{
				//hide-timer running?
				if ( innerDiv.timer )
				{
					clearTimeout(innerDiv.timer);
					innerDiv.timer = null;
				}
				else
				{
					return;
				}
			}
			//hide all open menus on the same level and below and unhighlight the li item (but not the current submenu!)
			$(li.parentNode.getElementsByTagName('DIV')).each(function(){
				if ( this != innerDiv && this.isVisible )
				{
					hideDIV(this, delay);
					$(this.parentNode).removeClass('hover');
				}
			});
			//show the submenu, if there is one
			if ( innerDiv )
			{
				showDIV(innerDiv, delay);
			}
		};

		var liHoverOut = function(e)
		{
			if ( !testHandleHover(e) )
			{
				return false;
			}
			if ( e.target != this )
			{
				if ( !isChild(this, e.target) ) //return only if the target is no direct child of this
				{
					return;
				}
			}
			//remove the hover from the submenu item, if the mouse is hovering out of the menu (this is only for the last open (levelwise) (sub-)menu)
			var div = getOneChild(this, 'DIV');
			if ( !div )
			{
				$(this).removeClass('hover');
			}
			else 
			{
				if ( !div.isVisible )
				{
					$(this).removeClass('hover');
				}
			}
		};

		var mainHoverOut = function(e)
		{
			//no need to test e.target==this, as no child has the same event binded
			//remove hover
			var div = getOneChild(this, 'DIV');
			var relTarget = e.relatedTarget || e.toElement; //this is undefined sometimes (e.g. when the mouse moves out of the window), so dont remove hover then
			var p;
			if ( !shown )
			{
				$(this).removeClass('hover');
			}
			else if ( !div && relTarget ) //menuitem has no submenu, so dont remove the hover if the mouse goes outside the menu
			{
				p = findParentWithClass(e.target, 'UL', 'clickMenu');
				if ( p.contains(relTarget))
				{
					$(this).removeClass('hover');
				}
			}
			else if ( relTarget )
			{
				//remove hover only when moving to anywhere inside the clickmenu
				p = findParentWithClass(e.target, 'UL', 'clickMenu');
				if ( !div.isVisible && (p.contains(relTarget)) )
				{
					$(this).removeClass('hover');
				}
			}
		};

		var mainClick = function()
		{
			var div = getOneChild(this, 'DIV');
			if ( div && div.isVisible ) //clicked on an open main-menu-item
			{
				clean();
				$(this).addClass('hover');
			}
			else
			{
				hoverIn(this, settings.mainDelay);
				shown = true;
				$(document).bind('mousedown', checkMouse);
			}
			return false;
		};

		var checkMouse = function(e)
		{
			//is the mouse inside a clickmenu? if yes, is it an open (the current) one?
			var vis = false;
			var cm = findParentWithClass(e.target, 'UL', 'clickMenu');
			if ( cm )
			{
				$(cm.getElementsByTagName('DIV')).each(function(){
					if ( this.isVisible )
					{
						vis = true;
					}
				});
			}
			if ( !vis )
			{
				clean();
			}
		};

		var clean = function()
		{
			//remove timeout and hide the divs
			$('ul.clickMenu div.outerbox').each(function(){
				if ( this.timer )
				{
					clearTimeout(this.timer);
					this.timer = null;
				}
				if ( this.isVisible )
				{
					$(this).hide();
					this.isVisible = false;
				}
			});
			$('ul.clickMenu li').removeClass('hover');
			//remove events
			$('ul.clickMenu>li li').unbind('mouseover', liHoverIn).unbind('mouseout', liHoverOut).unbind('click', settings.onClick);
			$(document).unbind('mousedown', checkMouse);
			shown = false;
		};

		var getOneChild = function(elem, name)
		{
			if ( !elem )
			{
				return null;
			}
			var n = elem.firstChild;
			for ( ; n; n = n.nextSibling ) 
			{
				if ( n.nodeType == 1 && n.nodeName.toUpperCase() == name )
				{
					return n;
				}
			}
			return null;
		};

		var getAllChilds = function(elem, name)
		{
			if ( !elem )
			{
				return [];
			}
			var r = [];
			var n = elem.firstChild;
			for ( ; n; n = n.nextSibling ) 
			{
				if ( n.nodeType == 1 && n.nodeName.toUpperCase() == name )
				{
					r[r.length] = n;
				}
			}
			return r;
		};

		var findParentWithClass = function(elem, searchTag, searchClass)
		{
			var pNode = elem.parentNode;
			var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
			for ( ; pNode; pNode = pNode.parentNode )
			{
				if ( pNode.nodeType == 1 && pNode.nodeName.toUpperCase() == searchTag && pattern.test(pNode.className) )
				{
					return pNode;
				}
			}
			return null;
		};
		
		var checkClass = function(elem, searchClass)
		{
			var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
			if ( pattern.test(elem.className) )
			{
				return true;
			}
			return false;
		};
		
		var isChild = function(elem, childElem)
		{
			var n = elem.firstChild;
			for ( ; n; n = n.nextSibling ) 
			{
				if ( n == childElem )
				{
					return true;
				}
			}
			return false;
		};

	    return this.each(function()
		{
			//add .contains() to mozilla - http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
			if (window.Node && Node.prototype && !Node.prototype.contains)
			{
				Node.prototype.contains = function(arg) 
				{
					return !!(this.compareDocumentPosition(arg) & 16);
				};
			}
			//add class
			if ( !checkClass(this, 'clickMenu') )
			{
				$(this).addClass('clickMenu');
			}
			//add shadows
			$('ul', this).shadowBox();
			//assign events
			$(this).bind('closemenu', function(){clean();}); //assign closemenu-event, through wich the menu can be closed from outside the plugin
			//add click event handling, if there are any elements inside the main menu
			var liElems = getAllChilds(this, 'LI');
			for ( var j = 0; j < liElems.length; j++ )
			{
				if ( getOneChild(getOneChild(getOneChild(liElems[j], 'DIV'), 'UL'), 'LI') ) // >div>ul>li
				{
					$(liElems[j]).click(mainClick);
				}
			}
			//add hover event handling and assign classes
			$(liElems).hover(mainHoverIn, mainHoverOut).addClass('main').find('>div').addClass('inner');
			//add the little arrow before each submenu
			/*
			if ( settings.arrowSrc )
			{
				$('div.inner div.outerbox', this).before('<img src="' + settings.arrowSrc + '" class="liArrow" />');
			}
			*/
			$('div.inner div.outerbox', this).before('<span class="liArrow">►</span>');

			//the floating list elements are destroying the layout..so make it nice again..
			$(this).wrap('<div class="cmDiv"></div>').after('<div style="clear: both; visibility: hidden;"></div>');
	    });
	};
	$.fn.clickMenu.setDefaults = function(o)
	{
		$.extend(defaults, o);
	};
})(jQuery);

(function($)
{
	$.fn.shadowBox = function() {
	    return this.each(function()
		{
			var outer = $('<div class="outerbox"></div>').get(0);
			if ( $(this).css('position') == 'absolute' )
			{
				//if the child(this) is positioned abolute, we have to use relative positioning and shrink the outerbox accordingly to the innerbox
				$(outer).css({position:'relative', width:this.offsetWidth, height:this.offsetHeight});
			}
			else
			{
				//shrink the outerbox
				$(outer).css('position', 'absolute');
			}
			//add the boxes
			//$(this).addClass('innerBox').wrap(outer).
			//		before('<div class="shadowbox1"></div><div class="shadowbox2"></div><div class="shadowbox3"></div>');
			$(this).addClass('innerBox').wrap(outer);
	    });
	};
})(jQuery);