//v.3.6 build 131108

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
/****************************************************************************************************************************************************/
/*								 	EXTENDED MODULE INFO							    */
dhtmlXMenuObject.prototype.extendedModule = "DHXMENUEXT";
/****************************************************************************************************************************************************/
/*								 	ENABLING/DISBLING							    */
/**
*   @desc: enables an item
*   @param: id - item's id to enable
*   @param: state - true|false
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemEnabled = function(id) {
	// modified in 0.4
	this._changeItemState(id, "enabled", this._getItemLevelType(id));
}
/**
*   @desc: disables an item
*   @param: id - item's id to disablei
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemDisabled = function(id) {
	this._changeItemState(id, "disabled", this._getItemLevelType(id));
}
/**
*   @desc: returns true if the item is enabled
*   @param: id - the item to check
*   @type: public
*/
dhtmlXMenuObject.prototype.isItemEnabled = function(id) {
	return (this.itemPull[this.idPrefix+id]!=null?(this.itemPull[this.idPrefix+id]["state"]=="enabled"):false);
}
/* enable/disable sublevel item */
dhtmlXMenuObject.prototype._changeItemState = function(id, newState, levelType) {
	var t = false;
	var j = this.idPrefix + id;
	if ((this.itemPull[j] != null) && (this.idPull[j] != null)) {
		if (this.itemPull[j]["state"] != newState) {
			this.itemPull[j]["state"] = newState;
			if (this.itemPull[j]["parent"] == this.idPrefix+this.topId && !this.context) {
				this.idPull[j].className = "dhtmlxMenu_"+this.skin+"_TopLevel_Item_"+(this.itemPull[j]["state"]=="enabled"?"Normal":"Disabled");
			} else {
				this.idPull[j].className = "sub_item"+(this.itemPull[j]["state"]=="enabled"?"":"_dis");
			}
			
			this._updateItemComplexState(this.idPrefix+id, this.itemPull[this.idPrefix+id]["complex"], false);
			this._updateItemImage(id, levelType);
			// if changeItemState attached to onClick event and changing applies to selected item all selection should be reparsed
			if ((this.idPrefix + this.menuLastClicked == j) && (levelType != "TopLevel")) {
				this._redistribSubLevelSelection(j, this.itemPull[j]["parent"]);
			}
			if (levelType == "TopLevel" && !this.context) { // rebuild style.left and show nested polygons
				// this._redistribTopLevelSelection(id, "parent");
			}
		}
	}
	return t;
}
/****************************************************************************************************************************************************/
/*								 	SET/GET TEXT								    */
/**
*   @desc: returns item's text
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getItemText = function(id) {
	return (this.itemPull[this.idPrefix+id]!=null?this.itemPull[this.idPrefix+id]["title"]:"");
}

/**
*   @desc: sets text for the item
*   @param: id - the item
*   @param: text - a new text
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemText = function(id, text) {
	id = this.idPrefix + id;
	if ((this.itemPull[id] != null) && (this.idPull[id] != null)) {
		this._clearAndHide();
		this.itemPull[id]["title"] = text;
		if (this.itemPull[id]["parent"] == this.idPrefix+this.topId && !this.context) {
			// top level
			var tObj = null;
			for (var q=0; q<this.idPull[id].childNodes.length; q++) {
				try { if (this.idPull[id].childNodes[q].className == "top_level_text") tObj = this.idPull[id].childNodes[q]; } catch(e) {}
			}
			if (String(this.itemPull[id]["title"]).length == "" || this.itemPull[id]["title"] == null) {
				if (tObj != null) tObj.parentNode.removeChild(tObj);
			} else {
				if (!tObj) {
					tObj = document.createElement("DIV");
					tObj.className = "top_level_text";
					if (this._rtl && this.idPull[id].childNodes.length > 0) this.idPull[id].insertBefore(tObj,this.idPull[id].childNodes[0]); else this.idPull[id].appendChild(tObj);
				}
				tObj.innerHTML = this.itemPull[id]["title"];
			}
		} else {
			// sub level
			var tObj = null;
			for (var q=0; q<this.idPull[id].childNodes[1].childNodes.length; q++) {
				if (String(this.idPull[id].childNodes[1].childNodes[q].className||"") == "sub_item_text") tObj = this.idPull[id].childNodes[1].childNodes[q];
			}
			if (String(this.itemPull[id]["title"]).length == "" || this.itemPull[id]["title"] == null) {
				if (tObj) {
					tObj.parentNode.removeChild(tObj);
					tObj = null;
					this.idPull[id].childNodes[1].innerHTML = "&nbsp;";
				}
			} else {
				if (!tObj) {
					tObj = document.createElement("DIV");
					tObj.className = "sub_item_text";
					this.idPull[id].childNodes[1].innerHTML = "";
					this.idPull[id].childNodes[1].appendChild(tObj);
				}
				tObj.innerHTML = this.itemPull[id]["title"];
			}
		}
	}
}
/****************************************************************************************************************************************************/
/**
*   @desc: loads menu data from an html and calls onLoadFunction when loading is done
*   @param: object - html data container
*   @param: clearAfterAdd - true|false, removes the container object after the data is loaded
*   @param: onLoadFunction - is called after the data is loaded (but before clearing html content if clear is set to true)
*   @type: public
*/
dhtmlXMenuObject.prototype.loadFromHTML = function(objId, clearAfterAdd, onLoadFunction) {
	//alert(4)
	// this.idPrefix = this._genStr(12);
	this.itemTagName = "DIV";
	if (typeof(objId) == "string") { objId = document.getElementById(objId); }
	this._buildMenu(objId, null);
	this.init();
	if (clearAfterAdd) { objId.parentNode.removeChild(objId); }
	if (onLoadFunction != null) { onLoadFunction(); }
}
/****************************************************************************************************************************************************/
/*								 	SHOW/HIDE								    */
/**
*   @desc: hides an item
*   @param: id - the item to hide
*   @type: public
*/
dhtmlXMenuObject.prototype.hideItem = function(id) {
	this._changeItemVisible(id, false);
}
/**
*   @desc: shows an item
*   @param: id - the item to show
*   @type: public
*/
dhtmlXMenuObject.prototype.showItem = function(id) {
	this._changeItemVisible(id, true);
}
/**
*   @desc: returns true if the item is hidden
*   @param: id - the item to check
*   @type: public
*/
dhtmlXMenuObject.prototype.isItemHidden = function(id) {
	var isHidden = null;
	if (this.idPull[this.idPrefix+id] != null) { isHidden = (this.idPull[this.idPrefix+id].style.display == "none"); }
	return isHidden;
}
/* show/hide item in menu, optimized for version 0.3 */
dhtmlXMenuObject.prototype._changeItemVisible = function(id, visible) {
	var itemId = this.idPrefix+id;
	if (this.itemPull[itemId] == null) return;
	if (this.itemPull[itemId]["type"] == "separator") { itemId = "separator_"+itemId; }
	if (this.idPull[itemId] == null) return;
	this.idPull[itemId].style.display = (visible?"":"none");
	this._redefineComplexState(this.itemPull[this.idPrefix+id]["parent"]);
}
/****************************************************************************************************************************************************/
/*								 	USERDATA								    */
//#menu_userdata:06062008{
/**
*   @desc: sets userdata for an item
*   @param: id - the item
*   @param: name - the name of userdata (string)
*   @param: value - the value of userdata (usually string)
*   @type: public
*/
dhtmlXMenuObject.prototype.setUserData = function(id, name, value) {
	this.userData[this.idPrefix+id+"_"+name] = value;
}

/**
*   @desc: returns item's userdata
*   @param: id - the item
*   @param: name - the name of userdata (string)
*   @type: public
*/
dhtmlXMenuObject.prototype.getUserData = function(id, name) {
	return (this.userData[this.idPrefix+id+"_"+name]!=null?this.userData[this.idPrefix+id+"_"+name]:null);
}
//#}
/****************************************************************************************************************************************************/
/*								 	OPENMODE/TIMEOUT							    */
/**
*   @desc: sets open mode for the menu
*   @param: mode - win|web, the default mode is web, in the win mode a user should click anywhere to hide the menu, in the web mode - just put the mouse pointer out of the menu area
*   @type: public
*/
dhtmlXMenuObject.prototype.setOpenMode = function(mode) {
	if (mode == "win" || mode == "web") this.menuMode = mode; else this.menuMode == "web"; 
}
/**
*   @desc: sets hide menu timeout (web mode only)
*   @param: tm - timeout, ms, 400 default
*   @type: public
*/
dhtmlXMenuObject.prototype.setWebModeTimeout = function(tm) {
	this.menuTimeoutMsec = (!isNaN(tm)?tm:400);
}
/****************************************************************************************************************************************************/
/*								 	DYNAMICAL LOADING							    */
/**
*   @desc: enables dynamic loading of sublevels
*   @param: url - server-side script, transmitted params are action=loadMenu and parentId 
*   @param: icon - true|false, replaces elemet's arrow with loading image while loading
*   @type: public
*/
dhtmlXMenuObject.prototype.enableDynamicLoading = function(url, icon) {
	this.dLoad = true;
	this.dLoadUrl = url;
	this.dLoadSign = (String(this.dLoadUrl).search(/\?/)==-1?"?":"&");
	this.loaderIcon = icon;
	this.init();
}
/* internal, show/hide loader icon */
dhtmlXMenuObject.prototype._updateLoaderIcon = function(id, state) {
	
	if (this.idPull[id] == null) return;
	if (String(this.idPull[id].className).search("TopLevel_Item") >= 0) return;
	// get arrow
	var ind = (this._rtl?0:2);
	if (!this.idPull[id].childNodes[ind]) return;
	if (!this.idPull[id].childNodes[ind].childNodes[0]) return;
	var aNode = this.idPull[id].childNodes[ind].childNodes[0];
	if (String(aNode.className).search("complex_arrow") === 0) aNode.className = "complex_arrow"+(state?"_loading":"");

}
/****************************************************************************************************************************************************/
/*								 	IMAGES									    */
/**
*   @desc: returns item's image - array(img, imgDis)
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getItemImage = function(id) {
	var imgs = new Array(null, null);
	id = this.idPrefix+id;
	if (this.itemPull[id]["type"] == "item") {
		imgs[0] = this.itemPull[id]["imgen"];
		imgs[1] = this.itemPull[id]["imgdis"];
	}
	return imgs;
}
/**
*   @desc: sets an image for the item
*   @param: id - the item
*   @param: img - the image for the enabled item (empty string for none)
*   @param: imgDis - the image for the disabled item (empty string for none)
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemImage = function(id, img, imgDis) {
	if (this.itemPull[this.idPrefix+id]["type"] != "item") return;
	this.itemPull[this.idPrefix+id]["imgen"] = img;
	this.itemPull[this.idPrefix+id]["imgdis"] = imgDis;
	this._updateItemImage(id, this._getItemLevelType(id));
}
/**
*   @desc: removes both enabled and disabled item images
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.clearItemImage = function(id) {
	this.setItemImage(id, "", "");
}
/****************************************************************************************************************************************************/
/*								 	CONTEXT STUFF								    */
/* public: context menu auto open/close enable/disable */
/**
*   @desc: sets to false to prevent showing a contextual menu by a click
*   @param: mode - true/false
*   @type: public
*/
dhtmlXMenuObject.prototype.setAutoShowMode = function(mode) {
	this.contextAutoShow = (mode==true?true:false);
}
/**
*   @desc: sets to false to prevent hiding a contextual menu by a click
*   @param: mode - true/false
*   @type: public
*/
dhtmlXMenuObject.prototype.setAutoHideMode = function(mode) {
	this.contextAutoHide = (mode==true?true:false);
}

/**
*   @desc: sets to true will hide all opened contextual menu polygons on mouseout
*   @param: mode - true/false
*   @type: public
*/
dhtmlXMenuObject.prototype.setContextMenuHideAllMode = function(mode) {
	this.contextHideAllMode = (mode==true?true:false);
}
/**
*   @desc: retutn hide all contextual menu mode
*   @type: public
*/
dhtmlXMenuObject.prototype.getContextMenuHideAllMode = function() {
	return this.contextHideAllMode;
}
/****************************************************************************************************************************************************/
/*								 	VISIBLE AREA								    */
/**
*   @desc: sets the area in which the menu can appear, if the area is not set, the menu will occupy all available visible space
*   @param: x1, x2 - int, leftmost and rightmost coordinates by x axis
*   @param: y1, y2 - int, topmost and bottommost coordinates by y axis
*   @type: public
*/
dhtmlXMenuObject.prototype.setVisibleArea = function(x1, x2, y1, y2) {
	this._isVisibleArea = true;
	this.menuX1 = x1;
	this.menuX2 = x2;
	this.menuY1 = y1;
	this.menuY2 = y2;
}
/****************************************************************************************************************************************************/
/*								 	TOOLTOPS								    */
// tooltips, added in 0.4
/**
*   @desc: sets tooltip for a menu item
*   @param: id - menu item's id
*   @param: tip - tooltip
*   @type: public
*/
dhtmlXMenuObject.prototype.setTooltip = function(id, tip) {
	id = this.idPrefix+id;
	if (!(this.itemPull[id] != null && this.idPull[id] != null)) return;
	this.idPull[id].title = (tip.length > 0 ? tip : null);
	this.itemPull[id]["tip"] = tip;
}
/**
*   @desc: returns tooltip of a menu item
*   @param: id - menu item's id
*   @type: public
*/
dhtmlXMenuObject.prototype.getTooltip = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	return this.itemPull[this.idPrefix+id]["tip"];
}
/****************************************************************************************************************************************************/
/*								 	HOTKEYS									    */
//#menu_hotkey:06062008#{
// hot-keys, added in 0.4
/**
*   @desc: sets menu hot-key (just text label)
*   @param: id - menu item's id
*   @param: hkey - hot-key text
*   @type: public
*/
dhtmlXMenuObject.prototype.setHotKey = function(id, hkey) {
	
	id = this.idPrefix+id;
	
	if (!(this.itemPull[id] != null && this.idPull[id] != null)) return;
	if (this.itemPull[id]["parent"] == this.idPrefix+this.topId && !this.context) return;
	if (this.itemPull[id]["complex"]) return;
	var t = this.itemPull[id]["type"];
	if (!(t == "item" || t == "checkbox" || t == "radio")) return;
	
	// retrieve obj
	var hkObj = null;
	try { if (this.idPull[id].childNodes[this._rtl?0:2].childNodes[0].className == "sub_item_hk") hkObj = this.idPull[id].childNodes[this._rtl?0:2].childNodes[0]; } catch(e){}
	
	if (hkey.length == 0) {
		// remove if exists
		this.itemPull[id]["hotkey_backup"] = this.itemPull[id]["hotkey"];
		this.itemPull[id]["hotkey"] = "";
		if (hkObj != null) hkObj.parentNode.removeChild(hkObj);
		
	} else {
		
		// add if needed or change
		this.itemPull[id]["hotkey"] = hkey;
		this.itemPull[id]["hotkey_backup"] = null;
		//
		if (hkObj == null) {
			hkObj = document.createElement("DIV");
			hkObj.className = "sub_item_hk";
			var item = this.idPull[id].childNodes[this._rtl?0:2];
			while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
			item.appendChild(hkObj);
		}
		hkObj.innerHTML = hkey;

	}
}
/**
*   @desc: returns item's hot-key (just text label)
*   @param: id - menu item's id
*   @type: public
*/
dhtmlXMenuObject.prototype.getHotKey = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	return this.itemPull[this.idPrefix+id]["hotkey"];
}
/****************************************************************************************************************************************************/
/*								 	MISC									    */
//#}
/* set toplevel item selected */
dhtmlXMenuObject.prototype.setItemSelected = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	// console.log(this.itemPull[this.idPrefix+id]);
	
}
/**
*   @desc: set top level additional text (in case of usual menubar)
*   @param: text - text
*   @type: public
*/
dhtmlXMenuObject.prototype.setTopText = function(text) {
	if (this.context) return;
	if (this._topText == null) {
		this._topText = document.createElement("DIV");
		this._topText.className = "dhtmlxMenu_TopLevel_Text_"+(this._rtl?"left":(this._align=="left"?"right":"left"));
		this.base.appendChild(this._topText);
	}
	this._topText.innerHTML = text;
}
/**
*   @desc: set top level menu align
*   @param: align - left|right
*   @type: public
*/
dhtmlXMenuObject.prototype.setAlign = function(align) {
	if (this._align == align) return;
	if (align == "left" || align == "right") {
		// if (this.setRTL) this.setRTL(false);
		this._align = align;
		if (this.cont) this.cont.className = (this._align=="right"?"align_right":"align_left");
		if (this._topText != null) this._topText.className = "dhtmlxMenu_TopLevel_Text_"+(this._align=="left"?"right":"left");
	}
}
/**
*   @desc: set href to item, overwrite old if exists
*   @param: itemId
*   @param: href - url to open instead of onClik event handling
*   @param: target - target attribute
*   @type: public
*/
dhtmlXMenuObject.prototype.setHref = function(itemId, href, target) {
	if (this.itemPull[this.idPrefix+itemId] == null) return;
	this.itemPull[this.idPrefix+itemId]["href_link"] = href;
	if (target != null) this.itemPull[this.idPrefix+itemId]["href_target"] = target;
}
/**
*   @desc: clears item href and back item to default onClick behavior
*   @param: itemId
*   @type: public
*/
dhtmlXMenuObject.prototype.clearHref = function(itemId) {
	if (this.itemPull[this.idPrefix+itemId] == null) return;
	delete this.itemPull[this.idPrefix+itemId]["href_link"];
	delete this.itemPull[this.idPrefix+itemId]["href_target"];
}
/*
File [id="file"] -> Open [id="open"] -> Last Save [id="lastsave"]
getCircuit("lastsave") will return Array("file", "open", "lastsave");
*/
/**
*   @desc: return array with ids from topmost parent to chosen item
*   @param: id - chosen item id
*   @type: public
*/
dhtmlXMenuObject.prototype.getCircuit = function(id) {
	var parents = new Array(id);
	while (this.getParentId(id) != this.topId) {
		id = this.getParentId(id);
		parents[parents.length] = id;
	}
	return parents.reverse();
}
/* export to function */
/* WTF?
dhtmlXMenuObject.prototype.generateSQL = function() {
	var sql = "INSERT INTO `dhtmlxmenu_demo` (`itemId`, `itemParentId`, `itemOrder`, `itemText`, `itemType`, `itemEnabled`, `itemChecked`, `itemGroup`, `itemImage`, `itemImageDis`) VALUES ";
	var values = "";
	var q = 0;
	for (var a in this.itemPull) {
		values += (values.length>0?", ":"")+"('"+a.replace(this.idPrefix,"")+"',"+
						     "'"+(this.itemPull[a]["parent"]!=null?this.itemPull[a]["parent"].replace(this.idPrefix,""):"")+"',"+
						     "'"+(q++)+"',"+
						     "'"+this.itemPull[a]["title"]+"',"+
						     "'"+(this.itemPull[a]["type"]!="item"?this.itemPull[a]["type"]:"")+"',"+
						     "'"+(this.itemPull[a]["state"]=="enabled"?"1":"0")+"',"+
						     "'"+(this.itemPull[a]["checked"]!=null?(this.itemPull[a]["checked"]?"1":"0"):"0")+"',"+
						     "'"+(this.itemPull[a]["group"]!=null?this.itemPull[a]["group"]:"")+"',"+
						     "'"+this.itemPull[a]["imgen"]+"',"+
						     "'"+this.itemPull[a]["imgdis"]+"')";
	}
	return sql+values;
}
*/
//#menu_overflow:06062008#{
/****************************************************************************************************************************************************/
/*								 	OVERFLOW								    */
/* clear all selected subitems in polygon, implemented in 0.4 */
dhtmlXMenuObject.prototype._clearAllSelectedSubItemsInPolygon = function(polygon) {
	var subIds = this._getSubItemToDeselectByPolygon(polygon);
	// hide opened polygons and selected items
	for (var q=0; q<this._openedPolygons.length; q++) { if (this._openedPolygons[q] != polygon) { this._hidePolygon(this._openedPolygons[q]); } }
	for (var q=0; q<subIds.length; q++) { if (this.idPull[subIds[q]] != null) { if (this.itemPull[subIds[q]]["state"] == "enabled") { this.idPull[subIds[q]].className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_Item_Normal"; } } }
}
/* define normal/disabled arrows in polygon */
dhtmlXMenuObject.prototype._checkArrowsState = function(id) {
	var polygon = this.idPull["polygon_"+id];
	var arrowUp = this.idPull["arrowup_"+id];
	var arrowDown = this.idPull["arrowdown_"+id];
	if (polygon.scrollTop == 0) {
		arrowUp.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp_Disabled";
	} else {
		arrowUp.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp" + (arrowUp.over ? "_Over" : "");
	}
	if (polygon.scrollTop + polygon.offsetHeight < polygon.scrollHeight) {
		arrowDown.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown" + (arrowDown.over ? "_Over" : "");
	} else {
		arrowDown.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown_Disabled";
	}
}
/* add up-limit-arrow */
dhtmlXMenuObject.prototype._addUpArrow = function(id) {
	var main_self = this;
	var arrow = document.createElement("DIV");
	arrow.pId = this.idPrefix+id;
	arrow.id = "arrowup_"+this.idPrefix+id;
	arrow.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp";
	arrow.innerHTML = "<div class='dhtmlxMenu_"+this.skin+"_SubLevelArea_Arrow'><div class='dhtmlxMenu_SubLevelArea_Arrow_Icon'></div></div>";
	arrow.style.display = "none";
	arrow.over = false;
	arrow.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
	arrow.oncontextmenu = function(e) { e = e||event; e.returnValue = false; return false; }
	// actions
	arrow.onmouseover = function() {
		if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
		main_self._clearAllSelectedSubItemsInPolygon(this.pId);
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Over";
		this.over = true;
		main_self._canScrollUp = true;
		main_self._doScrollUp(this.pId, true);
	}
	arrow.onmouseout = function() {
		if (main_self.menuMode == "web") {
			window.clearTimeout(main_self.menuTimeoutHandler);
			main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");
		}
		this.over = false;
		main_self._canScrollUp = false;
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp";
		window.clearTimeout(main_self._scrollUpTM);
	}
	arrow.onclick = function(e) {
		e = e||event;
		e.returnValue = false;
		e.cancelBubble = true;
		return false;
	}
	//
	// var polygon = this.idPull["polygon_"+this.idPrefix+id];
	// polygon.insertBefore(arrow, polygon.childNodes[0]);
	document.body.insertBefore(arrow, document.body.firstChild);
	this.idPull[arrow.id] = arrow;
}
dhtmlXMenuObject.prototype._addDownArrow = function(id) {
	var main_self = this;
	var arrow = document.createElement("DIV");
	arrow.pId = this.idPrefix+id;
	arrow.id = "arrowdown_"+this.idPrefix+id;
	arrow.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown";
	arrow.innerHTML = "<div class='dhtmlxMenu_"+this.skin+"_SubLevelArea_Arrow'><div class='dhtmlxMenu_SubLevelArea_Arrow_Icon'></div></div>";
	arrow.style.display = "none";
	arrow.over = false;
	arrow.onselectstart = function(e) { e = e||event; e.returnValue = false; return false; }
	arrow.oncontextmenu = function(e) { e = e||event; e.returnValue = false; return false; }
	// actions
	arrow.onmouseover = function() {
		if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
		main_self._clearAllSelectedSubItemsInPolygon(this.pId);
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Over";
		this.over = true;
		main_self._canScrollDown = true;
		main_self._doScrollDown(this.pId, true);
	}
	arrow.onmouseout = function() {
		if (main_self.menuMode == "web") {
			window.clearTimeout(main_self.menuTimeoutHandler);
			main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");
		}
		this.over = false;
		main_self._canScrollDown = false;
		if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Disabled") return;
		this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown";
		window.clearTimeout(main_self._scrollDownTM);
	}
	arrow.onclick = function(e) {
		e = e||event;
		e.returnValue = false;
		e.cancelBubble = true;
		return false;
	}
	document.body.insertBefore(arrow, document.body.firstChild);
	this.idPull[arrow.id] = arrow;
}
dhtmlXMenuObject.prototype._removeUpArrow = function(id) {
	var fullId = "arrowup_"+this.idPrefix+id;
	this._removeArrow(fullId);
}
dhtmlXMenuObject.prototype._removeDownArrow = function(id) {
	var fullId = "arrowdown_"+this.idPrefix+id;
	this._removeArrow(fullId);
}
dhtmlXMenuObject.prototype._removeArrow = function(fullId) {
	var arrow = this.idPull[fullId];
	arrow.onselectstart = null;
	arrow.oncontextmenu = null;
	arrow.onmouseover = null;
	arrow.onmouseout = null;
	arrow.onclick = null;
	if (arrow.parentNode) arrow.parentNode.removeChild(arrow);
	arrow = null;
	this.idPull[fullId] = null;
	try { delete this.idPull[fullId]; } catch(e) {}
}
dhtmlXMenuObject.prototype._isArrowExists = function(id) {
	if (this.idPull["arrowup_"+id] != null && this.idPull["arrowdown_"+id] != null) return true;
	return false;
}
/* scroll down */
dhtmlXMenuObject.prototype._doScrollUp = function(id, checkArrows) {
	var polygon = this.idPull["polygon_"+id];
	if (this._canScrollUp && polygon.scrollTop > 0) {
		var theEnd = false;
		var nextScrollTop = polygon.scrollTop - this._scrollUpTMStep;
		if (nextScrollTop < 0) {
			theEnd = true;
			nextScrollTop = 0;
		}
		polygon.scrollTop = nextScrollTop;
		if (!theEnd) {
			var that = this;
			this._scrollUpTM = window.setTimeout(function() { that._doScrollUp(id, false); }, this._scrollUpTMTime);
		}
	} else {
		this._canScrollUp = false;
		this._checkArrowsState(id);
	}
	if (checkArrows) {
		this._checkArrowsState(id);
	}
}
dhtmlXMenuObject.prototype._doScrollDown = function(id, checkArrows) {
	var polygon = this.idPull["polygon_"+id];
	if (this._canScrollDown && polygon.scrollTop + polygon.offsetHeight <= polygon.scrollHeight) {
		var theEnd = false;
		var nextScrollTop = polygon.scrollTop + this._scrollDownTMStep;
		if (nextScrollTop + polygon.offsetHeight > polygon.scollHeight) {
			theEnd = true;
			nextScrollTop = polygon.scollHeight - polygon.offsetHeight;
		}
		polygon.scrollTop = nextScrollTop;
		if (!theEnd) {
			var that = this;
			this._scrollDownTM = window.setTimeout(function() { that._doScrollDown(id, false); }, this._scrollDownTMTime);
		}
	} else {
		this._canScrollDown
		this._checkArrowsState(id);
	}
	if (checkArrows) {
		this._checkArrowsState(id);
	}
}
//
dhtmlXMenuObject.prototype._countPolygonItems = function(id) {
	var count = 0;
	for (var a in this.itemPull) {
		var par = this.itemPull[a]["parent"];
		var tp = this.itemPull[a]["type"];
		if (par == this.idPrefix+id && (tp == "item" || tp == "radio" || tp == "checkbox")) { count++; }
	}
	return count;
}
/* limit maximum items on single polygon, default - 0 = no limit */
/**
*   @desc: limits the maximum number of visible items in polygons
*   @param: itemsNum - count of the maximum number of visible items
*   @type: public
*/
dhtmlXMenuObject.prototype.setOverflowHeight = function(itemsNum) {
	
	// set auto overflow mode
	if (itemsNum === "auto") {
		this.limit = 0;
		this.autoOverflow = true;
		return;
	}
	
	// no existing limitation, now new limitation
	if (this.limit == 0 && itemsNum <= 0) return;
	
	// hide menu to prevent visible changes
	this._clearAndHide();
	
	// redefine existing limitation, arrows will added automatically with showPlygon
	if (this.limit >= 0 && itemsNum > 0) {
		this.limit = itemsNum;
		return;
	}
	
	// remove existing limitation
	if (this.limit > 0 && itemsNum <= 0) {
		for (var a in this.itemPull) {
			if (this._isArrowExists(a)) {
				var b = String(a).replace(this.idPrefix, "");
				this._removeUpArrow(b);
				this._removeDownArrow(b);
				// remove polygon's height
				this.idPull["polygon_"+a].style.height = "";
			}
		}
		this.limit = 0;
		return;
	}
}
//#}
/****************************************************************************************************************************************************/
/*								 	RADIOBUTTONS								    */
//#menu_radio:06062008{
dhtmlXMenuObject.prototype._getRadioImgObj = function(id) {
	try { var imgObj = this.idPull[this.idPrefix+id].childNodes[(this._rtl?2:0)].childNodes[0] } catch(e) { var imgObj = null; }
	return imgObj;
}
dhtmlXMenuObject.prototype._setRadioState = function(id, state) {
	// if (this.itemPull[this.idPrefix+id]["state"] != "enabled") return;
	var imgObj = this._getRadioImgObj(id);
	if (imgObj != null) {
		// fix, added in 0.4
		var rObj = this.itemPull[this.idPrefix+id];
		rObj["checked"] = state;
		rObj["imgen"] = "rdbt_"+(rObj["checked"]?"1":"0");
		rObj["imgdis"] = rObj["imgen"];
		imgObj.className = "sub_icon "+rObj["imgen"];
	}
}
dhtmlXMenuObject.prototype._radioOnClickHandler = function(id, type, casState) {
	if (type.charAt(1)=="d" || this.itemPull[this.idPrefix+id]["group"]==null) return;
	// deselect all from the same group
	var group = this.itemPull[this.idPrefix+id]["group"];
	if (this.checkEvent("onRadioClick")) {
		if (this.callEvent("onRadioClick", [group, this.getRadioChecked(group), id, this.contextMenuZoneId, casState])) {
			this.setRadioChecked(group, id);
		}
	} else {
		this.setRadioChecked(group, id);
	}
	// call onClick if exists
	if (this.checkEvent("onClick")) this.callEvent("onClick", [id]);
}
/**
*   @desc: returns a checked radio button in the group
*   @param: group - radio button group
*   @type: public
*/
dhtmlXMenuObject.prototype.getRadioChecked = function(group) {
	var id = null;
	for (var q=0; q<this.radio[group].length; q++) {
		var itemId = this.radio[group][q].replace(this.idPrefix, "");
		var imgObj = this._getRadioImgObj(itemId);
		if (imgObj != null) {
			var checked = (imgObj.className).match(/rdbt_1$/gi);
			if (checked != null) id = itemId;
		}
	}
	return id;
}
/**
*   @desc: checks a radio button inside the group
*   @param: group - radio button group
*   @param: id - radio button's id
*   @type: public
*/
dhtmlXMenuObject.prototype.setRadioChecked = function(group, id) {
	if (this.radio[group] == null) return;
	for (var q=0; q<this.radio[group].length; q++) {
		var itemId = this.radio[group][q].replace(this.idPrefix, "");
		this._setRadioState(itemId, (itemId==id));
	}
}
/**
*   @desc: adds a new radio button, sibling|child mode
*   @param: mode - (string) sibling|child
*   @param: nextToId - the item after which the radio button will be added in the "sibling" mode or parent item's id in the "child" mode
*   @param: pos - the item's position in the child mode (null for sibling)
*   @param: itemId - id of a new radio button
*   @param: itemText - text of a new radio button
*   @param: group - radiogroup's id
*   @param: state - checked|unchecked
*   @param: disabled - enabled|disabled
*   @type: public
*/
dhtmlXMenuObject.prototype.addRadioButton = function(mode, nextToId, pos, itemId, itemText, group, state, disabled) {
	// radiobutton
	/*
	if (this.itemPull[this.idPrefix+nextToId] == null) return;
	if (this.itemPull[this.idPrefix+nextToId]["parent"] == this.idPrefix+this.topId) return;
	*/
	if (this.context && nextToId == this.topId) {
		// adding radiobutton as first element to context menu
		// do nothing
	} else {
		if (this.itemPull[this.idPrefix+nextToId] == null) return;
		if (mode == "child" && this.itemPull[this.idPrefix+nextToId]["type"] != "item") return;
		// if (this.itemPull[this.idPrefix+nextToId]["parent"] == this.idPrefix+this.topId && !this.context) return;
	}
	
	//
	//
	var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
	var img = "rdbt_"+(state?"1":"0");
	var imgDis = img;
	//
	if (mode == "sibling") {
		var parentId = this.idPrefix+this.getParentId(nextToId);
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "radio", disabled, img, imgDis);
		this._renderSublevelItem(id, this.getItemPosition(nextToId));
	} else {
		var parentId = this.idPrefix+nextToId;
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "radio", disabled, img, imgDis);
		if (this.idPull["polygon_"+parentId] == null) { this._renderSublevelPolygon(parentId, parentId); }
		this._renderSublevelItem(id, pos-1);
		this._redefineComplexState(parentId);
	}
	//
	var gr = (group!=null?group:this._genStr(24));
	this.itemPull[id]["group"] = gr;
	//
	if (this.radio[gr]==null) { this.radio[gr] = new Array(); }
	this.radio[gr][this.radio[gr].length] = id;
	//
	if (state == true) this.setRadioChecked(gr, String(id).replace(this.idPrefix, ""));
}
//#}
/****************************************************************************************************************************************************/
/*								 	CHECKBOXES								    */
//#menu_checks:06062008{
dhtmlXMenuObject.prototype._getCheckboxState = function(id) {
	if (this.itemPull[this.idPrefix+id] == null) return null;
	return this.itemPull[this.idPrefix+id]["checked"];
}
dhtmlXMenuObject.prototype._setCheckboxState = function(id, state) {
	if (this.itemPull[this.idPrefix+id] == null) return;
	this.itemPull[this.idPrefix+id]["checked"] = state;
}
dhtmlXMenuObject.prototype._updateCheckboxImage = function(id) {
	if (this.idPull[this.idPrefix+id] == null) return;
	this.itemPull[this.idPrefix+id]["imgen"] = "chbx_"+(this._getCheckboxState(id)?"1":"0");
	this.itemPull[this.idPrefix+id]["imgdis"] = this.itemPull[this.idPrefix+id]["imgen"];
	try { this.idPull[this.idPrefix+id].childNodes[(this._rtl?2:0)].childNodes[0].className = "sub_icon "+this.itemPull[this.idPrefix+id]["imgen"]; } catch(e){}
}
dhtmlXMenuObject.prototype._checkboxOnClickHandler = function(id, type, casState) {
	if (type.charAt(1)=="d") return;
	if (this.itemPull[this.idPrefix+id] == null) return;
	var state = this._getCheckboxState(id);
	if (this.checkEvent("onCheckboxClick")) {
		if (this.callEvent("onCheckboxClick", [id, state, this.contextMenuZoneId, casState])) {
			this.setCheckboxState(id, !state);
		}
	} else {
		this.setCheckboxState(id, !state);
	}
	// call onClick if exists
	if (this.checkEvent("onClick")) this.callEvent("onClick", [id]);
}
/**
*   @desc: sets checkbox's state
*   @param: id - the item
*   @param: state - a new state (true|false)
*   @type: public
*/
dhtmlXMenuObject.prototype.setCheckboxState = function(id, state) {
	this._setCheckboxState(id, state);
	this._updateCheckboxImage(id);
}
/**
*   @desc: returns current checkbox's state
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getCheckboxState = function(id) {
	return this._getCheckboxState(id);
}
/**
*   @desc: adds a new checkbox, sibling|child mode
*   @param: mode - (string) sibling|child
*   @param: nextToId - the item after which the checkbox will be added in the "sibling" mode or parent item's id in the "child" mode
*   @param: pos - item's position in the child mode (null for sibling)
*   @param: itemId - id of a new checkbox
*   @param: itemText - text of a new checkbox
*   @param: state - checked|unchecked
*   @param: disabled - enabled|disabled
*   @type: public
*/
dhtmlXMenuObject.prototype.addCheckbox = function(mode, nextToId, pos, itemId, itemText, state, disabled) {
	// checks
	if (this.context && nextToId == this.topId) {
		// adding checkbox as first element to context menu
		// do nothing
	} else {
		if (this.itemPull[this.idPrefix+nextToId] == null) return;
		if (mode == "child" && this.itemPull[this.idPrefix+nextToId]["type"] != "item") return;
		// if (this.itemPull[this.idPrefix+nextToId]["parent"] == this.idPrefix+this.topId && !this.context) return;
	}
	//
	var img = "chbx_"+(state?"1":"0");
	var imgDis = img;
	//
	
	if (mode == "sibling") {
		
		var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
		var parentId = this.idPrefix+this.getParentId(nextToId);
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "checkbox", disabled, img, imgDis);
		this.itemPull[id]["checked"] = state;
		this._renderSublevelItem(id, this.getItemPosition(nextToId));
	} else {
		
		var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));
		var parentId = this.idPrefix+nextToId;
		this._addItemIntoGlobalStrorage(id, parentId, itemText, "checkbox", disabled, img, imgDis);
		this.itemPull[id]["checked"] = state;
		if (this.idPull["polygon_"+parentId] == null) { this._renderSublevelPolygon(parentId, parentId); }
		this._renderSublevelItem(id, pos-1);
		this._redefineComplexState(parentId);
	}
}
//#}
/****************************************************************************************************************************************************/
/*								 	SERIALIZE								    */
dhtmlXMenuObject.prototype._readLevel = function(parentId) {
	var xml = "";
	for (var a in this.itemPull) {
		if (this.itemPull[a]["parent"] == parentId) {
			var imgEn = "";
			var imgDis = "";
			var hotKey = "";
			var itemId = String(this.itemPull[a]["id"]).replace(this.idPrefix,"");
			var itemType = "";
			var itemText = (this.itemPull[a]["title"]!=""?' text="'+this.itemPull[a]["title"]+'"':"");
			var itemState = "";
			if (this.itemPull[a]["type"] == "item") {
				if (this.itemPull[a]["imgen"] != "") imgEn = ' img="'+this.itemPull[a]["imgen"]+'"';
				if (this.itemPull[a]["imgdis"] != "") imgDis = ' imgdis="'+this.itemPull[a]["imgdis"]+'"';
				if (this.itemPull[a]["hotkey"] != "") hotKey = '<hotkey>'+this.itemPull[a]["hotkey"]+'</hotkey>';
			}
			if (this.itemPull[a]["type"] == "separator") {
				itemType = ' type="separator"';
			} else {
				if (this.itemPull[a]["state"] == "disabled") itemState = ' enabled="false"';
			}
			if (this.itemPull[a]["type"] == "checkbox") {
				itemType = ' type="checkbox"'+(this.itemPull[a]["checked"]?' checked="true"':"");
			}
			if (this.itemPull[a]["type"] == "radio") {
				itemType = ' type="radio" group="'+this.itemPull[a]["group"]+'" '+(this.itemPull[a]["checked"]?' checked="true"':"");
			}
			xml += "<item id='"+itemId+"'"+itemText+itemType+imgEn+imgDis+itemState+">";
			xml += hotKey;
			if (this.itemPull[a]["complex"]) xml += this._readLevel(a);
			xml += "</item>";
		}
	}
	return xml;
}
/**
*   @desc: serialize menu to xml
*   @type: public
*/
dhtmlXMenuObject.prototype.serialize = function() {
	var xml = "<menu>"+this._readLevel(this.idPrefix+this.topId)+"</menu>";
	return xml;
}
/****************************************************************************************************************************************************/


/**
*   @desc: a constructor, creates a new dhtmlxMenu object, baseId defines a base object for the top menu level
*   @param: baseId - id of the html element to which a menu will be attached, in case of a contextual menu - if specified, will used as a contextual zone
*   @type: public
*/
function dhtmlXMenuObject(baseId, skin) {
    var main_self = this;

    this.addBaseIdAsContextZone = null;

    this.isDhtmlxMenuObject = true;

    // skin settings
    this.skin = (skin != null ? skin : (typeof (dhtmlx) != "undefined" && typeof (dhtmlx.skin) == "string" ? dhtmlx.skin : "dhx_skyblue"));
    this.imagePath = "";

    // iframe
    this._isIE6 = false;
    if (_isIE) this._isIE6 = (window.XMLHttpRequest == null ? true : false);

    if (baseId == null) {
        this.base = document.body;
    } else {
        var baseObj = (typeof (baseId) == "string" ? document.getElementById(baseId) : baseId);
        if (baseObj != null) {
            this.base = baseObj;
            if (!this.base.id) this.base.id = (new Date()).valueOf();
            while (this.base.childNodes.length > 0) { this.base.removeChild(this.base.childNodes[0]); }
            this.base.className += " dhtmlxMenu_" + this.skin + "_Middle dir_left";
            this.base._autoSkinUpdate = true;
            // preserv default oncontextmenu for future restorin in case of context menu
            if (this.base.oncontextmenu) this.base._oldContextMenuHandler = this.base.oncontextmenu;
            //
            this.addBaseIdAsContextZone = this.base.id;
            this.base.onselectstart = function(e) { e = e || event; e.returnValue = false; return false; }
            this.base.oncontextmenu = function(e) { e = e || event; e.returnValue = false; return false; }
        } else {
            this.base = document.body;
        }
    }
    // this.topId = topId;
    this.topId = "dhxWebMenuTopId";

    // 
    if (!this.extendedModule) {
        // add notify for menu
        var t = function() { alert(this.i18n.dhxmenuextalert); };
        var extMethods = new Array("setItemEnabled", "setItemDisabled", "isItemEnabled", "_changeItemState", "getItemText", "setItemText",
				"loadFromHTML", "hideItem", "showItem", "isItemHidden", "_changeItemVisible", "setUserData", "getUserData",
				"setOpenMode", "setWebModeTimeout", "enableDynamicLoading", "_updateLoaderIcon", "getItemImage", "setItemImage",
				"clearItemImage", "setAutoShowMode", "setAutoHideMode", "setContextMenuHideAllMode", "getContextMenuHideAllMode",
				"setVisibleArea", "setTooltip", "getTooltip", "setHotKey", "getHotKey", "setItemSelected", "setTopText", "setRTL",
				"setAlign", "setHref", "clearHref", "getCircuit", "_clearAllSelectedSubItemsInPolygon", "_checkArrowsState",
				"_addUpArrow", "_addDownArrow", "_removeUpArrow", "_removeDownArrow", "_isArrowExists", "_doScrollUp", "_doScrollDown",
				"_countPolygonItems", "setOverflowHeight", "_getRadioImgObj", "_setRadioState", "_radioOnClickHandler",
				"getRadioChecked", "setRadioChecked", "addRadioButton", "_getCheckboxState", "_setCheckboxState", "_readLevel",
				"_updateCheckboxImage", "_checkboxOnClickHandler", "setCheckboxState", "getCheckboxState", "addCheckbox", "serialize");
        for (var q = 0; q < extMethods.length; q++) if (!this[extMethods[q]]) this[extMethods[q]] = t;
        extMethods = null;
    }

    // should be used for frameset in IE
    this.fixedPosition = false;

    this.menuSelected = -1;
    this.menuLastClicked = -1;
    this.idPrefix = "";
    this.itemTagName = "item";
    this.itemTextTagName = "itemtext";
    this.userDataTagName = "userdata";
    this.itemTipTagName = "tooltip";
    this.itemHotKeyTagName = "hotkey";
    this.itemHrefTagName = "href";
    this.dirTopLevel = "bottom";
    this.dirSubLevel = "right";
    this.menuX1 = null;
    this.menuX2 = null;
    this.menuY1 = null;
    this.menuY2 = null;
    this.menuMode = "web";
    this.menuTimeoutMsec = 400;
    this.menuTimeoutHandler = null;
    this.autoOverflow = false;
    this.idPull = {};
    this.itemPull = {};
    this.userData = {};
    this.radio = {};
    //
    this._rtl = false;
    this._align = "left";
    //
    this.menuTouched = false;
    //
    this.zIndInit = 1200;
    this.zInd = this.zIndInit;
    this.zIndStep = 50;
    //
    this.menuModeTopLevelTimeout = true; // shows sublevel polygons from toplevel items with delay
    this.menuModeTopLevelTimeoutTime = 200; // msec
    //
    // default skin
    // this.skin = "Standard";

    // skin-based params
    this._topLevelBottomMargin = 1;
    this._topLevelRightMargin = 0;
    this._topLevelOffsetLeft = 1;
    this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -4) : -4); // border fixer for FF for arrows polygons

    /**
    *   @desc: changes menu skin
    *   @param: skin - skin name
    *   @type: public
    */
    this.setSkin = function(skin) {
        var oldSkin = this.skin;
        this.skin = skin;
        switch (this.skin) {
            case "dhx_black":
            case "dhx_blue":
            case "dhx_skyblue":
            case "dhx_web":
                this._topLevelBottomMargin = 2;
                this._topLevelRightMargin = 1;
                this._topLevelOffsetLeft = 1;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -4) : -4);
                break;
            case "dhx_web":
                this._arrowFFFix = 0;
                break;
            case "dhx_terrace":
                this._topLevelBottomMargin = 0;
                this._topLevelRightMargin = 0;
                this._topLevelOffsetLeft = 0;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -4) : -4);
                break;
        }
        if (this.base._autoSkinUpdate) {
            this.base.className = this.base.className.replace("dhtmlxMenu_" + oldSkin + "_Middle", "") + " dhtmlxMenu_" + this.skin + "_Middle";
        }

        for (var a in this.idPull) {
            this.idPull[a].className = String(this.idPull[a].className).replace(oldSkin, this.skin);

        }
    }
    this.setSkin(this.skin);
    //
    this.dLoad = false;
    this.dLoadUrl = "";
    this.dLoadSign = "?";
    this.loaderIcon = false;
    this.limit = 0;
    //
    this._scrollUpTM = null;
    this._scrollUpTMTime = 20;
    this._scrollUpTMStep = 3;
    this._scrollDownTM = null;
    this._scrollDownTMTime = 20;
    this._scrollDownTMStep = 3;
    /* context menu */
    this.context = false;
    this.contextZones = {};
    this.contextMenuZoneId = false;
    this.contextAutoShow = true; /* default open action */
    this.contextAutoHide = true; /* default close action */
    this.contextHideAllMode = true; /* true will hide all opened contextual menu polygons on mouseout, false - all except topleft */

    this._selectedSubItems = new Array();
    this._openedPolygons = new Array();
    this._addSubItemToSelected = function(item, polygon) {
        var t = true;
        for (var q = 0; q < this._selectedSubItems.length; q++) { if ((this._selectedSubItems[q][0] == item) && (this._selectedSubItems[q][1] == polygon)) { t = false; } }
        if (t == true) { this._selectedSubItems.push(new Array(item, polygon)); }
        return t;
    }
    this._removeSubItemFromSelected = function(item, polygon) {
        var m = new Array();
        var t = false;
        for (var q = 0; q < this._selectedSubItems.length; q++) { if ((this._selectedSubItems[q][0] == item) && (this._selectedSubItems[q][1] == polygon)) { t = true; } else { m[m.length] = this._selectedSubItems[q]; } }
        if (t == true) { this._selectedSubItems = m; }
        return t;
    }
    this._getSubItemToDeselectByPolygon = function(polygon) {
        var m = new Array();
        for (var q = 0; q < this._selectedSubItems.length; q++) {
            if (this._selectedSubItems[q][1] == polygon) {
                m[m.length] = this._selectedSubItems[q][0];
                m = m.concat(this._getSubItemToDeselectByPolygon(this._selectedSubItems[q][0]));
                var t = true;
                for (var w = 0; w < this._openedPolygons.length; w++) { if (this._openedPolygons[w] == this._selectedSubItems[q][0]) { t = false; } }
                if (t == true) { this._openedPolygons[this._openedPolygons.length] = this._selectedSubItems[q][0]; }
                this._selectedSubItems[q][0] = -1;
                this._selectedSubItems[q][1] = -1;
            }
        }
        return m;
    }
    /* end */
    /* define polygon's position for dinamic content rendering and shows it, added in version 0.3 */
    this._hidePolygon = function(id) {
        if (this.idPull["polygon_" + id] != null) {
            if (typeof (this._menuEffect) != "undefined" && this._menuEffect !== false) {
                this._hidePolygonEffect("polygon_" + id);
            } else {
                // already hidden
                if (this.idPull["polygon_" + id].style.display == "none") return;
                //
                this.idPull["polygon_" + id].style.display = "none";
                if (this.idPull["arrowup_" + id] != null) { this.idPull["arrowup_" + id].style.display = "none"; }
                if (this.idPull["arrowdown_" + id] != null) { this.idPull["arrowdown_" + id].style.display = "none"; }
                this._updateItemComplexState(id, true, false);
                // hide ie6 cover
                if (this._isIE6) { if (this.idPull["polygon_" + id + "_ie6cover"] != null) { this.idPull["polygon_" + id + "_ie6cover"].style.display = "none"; } }
            }
            // call event
            id = String(id).replace(this.idPrefix, "");
            if (id == this.topId) id = null;
            this.callEvent("onHide", [id]);

            // corners
            if (id != null && this.skin == "dhx_terrace" && this.itemPull[this.idPrefix + id].parent == this.idPrefix + this.topId) {
                this._improveTerraceButton(this.idPrefix + id, true);
            }


        }
    }
    this._showPolygon = function(id, openType) {

        var itemCount = this._countVisiblePolygonItems(id);
        if (itemCount == 0) return;
        var pId = "polygon_" + id;
        if ((this.idPull[pId] != null) && (this.idPull[id] != null)) {

            if (this.menuModeTopLevelTimeout && this.menuMode == "web" && !this.context) {
                if (!this.idPull[id]._mouseOver && openType == this.dirTopLevel) return;
            }

            // detect visible area
            if (!this.fixedPosition) this._autoDetectVisibleArea();

            // show arrows
            var arrUpH = 0;
            var arrDownH = 0;
            //
            var arrowUp = null;
            var arrowDown = null;

            // show polygon
            this.idPull[pId].style.visibility = "hidden";
            this.idPull[pId].style.left = "0px";
            this.idPull[pId].style.top = "0px";
            this.idPull[pId].style.display = "";
            this.idPull[pId].style.zIndex = this.zInd;

            //
            if (this.autoOverflow) {
                if (this.idPull[pId].firstChild.offsetHeight > this.menuY1 + this.menuY2) {
                    var t0 = Math.floor((this.menuY2 - this.menuY1 - 35) / 24);
                    this.limit = t0;
                } else {
                    this.limit = 0;

                    if (this.idPull["arrowup_" + id] != null) this._removeUpArrow(String(id).replace(this.idPrefix, ""));
                    if (this.idPull["arrowdown_" + id] != null) this._removeDownArrow(String(id).replace(this.idPrefix, ""));
                }
            }

            //#menu_overflow:06062008#{
            if (this.limit > 0 && this.limit < itemCount) {

                // add overflow arrows if they not exists
                if (this.idPull["arrowup_" + id] == null) this._addUpArrow(String(id).replace(this.idPrefix, ""));
                if (this.idPull["arrowdown_" + id] == null) this._addDownArrow(String(id).replace(this.idPrefix, ""));

                // configure up arrow
                arrowUp = this.idPull["arrowup_" + id];
                arrowUp.style.visibility = "hidden";
                arrowUp.style.display = "";
                arrowUp.style.zIndex = this.zInd;
                arrUpH = arrowUp.offsetHeight;

                // configure bottom arrow
                arrowDown = this.idPull["arrowdown_" + id];
                arrowDown.style.visibility = "hidden";
                arrowDown.style.display = "";
                arrowDown.style.zIndex = this.zInd;
                arrDownH = arrowDown.offsetHeight;
            }
            //#}

            if (this.limit > 0) {
                if (this.limit < itemCount) {
                    // set fixed size
                    // this.idPull[pId].style.height = this.idPull[pId].tbd.childNodes[0].offsetHeight*this.limit+"px";// + arrUpH + arrDownH;
                    this.idPull[pId].style.height = 24 * this.limit + "px";
                    this.idPull[pId].scrollTop = 0;
                } else {
                    // remove fixed size
                    this.idPull[pId].style.height = "";
                }
            }
            //
            this.zInd += this.zIndStep;
            //
            // console.log(this.idPull)
            if (this.itemPull[id] != null) {
                var parPoly = "polygon_" + this.itemPull[id]["parent"];
            } else if (this.context) {
                var parPoly = this.idPull[this.idPrefix + this.topId];
            }
            /*
            // debug info
            if (parPoly == null) {
            alert("Implementation error. Please report support@dhtmlx.com");
            }
            */
            //
            //
            // define position
            var srcX = (this.idPull[id].tagName != null ? getAbsoluteLeft(this.idPull[id]) : this.idPull[id][0]);
            var srcY = (this.idPull[id].tagName != null ? getAbsoluteTop(this.idPull[id]) : this.idPull[id][1]);
            var srcW = (this.idPull[id].tagName != null ? this.idPull[id].offsetWidth : 0);
            var srcH = (this.idPull[id].tagName != null ? this.idPull[id].offsetHeight : 0);

            var x = 0;
            var y = 0;
            var w = this.idPull[pId].offsetWidth;
            var h = this.idPull[pId].offsetHeight + arrUpH + arrDownH;

            //console.log(srcY,h,window.innerHeight,document.body.scrollTop)
            /*
            var bottomOverflow = (srcY+h > window.innerHeight+document.body.scrollTop);
            if (bottomOverflow) {
            if (openType == "bottom") openType = "top";
            if (openType == "right" || openType == "left") {
            srcY = srcY-h;
            }
            }
            */
            // pos
            if (openType == "bottom") {
                if (this._rtl) {
                    x = srcX + (srcW != null ? srcW : 0) - w;
                } else {
                    if (this._align == "right") {
                        x = srcX + srcW - w;
                    } else {
                        x = srcX - 1 + (openType == this.dirTopLevel ? this._topLevelRightMargin : 0);
                    }
                }
                y = srcY - 1 + srcH + this._topLevelBottomMargin;
            }
            if (openType == "right") { x = srcX + srcW - 1; y = srcY + 2; }
            if (openType == "left") { x = srcX - this.idPull[pId].offsetWidth + 2; y = srcY + 2; }
            if (openType == "top") { x = srcX - 1; y = srcY - h + 2; }

            // overflow check
            if (this.fixedPosition) {
                // use fixed document.body/window dimension if required
                var mx = 65536;
                var my = 65536;
            } else {
                var mx = (this.menuX2 != null ? this.menuX2 : 0);
                var my = (this.menuY2 != null ? this.menuY2 : 0);

                if (mx == 0) {
                    if (window.innerWidth) {
                        mx = window.innerWidth;
                        my = window.innerHeight;
                    } else {
                        mx = document.body.offsetWidth;
                        my = document.body.scrollHeight;
                    }
                }
            }
            if (x + w > mx && !this._rtl) {
                // no space on right, open to left
                x = srcX - w + 2;
            }
            if (x < this.menuX1 && this._rtl) {
                // no space on left, open to right
                x = srcX + srcW - 2;
            }
            if (x < 0) {
                // menu floats left
                x = 0;
            }
            if (y + h > my && this.menuY2 != null) {
                y = Math.max(srcY + srcH - h + 2, (this._isVisibleArea ? this.menuY1 + 2 : 2));
                // open from top level
                if (this.context && this.idPrefix + this.topId == id && arrowDown != null) {
                    // autoscroll prevent because menu mouse pointer will right over downarrow
                    y = y - 2;
                }
                if (this.itemPull[id] != null && !this.context) {
                    if (this.itemPull[id]["parent"] == this.idPrefix + this.topId) y = y - this.base.offsetHeight;
                }
            }
            //
            this.idPull[pId].style.left = x + "px";
            this.idPull[pId].style.top = y + arrUpH + "px";
            //
            if (typeof (this._menuEffect) != "undefined" && this._menuEffect !== false) {
                this._showPolygonEffect(pId);
            } else {
                this.idPull[pId].style.visibility = "";
                //#menu_overflow:06062008#{
                if (this.limit > 0 && this.limit < itemCount) {
                    // this.idPull[pId].scrollTop = 0;
                    arrowUp.style.left = x + "px";
                    arrowUp.style.top = y + "px";
                    arrowUp.style.width = w + this._arrowFFFix + "px";
                    arrowUp.style.visibility = "";
                    //
                    arrowDown.style.left = x + "px";
                    arrowDown.style.top = y + h - arrDownH + "px";
                    arrowDown.style.width = w + this._arrowFFFix + "px";
                    arrowDown.style.visibility = "";
                    //
                    this._checkArrowsState(id);
                }
                //#}
                // show ie6 cover
                if (this._isIE6) {
                    var pIdIE6 = pId + "_ie6cover";
                    if (this.idPull[pIdIE6] == null) {
                        var ifr = document.createElement("IFRAME");
                        ifr.className = "dhtmlxMenu_IE6CoverFix_" + this.skin;
                        ifr.frameBorder = 0;
                        ifr.setAttribute("src", "javascript:false;");
                        document.body.insertBefore(ifr, document.body.firstChild);
                        this.idPull[pIdIE6] = ifr;
                    }
                    this.idPull[pIdIE6].style.left = x + "px";
                    this.idPull[pIdIE6].style.top = y + "px";
                    this.idPull[pIdIE6].style.width = w + "px";
                    this.idPull[pIdIE6].style.height = h + "px";
                    this.idPull[pIdIE6].style.zIndex = this.idPull[pId].style.zIndex - 1;
                    this.idPull[pIdIE6].style.display = "";
                }
            }

            id = String(id).replace(this.idPrefix, "");
            if (id == this.topId) id = null;
            this.callEvent("onShow", [id]);

            // corners
            if (id != null && this.skin == "dhx_terrace" && this.itemPull[this.idPrefix + id].parent == this.idPrefix + this.topId) {
                this._improveTerraceButton(this.idPrefix + id, false);
            }
            // this.callEvent("_onPolyShow",[id.replace(this.idPrefix,"")]);

        }
    }
    /* redistrib sublevel selection: select id and deselect other, added in version 0.3 */
    this._redistribSubLevelSelection = function(id, parentId) {
        // clear previosly selected items
        while (this._openedPolygons.length > 0) this._openedPolygons.pop();
        // this._openedPolygons = new Array();
        var i = this._getSubItemToDeselectByPolygon(parentId);
        this._removeSubItemFromSelected(-1, -1);
        for (var q = 0; q < i.length; q++) { if ((this.idPull[i[q]] != null) && (i[q] != id)) { if (this.itemPull[i[q]]["state"] == "enabled") { this.idPull[i[q]].className = "sub_item"; } } }
        // hide polygons
        for (var q = 0; q < this._openedPolygons.length; q++) { if (this._openedPolygons[q] != parentId) { this._hidePolygon(this._openedPolygons[q]); } }
        // add new selection into list new
        if (this.itemPull[id]["state"] == "enabled") {
            this.idPull[id].className = "sub_item_selected";
            if (this.itemPull[id]["complex"] && this.dLoad && (this.itemPull[id]["loaded"] == "no")) {
                if (this.loaderIcon == true) { this._updateLoaderIcon(id, true); }
                var xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
                this.itemPull[id]["loaded"] = "get";
                this.callEvent("onXLS", []);
                xmlLoader.loadXML(this.dLoadUrl + this.dLoadSign + "action=loadMenu&parentId=" + id.replace(this.idPrefix, "") + "&etc=" + new Date().getTime());
            }
            // show
            if (this.itemPull[id]["complex"] || (this.dLoad && (this.itemPull[id]["loaded"] == "yes"))) {
                // make arrow over
                if ((this.itemPull[id]["complex"]) && (this.idPull["polygon_" + id] != null)) {
                    this._updateItemComplexState(id, true, true);
                    this._showPolygon(id, this.dirSubLevel);
                }
            }
            this._addSubItemToSelected(id, parentId);
            this.menuSelected = id;
        }
    }
    /* onClickMenu action (click on any end item to perform some actions)
    optimized in version 0.3 added type feature (click on disabled items, click on complex nodes)
    attachEvent feature from 0.4 */
    this._doOnClick = function(id, type, casState) {
        this.menuLastClicked = id;
        // href
        if (this.itemPull[this.idPrefix + id]["href_link"] != null && this.itemPull[this.idPrefix + id].state == "enabled") {
            var form = document.createElement("FORM");
            var k = String(this.itemPull[this.idPrefix + id]["href_link"]).split("?");
            form.action = k[0];
            if (k[1] != null) {
                var p = String(k[1]).split("&");
                for (var q = 0; q < p.length; q++) {
                    var j = String(p[q]).split("=");
                    var m = document.createElement("INPUT");
                    m.type = "hidden";
                    m.name = (j[0] || "");
                    m.value = (j[1] || "");
                    form.appendChild(m);
                }
            }
            if (this.itemPull[this.idPrefix + id]["href_target"] != null) { form.target = this.itemPull[this.idPrefix + id]["href_target"]; }
            form.style.display = "none";
            document.body.appendChild(form);
            form.submit();
            if (form != null) {
                document.body.removeChild(form);
                form = null;
            }
            return;
        }
        //
        // some fixes
        if (type.charAt(0) == "c") return; // can't click on complex item
        if (type.charAt(1) == "d") return; // can't click on disabled item
        if (type.charAt(2) == "s") return; // can't click on separator
        //
        if (this.checkEvent("onClick")) {
            // this.callEvent("onClick", [id, type, this.contextMenuZoneId]);
            this.callEvent("onClick", [id, this.contextMenuZoneId, casState]);
        } else {
            if ((type.charAt(1) == "d") || (this.menuMode == "win" && type.charAt(2) == "t")) return;
        }
        if (this.context && this._isContextMenuVisible() && this.contextAutoHide) {
            this._hideContextMenu();
        } else {
            // if menu unloaded from click event
            if (this._clearAndHide) this._clearAndHide();
        }
    }
    /* onTouchMenu action (select topLevel item), attachEvent added in 0.4 */
    this._doOnTouchMenu = function(id) {
        if (this.menuTouched == false) {
            this.menuTouched = true;
            if (this.checkEvent("onTouch")) {
                this.callEvent("onTouch", [id]);
            }
        }
    }
    // this._onTouchHandler = function(id) { }
    // this._setOnTouchHandler = function(handler) { this._onTouchHandler = function(id) { handler(id); } }
    /* return menu array of all nested objects */
    this._searchMenuNode = function(node, menu) {
        var m = new Array();
        for (var q = 0; q < menu.length; q++) {
            if (typeof (menu[q]) == "object") {
                if (menu[q].length == 5) { if (typeof (menu[q][0]) != "object") { if ((menu[q][0].replace(this.idPrefix, "") == node) && (q == 0)) { m = menu; } } }
                var j = this._searchMenuNode(node, menu[q]);
                if (j.length > 0) { m = j; }
            }
        }
        return m;
    }
    /* return array of subitems for single menu object */
    /* modified in version 0.3 */
    this._getMenuNodes = function(node) {
        var m = new Array;
        for (var a in this.itemPull) { if (this.itemPull[a]["parent"] == node) { m[m.length] = a; } }
        return m;
    }
    /* generate random string with specified length */
    this._genStr = function(w) {
        var s = ""; var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var q = 0; q < w; q++) s += z.charAt(Math.round(Math.random() * (z.length - 1)));
        return s;
    }
    /**
    *	@desc: return item type by id
    *	@param: id
    *	@type: public
    */
    this.getItemType = function(id) {
        id = this.idPrefix + id;
        if (this.itemPull[id] == null) { return null; }
        return this.itemPull[id]["type"];
    }
    /*
    *	@desc: iterator, calls user-defined handler for each existing item and pass item id into it
    *	@param: handler - user-defined handler
    *	@type: public
    */
    this.forEachItem = function(handler) {
        for (var a in this.itemPull) { handler(String(a).replace(this.idPrefix, "")); }
    }
    /* clear selection and hide menu on onbody click event, optimized in version 0.3 */
    this._clearAndHide = function() {
        main_self.menuSelected = -1;
        main_self.menuLastClicked = -1;
        while (main_self._openedPolygons.length > 0) { main_self._openedPolygons.pop(); }
        for (var q = 0; q < main_self._selectedSubItems.length; q++) {
            var id = main_self._selectedSubItems[q][0];
            // clear all selection
            if (main_self.idPull[id] != null) {
                if (main_self.itemPull[id]["state"] == "enabled") {
                    if (main_self.idPull[id].className == "sub_item_selected") main_self.idPull[id].className = "sub_item";
                    if (main_self.idPull[id].className == "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Selected") {
                        // main_self.idPull[id].className = "dhtmlxMenu_"+main_self.skin+"_TopLevel_Item_Normal";
                        // custom css
                        // console.log(main_self.itemPull[this.id])
                        if (main_self.itemPull[id]["cssNormal"] != null) {
                            // alert(1)
                            main_self.idPull[id].className = main_self.itemPull[id]["cssNormal"];
                        } else {
                            // default css
                            main_self.idPull[id].className = "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Normal";
                        }
                    }
                }
            }
            main_self._hidePolygon(id);
        }
        // added in 0.4
        // main_self._hidePolygon(main_self.idPrefix+main_self.topId);
        main_self.menuTouched = false;
        //
        // hide all contextmenu polygons on mouseout
        if (main_self.context) {
            if (main_self.contextHideAllMode) {
                main_self._hidePolygon(main_self.idPrefix + main_self.topId);
                main_self.zInd = main_self.zIndInit;
            } else {
                main_self.zInd = main_self.zIndInit + main_self.zIndStep;
            }
        }
    }
    /* loading and parsing through xml, optimized in version 0.3 */
    this._doOnLoad = function() { }
    /**
    *   @desc: loads menu data from an xml file and calls onLoadFunction when loading is done
    *   @param: xmlFile - an xml file with webmenu data
    *   @param: onLoadFunction - a function that is called after loading is done
    *   @type: public
    */
    this.loadXML = function(xmlFile, onLoadFunction) {
        if (onLoadFunction) this._doOnLoad = function() { onLoadFunction(); };
        this.callEvent("onXLS", []);
        this._xmlLoader.loadXML(xmlFile);
    }
    /**
    *   @desc: loads menu data from an xml string and calls onLoadFunction when loading is done
    *   @param: xmlFile - an xml string with webmenu data
    *   @param: onLoadFunction - function that is called after loading is done
    *   @type: public
    */
    this.loadXMLString = function(xmlString, onLoadFunction) {
        if (onLoadFunction) this._doOnLoad = function() { onLoadFunction(); };
        this._xmlLoader.loadXMLString(xmlString);
    }
    this._buildMenu = function(t, parentId) {
        // if (parentId==null) { parentId = this.topId;}
        var u = 0;
        for (var q = 0; q < t.childNodes.length; q++) {
            if (t.childNodes[q].tagName == this.itemTagName) {
                var r = t.childNodes[q];
                var item = {};
                // basic
                item["id"] = this.idPrefix + (r.getAttribute("id") || this._genStr(24));
                item["title"] = r.getAttribute("text") || "";
                // images
                item["imgen"] = r.getAttribute("img") || "";
                item["imgdis"] = r.getAttribute("imgdis") || "";
                item["tip"] = "";
                item["hotkey"] = "";
                // custom css
                if (r.getAttribute("cssNormal") != null) { item["cssNormal"] = r.getAttribute("cssNormal"); }
                // type
                item["type"] = r.getAttribute("type") || "item";
                //#menu_checks:06062008{
                if (item["type"] == "checkbox") {
                    item["checked"] = (r.getAttribute("checked") != null);
                    // set classname
                    item["imgen"] = "chbx_" + (item["checked"] ? "1" : "0");
                    item["imgdis"] = item["imgen"];
                }
                //#}
                //#menu_radio:06062008{
                if (item["type"] == "radio") {
                    item["checked"] = (r.getAttribute("checked") != null);
                    item["imgen"] = "rdbt_" + (item["checked"] ? "1" : "0");
                    item["imgdis"] = item["imgen"];
                    item["group"] = r.getAttribute("group") || this._genStr(24);
                    if (this.radio[item["group"]] == null) { this.radio[item["group"]] = new Array(); }
                    this.radio[item["group"]][this.radio[item["group"]].length] = item["id"];
                }
                //#}
                // enable/disable
                item["state"] = (r.getAttribute("enabled") != null || r.getAttribute("disabled") != null ? (r.getAttribute("enabled") == "false" || r.getAttribute("disabled") == "true" ? "disabled" : "enabled") : "enabled");
                item["parent"] = (parentId != null ? parentId : this.idPrefix + this.topId);
                // item["complex"] = (((this.dLoad)&&(parentId!=null))?(r.getAttribute("complex")!=null?true:false):(this._buildMenu(r,item["id"])>0));
                item["complex"] = (this.dLoad ? (r.getAttribute("complex") != null ? true : false) : (this._buildMenu(r, item["id"]) > 0));
                if (this.dLoad && item["complex"]) { item["loaded"] = "no"; }
                this.itemPull[item["id"]] = item;
                // check for user data
                for (var w = 0; w < r.childNodes.length; w++) {
                    // added in 0.4
                    var tagNm = r.childNodes[w].tagName;
                    if (tagNm != null) { tagNm = tagNm.toLowerCase(); }
                    //
                    if (tagNm == this.userDataTagName) {
                        var d = r.childNodes[w];
                        if (d.getAttribute("name") != null) { this.userData[item["id"] + "_" + d.getAttribute("name")] = (d.firstChild != null && d.firstChild.nodeValue != null ? d.firstChild.nodeValue : ""); }
                    }
                    // extended text, added in 0.4
                    if (tagNm == this.itemTextTagName) { item["title"] = r.childNodes[w].firstChild.nodeValue; }
                    // tooltips, added in 0.4
                    if (tagNm == this.itemTipTagName) { item["tip"] = r.childNodes[w].firstChild.nodeValue; }
                    // hotkeys, added in 0.4
                    if (tagNm == this.itemHotKeyTagName) { item["hotkey"] = r.childNodes[w].firstChild.nodeValue; }
                    // hrefs
                    if (tagNm == this.itemHrefTagName && item["type"] == "item") {
                        item["href_link"] = r.childNodes[w].firstChild.nodeValue;
                        if (r.childNodes[w].getAttribute("target") != null) { item["href_target"] = r.childNodes[w].getAttribute("target"); }
                    }
                }
                u++;
            }
        }
        return u;
    }
    /* parse incoming xml */
    this._xmlParser = function() {
        if (main_self.dLoad) {
            var t = this.getXMLTopNode("menu");
            parentId = (t.getAttribute("parentId") != null ? t.getAttribute("parentId") : null);
            if (parentId == null) {
                // alert(1)
                // main_self.idPrefix = main_self._genStr(12);
                main_self._buildMenu(t, null);
                main_self._initTopLevelMenu();
            } else {
                main_self._buildMenu(t, main_self.idPrefix + parentId);
                main_self._addSubMenuPolygon(main_self.idPrefix + parentId, main_self.idPrefix + parentId); //, main_self.idPull[main_self.idPrefix+parentId]);
                if (main_self.menuSelected == main_self.idPrefix + parentId) {
                    var pId = main_self.idPrefix + parentId;
                    var isTop = main_self.itemPull[main_self.idPrefix + parentId]["parent"] == main_self.idPrefix + main_self.topId;
                    var level = ((isTop && (!main_self.context)) ? main_self.dirTopLevel : main_self.dirSubLevel);
                    var isShow = false;
                    if (isTop && main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
                        var item = main_self.idPull[main_self.idPrefix + parentId];
                        if (item._mouseOver == true) {
                            var delay = main_self.menuModeTopLevelTimeoutTime - (new Date().getTime() - item._dynLoadTM);
                            if (delay > 1) {
                                item._menuOpenTM = window.setTimeout(function() { main_self._showPolygon(pId, level); }, delay);
                                isShow = true;
                            }
                        }
                    }
                    if (!isShow) { main_self._showPolygon(pId, level); }
                }
                main_self.itemPull[main_self.idPrefix + parentId]["loaded"] = "yes";
                // console.log(main_self.loaderIcon)
                if (main_self.loaderIcon == true) { main_self._updateLoaderIcon(main_self.idPrefix + parentId, false); }
            }
            this.destructor();
            main_self.callEvent("onXLE", []);
        } else {
            var t = this.getXMLTopNode("menu");
            // alert(3)
            // main_self.idPrefix = main_self._genStr(12);
            main_self._buildMenu(t, null);
            main_self.init();
            main_self.callEvent("onXLE", []);
            main_self._doOnLoad();
        }
    }
    this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
    /* show sublevel item */
    this._showSubLevelItem = function(id, back) {
        if (document.getElementById("arrow_" + this.idPrefix + id) != null) { document.getElementById("arrow_" + this.idPrefix + id).style.display = (back ? "none" : ""); }
        if (document.getElementById("image_" + this.idPrefix + id) != null) { document.getElementById("image_" + this.idPrefix + id).style.display = (back ? "none" : ""); }
        if (document.getElementById(this.idPrefix + id) != null) { document.getElementById(this.idPrefix + id).style.display = (back ? "" : "none"); }
    }
    /* hide sublevel item */
    this._hideSubLevelItem = function(id) {
        this._showSubLevelItem(id, true)
    }
    // generating id prefix
    this.idPrefix = this._genStr(12);

    /* attach body events */
    this._bodyClick = function(e) {
        e = e || event;
        if (e.button == 2 || (_isOpera && e.ctrlKey == true)) return;
        if (main_self.context) {
            if (main_self.contextAutoHide && (!_isOpera || (main_self._isContextMenuVisible() && _isOpera))) main_self._hideContextMenu();
        } else {
            if (main_self._clearAndHide) main_self._clearAndHide();
        }
    }
    this._bodyContext = function(e) {
        e = e || event;
        var t = String((e.srcElement || e.target).className);
        if (t.search("dhtmlxMenu") != -1 && t.search("SubLevelArea") != -1) return;
        var toHide = true;
        var testZone = e.target || e.srcElement;
        while (testZone != null) {
            if (testZone.id != null) if (main_self.isContextZone(testZone.id)) toHide = false;
            if (testZone == document.body) toHide = false;
            testZone = testZone.parentNode;
        }
        if (toHide) main_self.hideContextMenu();
    }

    if (_isIE) {
        document.body.attachEvent("onclick", this._bodyClick);
        document.body.attachEvent("oncontextmenu", this._bodyContext);
    } else {
        window.addEventListener("click", this._bodyClick, false);
        window.addEventListener("contextmenu", this._bodyContext, false);
    }

    // add menu to global store
    this._UID = this._genStr(32);
    dhtmlxMenuObjectLiveInstances[this._UID] = this;

    /* events */
    dhtmlxEventable(this);
    //
    return this;
}
dhtmlXMenuObject.prototype.init = function() {
    if (this._isInited == true) return;
    if (this.dLoad) {
        this.callEvent("onXLS", []);
        // this._xmlLoader.loadXML(this.dLoadUrl+"?action=loadMenu&parentId="+this.topId+"&topId="+this.topId);
        this._xmlLoader.loadXML(this.dLoadUrl + this.dLoadSign + "action=loadMenu&etc=" + new Date().getTime()); // &&parentId=topId&"+this.topId+"&topId="+this.topId);
    } else {
        this._initTopLevelMenu();
        this._isInited = true;
    }
}
dhtmlXMenuObject.prototype._countVisiblePolygonItems = function(id) {
    /*
    var count = 0;
    if ((this.idPull["polygon_"+id] != null) && (this.idPull[id] != null)) {
    for (var q=0; q<this.idPull["polygon_"+id].childNodes.length; q++) {
    var node = this.idPull["polygon_"+id].childNodes[q];
    count += (((node.style.display=="none")||(node.className=="dhtmlxMenu_SubLevelArea_Separator"))?0:1);
    }
    }
    */
    /* updated in 0.4 */
    var count = 0;
    // console.log(this.idPull)
    for (var a in this.itemPull) {
        //console.log(a)
        var par = this.itemPull[a]["parent"];
        var tp = this.itemPull[a]["type"];
        if (this.idPull[a] != null) {
            // console.log(this.idPull[a])
            // alert(1111)
            if (par == id && (tp == "item" || tp == "radio" || tp == "checkbox") && this.idPull[a].style.display != "none") {
                count++;
            }
        }
    }
    return count;
}
dhtmlXMenuObject.prototype._redefineComplexState = function(id) {
    // alert(id)
    if (this.idPrefix + this.topId == id) { return; }
    if ((this.idPull["polygon_" + id] != null) && (this.idPull[id] != null)) {
        var u = this._countVisiblePolygonItems(id);
        if ((u > 0) && (!this.itemPull[id]["complex"])) { this._updateItemComplexState(id, true, false); }
        if ((u == 0) && (this.itemPull[id]["complex"])) { this._updateItemComplexState(id, false, false); }
    }
}
/* complex arrow manipulations, over added in 0.4 */
dhtmlXMenuObject.prototype._updateItemComplexState = function(id, state, over) {
    // 0.2 FIX :: topLevel's items can have complex items with arrow
    if ((!this.context) && (this._getItemLevelType(id.replace(this.idPrefix, "")) == "TopLevel")) {
        // 30.06.2008 fix > complex state for top level item, state only, no arrow
        this.itemPull[id]["complex"] = state;
        return;
    }
    if ((this.idPull[id] == null) || (this.itemPull[id] == null)) { return; }
    // 0.2 FIX :: end
    this.itemPull[id]["complex"] = state;
    // fixed in 0.4 for context
    if (id == this.idPrefix + this.topId) return;
    // end fix
    // try to retrieve arrow img object
    var arrowObj = null;


    var item = this.idPull[id].childNodes[this._rtl ? 0 : 2];
    if (item.childNodes[0]) if (String(item.childNodes[0].className).search("complex_arrow") === 0) arrowObj = item.childNodes[0];

    if (this.itemPull[id]["complex"]) {
        // create arrow
        if (arrowObj == null) {
            arrowObj = document.createElement("DIV");
            arrowObj.className = "complex_arrow";
            arrowObj.id = "arrow_" + id;
            while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
            item.appendChild(arrowObj);
        }
        // over state added in 0.4

        if (this.dLoad && (this.itemPull[id]["loaded"] == "get") && this.loaderIcon) {
            // change arrow to loader
            if (arrowObj.className != "complex_arrow_loading") arrowObj.className = "complex_arrow_loading";
        } else {
            arrowObj.className = "complex_arrow";
        }

        return;
    }

    if ((!this.itemPull[id]["complex"]) && (arrowObj != null)) {
        item.removeChild(arrowObj);
        if (this.itemPull[id]["hotkey_backup"] != null && this.setHotKey) { this.setHotKey(id.replace(this.idPrefix, ""), this.itemPull[id]["hotkey_backup"]); }
    }

}

/* return css-part level type */
dhtmlXMenuObject.prototype._getItemLevelType = function(id) {
    return (this.itemPull[this.idPrefix + id]["parent"] == this.idPrefix + this.topId ? "TopLevel" : "SubLevelArea");
}
/****************************************************************************************************************************************************/
/*								 	"TOPLEVEL" LOW-LEVEL RENDERING						    */
/* redistrib selection in case of top node in real-time mode */
dhtmlXMenuObject.prototype._redistribTopLevelSelection = function(id, parent) {
    // kick polygons and decelect before selected menues
    var i = this._getSubItemToDeselectByPolygon("parent");
    this._removeSubItemFromSelected(-1, -1);
    for (var q = 0; q < i.length; q++) {
        if (i[q] != id) { this._hidePolygon(i[q]); }
        if ((this.idPull[i[q]] != null) && (i[q] != id)) { this.idPull[i[q]].className = this.idPull[i[q]].className.replace(/Selected/g, "Normal"); }
    }
    // check if enabled
    if (this.itemPull[this.idPrefix + id]["state"] == "enabled") {
        this.idPull[this.idPrefix + id].className = "dhtmlxMenu_" + this.skin + "_TopLevel_Item_Selected";
        //
        this._addSubItemToSelected(this.idPrefix + id, "parent");
        this.menuSelected = (this.menuMode == "win" ? (this.menuSelected != -1 ? id : this.menuSelected) : id);
        if ((this.itemPull[this.idPrefix + id]["complex"]) && (this.menuSelected != -1)) { this._showPolygon(this.idPrefix + id, this.dirTopLevel); }
    }
}
dhtmlXMenuObject.prototype._initTopLevelMenu = function() {
    // console.log(this.idPull);
    this.dirTopLevel = "bottom";
    this.dirSubLevel = (this._rtl ? "left" : "right");
    if (this.context) {
        this.idPull[this.idPrefix + this.topId] = new Array(0, 0);
        this._addSubMenuPolygon(this.idPrefix + this.topId, this.idPrefix + this.topId);
    } else {
        var m = this._getMenuNodes(this.idPrefix + this.topId);
        for (var q = 0; q < m.length; q++) {
            if (this.itemPull[m[q]]["type"] == "item") this._renderToplevelItem(m[q], null);
            if (this.itemPull[m[q]]["type"] == "separator") this._renderSeparator(m[q], null);
        }
    }
}
/* add top menu item, complex define that submenues are in presence */
dhtmlXMenuObject.prototype._renderToplevelItem = function(id, pos) {
    var main_self = this;
    var m = document.createElement("DIV");
    m.id = id;
    // custom css
    if (this.itemPull[id]["state"] == "enabled" && this.itemPull[id]["cssNormal"] != null) {
        m.className = this.itemPull[id]["cssNormal"];
    } else {
        m.className = "dhtmlxMenu_" + this.skin + "_TopLevel_Item_" + (this.itemPull[id]["state"] == "enabled" ? "Normal" : "Disabled");
    }

    // text
    if (this.itemPull[id]["title"] != "") {
        var t1 = document.createElement("DIV");
        t1.className = "top_level_text";
        t1.innerHTML = this.itemPull[id]["title"];
        m.appendChild(t1);
    }
    // tooltip
    if (this.itemPull[id]["tip"].length > 0) m.title = this.itemPull[id]["tip"];
    //
    // image in top level
    if ((this.itemPull[id]["imgen"] != "") || (this.itemPull[id]["imgdis"] != "")) {
        var imgTop = this.itemPull[id][(this.itemPull[id]["state"] == "enabled") ? "imgen" : "imgdis"];
        if (imgTop) {
            var img = document.createElement("IMG");
            img.border = "0";
            img.id = "image_" + id;
            img.src = this.imagePath + imgTop;
            img.className = "dhtmlxMenu_TopLevel_Item_Icon";
            if (m.childNodes.length > 0 && !this._rtl) m.insertBefore(img, m.childNodes[0]); else m.appendChild(img);
        }
    }
    m.onselectstart = function(e) { e = e || event; e.returnValue = false; return false; }
    m.oncontextmenu = function(e) { e = e || event; e.returnValue = false; return false; }
    // add container for top-level items if not exists yet
    if (!this.cont) {
        this.cont = document.createElement("DIV");
        this.cont.dir = "ltr";
        this.cont.className = (this._align == "right" ? "align_right" : "align_left");
        this.base.appendChild(this.cont);
    }
    // insert
    /*
    if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > this.base.childNodes.length - 1) pos = null; }
    if (pos != null) this.base.insertBefore(m, this.base.childNodes[pos]); else this.base.appendChild(m);
    */
    if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > this.cont.childNodes.length - 1) pos = null; }
    if (pos != null) this.cont.insertBefore(m, this.cont.childNodes[pos]); else this.cont.appendChild(m);


    //
    this.idPull[m.id] = m;
    // create submenues
    if (this.itemPull[id]["complex"] && (!this.dLoad)) this._addSubMenuPolygon(this.itemPull[id]["id"], this.itemPull[id]["id"]);
    // events
    m.onmouseover = function() {
        if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
        // kick polygons and decelect before selected menues
        var i = main_self._getSubItemToDeselectByPolygon("parent");
        main_self._removeSubItemFromSelected(-1, -1);
        for (var q = 0; q < i.length; q++) {
            if (i[q] != this.id) { main_self._hidePolygon(i[q]); }
            if ((main_self.idPull[i[q]] != null) && (i[q] != this.id)) {
                // custom css
                if (main_self.itemPull[i[q]]["cssNormal"] != null) {
                    main_self.idPull[i[q]].className = main_self.itemPull[i[q]]["cssNormal"];
                } else {
                    if (main_self.idPull[i[q]].className == "sub_item_selected") main_self.idPull[i[q]].className = "sub_item";
                    main_self.idPull[i[q]].className = main_self.idPull[i[q]].className.replace(/Selected/g, "Normal");
                }
            }
        }
        // check if enabled
        if (main_self.itemPull[this.id]["state"] == "enabled") {
            this.className = "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Selected";
            //
            main_self._addSubItemToSelected(this.id, "parent");
            main_self.menuSelected = (main_self.menuMode == "win" ? (main_self.menuSelected != -1 ? this.id : main_self.menuSelected) : this.id);
            if (main_self.dLoad && (main_self.itemPull[this.id]["loaded"] == "no")) {
                if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
                    this._mouseOver = true;
                    this._dynLoadTM = new Date().getTime();
                }
                var xmlLoader = new dtmlXMLLoaderObject(main_self._xmlParser, window);
                main_self.itemPull[this.id]["loaded"] = "get";
                main_self.callEvent("onXLS", []);
                xmlLoader.loadXML(main_self.dLoadUrl + main_self.dLoadSign + "action=loadMenu&parentId=" + this.id.replace(main_self.idPrefix, "") + "&etc=" + new Date().getTime());
            }
            if ((!main_self.dLoad) || (main_self.dLoad && (!main_self.itemPull[this.id]["loaded"] || main_self.itemPull[this.id]["loaded"] == "yes"))) {
                if ((main_self.itemPull[this.id]["complex"]) && (main_self.menuSelected != -1)) {
                    if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
                        this._mouseOver = true;
                        var showItemId = this.id;
                        this._menuOpenTM = window.setTimeout(function() { main_self._showPolygon(showItemId, main_self.dirTopLevel); }, main_self.menuModeTopLevelTimeoutTime);
                    } else {
                        main_self._showPolygon(this.id, main_self.dirTopLevel);
                    }
                }
            }
        }
        main_self._doOnTouchMenu(this.id.replace(main_self.idPrefix, ""));
    }
    m.onmouseout = function() {
        if (!((main_self.itemPull[this.id]["complex"]) && (main_self.menuSelected != -1)) && (main_self.itemPull[this.id]["state"] == "enabled")) {
            // custom css
            // console.log(main_self.itemPull[this.id])
            if (main_self.itemPull[this.id]["cssNormal"] != null) {
                // alert(1)
                m.className = main_self.itemPull[this.id]["cssNormal"];
            } else {
                // default css
                m.className = "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Normal";
            }
        }
        if (main_self.menuMode == "web") {
            window.clearTimeout(main_self.menuTimeoutHandler);
            main_self.menuTimeoutHandler = window.setTimeout(function() { main_self._clearAndHide(); }, main_self.menuTimeoutMsec, "JavaScript");
        }
        if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
            this._mouseOver = false;
            window.clearTimeout(this._menuOpenTM);
        }
    }
    m.onclick = function(e) {
        if (main_self.menuMode == "web") { window.clearTimeout(main_self.menuTimeoutHandler); }
        // fix, added in 0.4
        if (main_self.menuMode != "web" && main_self.itemPull[this.id]["state"] == "disabled") { return; }
        //
        e = e || event;
        e.cancelBubble = true;
        e.returnValue = false;

        if (main_self.menuMode == "win") {
            if (main_self.itemPull[this.id]["complex"]) {
                if (main_self.menuSelected == this.id) { main_self.menuSelected = -1; var s = false; } else { main_self.menuSelected = this.id; var s = true; }
                if (s) { main_self._showPolygon(this.id, main_self.dirTopLevel); } else { main_self._hidePolygon(this.id); }
            }
        }
        var tc = (main_self.itemPull[this.id]["complex"] ? "c" : "-");
        var td = (main_self.itemPull[this.id]["state"] != "enabled" ? "d" : "-");
        var cas = { "ctrl": e.ctrlKey, "alt": e.altKey, "shift": e.shiftKey };
        main_self._doOnClick(this.id.replace(main_self.idPrefix, ""), tc + td + "t", cas);
        return false;
    }

    if (this.skin == "dhx_terrace") {
        this._improveTerraceSkin();
    }
}
/****************************************************************************************************************************************************/
/**
*   @desc: empty function, now more used from 90226
*   @type: public
*/
dhtmlXMenuObject.prototype.setImagePath = function() { /* no more used */ }
/**
*   @desc: defines an url where necessary user embedded icons are located
*   @param: path - url to images
*   @type: public
*/
dhtmlXMenuObject.prototype.setIconsPath = function(path) { this.imagePath = path; }
/**
*   @desc: alias for setIconsPath
*   @type: public
*/
dhtmlXMenuObject.prototype.setIconPath = dhtmlXMenuObject.prototype.setIconsPath;
/* real-time update icon in menu */
dhtmlXMenuObject.prototype._updateItemImage = function(id, levelType) {
    // search existsing image

    id = this.idPrefix + id;
    var isTopLevel = (this.itemPull[id]["parent"] == this.idPrefix + this.topId && !this.context);

    // search existing image
    var imgObj = null;
    if (isTopLevel) {
        for (var q = 0; q < this.idPull[id].childNodes.length; q++) {
            try { if (this.idPull[id].childNodes[q].className == "dhtmlxMenu_TopLevel_Item_Icon") imgObj = this.idPull[id].childNodes[q]; } catch (e) { }
        }
    } else {
        try { var imgObj = this.idPull[id].childNodes[this._rtl ? 2 : 0].childNodes[0]; } catch (e) { }
    }

    if (this.itemPull[id]["type"] == "radio") {
        var imgSrc = this.itemPull[id][(this.itemPull[id]["state"] == "enabled" ? "imgen" : "imgdis")];
        // console.log(this.itemPull[this.idPrefix+id])
    } else {
        var imgSrc = this.itemPull[id][(this.itemPull[id]["state"] == "enabled" ? "imgen" : "imgdis")];
    }

    if (imgSrc.length > 0) {
        if (imgObj != null) {
            imgObj.src = this.imagePath + imgSrc;
        } else {
            if (isTopLevel) {
                var imgObj = document.createElement("IMG");
                imgObj.className = "dhtmlxMenu_TopLevel_Item_Icon";
                imgObj.src = this.imagePath + imgSrc;
                imgObj.border = "0";
                imgObj.id = "image_" + id;
                if (!this._rtl && this.idPull[id].childNodes.length > 0) this.idPull[id].insertBefore(imgObj, this.idPull[id].childNodes[0]); else this.idPull[id].appendChild(imgObj);

            } else {

                var imgObj = document.createElement("IMG");
                imgObj.className = "sub_icon";
                imgObj.src = this.imagePath + imgSrc;
                imgObj.border = "0";
                imgObj.id = "image_" + id;
                var item = this.idPull[id].childNodes[this._rtl ? 2 : 0];
                while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
                item.appendChild(imgObj);

            }
        }
    } else {
        if (imgObj != null) imgObj.parentNode.removeChild(imgObj);
    }
}
/**
*   @desc: removes an item from the menu with all nested sublevels
*   @param: id - id of the item for removing
*   @type: public
*/
dhtmlXMenuObject.prototype.removeItem = function(id, _isTId, _recCall) {
    if (!_isTId) id = this.idPrefix + id;

    var pId = null;

    if (id != this.idPrefix + this.topId) {

        if (this.itemPull[id] == null) return;

        // effects
        if (this.idPull["polygon_" + id] && this.idPull["polygon_" + id]._tmShow) window.clearTimeout(this.idPull["polygon_" + id]._tmShow);

        // separator top
        var t = this.itemPull[id]["type"];

        if (t == "separator") {
            var item = this.idPull["separator_" + id];
            if (this.itemPull[id]["parent"] == this.idPrefix + this.topId) {
                item.onclick = null;
                item.onselectstart = null;
                item.id = null;
                item.parentNode.removeChild(item);
            } else {
                item.childNodes[0].childNodes[0].onclick = null;
                item.childNodes[0].childNodes[0].onselectstart = null;
                item.childNodes[0].childNodes[0].id = null;
                item.childNodes[0].removeChild(item.childNodes[0].childNodes[0]);
                item.removeChild(item.childNodes[0]);
                item.parentNode.removeChild(item);
            }
            this.idPull["separator_" + id] = null;
            this.itemPull[id] = null;
            delete this.idPull["separator_" + id];
            delete this.itemPull[id];
            item = null;
        } else {
            // item checkbox radio
            pId = this.itemPull[id]["parent"];
            var item = this.idPull[id];
            item.onclick = null;
            item.oncontextmenu = null;
            item.onmouseover = null;
            item.onmouseout = null;
            item.onselectstart = null;
            item.id = null;
            while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
            item.parentNode.removeChild(item);
            this.idPull[id] = null;
            this.itemPull[id] = null;
            delete this.idPull[id];
            delete this.itemPull[id];
            item = null;

        }
        t = null;
    }

    // clear nested items
    for (var a in this.itemPull) if (this.itemPull[a]["parent"] == id) this.removeItem(a, true, true);

    // check if empty polygon left
    var p2 = new Array(id);
    if (pId != null && !_recCall) {
        if (this.idPull["polygon_" + pId] != null) {
            if (this.idPull["polygon_" + pId].tbd.childNodes.length == 0) {
                p2.push(pId);
                this._updateItemComplexState(pId, false, false);
            }
        }
    }

    // delete nested polygons and parent's if any
    for (var q = 0; q < p2.length; q++) {
        if (this.idPull["polygon_" + p2[q]]) {
            var p = this.idPull["polygon_" + p2[q]];
            p.onclick = null;
            p.oncontextmenu = null;
            p.tbl.removeChild(p.tbd);
            p.tbd = null;
            p.removeChild(p.tbl);
            p.tbl = null;
            p.id = null;
            p.parentNode.removeChild(p);
            p = null;
            if (this._isIE6) {
                var pc = "polygon_" + p2[q] + "_ie6cover";
                if (this.idPull[pc] != null) { document.body.removeChild(this.idPull[pc]); delete this.idPull[pc]; }
            }
            if (this.idPull["arrowup_" + id] != null && this._removeArrow) this._removeArrow("arrowup_" + id);
            if (this.idPull["arrowdown_" + id] != null && this._removeArrow) this._removeArrow("arrowdown_" + id);
            //
            this.idPull["polygon_" + p2[q]] = null;
            delete this.idPull["polygon_" + p2[q]];
        }
    }
    p2 = null;

    // update corners
    if (this.skin == "dhx_terrace" && arguments.length == 1) this._improveTerraceSkin();

}
/* collect parents for remove complex item */
dhtmlXMenuObject.prototype._getAllParents = function(id) {
    var parents = new Array();
    for (var a in this.itemPull) {
        if (this.itemPull[a]["parent"] == id) {
            parents[parents.length] = this.itemPull[a]["id"];
            if (this.itemPull[a]["complex"]) {
                var t = this._getAllParents(this.itemPull[a]["id"]);
                for (var q = 0; q < t.length; q++) { parents[parents.length] = t[q]; }
            }
        }
    }
    return parents;
}

//#menu_context:06062008{

/****************************************************************************************************************************************************/
/*								 	CONTEXT STUFF								    */
/* render dhtmlxMenu as context menu of base object */
/**
*   @desc: renders menu as contextual
*   @type: public
*/
dhtmlXMenuObject.prototype.renderAsContextMenu = function() {
    this.context = true;
    if (this.base._autoSkinUpdate == true) {
        this.base.className = this.base.className.replace("dhtmlxMenu_" + this.skin + "_Middle", "");
        this.base._autoSkinUpdate = false;
    }
    if (this.addBaseIdAsContextZone != null) { this.addContextZone(this.addBaseIdAsContextZone); }
}
/**
*   @desc: adds a contextual zone to a contextual menu
*   @param: zoneId - id of the object on page to render as a contextual zone
*   @type: public
*/
dhtmlXMenuObject.prototype.addContextZone = function(zoneId) {
    if (zoneId == document.body) {
        zoneId = "document.body." + this.idPrefix;
        var zone = document.body;
    } else {
        var zone = document.getElementById(zoneId);
    }
    var zoneExists = false;
    for (var a in this.contextZones) { zoneExists = zoneExists || (a == zoneId) || (this.contextZones[a] == zone); }
    if (zoneExists == true) return false;
    this.contextZones[zoneId] = zone;
    var main_self = this;
    if (_isOpera) {
        this.operaContext = function(e) { main_self._doOnContextMenuOpera(e, main_self); }
        zone.addEventListener("mouseup", this.operaContext, false);
        //
    } else {
        if (zone.oncontextmenu != null && !zone._oldContextMenuHandler) zone._oldContextMenuHandler = zone.oncontextmenu;
        zone.oncontextmenu = function(e) {
            // autoclose any other opened context menues
            for (var q in dhtmlxMenuObjectLiveInstances) {
                if (q != main_self._UID) {
                    if (dhtmlxMenuObjectLiveInstances[q].context) {
                        dhtmlxMenuObjectLiveInstances[q]._hideContextMenu();
                    }
                }
            }
            //
            e = e || event;
            e.cancelBubble = true;
            e.returnValue = false;
            main_self._doOnContextBeforeCall(e, this);
            return false;
        }
    }
}
dhtmlXMenuObject.prototype._doOnContextMenuOpera = function(e, main_self) {
    // autoclose any other opened context menues
    for (var q in dhtmlxMenuObjectLiveInstances) {
        if (q != main_self._UID) {
            if (dhtmlxMenuObjectLiveInstances[q].context) {
                dhtmlxMenuObjectLiveInstances[q]._hideContextMenu();
            }
        }
    }
    //
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.button == 0 && e.ctrlKey == true) { main_self._doOnContextBeforeCall(e, this); }
    return false;
}
/**
*   @desc: removes an object from contextual zones list
*   @param: zoneId - id of a contextual zone
*   @type: public
*/
dhtmlXMenuObject.prototype.removeContextZone = function(zoneId) {
    if (!this.isContextZone(zoneId)) return false;
    if (zoneId == document.body) zoneId = "document.body." + this.idPrefix;
    var zone = this.contextZones[zoneId];
    if (_isOpera) {
        zone.removeEventListener("mouseup", this.operaContext, false);
    } else {
        zone.oncontextmenu = (zone._oldContextMenuHandler != null ? zone._oldContextMenuHandler : null);
        zone._oldContextMenuHandler = null;
    }
    try {
        this.contextZones[zoneId] = null;
        delete this.contextZones[zoneId];
    } catch (e) { }
    return true;
}
/**
*   @desc: returns true if an object is used as a contextual zone for the menu
*   @param: zoneId - id of the object to check
*   @type: public
*/
dhtmlXMenuObject.prototype.isContextZone = function(zoneId) {
    if (zoneId == document.body && this.contextZones["document.body." + this.idPrefix] != null) return true;
    var isZone = false;
    if (this.contextZones[zoneId] != null) { if (this.contextZones[zoneId] == document.getElementById(zoneId)) isZone = true; }
    return isZone;
}
dhtmlXMenuObject.prototype._isContextMenuVisible = function() {
    if (this.idPull["polygon_" + this.idPrefix + this.topId] == null) return false;
    return (this.idPull["polygon_" + this.idPrefix + this.topId].style.display == "");
}
dhtmlXMenuObject.prototype._showContextMenu = function(x, y, zoneId) {
    // hide any opened context menu/polygons
    this._clearAndHide();
    // this._hideContextMenu();
    // open
    if (this.idPull["polygon_" + this.idPrefix + this.topId] == null) return false;
    window.clearTimeout(this.menuTimeoutHandler);
    this.idPull[this.idPrefix + this.topId] = new Array(x, y);
    this._showPolygon(this.idPrefix + this.topId, "bottom");
    this.callEvent("onContextMenu", [zoneId]);
}
dhtmlXMenuObject.prototype._hideContextMenu = function() {
    if (this.idPull["polygon_" + this.idPrefix + this.topId] == null) return false;
    this._clearAndHide();
    this._hidePolygon(this.idPrefix + this.topId);
    this.zInd = this.zIndInit;
}
/****************************************************************************************************************************************************/
dhtmlXMenuObject.prototype._doOnContextBeforeCall = function(e, cZone) {
    this.contextMenuZoneId = cZone.id;
    this._clearAndHide();
    this._hideContextMenu();

    // scroll settings
    var p = (e.srcElement || e.target);
    var px = (_isIE || _isOpera || _KHTMLrv ? e.offsetX : e.layerX);
    var py = (_isIE || _isOpera || _KHTMLrv ? e.offsetY : e.layerY);
    var mx = getAbsoluteLeft(p) + px;
    var my = getAbsoluteTop(p) + py;

    if (this.checkEvent("onBeforeContextMenu")) {
        if (this.callEvent("onBeforeContextMenu", [cZone.id, e])) {
            if (this.contextAutoShow) {
                this._showContextMenu(mx, my, cZone.id);
                this.callEvent("onAfterContextMenu", [cZone.id, e]);
            }
        }
    } else {
        if (this.contextAutoShow) {
            this._showContextMenu(mx, my, cZone.id);
            this.callEvent("onAfterContextMenu", [cZone.id]);
        }
    }
}
/* public: user call for show/hide context menu */
/**
*   @desc: usercall to show a contextual menu
*   @param: x - position of the menu on x axis
*   @param: y - position of the menu on y axis
*   @type: public
*/
dhtmlXMenuObject.prototype.showContextMenu = function(x, y) {
    this._showContextMenu(x, y, false);
}
/**
*   @desc: usercall to hide a contextual menu
*   @type: public
*/
dhtmlXMenuObject.prototype.hideContextMenu = function() {
    this._hideContextMenu();
}
dhtmlXMenuObject.prototype._autoDetectVisibleArea = function() {
    if (this._isVisibleArea) return;
    //
    this.menuX1 = document.body.scrollLeft;
    this.menuX2 = this.menuX1 + (window.innerWidth || document.body.clientWidth);
    this.menuY1 = Math.max((_isIE ? document.documentElement : document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);
    // this.menuY2 = this.menuY1+(_isIE?(document.documentElement?Math.max(document.documentElement.clientHeight:document.body.clientHeight):window.innerHeight);
    this.menuY2 = this.menuY1 + (_isIE ? Math.max(document.documentElement.clientHeight || 0, document.documentElement.offsetHeight || 0, document.body.clientHeight || 0) : window.innerHeight);

}
/* inner - returns true if prognozided polygon layout off the visible area */
/*dhtmlXMenuObject.prototype._isInVisibleArea = function(x, y, w, h) {
return ((x >= this.menuX1) && (x+w<=this.menuX2) && (y >= this.menuY1) && (y+h <= this.menuY2));
}*/


//#}

/**
*   @desc: returns item's position in the current polygon
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getItemPosition = function(id) {
    id = this.idPrefix + id;
    var pos = -1;
    if (this.itemPull[id] == null) return pos;
    var parent = this.itemPull[id]["parent"];
    // var obj = (this.idPull["polygon_"+parent]!=null?this.idPull["polygon_"+parent].tbd:this.base);
    var obj = (this.idPull["polygon_" + parent] != null ? this.idPull["polygon_" + parent].tbd : this.cont);
    for (var q = 0; q < obj.childNodes.length; q++) { if (obj.childNodes[q] == this.idPull["separator_" + id] || obj.childNodes[q] == this.idPull[id]) { pos = q; } }
    return pos;
}

/**
*   @desc: sets new item's position in the current polygon (moves an item inside the single level)
*   @param: id - the item
*   @param: pos - the position (int)
*   @type: public
*/
dhtmlXMenuObject.prototype.setItemPosition = function(id, pos) {
    id = this.idPrefix + id;
    if (this.idPull[id] == null) { return; }
    // added in 0.4
    var isOnTopLevel = (this.itemPull[id]["parent"] == this.idPrefix + this.topId);
    //
    var itemData = this.idPull[id];
    var itemPos = this.getItemPosition(id.replace(this.idPrefix, ""));
    var parent = this.itemPull[id]["parent"];
    // var obj = (this.idPull["polygon_"+parent]!=null?this.idPull["polygon_"+parent].tbd:this.base);
    var obj = (this.idPull["polygon_" + parent] != null ? this.idPull["polygon_" + parent].tbd : this.cont);
    obj.removeChild(obj.childNodes[itemPos]);
    if (pos < 0) pos = 0;
    // added in 0.4
    if (isOnTopLevel && pos < 1) { pos = 1; }
    //
    if (pos < obj.childNodes.length) { obj.insertBefore(itemData, obj.childNodes[pos]); } else { obj.appendChild(itemData); }
}

/**
*   @desc: returns parent's id
*   @param: id - the item
*   @type: public
*/
dhtmlXMenuObject.prototype.getParentId = function(id) {
    id = this.idPrefix + id;
    if (this.itemPull[id] == null) { return null; }
    return ((this.itemPull[id]["parent"] != null ? this.itemPull[id]["parent"] : this.topId).replace(this.idPrefix, ""));
}
/* public: add item */

/**
*   @desc: adds a new sibling item
*   @param: nextToId - id of the element after which a new one will be inserted
*   @param: itemId - id of a new item
*   @param: itemText - text of a new item
*   @param: disabled - true|false, whether the item is disabled or not
*   @param: img - image for the enabled item
*   @param: imgDis - image for the disabled item
*   @type: public
*/
dhtmlXMenuObject.prototype.addNewSibling = function(nextToId, itemId, itemText, disabled, imgEnabled, imgDisabled) {
    var id = this.idPrefix + (itemId != null ? itemId : this._genStr(24));
    var parentId = this.idPrefix + (nextToId != null ? this.getParentId(nextToId) : this.topId);
    // console.log(id, parentId)
    // console.log(id, ",", parentId)
    this._addItemIntoGlobalStrorage(id, parentId, itemText, "item", disabled, imgEnabled, imgDisabled);
    if ((parentId == this.idPrefix + this.topId) && (!this.context)) {
        this._renderToplevelItem(id, this.getItemPosition(nextToId));
    } else {
        this._renderSublevelItem(id, this.getItemPosition(nextToId));
    }
}

/**
*   @desc: adds a new child item
*   @param: parentId - the item which will contain a new item in the sublevel
*   @param: position - the position of a new item
*   @param: itemId - id of a new item
*   @param: itemText - text of a new item
*   @param: disabled - true|false, whether the item is disabled or not
*   @param: img - image for the enabled item
*   @param: imgDis - image for the disabled item
*   @type: public
*/
dhtmlXMenuObject.prototype.addNewChild = function(parentId, pos, itemId, itemText, disabled, imgEnabled, imgDisabled) {
    if (parentId == null) {
        if (this.context) {
            parentId = this.topId;
        } else {
            this.addNewSibling(parentId, itemId, itemText, disabled, imgEnabled, imgDisabled);
            if (pos != null) this.setItemPosition(itemId, pos);
            return;
        }
    }
    itemId = this.idPrefix + (itemId != null ? itemId : this._genStr(24));
    // remove hotkey, added in 0.4
    if (this.setHotKey) this.setHotKey(parentId, "");
    //
    parentId = this.idPrefix + parentId;
    this._addItemIntoGlobalStrorage(itemId, parentId, itemText, "item", disabled, imgEnabled, imgDisabled);
    if (this.idPull["polygon_" + parentId] == null) { this._renderSublevelPolygon(parentId, parentId); }
    this._renderSublevelItem(itemId, pos - 1);
    // console.log(parentId)
    this._redefineComplexState(parentId);
}

/* add item to storage */
dhtmlXMenuObject.prototype._addItemIntoGlobalStrorage = function(itemId, itemParentId, itemText, itemType, disabled, img, imgDis) {
    var item = {
        id: itemId,
        title: itemText,
        imgen: (img != null ? img : ""),
        imgdis: (imgDis != null ? imgDis : ""),
        type: itemType,
        state: (disabled == true ? "disabled" : "enabled"),
        parent: itemParentId,
        complex: false,
        hotkey: "",
        tip: ""
    };
    this.itemPull[item.id] = item;
}
/* recursively creates and adds submenu polygon */
dhtmlXMenuObject.prototype._addSubMenuPolygon = function(id, parentId) {
    var s = this._renderSublevelPolygon(id, parentId);
    var j = this._getMenuNodes(parentId);
    for (q = 0; q < j.length; q++) { if (this.itemPull[j[q]]["type"] == "separator") { this._renderSeparator(j[q], null); } else { this._renderSublevelItem(j[q], null); } }
    if (id == parentId) { var level = "topLevel"; } else { var level = "subLevel"; }
    for (var q = 0; q < j.length; q++) { if (this.itemPull[j[q]]["complex"]) { this._addSubMenuPolygon(id, this.itemPull[j[q]]["id"]); } }
}
/* inner: add single subpolygon/item/separator */
dhtmlXMenuObject.prototype._renderSublevelPolygon = function(id, parentId) {
    var s = document.createElement("DIV");
    s.className = "dhtmlxMenu_" + this.skin + "_SubLevelArea_Polygon " + (this._rtl ? "dir_right" : "");
    s.dir = "ltr";
    s.oncontextmenu = function(e) { e = e || event; e.returnValue = false; e.cancelBubble = true; return false; }
    s.id = "polygon_" + parentId;
    s.onclick = function(e) { e = e || event; e.cancelBubble = true; }
    s.style.display = "none";
    document.body.insertBefore(s, document.body.firstChild);
    //
    var tbl = document.createElement("TABLE");
    tbl.className = "dhtmlxMebu_SubLevelArea_Tbl";
    tbl.cellSpacing = 0;
    tbl.cellPadding = 0;
    tbl.border = 0;
    var tbd = document.createElement("TBODY");
    tbl.appendChild(tbd);
    s.appendChild(tbl);
    s.tbl = tbl;
    s.tbd = tbd;
    // polygon
    this.idPull[s.id] = s;
    if (this.sxDacProc != null) {
        this.idPull["sxDac_" + parentId] = new this.sxDacProc(s, s.className);
        if (_isIE) {
            this.idPull["sxDac_" + parentId]._setSpeed(this.dacSpeedIE);
            this.idPull["sxDac_" + parentId]._setCustomCycle(this.dacCyclesIE);
        } else {
            this.idPull["sxDac_" + parentId]._setSpeed(this.dacSpeed);
            this.idPull["sxDac_" + parentId]._setCustomCycle(this.dacCycles);
        }
    }
    return s;
}
dhtmlXMenuObject.prototype._renderSublevelItem = function(id, pos) {
    var main_self = this;

    var tr = document.createElement("TR");
    tr.className = (this.itemPull[id]["state"] == "enabled" ? "sub_item" : "sub_item_dis");

    // icon
    var t1 = document.createElement("TD");
    t1.className = "sub_item_icon";
    var icon = this.itemPull[id][(this.itemPull[id]["state"] == "enabled" ? "imgen" : "imgdis")];
    if (icon != "") {
        var tp = this.itemPull[id]["type"];
        if (tp == "checkbox" || tp == "radio") {
            var img = document.createElement("DIV");
            img.id = "image_" + this.itemPull[id]["id"];
            img.className = "sub_icon " + icon;
            t1.appendChild(img);
        }
        if (!(tp == "checkbox" || tp == "radio")) {
            var img = document.createElement("IMG");
            img.id = "image_" + this.itemPull[id]["id"];
            img.className = "sub_icon";
            img.src = this.imagePath + icon;
            t1.appendChild(img);
        }
    }

    // text
    var t2 = document.createElement("TD");
    t2.className = "sub_item_text";
    if (this.itemPull[id]["title"] != "") {
        var t2t = document.createElement("DIV");
        t2t.className = "sub_item_text";
        t2t.innerHTML = this.itemPull[id]["title"];
        t2.appendChild(t2t);
    } else {
        t2.innerHTML = "&nbsp;";
    }

    // hotkey/sublevel arrow
    var t3 = document.createElement("TD");
    t3.className = "sub_item_hk";
    if (this.itemPull[id]["complex"]) {

        var arw = document.createElement("DIV");
        arw.className = "complex_arrow";
        arw.id = "arrow_" + this.itemPull[id]["id"];
        t3.appendChild(arw);

    } else {
        if (this.itemPull[id]["hotkey"].length > 0 && !this.itemPull[id]["complex"]) {
            var t3t = document.createElement("DIV");
            t3t.className = "sub_item_hk";
            t3t.innerHTML = this.itemPull[id]["hotkey"];
            t3.appendChild(t3t);
        } else {
            t3.innerHTML = "&nbsp;";
        }
    }
    tr.appendChild(this._rtl ? t3 : t1);
    tr.appendChild(t2);
    tr.appendChild(this._rtl ? t1 : t3);


    //
    tr.id = this.itemPull[id]["id"];
    tr.parent = this.itemPull[id]["parent"];
    // tooltip, added in 0.4
    if (this.itemPull[id]["tip"].length > 0) tr.title = this.itemPull[id]["tip"];
    //
    if (!this._hideTMData) this._hideTMData = {};

    tr.onselectstart = function(e) { e = e || event; e.returnValue = false; return false; }
    tr.onmouseover = function(e) {
        if (main_self._hideTMData[this.id]) window.clearTimeout(main_self._hideTMData[this.id]);
        if (main_self.menuMode == "web") window.clearTimeout(main_self.menuTimeoutHandler);
        if (!this._visible) main_self._redistribSubLevelSelection(this.id, this.parent); // if not visible
        this._visible = true;
    }
    tr.onmouseout = function() {
        if (main_self.menuMode == "web") {
            if (main_self.menuTimeoutHandler) window.clearTimeout(main_self.menuTimeoutHandler);
            main_self.menuTimeoutHandler = window.setTimeout(function() { if (main_self && main_self._clearAndHide) main_self._clearAndHide(); }, main_self.menuTimeoutMsec, "JavaScript");
        }
        var k = this;
        if (main_self._hideTMData[this.id]) window.clearTimeout(main_self._hideTMData[this.id]);
        main_self._hideTMData[this.id] = window.setTimeout(function() { k._visible = false; }, 50);
    }
    tr.onclick = function(e) {
        // added in 0.4, preven complex closing if user event not defined
        if (!main_self.checkEvent("onClick") && main_self.itemPull[this.id]["complex"]) return;
        //
        e = e || event; e.cancelBubble = true;
        e.returnValue = false;
        tc = (main_self.itemPull[this.id]["complex"] ? "c" : "-");
        td = (main_self.itemPull[this.id]["state"] == "enabled" ? "-" : "d");
        var cas = { "ctrl": e.ctrlKey, "alt": e.altKey, "shift": e.shiftKey };
        switch (main_self.itemPull[this.id]["type"]) {
            case "checkbox":
                main_self._checkboxOnClickHandler(this.id.replace(main_self.idPrefix, ""), tc + td + "n", cas);
                break;
            case "radio":
                main_self._radioOnClickHandler(this.id.replace(main_self.idPrefix, ""), tc + td + "n", cas);
                break;
            case "item":
                main_self._doOnClick(this.id.replace(main_self.idPrefix, ""), tc + td + "n", cas);
                break;
        }
        return false;
    }
    // add
    var polygon = this.idPull["polygon_" + this.itemPull[id]["parent"]];
    if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > polygon.tbd.childNodes.length - 1) pos = null; }
    if (pos != null && polygon.tbd.childNodes[pos] != null) polygon.tbd.insertBefore(tr, polygon.tbd.childNodes[pos]); else polygon.tbd.appendChild(tr);
    this.idPull[tr.id] = tr;
}
/****************************************************************************************************************************************************/
/*								 	SEPARATOR								    */
dhtmlXMenuObject.prototype._renderSeparator = function(id, pos) {
    var level = (this.context ? "SubLevelArea" : (this.itemPull[id]["parent"] == this.idPrefix + this.topId ? "TopLevel" : "SubLevelArea"));
    if (level == "TopLevel" && this.context) return;

    var main_self = this;

    if (level != "TopLevel") {
        var tr = document.createElement("TR");
        tr.className = "sub_sep";
        var td = document.createElement("TD");
        td.colSpan = "3";
        tr.appendChild(td);
    }

    var k = document.createElement("DIV");
    k.id = "separator_" + id;
    k.className = (level == "TopLevel" ? "top_sep" : "sub_sep");
    k.onselectstart = function(e) { e = e || event; e.returnValue = false; }
    k.onclick = function(e) {
        e = e || event; e.cancelBubble = true;
        var cas = { "ctrl": e.ctrlKey, "alt": e.altKey, "shift": e.shiftKey };
        main_self._doOnClick(this.id.replace("separator_" + main_self.idPrefix, ""), "--s", cas);
    }
    if (level == "TopLevel") {
        if (pos != null) {
            pos++; if (pos < 0) { pos = 0; }
            // if (this.base.childNodes[pos] != null) { this.base.insertBefore(k, this.base.childNodes[pos]); } else { this.base.appendChild(k); }
            if (this.cont.childNodes[pos] != null) { this.cont.insertBefore(k, this.cont.childNodes[pos]); } else { this.cont.appendChild(k); }
        } else {
            // add as a last item
            // var last = this.base.childNodes[this.base.childNodes.length-1];
            var last = this.cont.childNodes[this.cont.childNodes.length - 1];
            // if (String(last).search("TopLevel_Text") == -1) { this.base.appendChild(k); } else { this.base.insertBefore(k, last); }
            if (String(last).search("TopLevel_Text") == -1) { this.cont.appendChild(k); } else { this.cont.insertBefore(k, last); }
        }
        this.idPull[k.id] = k;
    } else {
        var polygon = this.idPull["polygon_" + this.itemPull[id]["parent"]];
        if (pos != null) { pos++; if (pos < 0) pos = 0; if (pos > polygon.tbd.childNodes.length - 1) pos = null; }
        if (pos != null && polygon.tbd.childNodes[pos] != null) polygon.tbd.insertBefore(tr, polygon.tbd.childNodes[pos]); else polygon.tbd.appendChild(tr);
        td.appendChild(k);
        this.idPull[k.id] = tr;
    }
}
/**
*   @desc: add a new separator
*   @param: nextToId - id of the element after which a new separator will be inserted
*   @param: itemId - id of a new separator
*   @type: public
*/
dhtmlXMenuObject.prototype.addNewSeparator = function(nextToId, itemId) { //, disabled) {
    itemId = this.idPrefix + (itemId != null ? itemId : this._genStr(24));
    var parentId = this.idPrefix + this.getParentId(nextToId);
    // if ((parentId == this.idPrefix+this.topId) && (!this.context)) { return; }
    // this._addItemIntoGlobalStrorage(itemId, parentId, "", "item", disabled, "", "");
    // this._addItemIntoGlobalStrorage(itemId, parentId, "", "item", false, "", "");
    this._addItemIntoGlobalStrorage(itemId, parentId, "", "separator", false, "", "");
    this._renderSeparator(itemId, this.getItemPosition(nextToId));
}
/****************************************************************************************************************************************************/
// hide any opened polygons
/**
*   @desc: hides any open menu polygons
*   @type: public
*/
dhtmlXMenuObject.prototype.hide = function() {
    this._clearAndHide();
}
/**
*   @desc: clear all loaded items
*   @type: public
*/
dhtmlXMenuObject.prototype.clearAll = function() {
    /*
    for (var a in this.itemPull) {
    if (this.itemPull[a]["parent"] == this.idPrefix+this.topId) {
    this.removeItem(String(a).replace(this.idPrefix,""));
    }
    }
    */
    this.removeItem(this.idPrefix + this.topId, true);
    this._isInited = false;
    this.idPrefix = this._genStr(12);
    this.itemPull = {};
}
/****************************************************************************************************************************************************/
/**
*   @desc: unloads menu from page (destructor)
*   @type: public
*/
dhtmlXMenuObject.prototype.unload = function() {

    if (_isIE) {
        document.body.detachEvent("onclick", this._bodyClick);
        document.body.detachEvent("oncontextmenu", this._bodyContext);
    } else {
        window.removeEventListener("click", this._bodyClick, false);
        window.removeEventListener("contextmenu", this._bodyContext, false);
    }
    this._bodyClick = null;
    this._bodyContext = null;

    // will recursively remove all items
    this.removeItem(this.idPrefix + this.topId, true);

    this.itemPull = null;
    this.idPull = null;

    // clear context zones
    if (this.context) for (var a in this.contextZones) this.removeContextZone(a);

    if (this.cont != null) {
        this.cont.className = "";
        this.cont.parentNode.removeChild(this.cont);
        this.cont = null;
    }

    if (this.base != null) {
        this.base.className = "";
        if (!this.context) this.base.oncontextmenu = (this.base._oldContextMenuHandler || null);
        this.base.onselectstart = null;
        this.base = null;
    }
    this.setSkin = null;

    this.detachAllEvents();

    if (this._xmlLoader) {
        this._xmlLoader.destructor();
        this._xmlLoader = null;
    }

    this.taskid = 0;
    this._align = null;
    this._arrowFFFix = null;
    this._isIE6 = null;
    this._isInited = null;
    this._rtl = null;
    this._scrollDownTMStep = null;
    this._scrollDownTMTime = null;
    this._scrollUpTMStep = null;
    this._scrollUpTMTime = null;
    this._topLevelBottomMargin = null;
    this._topLevelOffsetLeft = null;
    this._topLevelBottomMargin = null;
    this._topLevelRightMargin = null;
    this.addBaseIdAsContextZone = null;
    this.context = null;
    this.contextAutoHide = null;
    this.contextAutoShow = null;
    this.contextHideAllMode = null;
    this.contextMenuZoneId = null;
    this.dLoad = null;
    this.dLoadSign = null;
    this.dLoadUrl = null;
    this.loaderIcon = null;
    this.fixedPosition = null;
    this.dirSubLevel = null;
    this.dirTopLevel = null;
    this.limit = null;
    this.menuSelected = null;
    this.menuLastClicked = null;
    this.idPrefix = null;
    this.imagePath = null;
    this.menuMode = null;
    this.menuModeTopLevelTimeout = null;
    this.menuModeTopLevelTimeoutTime = null;
    this.menuTimeoutHandler = null;
    this.menuTimeoutMsec = null;
    this.menuTouched = null;
    this.isDhtmlxMenuObject = null;
    this.itemHotKeyTagName = null;
    this.itemHrefTagName = null;
    this.itemTagName = null;
    this.itemTextTagName = null;
    this.itemTipTagName = null;
    this.userDataTagName = null;
    this.skin = null;
    this.topId = null;
    this.dacCycles = null;
    this.dacCyclesIE = null;
    this.dacSpeed = null;
    this.dacSpeedIE = null;
    this.zInd = null;
    this.zIndInit = null;
    this.zIndStep = null;

    //
    // unload basic methods

    this._enableDacSupport = null;
    this._selectedSubItems = null;
    this._openedPolygons = null;
    this._addSubItemToSelected = null;
    this._removeSubItemFromSelected = null;
    this._getSubItemToDeselectByPolygon = null;
    this._hidePolygon = null;
    this._showPolygon = null;
    this._redistribSubLevelSelection = null;
    this._doOnClick = null;
    this._doOnTouchMenu = null;
    this._searchMenuNode = null;
    this._getMenuNodes = null;
    this._genStr = null;
    this._clearAndHide = null;
    this._doOnLoad = null;
    this.getItemType = null;
    this.forEachItem = null;
    this.init = null;
    this.loadXML = null;
    this.loadXMLString = null;
    this._buildMenu = null;
    this._xmlParser = null;
    this._showSubLevelItem = null;
    this._hideSubLevelItem = null;
    this._countVisiblePolygonItems = null;
    this._redefineComplexState = null;
    this._updateItemComplexState = null;
    this._getItemLevelType = null;
    this._redistribTopLevelSelection = null;
    this._initTopLevelMenu = null;
    this._renderToplevelItem = null;
    this.setImagePath = null;
    this.setIconsPath = null;
    this.setIconPath = null;
    this._updateItemImage = null;
    this.removeItem = null;
    this._getAllParents = null;
    this.renderAsContextMenu = null;
    this.addContextZone = null;
    this.removeContextZone = null;
    this.isContextZone = null;
    this._isContextMenuVisible = null;
    this._showContextMenu = null;
    this._doOnContextBeforeCall = null;
    this._autoDetectVisibleArea = null;
    this._addItemIntoGlobalStrorage = null;
    this._addSubMenuPolygon = null;
    this._renderSublevelPolygon = null;
    this._renderSublevelItem = null;
    this._renderSeparator = null;
    this._hideContextMenu = null;
    this.clearAll = null;
    this.getItemPosition = null;
    this.setItemPosition = null;
    this.getParentId = null;
    this.addNewSibling = null;
    this.addNewChild = null;
    this.addNewSeparator = null;
    this.attachEvent = null;
    this.callEvent = null;
    this.checkEvent = null;
    this.eventCatcher = null;
    this.detachEvent = null;
    this.dhx_Event = null;
    this.unload = null;
    this.items = null;
    this.radio = null;
    this.detachAllEvents = null;
    this.hide = null;
    this.showContextMenu = null;
    this.hideContextMenu = null;


    // unload extended methods
    this._changeItemState = null;
    this._changeItemVisible = null;
    this._updateLoaderIcon = null;
    this._clearAllSelectedSubItemsInPolygon = null;
    this._checkArrowsState = null;
    this._addUpArrow = null;
    this._addDownArrow = null;
    this._removeUpArrow = null;
    this._removeDownArrow = null;
    this._isArrowExists = null;
    this._doScrollUp = null;
    this._doScrollDown = null;
    this._countPolygonItems = null;
    this._getRadioImgObj = null;
    this._setRadioState = null;
    this._radioOnClickHandler = null;
    this._getCheckboxState = null;
    this._setCheckboxState = null;
    this._readLevel = null;
    this._updateCheckboxImage = null;
    this._checkboxOnClickHandler = null;
    this._removeArrow = null;
    this.setItemEnabled = null;
    this.setItemDisabled = null;
    this.isItemEnabled = null;
    this.getItemText = null;
    this.setItemText = null;
    this.loadFromHTML = null;
    this.hideItem = null;
    this.showItem = null;
    this.isItemHidden = null;
    this.setUserData = null;
    this.getUserData = null;
    this.setOpenMode = null;
    this.setWebModeTimeout = null;
    this.enableDynamicLoading = null;
    this.getItemImage = null;
    this.setItemImage = null;
    this.clearItemImage = null;
    this.setAutoShowMode = null;
    this.setAutoHideMode = null;
    this.setContextMenuHideAllMode = null;
    this.getContextMenuHideAllMode = null;
    this.setVisibleArea = null;
    this.setTooltip = null;
    this.getTooltip = null;
    this.setHotKey = null;
    this.getHotKey = null;
    this.setItemSelected = null;
    this.setTopText = null;
    this.setRTL = null;
    this.setAlign = null;
    this.setHref = null;
    this.clearHref = null;
    this.getCircuit = null;
    this.contextZones = null;
    this.setOverflowHeight = null;
    this.userData = null;
    this.getRadioChecked = null;
    this.setRadioChecked = null;
    this.addRadioButton = null;
    this.setCheckboxState = null;
    this.getCheckboxState = null;
    this.addCheckbox = null;
    this.serialize = null;


    this.extendedModule = null;

    // remove menu from global store
    dhtmlxMenuObjectLiveInstances[this._UID] = null;
    try { delete dhtmlxMenuObjectLiveInstances[this._UID]; } catch (e) { }
    this._UID = null;

}
// dhtmlxmenu global store
var dhtmlxMenuObjectLiveInstances = {};

dhtmlXMenuObject.prototype.i18n = {
    dhxmenuextalert: "dhtmlxmenu_ext.js required"
};

//menu
(function() {
    dhtmlx.extend_api("dhtmlXMenuObject", {
        _init: function(obj) {
            return [obj.parent, obj.skin];
        },
        align: "setAlign",
        top_text: "setTopText",
        context: "renderAsContextMenu",
        icon_path: "setIconsPath",
        open_mode: "setOpenMode",
        rtl: "setRTL",
        skin: "setSkin",
        dynamic: "enableDynamicLoading",
        xml: "loadXML",
        items: "items",
        overflow: "setOverflowHeight"
    }, {
        items: function(arr, parent) {
            var pos = 100000;
            var lastItemId = null;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (item.type == "separator") {
                    this.addNewSeparator(lastItemId, pos, item.id);
                    lastItemId = item.id;
                } else {
                    this.addNewChild(parent, pos, item.id, item.text, item.disabled, item.img, item.img_disabled);
                    lastItemId = item.id;
                    if (item.items) this.items(item.items, item.id);
                }
            }
        }
    });
})();

// terrace
dhtmlXMenuObject.prototype._improveTerraceSkin = function() {

    for (var a in this.itemPull) {

        if (this.itemPull[a].parent == this.idPrefix + this.topId && this.idPull[a] != null) { // this.idPull[a] will null for separator

            var bl = false;
            var br = false;

            // left side, first item, not sep
            if (this.idPull[a].parentNode.firstChild == this.idPull[a]) {
                bl = true;
            }

            // right side, last item, not sep
            if (this.idPull[a].parentNode.lastChild == this.idPull[a]) {
                br = true;
            }

            // check siblings
            for (var b in this.itemPull) {
                if (this.itemPull[b].type == "separator" && this.itemPull[b].parent == this.idPrefix + this.topId) {
                    if (this.idPull[a].nextSibling == this.idPull["separator_" + b]) {
                        br = true;
                    }
                    if (this.idPull[a].previousSibling == this.idPull["separator_" + b]) {
                        bl = true;
                    }
                }
            }

            this.idPull[a].style.borderLeft = (bl ? "1px solid #cecece" : "0px solid white");
            this.idPull[a].style.borderTopLeftRadius = this.idPull[a].style.borderBottomLeftRadius = (bl ? "5px" : "0px");

            this.idPull[a].style.borderTopRightRadius = this.idPull[a].style.borderBottomRightRadius = (br ? "5px" : "0px");

            this.idPull[a]._bl = bl;
            this.idPull[a]._br = br;

        }
    }

};

dhtmlXMenuObject.prototype._improveTerraceButton = function(id, state) {
    if (state) {
        this.idPull[id].style.borderBottomLeftRadius = (this.idPull[id]._bl ? "5px" : "0px");
        this.idPull[id].style.borderBottomRightRadius = (this.idPull[id]._br ? "5px" : "0px");
    } else {
        this.idPull[id].style.borderBottomLeftRadius = "0px";
        this.idPull[id].style.borderBottomRightRadius = "0px";
    }
};