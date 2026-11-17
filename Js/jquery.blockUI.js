/*!
 * jQuery blockUI plugin
 * Version 2.43 (29-JUL-2012)
 * @requires jQuery v1.2.3 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2010 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {

	function setup($) {
		if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
			alert('blockUI requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
			return;
		}

		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// retarded userAgent strings on Vista)
		var mode = document.documentMode || 0;
		var setExpr = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8);
		var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent) && !mode;

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>'+title+'</h1>');
			if (message) $m.append('<h2>'+message+'</h2>');
			if (timeout == undefined) timeout = 3000;
			$.blockUI({
				message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
				timeout: timeout, showOverlay: false,
				onUnblock: onClose,
				css: $.blockUI.defaults.growlCSS
			});
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static')
					this.style.position = 'relative';
				if ($.browser.msie)
					this.style.zoom = 1; // force 'hasLayout'
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.42; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
		    message: '<center><h4><b>Please Wait &nbsp;<i class="fa fa-spinner fa-spin"></i></b></h4></center>',

			title: null,	  // title string; only used when theme == true
			draggable: true,  // only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding:	0,
				margin:		0,
				width:		'30%',
				top:		'40%',
				left:		'35%',
				textAlign:	'center',
				color:		'#000',
				border:		'3px solid #aaa',
				backgroundColor:'#fff',
				cursor:		'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'35%'
			},

			// styles for the overlay
			overlayCSS:  {
				backgroundColor: '#000',
				opacity:	  	 0.6,
				cursor:		  	 'wait'
			},

			// styles applied when using $.growlUI
			growlCSS: {
				width:  	'350px',
				top:		'10px',
				left:   	'',
				right:  	'10px',
				border: 	'none',
				padding:	'5px',
				opacity:	0.6,
				cursor: 	'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius': '10px',
				'-moz-border-radius':	 '10px',
				'border-radius': 		 '10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn:  200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut:  400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	 onUnblock(element, options)
			onUnblock: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock)
				remove(window, {fadeOut:0});

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent)
					data.parent.removeChild(node);
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking

			var lyr1 = ($.browser.msie || opts.forceIframe)
				? $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')
				: $('<div class="blockUI" style="display:none"></div>');

			var lyr2 = opts.theme
				? $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>')
				: $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			var lyr3, s;
			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
	        	if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
	        	}
		        s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
        		if ( opts.title ) {
          			s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>'
        		}  
        		s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme && (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform))))
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if ($.browser.msie || opts.forceIframe)
				lyr1.css('opacity',0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function() {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.boxModel)
					$('html,body').css('height','100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each([lyr1,lyr2,lyr3], function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						full ? s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"')
							 : s.setExpression('height','this.parentNode.offsetHeight + "px"');
						full ? s.setExpression('width','jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
							 : s.setExpression('width','this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
						s.setExpression('top',expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme)
					lyr3.find('.ui-widget-content').append(msg);
				else
					lyr3.append(msg);
				if (msg.jquery || msg.nodeType)
					$(msg).show();
			}

			if (($.browser.msie || opts.forceIframe) && opts.showOverlay)
				lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay)
					lyr2._fadeIn(opts.fadeIn, cb1);
				if (msg)
					lyr3._fadeIn(opts.fadeIn, cb2);
			}
			else {
				if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(':input:enabled:visible',pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					full ? $.unblockUI(opts) : $(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		};

		// remove the block
		function remove(el, opts) {
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			else
				els = $('.blockUI', el);

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				els.fadeOut(opts.fadeOut);
				setTimeout(function() { reset(els,data,opts,el); }, opts.fadeOut);
			}
			else
				reset(els, data, opts, el);
		};

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				if (data.parent)
					data.parent.appendChild(data.el);
				$(el).removeData('blockUI.history');
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el,opts);
		};

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress';
			b ? $(document).bind(events, opts, handler) : $(document).unbind(events, handler);

		// former impl...
		//	   var $e = $('a,:input');
		//	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		};

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back)},10);
						return false;
					}
				}
			}
			var opts = e.data;
			// allow events within the message content
			if ($(e.target).parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return $(e.target).parents().children().filter('div.blockUI').length == 0;
		};

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e)
				e.focus();
		};

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) s.left = l > 0 ? (l+'px') : '0';
			if (y) s.top  = t > 0 ? (t+'px') : '0';
		};

		function sz(el, p) {
			return parseInt($.css(el,p))||0;
		};

	};


	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();


/*--------------------------------------------------|

| dTree 2.05 | www.destroydrop.com/javascript/tree/ |

|---------------------------------------------------|

| Copyright (c) 2002-2003 Geir Landrö               |

|                                                   |

| This script can be used freely as long as all     |

| copyright messages are intact.                    |

|                                                   |

| Updated: 28.06.2006 by Mahmoud Tahoon           
|                    |

|--------------------------------------------------*/



// Node object
//alert("D TREE");	

function Node(id, pid, name, url, title, target, icon, iconOpen, open) {

	this.id = id;

	this.pid = pid;

	this.name = name;

	this.url = url;

	this.title = title;

	this.target = target;

	this.icon = icon;

	this.iconOpen = iconOpen;

	this._io = open || false;

	this._is = false; // if this node is selected or not

	this._ls = false; // is this node is the last sibling

	this._hc = false; // if this node have children or not

	this._ai = 0;

	this._p;            // the parent node of this node
	
	this._children = 0; // Number of children this nodes have
	
	this._isLeft =  false; // Is this node is a very left child
	
	this._isRight = false; // Is this node is a very right child
	
	this._isOnly = false;  // Is this node is the only child for its parent
	
	this._nodeIndex = 0; // the index of this node in the childs array of its parent

};



// Tree object

function dTree(objName) {

	this.config = {

		target			: null,

		folderLinks		: true,

		useSelection	: true,

		useCookies		: true,

		useLines		: true,

		useIcons		: true,

		useStatusText	: false,

		closeSameLevel	: false,

		inOrder			: false

	}

	this.icon = {

		root			: 'img/base.gif',

		folder			: 'img/folder.gif',

		folderOpen		: 'img/folderopen.gif',

		node			: 'img/page.gif',

		empty			: 'img/empty.gif',

		line			: 'img/line.gif',

		join			: 'img/join.gif',

		joinBottom		: 'img/joinbottom.gif',

		plus			: 'img/plus.png',

		plusBottom		: 'img/plusbottom.gif',

		minus			: 'img/minus.gif',

		minusBottom		: 'img/minusbottom.gif',

		nlPlus			: 'img/nolines_plus.gif',

		nlMinus			: 'img/nolines_minus.gif',
		
		middleLine		: 'img/myline2.gif',
		
		leftLine		: 'img/myline2.gif',
		
		smallLine		: 'img/smallLine.gif',
		
		rightLine		: 'img/myline2.gif'

	};

	this.obj = objName;

	this.aNodes = [];

	this.aIndent = [];

	this.root = new Node(-1);

	this.selectedNode = null;

	this.selectedFound = false;

	this.completed = false;

};



// Adds a new node to the node array

dTree.prototype.add = function(id, pid, name, url, title, target, icon, iconOpen, open) {

	this.aNodes[this.aNodes.length] = new Node(id, pid, name, url, title, target, icon, iconOpen, open);

};



// Open/close all nodes

dTree.prototype.openAll = function() {

	this.oAll(true);

};

dTree.prototype.closeAll = function() {

	this.oAll(false);

};



// Outputs the tree to the page

dTree.prototype.toString = function() {

	var str = '<div class="dtree">\n';

	if (document.getElementById) {

		if (this.config.useCookies) this.selectedNode = this.getSelected();

		str += this.addNode(this.root);

	} else str += 'Browser not supported.';

	str += '</div>';

	if (!this.selectedFound) this.selectedNode = null;

	this.completed = true;

	return str;

};



// Creates the tree structure

dTree.prototype.addNode = function(pNode) 
{
	var str = '';
	str += '<table border=0 cellpadding=0 cellspacing=0 >';
	str += '	<tr>';
	var n=0;

	if (this.config.inOrder) n = pNode._ai;
	//alert("NODES LENGTH: "+this.aNodes.length+" N="+n+" NAME: "+pNode.name);
	var childsIndex =0;
	for (n; n<this.aNodes.length; n++) 
	{

		if (this.aNodes[n].pid == pNode.id) 
		{
			var cn = this.aNodes[n];
			cn._p = pNode;
			
			cn._ai = n;
			
			this.setCS(cn); // Checks if a node has any children and if it is the last sibling
			cn._childIndex = childsIndex++;
			
			if(cn._p._children <= 1)
				cn._isOnly;
			else
			{
				if(cn._childIndex == 0)
					cn._isLeft=true;
				if(cn._childIndex == cn._p._children-1)
					cn._isRight=true;
			}
						
			if (!cn.target && this.config.target) cn.target = this.config.target;
			if (cn._hc && !cn._io && this.config.useCookies) cn._io = this.isOpen(cn.id);
			if (!this.config.folderLinks && cn._hc) cn.url = null;
			if (this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
					cn._is = true;
					this.selectedNode = n;
					this.selectedFound = true;
			}
			
			str += '	<td valign=top align=center ';
			str += '>';
			
			str += this.node(cn, n);
			str += '	</td>';
			
			//alert("Node '"+cn.name+"' is: ONLY:"+cn._isOnly+" - Left: "+cn._isLeft+" - Right: "+cn._isRight+" PARENT: "+cn._p._children);
			
			if (cn._ls) break;
		}
		
	}
	
	str += '	</tr>';
	str += '</table>';

	return str;

};



// Creates the node icon, url and text

dTree.prototype.node = function(node, nodeId) {

	if(node._p._children <= 1)
		node._isOnly=true;
	//alert("Node '"+node.name+"' is: ONLY:"+node._isOnly+" - Left: "+node._isLeft+" - Right: "+node._isRight+" PARENT: "+node._p._children);
	//alert("NODE NAME: "+node.name+" HAS CHILDREN: "+node._hc+" INDENT: "+this.indent(node, nodeId));
	var str = '<div class="dTreeNode" style="white-space:nowrap">';
	
	str += '<table border="0" cellpadding="0" cellspacing="0" Width="100%">';
	str += '<tr>';
	str += '	<td align="center" width="52%" '
	
	//alert("Node: "+node.name+" Left TD Decesion -- Node '"+node.name+"' is: ONLY:"+node._isOnly+" - Left: "+node._isLeft+" - Right: "+node._isRight);
	
	if (this.root.id != node.pid) 
	{
		if(this.config.useLines)
		{
			if(node._isOnly)
			{
				str += '';	
			}
			else if(node._isLeft)
			{
				str += '';
			}
			else if(node._isRight)
			{
				str += ' style="border-top-width:1px;border-top-style:dotted;border-top-color:Gray;" ';
			}
			else
			{
				str += ' style="border-top-width:1px;border-top-style:dotted;border-top-color:Gray;" ';
			}
		}
	}
	str += ' >&nbsp; ';
	str += '	</td>';
	str += '	<td valign="top" style="padding-top:0px;" align="center" width="1%" ';
	str += ' >';
	
	if (this.root.id != node.pid) /// if this node isn't a first lever node
	{
		str += '<img src="';
		if(this.config.useLines)
		{
			if(node._isOnly)
				str += this.icon.line	
			else if(node._isLeft)
				str += this.icon.leftLine;
			else if(node._isRight)
				str += this.icon.rightLine;
			else
				str += this.icon.middleLine;
		}
		else
		{
			str += this.icon.empty
		}	
		str += '" alt="" />';
	}
	
	
	str += '	</td>';
	str += '	<td align="center" width="52%" ';
	
	if (this.root.id != node.pid) 
	{
		if(this.config.useLines)
		{
			if(node._isOnly)
				str += ' ';
			else if(node._isLeft)
				str += ' style="border-top-width:1px;border-top-style:dotted;border-top-color:Gray;" ';
			else if(node._isRight)
				str += '';
			else
				str += ' style="border-top-width:1px;border-top-style:dotted;border-top-color:Gray;" ';
		}
	}
	
	str += ' >&nbsp; ';
	str += '	</td>';
	str += '</tr>';
	
	//alert("NODE: "+node.name+" is: "+str);
	
	str += '<tr>';
	str += '	<td align="center" colspan="3">';
	
	str += '<table border=0 bordercolor=blue cellpadding="0" cellspacing="0" >';
	str += '<tr><td valign=top align=center>' + this.indent(node, nodeId);

	if (this.config.useIcons) {

		if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);

		if (!node.iconOpen) node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;

		if (this.root.id == node.pid) {

			node.icon = this.icon.root;

			node.iconOpen = this.icon.root;

		}

		str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';

	}
	str+="</td></tr><tr><td valign=top align=center style='white-space:nowrap'>";
	if (node.url) {

		str += '<a id="s' + this.obj + nodeId + '" class="' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') + '" href="' + node.url + '"';

		if (node.title) str += ' title="' + node.title + '"';

		if (node.target) str += ' target="' + node.target + '"';

		if (this.config.useStatusText) str += ' onmouseover="window.status=\'' + node.name + '\';return true;" onmouseout="window.status=\'\';return true;" ';

		if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc))

			str += ' onclick="javascript: ' + this.obj + '.s(' + nodeId + ');"';

		str += '>';

	}

	else if ((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id)

		str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');" class="node">';

		
	str += node.name;
	if (node.url || ((!this.config.folderLinks || !node.url) && node._hc)) str += '</a>';
	str += '</div>';
	
	str += '</td></tr></table>';
	str += '</td></tr></table>';

	if (node._hc) {

		str += '<div id="d' + this.obj + nodeId + '" class="clip" style="display:' + ((node._io) ? 'block' : 'none') + ';">';

		str += '<table border=0 cellpadding=0 cellspacing=0>';
		str += '<tr><td height="9" align="center"><img src="'+this.icon.smallLine+'" alt="" border=0></td></tr>';
		str += '<tr><td>';
		
		str += this.addNode(node);

		str += '</td></tr></table>';
		str += '</div>';

	}

	this.aIndent.pop();

	return str;

};



// Adds the empty and line icons

dTree.prototype.indent = function(node, nodeId) {

	var str = '';
		
	(node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);

	if (node._hc) 
	{
		str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="';

		str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;

		str += '" alt="" /></a>';
	}
	
	return str;
};



// Checks if a node has any children and if it is the last sibling

dTree.prototype.setCS = function(node) {

	var lastId;
	
	var children =0;

	for (var n=0; n<this.aNodes.length; n++) {

		if (this.aNodes[n].pid == node.id)
		{
		 node._hc = true;
		 children ++;
		}

		if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;

	}
	node._children = children;
	if (lastId==node.id) node._ls = true;

};



// Returns the selected node

dTree.prototype.getSelected = function() {

	var sn = this.getCookie('cs' + this.obj);

	return (sn) ? sn : null;

};



// Highlights the selected node

dTree.prototype.s = function(id) {

	if (!this.config.useSelection) return;

	var cn = this.aNodes[id];

	if (cn._hc && !this.config.folderLinks) return;

	if (this.selectedNode != id) {

		if (this.selectedNode || this.selectedNode==0) {

			eOld = document.getElementById("s" + this.obj + this.selectedNode);

			eOld.className = "node";

		}

		eNew = document.getElementById("s" + this.obj + id);

		eNew.className = "nodeSel";

		this.selectedNode = id;

		if (this.config.useCookies) this.setCookie('cs' + this.obj, cn.id);

	}

};



// Toggle Open or close

dTree.prototype.o = function(id) {

	var cn = this.aNodes[id];

	this.nodeStatus(!cn._io, id, cn._ls);

	cn._io = !cn._io;

	if (this.config.closeSameLevel) this.closeLevel(cn);

	if (this.config.useCookies) this.updateCookie();

};



// Open or close all nodes

dTree.prototype.oAll = function(status) {

	for (var n=0; n<this.aNodes.length; n++) {

		if (this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {

			this.nodeStatus(status, n, this.aNodes[n]._ls)

			this.aNodes[n]._io = status;

		}

	}

	if (this.config.useCookies) this.updateCookie();

};



// Opens the tree to a specific node

dTree.prototype.openTo = function(nId, bSelect, bFirst) {

	if (!bFirst) {

		for (var n=0; n<this.aNodes.length; n++) {

			if (this.aNodes[n].id == nId) {

				nId=n;

				break;

			}

		}

	}

	var cn=this.aNodes[nId];

	if (cn.pid==this.root.id || !cn._p) return;

	cn._io = true;

	cn._is = bSelect;

	if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);

	if (this.completed && bSelect) this.s(cn._ai);

	else if (bSelect) this._sn=cn._ai;

	this.openTo(cn._p._ai, false, true);

};



// Closes all nodes on the same level as certain node

dTree.prototype.closeLevel = function(node) {

	for (var n=0; n<this.aNodes.length; n++) {

		if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc) {

			this.nodeStatus(false, n, this.aNodes[n]._ls);

			this.aNodes[n]._io = false;

			this.closeAllChildren(this.aNodes[n]);

		}

	}

}



// Closes all children of a node

dTree.prototype.closeAllChildren = function(node) {

	for (var n=0; n<this.aNodes.length; n++) {

		if (this.aNodes[n].pid == node.id && this.aNodes[n]._hc) {

			if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);

			this.aNodes[n]._io = false;

			this.closeAllChildren(this.aNodes[n]);		

		}

	}

}



// Change the status of a node(open or closed)

dTree.prototype.nodeStatus = function(status, id, bottom) {

	eDiv	= document.getElementById('d' + this.obj + id);

	eJoin	= document.getElementById('j' + this.obj + id);

	if (this.config.useIcons) {

		eIcon	= document.getElementById('i' + this.obj + id);

		eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;

	}

	eJoin.src = ((status)?this.icon.nlMinus:this.icon.nlPlus);

	eDiv.style.display = (status) ? 'block': 'none';

};





// [Cookie] Clears a cookie

dTree.prototype.clearCookie = function() {

	var now = new Date();

	var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);

	this.setCookie('co'+this.obj, 'cookieValue', yesterday);

	this.setCookie('cs'+this.obj, 'cookieValue', yesterday);

};



// [Cookie] Sets value in a cookie

dTree.prototype.setCookie = function(cookieName, cookieValue, expires, path, domain, secure) {

	document.cookie =

		escape(cookieName) + '=' + escape(cookieValue)

		+ (expires ? '; expires=' + expires.toGMTString() : '')

		+ (path ? '; path=' + path : '')

		+ (domain ? '; domain=' + domain : '')

		+ (secure ? '; secure' : '');

};



// [Cookie] Gets a value from a cookie

dTree.prototype.getCookie = function(cookieName) {

	var cookieValue = '';

	var posName = document.cookie.indexOf(escape(cookieName) + '=');

	if (posName != -1) {

		var posValue = posName + (escape(cookieName) + '=').length;

		var endPos = document.cookie.indexOf(';', posValue);

		if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));

		else cookieValue = unescape(document.cookie.substring(posValue));

	}

	return (cookieValue);

};



// [Cookie] Returns ids of open nodes as a string

dTree.prototype.updateCookie = function() {

	var str = '';

	for (var n=0; n<this.aNodes.length; n++) {

		if (this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {

			if (str) str += '.';

			str += this.aNodes[n].id;

		}

	}

	this.setCookie('co' + this.obj, str);

};



// [Cookie] Checks if a node id is in a cookie

dTree.prototype.isOpen = function(id) {

	var aOpen = this.getCookie('co' + this.obj).split('.');

	for (var n=0; n<aOpen.length; n++)

		if (aOpen[n] == id) return true;

	return false;

};



// If Push and pop is not implemented by the browser

if (!Array.prototype.push) {

	Array.prototype.push = function array_push() {

		for(var i=0;i<arguments.length;i++)

			this[this.length]=arguments[i];

		return this.length;

	}

};

if (!Array.prototype.pop) {

	Array.prototype.pop = function array_pop() {

		lastElement = this[this.length-1];

		this.length = Math.max(this.length-1,0);

		return lastElement;

	}

};



/*
 * jqModal - Minimalist Modaling with jQuery
 *   (http://dev.iceburg.net/jquery/jqModal/)
 *
 * Copyright (c) 2007,2008 Brice Burgess <bhb@iceburg.net>
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * $Version: 03/01/2009 +r14
 */
(function($) {
$.fn.jqm=function(o){
var p={
overlay: 50,
overlayClass: 'jqmOverlay',
closeClass: 'jqmClose',
trigger: '.jqModal',
ajax: F,
ajaxText: '',
target: F,
modal: F,
toTop: F,
onShow: F,
onHide: F,
onLoad: F
};
return this.each(function(){if(this._jqm)return H[this._jqm].c=$.extend({},H[this._jqm].c,o);s++;this._jqm=s;
H[s]={c:$.extend(p,$.jqm.params,o),a:F,w:$(this).addClass('jqmID'+s),s:s};
if(p.trigger)$(this).jqmAddTrigger(p.trigger);
});};

$.fn.jqmAddClose=function(e){return hs(this,e,'jqmHide');};
$.fn.jqmAddTrigger=function(e){return hs(this,e,'jqmShow');};
$.fn.jqmShow=function(t){return this.each(function(){t=t||window.event;$.jqm.open(this._jqm,t);});};
$.fn.jqmHide=function(t){return this.each(function(){t=t||window.event;$.jqm.close(this._jqm,t)});};

$.jqm = {
hash:{},
open:function(s,t){var h=H[s],c=h.c,cc='.'+c.closeClass,z=(parseInt(h.w.css('z-index'))),z=(z>0)?z:3000,o=$('<div></div>').css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':z-1,opacity:c.overlay/100});if(h.a)return F;h.t=t;h.a=true;h.w.css('z-index',z);
 if(c.modal) {if(!A[0])L('bind');A.push(s);}
 else if(c.overlay > 0)h.w.jqmAddClose(o);
 else o=F;

 h.o=(o)?o.addClass(c.overlayClass).prependTo('body'):F;
 if(ie6){$('html,body').css({height:'100%',width:'100%'});if(o){o=o.css({position:'absolute'})[0];for(var y in {Top:1,Left:1})o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");}}

 if(c.ajax) {var r=c.target||h.w,u=c.ajax,r=(typeof r == 'string')?$(r,h.w):$(r),u=(u.substr(0,1) == '@')?$(t).attr(u.substring(1)):u;
  r.html(c.ajaxText).load(u,function(){if(c.onLoad)c.onLoad.call(this,h);if(cc)h.w.jqmAddClose($(cc,h.w));e(h);});}
 else if(cc)h.w.jqmAddClose($(cc,h.w));

 if(c.toTop&&h.o)h.w.before('<span id="jqmP'+h.w[0]._jqm+'"></span>').insertAfter(h.o);	
 (c.onShow)?c.onShow(h):h.w.show();e(h);return F;
},
close:function(s){var h=H[s];if(!h.a)return F;h.a=F;
 if(A[0]){A.pop();if(!A[0])L('unbind');}
 if(h.c.toTop&&h.o)$('#jqmP'+h.w[0]._jqm).after(h.w).remove();
 if(h.c.onHide)h.c.onHide(h);else{h.w.hide();if(h.o)h.o.remove();} return F;
},
params:{}};
var s=0,H=$.jqm.hash,A=[],ie6=$.browser.msie&&($.browser.version == "6.0"),F=false,
i=$('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({opacity:0}),
e=function(h){if(ie6)if(h.o)h.o.html('<p style="width:100%;height:100%"/>').prepend(i);else if(!$('iframe.jqm',h.w)[0])h.w.prepend(i); f(h);},
f=function(h){try{$(':input:visible',h.w)[0].focus();}catch(_){}},
L=function(t){$()[t]("keypress",m)[t]("keydown",m)[t]("mousedown",m);},
m=function(e){var h=H[A[A.length-1]],r=(!$(e.target).parents('.jqmID'+h.s)[0]);if(r)f(h);return !r;},
hs=function(w,t,c){return w.each(function(){var s=this._jqm;$(t).each(function() {
 if(!this[c]){this[c]=[];$(this).click(function(){for(var i in {jqmShow:1,jqmHide:1})for(var s in this[i])if(H[this[i][s]])H[this[i][s]].w[i](this);return F;});}this[c].push(s);});});};
})(jQuery);



/*!
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */

(function(i){i.fn.jcarousel=function(a){if(typeof a=="string"){var c=i(this).data("jcarousel"),b=Array.prototype.slice.call(arguments,1);return c[a].apply(c,b)}else return this.each(function(){i(this).data("jcarousel",new h(this,a))})};var p={vertical:false,rtl:false,start:1,offset:1,size:null,scroll:3,visible:null,animation:"normal",easing:"swing",auto:0,wrap:null,initCallback:null,reloadCallback:null,itemLoadCallback:null,itemFirstInCallback:null,itemFirstOutCallback:null,itemLastInCallback:null, itemLastOutCallback:null,itemVisibleInCallback:null,itemVisibleOutCallback:null,buttonNextHTML:"<div></div>",buttonPrevHTML:"<div></div>",buttonNextEvent:"click",buttonPrevEvent:"click",buttonNextCallback:null,buttonPrevCallback:null,itemFallbackDimension:null},q=false;i(window).bind("load.jcarousel",function(){q=true});i.jcarousel=function(a,c){this.options=i.extend({},p,c||{});this.locked=false;this.buttonPrev=this.buttonNext=this.list=this.clip=this.container=null;if(!c||c.rtl===undefined)this.options.rtl= (i(a).attr("dir")||i("html").attr("dir")||"").toLowerCase()=="rtl";this.wh=!this.options.vertical?"width":"height";this.lt=!this.options.vertical?this.options.rtl?"right":"left":"top";for(var b="",d=a.className.split(" "),e=0;e<d.length;e++)if(d[e].indexOf("jcarousel-skin")!=-1){i(a).removeClass(d[e]);b=d[e];break}if(a.nodeName.toUpperCase()=="UL"||a.nodeName.toUpperCase()=="OL"){this.list=i(a);this.container=this.list.parent();if(this.container.hasClass("jcarousel-clip")){if(!this.container.parent().hasClass("jcarousel-container"))this.container= this.container.wrap("<div></div>");this.container=this.container.parent()}else if(!this.container.hasClass("jcarousel-container"))this.container=this.list.wrap("<div></div>").parent()}else{this.container=i(a);this.list=this.container.find("ul,ol").eq(0)}b!=""&&this.container.parent()[0].className.indexOf("jcarousel-skin")==-1&&this.container.wrap('<div class=" '+b+'"></div>');this.clip=this.list.parent();if(!this.clip.length||!this.clip.hasClass("jcarousel-clip"))this.clip=this.list.wrap("<div></div>").parent(); this.buttonNext=i(".jcarousel-next",this.container);if(this.buttonNext.size()==0&&this.options.buttonNextHTML!=null)this.buttonNext=this.clip.after(this.options.buttonNextHTML).next();this.buttonNext.addClass(this.className("jcarousel-next"));this.buttonPrev=i(".jcarousel-prev",this.container);if(this.buttonPrev.size()==0&&this.options.buttonPrevHTML!=null)this.buttonPrev=this.clip.after(this.options.buttonPrevHTML).next();this.buttonPrev.addClass(this.className("jcarousel-prev"));this.clip.addClass(this.className("jcarousel-clip")).css({overflow:"hidden", position:"relative"});this.list.addClass(this.className("jcarousel-list")).css({overflow:"hidden",position:"relative",top:0,margin:0,padding:0}).css(this.options.rtl?"right":"left",0);this.container.addClass(this.className("jcarousel-container")).css({position:"relative"});!this.options.vertical&&this.options.rtl&&this.container.addClass("jcarousel-direction-rtl").attr("dir","rtl");var f=this.options.visible!=null?Math.ceil(this.clipping()/this.options.visible):null;b=this.list.children("li");var g= this;if(b.size()>0){var j=0;e=this.options.offset;b.each(function(){g.format(this,e++);j+=g.dimension(this,f)});this.list.css(this.wh,j+100+"px");if(!c||c.size===undefined)this.options.size=b.size()}this.container.css("display","block");this.buttonNext.css("display","block");this.buttonPrev.css("display","block");this.funcNext=function(){g.next()};this.funcPrev=function(){g.prev()};this.funcResize=function(){g.reload()};this.options.initCallback!=null&&this.options.initCallback(this,"init");if(!q&& i.browser.safari){this.buttons(false,false);i(window).bind("load.jcarousel",function(){g.setup()})}else this.setup()};var h=i.jcarousel;h.fn=h.prototype={jcarousel:"0.2.5"};h.fn.extend=h.extend=i.extend;h.fn.extend({setup:function(){this.prevLast=this.prevFirst=this.last=this.first=null;this.animating=false;this.tail=this.timer=null;this.inTail=false;if(!this.locked){this.list.css(this.lt,this.pos(this.options.offset)+"px");var a=this.pos(this.options.start);this.prevFirst=this.prevLast=null;this.animate(a, false);i(window).unbind("resize.jcarousel",this.funcResize).bind("resize.jcarousel",this.funcResize)}},reset:function(){this.list.empty();this.list.css(this.lt,"0px");this.list.css(this.wh,"10px");this.options.initCallback!=null&&this.options.initCallback(this,"reset");this.setup()},reload:function(){this.tail!=null&&this.inTail&&this.list.css(this.lt,h.intval(this.list.css(this.lt))+this.tail);this.tail=null;this.inTail=false;this.options.reloadCallback!=null&&this.options.reloadCallback(this);if(this.options.visible!= null){var a=this,c=Math.ceil(this.clipping()/this.options.visible),b=0,d=0;this.list.children("li").each(function(e){b+=a.dimension(this,c);if(e+1<a.first)d=b});this.list.css(this.wh,b+"px");this.list.css(this.lt,-d+"px")}this.scroll(this.first,false)},lock:function(){this.locked=true;this.buttons()},unlock:function(){this.locked=false;this.buttons()},size:function(a){if(a!=undefined){this.options.size=a;this.locked||this.buttons()}return this.options.size},has:function(a,c){if(c==undefined||!c)c= a;if(this.options.size!==null&&c>this.options.size)c=this.options.size;for(var b=a;b<=c;b++){var d=this.get(b);if(!d.length||d.hasClass("jcarousel-item-placeholder"))return false}return true},get:function(a){return i(".jcarousel-item-"+a,this.list)},add:function(a,c){var b=this.get(a),d=0,e=i(c);if(b.length==0){var f;b=this.create(a);for(var g=h.intval(a);f=this.get(--g);)if(g<=0||f.length){g<=0?this.list.prepend(b):f.after(b);break}}else d=this.dimension(b);if(e.get(0).nodeName.toUpperCase()=="LI"){b.replaceWith(e); b=e}else b.empty().append(c);this.format(b.removeClass(this.className("jcarousel-item-placeholder")),a);e=this.options.visible!=null?Math.ceil(this.clipping()/this.options.visible):null;d=this.dimension(b,e)-d;a>0&&a<this.first&&this.list.css(this.lt,h.intval(this.list.css(this.lt))-d+"px");this.list.css(this.wh,h.intval(this.list.css(this.wh))+d+"px");return b},remove:function(a){var c=this.get(a);if(!(!c.length||a>=this.first&&a<=this.last)){var b=this.dimension(c);a<this.first&&this.list.css(this.lt, h.intval(this.list.css(this.lt))+b+"px");c.remove();this.list.css(this.wh,h.intval(this.list.css(this.wh))-b+"px")}},next:function(){this.stopAuto();this.tail!=null&&!this.inTail?this.scrollTail(false):this.scroll((this.options.wrap=="both"||this.options.wrap=="last")&&this.options.size!=null&&this.last==this.options.size?1:this.first+this.options.scroll)},prev:function(){this.stopAuto();this.tail!=null&&this.inTail?this.scrollTail(true):this.scroll((this.options.wrap=="both"||this.options.wrap== "first")&&this.options.size!=null&&this.first==1?this.options.size:this.first-this.options.scroll)},scrollTail:function(a){if(!(this.locked||this.animating||!this.tail)){var c=h.intval(this.list.css(this.lt));!a?c-=this.tail:c+=this.tail;this.inTail=!a;this.prevFirst=this.first;this.prevLast=this.last;this.animate(c)}},scroll:function(a,c){this.locked||this.animating||this.animate(this.pos(a),c)},pos:function(a){var c=h.intval(this.list.css(this.lt));if(this.locked||this.animating)return c;if(this.options.wrap!= "circular")a=a<1?1:this.options.size&&a>this.options.size?this.options.size:a;for(var b=this.first>a,d=this.options.wrap!="circular"&&this.first<=1?1:this.first,e=b?this.get(d):this.get(this.last),f=b?d:d-1,g=null,j=0,l=false,k=0;b?--f>=a:++f<a;){g=this.get(f);l=!g.length;if(g.length==0){g=this.create(f).addClass(this.className("jcarousel-item-placeholder"));e[b?"before":"after"](g);if(this.first!=null&&this.options.wrap=="circular"&&this.options.size!==null&&(f<=0||f>this.options.size)){e=this.get(this.index(f)); if(e.length)g=this.add(f,e.clone(true))}}e=g;k=this.dimension(g);if(l)j+=k;if(this.first!=null&&(this.options.wrap=="circular"||f>=1&&(this.options.size==null||f<=this.options.size)))c=b?c+k:c-k}d=this.clipping();var o=[],n=0;f=a;var m=0;for(e=this.get(a-1);++n;){g=this.get(f);l=!g.length;if(g.length==0){g=this.create(f).addClass(this.className("jcarousel-item-placeholder"));e.length==0?this.list.prepend(g):e[b?"before":"after"](g);if(this.first!=null&&this.options.wrap=="circular"&&this.options.size!== null&&(f<=0||f>this.options.size)){e=this.get(this.index(f));if(e.length)g=this.add(f,e.clone(true))}}e=g;k=this.dimension(g);if(k==0)throw Error("jCarousel: No width/height set for items. This will cause an infinite loop. Aborting...");if(this.options.wrap!="circular"&&this.options.size!==null&&f>this.options.size)o.push(g);else if(l)j+=k;m+=k;if(m>=d)break;f++}for(g=0;g<o.length;g++)o[g].remove();if(j>0){this.list.css(this.wh,this.dimension(this.list)+j+"px");if(b){c-=j;this.list.css(this.lt,h.intval(this.list.css(this.lt))- j+"px")}}j=a+n-1;if(this.options.wrap!="circular"&&this.options.size&&j>this.options.size)j=this.options.size;if(f>j){n=0;f=j;for(m=0;++n;){g=this.get(f--);if(!g.length)break;m+=this.dimension(g);if(m>=d)break}}f=j-n+1;if(this.options.wrap!="circular"&&f<1)f=1;if(this.inTail&&b){c+=this.tail;this.inTail=false}this.tail=null;if(this.options.wrap!="circular"&&j==this.options.size&&j-n+1>=1){b=h.margin(this.get(j),!this.options.vertical?"marginRight":"marginBottom");if(m-b>d)this.tail=m-d-b}for(;a-- > f;)c+=this.dimension(this.get(a));this.prevFirst=this.first;this.prevLast=this.last;this.first=f;this.last=j;return c},animate:function(a,c){if(!(this.locked||this.animating)){this.animating=true;var b=this,d=function(){b.animating=false;a==0&&b.list.css(b.lt,0);if(b.options.wrap=="circular"||b.options.wrap=="both"||b.options.wrap=="last"||b.options.size==null||b.last<b.options.size)b.startAuto();b.buttons();b.notify("onAfterAnimation");if(b.options.wrap=="circular"&&b.options.size!==null)for(var e= b.prevFirst;e<=b.prevLast;e++)if(e!==null&&!(e>=b.first&&e<=b.last)&&(e<1||e>b.options.size))b.remove(e)};this.notify("onBeforeAnimation");if(!this.options.animation||c==false){this.list.css(this.lt,a+"px");d()}else this.list.animate(!this.options.vertical?this.options.rtl?{right:a}:{left:a}:{top:a},this.options.animation,this.options.easing,d)}},startAuto:function(a){if(a!=undefined)this.options.auto=a;if(this.options.auto==0)return this.stopAuto();if(this.timer==null){var c=this;this.timer=setTimeout(function(){c.next()}, this.options.auto*1E3)}},stopAuto:function(){if(this.timer!=null){clearTimeout(this.timer);this.timer=null}},buttons:function(a,c){if(a==undefined||a==null){a=!this.locked&&this.options.size!==0&&(this.options.wrap&&this.options.wrap!="first"||this.options.size==null||this.last<this.options.size);if(!this.locked&&(!this.options.wrap||this.options.wrap=="first")&&this.options.size!=null&&this.last>=this.options.size)a=this.tail!=null&&!this.inTail}if(c==undefined||c==null){c=!this.locked&&this.options.size!== 0&&(this.options.wrap&&this.options.wrap!="last"||this.first>1);if(!this.locked&&(!this.options.wrap||this.options.wrap=="last")&&this.options.size!=null&&this.first==1)c=this.tail!=null&&this.inTail}var b=this;this.buttonNext[a?"bind":"unbind"](this.options.buttonNextEvent+".jcarousel",this.funcNext)[a?"removeClass":"addClass"](this.className("jcarousel-next-disabled")).attr("disabled",a?false:true);this.buttonPrev[c?"bind":"unbind"](this.options.buttonPrevEvent+".jcarousel",this.funcPrev)[c?"removeClass": "addClass"](this.className("jcarousel-prev-disabled")).attr("disabled",c?false:true);this.options.buttonNextCallback!=null&&this.buttonNext.data("jcarouselstate")!=a&&this.buttonNext.each(function(){b.options.buttonNextCallback(b,this,a)}).data("jcarouselstate",a);this.options.buttonPrevCallback!=null&&this.buttonPrev.data("jcarouselstate")!=c&&this.buttonPrev.each(function(){b.options.buttonPrevCallback(b,this,c)}).data("jcarouselstate",c)},notify:function(a){var c=this.prevFirst==null?"init":this.prevFirst< this.first?"next":"prev";this.callback("itemLoadCallback",a,c);if(this.prevFirst!==this.first){this.callback("itemFirstInCallback",a,c,this.first);this.callback("itemFirstOutCallback",a,c,this.prevFirst)}if(this.prevLast!==this.last){this.callback("itemLastInCallback",a,c,this.last);this.callback("itemLastOutCallback",a,c,this.prevLast)}this.callback("itemVisibleInCallback",a,c,this.first,this.last,this.prevFirst,this.prevLast);this.callback("itemVisibleOutCallback",a,c,this.prevFirst,this.prevLast, this.first,this.last)},callback:function(a,c,b,d,e,f,g){if(!(this.options[a]==undefined||typeof this.options[a]!="object"&&c!="onAfterAnimation")){var j=typeof this.options[a]=="object"?this.options[a][c]:this.options[a];if(i.isFunction(j)){var l=this;if(d===undefined)j(l,b,c);else if(e===undefined)this.get(d).each(function(){j(l,this,d,b,c)});else for(var k=d;k<=e;k++)k!==null&&!(k>=f&&k<=g)&&this.get(k).each(function(){j(l,this,k,b,c)})}}},create:function(a){return this.format("<li></li>",a)},format:function(a, c){a=i(a);for(var b=a.get(0).className.split(" "),d=0;d<b.length;d++)b[d].indexOf("jcarousel-")!=-1&&a.removeClass(b[d]);a.addClass(this.className("jcarousel-item")).addClass(this.className("jcarousel-item-"+c)).css({"float":this.options.rtl?"right":"left","list-style":"none"}).attr("jcarouselindex",c);return a},className:function(a){return a+" "+a+(!this.options.vertical?"-horizontal":"-vertical")},dimension:function(a,c){var b=a.jquery!=undefined?a[0]:a,d=!this.options.vertical?(b.offsetWidth|| h.intval(this.options.itemFallbackDimension))+h.margin(b,"marginLeft")+h.margin(b,"marginRight"):(b.offsetHeight||h.intval(this.options.itemFallbackDimension))+h.margin(b,"marginTop")+h.margin(b,"marginBottom");if(c==undefined||d==c)return d;d=!this.options.vertical?c-h.margin(b,"marginLeft")-h.margin(b,"marginRight"):c-h.margin(b,"marginTop")-h.margin(b,"marginBottom");i(b).css(this.wh,d+"px");return this.dimension(b)},clipping:function(){return!this.options.vertical?this.clip[0].offsetWidth-h.intval(this.clip.css("borderLeftWidth"))- h.intval(this.clip.css("borderRightWidth")):this.clip[0].offsetHeight-h.intval(this.clip.css("borderTopWidth"))-h.intval(this.clip.css("borderBottomWidth"))},index:function(a,c){if(c==undefined)c=this.options.size;return Math.round(((a-1)/c-Math.floor((a-1)/c))*c)+1}});h.extend({defaults:function(a){return i.extend(p,a||{})},margin:function(a,c){if(!a)return 0;var b=a.jquery!=undefined?a[0]:a;if(c=="marginRight"&&i.browser.safari){var d={display:"block","float":"none",width:"auto"},e,f;i.swap(b,d, function(){e=b.offsetWidth});d.marginRight=0;i.swap(b,d,function(){f=b.offsetWidth});return f-e}return h.intval(i.css(b,c))},intval:function(a){a=parseInt(a);return isNaN(a)?0:a}})})(jQuery);
