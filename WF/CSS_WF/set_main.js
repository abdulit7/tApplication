//graphics design workflow
var dragapproved = false;
var eventsource,x,y;
var popeventsource = "";
var temp1 = 0;
var temp2 = 0;

function nocontextmenu()
{
 event.cancelBubble = true
 event.returnValue = false;

 return false;
}

//init parameter
function nodrags()
{
   dragapproved = false;
}

function move()
{
	if (event.button == 1 && dragapproved)
	{
		var newleft = temp1 + event.clientX - x;
		var newtop = temp2 + event.clientY - y;
		eventsource.style.pixelLeft = newleft;
		eventsource.style.pixelTop = newtop;

		drawLine();

		return false;
	}
}

function drags()
{
  if (event.button != 1)
     return;

	var objRect = event.srcElement;
	if (event.srcElement.tagName.toLowerCase() == 'textbox') objRect = event.srcElement.parentElement;

	if ((objRect.tagName == 'roundrect') && (!event.ctrlKey))
	{
		dragapproved = true;
		eventsource = objRect;
		temp1 = eventsource.style.pixelLeft;
		temp2 = eventsource.style.pixelTop;
		x = event.clientX;
		y = event.clientY;
		document.onmousemove = move;
    }
    if ((objRect.tagName == 'shape') && (!event.ctrlKey)) {
        dragapproved = true;
        eventsource = objRect;
        temp1 = eventsource.style.pixelLeft;
        temp2 = eventsource.style.pixelTop;
        x = event.clientX;
        y = event.clientY;
        document.onmousemove = move;
    }
}

//-- draw line --
function drawLine()
{
  var source;
  var object;
  var sourceObj;
  var objectObj;
  var x0,y0,x1,y1;
  var p0,p1;
  var a = document.getElementsByTagName('line');
  for (var i = 0; i < a.length; i++)
  {
     source = a[i].getAttribute('source');
     object = a[i].getAttribute('object');
     if ((source != null) && (object != null))
     {
        sourceObj = document.getElementById(source);
        objectObj = document.getElementById(object);

        if ((sourceObj == null) || (objectObj == null)) continue;

        if (sourceObj.style.pixelLeft > objectObj.style.pixelLeft)
        {
           if ((sourceObj.style.pixelLeft - objectObj.style.pixelLeft) <= objectObj.style.pixelWidth)
           {
	  x0 = sourceObj.style.pixelLeft + sourceObj.style.pixelWidth / 2;
	  x1 = objectObj.style.pixelLeft + objectObj.style.pixelWidth / 2;
               if (sourceObj.style.pixelTop >  objectObj.style.pixelTop)
               {
  	  		y0 = sourceObj.style.pixelTop;
  	  		y1 = objectObj.style.pixelTop  + objectObj.style.pixelHeight;
               }
               else
               {
  	  		y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight;
  	  		y1 = objectObj.style.pixelTop;
  	  }
           }
           else
           {
               x0 = sourceObj.style.pixelLeft;
               x1 = objectObj.style.pixelLeft + objectObj.style.pixelWidth;
  	  y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight / 2;
  	  y1 = objectObj.style.pixelTop + objectObj.style.pixelHeight / 2;
           }
        }
        else
        {
           if ((objectObj.style.pixelLeft - sourceObj.style.pixelLeft) <= objectObj.style.pixelWidth)
           {
	  x0 = sourceObj.style.pixelLeft + sourceObj.style.pixelWidth / 2;
	  x1 = objectObj.style.pixelLeft + objectObj.style.pixelWidth / 2;
               if (sourceObj.style.pixelTop >  objectObj.style.pixelTop)
               {
  	  		y0 = sourceObj.style.pixelTop;
  	  		y1 = objectObj.style.pixelTop  + objectObj.style.pixelHeight;
               }
               else
               {
  	  		y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight;
  	  		y1 = objectObj.style.pixelTop;
  	  }
           }
           else
           {
		x0 = sourceObj.style.pixelLeft + sourceObj.style.pixelWidth;
		x1 = objectObj.style.pixelLeft;
		y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight / 2;
		y1 = objectObj.style.pixelTop + objectObj.style.pixelHeight / 2;
             }
        }

        a[i].from = String(x0) + ',' + String(y0);
        a[i].to = String(x1) + ',' + String(y1);

        a[i].style.pixelLeft = x0 + 'px';
        a[i].style.pixelTop = y0 + 'px';

        //condition
        strIF = a[i].getAttribute('title');
        if ((strIF != null) && (strIF != ''))
        {
	        var id = 'if_' + source + '_' + object;
	        var obj = document.getElementById(id);

	        var left = (x0 + (x1 - x0) / 2 - 30);
	        var top = (y0 + (y1 - y0) / 2 - 15);

	        if (obj != null)
	        {
		        obj.style.pixelLeft = left + 'px';
		        obj.style.pixelTop = top + 'px';

		        obj.style.left = left + 'px';
		        obj.style.top = top + 'px';

		        obj.style.display = '';
	        }
         }

        a[i].style.display = '';
     }
  }
}

//The Form has been load completed
function document.onreadystatechange()
{
   if (document.readyState=='complete')
   {
      drawLine();
      document.onmousedown = drags;
      document.onmouseup = nodrags;
   }
}

//Shape menu row
function getMenuRow(s_Event, s_Html) {
	var s_MenuRow = "";
	s_MenuRow = "<tr><td align=center valign=middle nowrap><TABLE border=0 cellpadding=0 cellspacing=0 width=132><tr><td nowrap valign=middle height=20 class=MouseOut onMouseOver=this.className='MouseOver'; onMouseOut=this.className='MouseOut';";
	s_MenuRow += " onclick=\"parent."+s_Event+";parent.oPopupMenu.hide();\"";
	s_MenuRow += ">&nbsp;";
	s_MenuRow += s_Html+"<\/td><\/tr><\/TABLE><\/td><\/tr>";
	return s_MenuRow;
}


//right key menu
var sMenuHr = "<tr><td align=center valign=middle height=2><TABLE border=0 cellpadding=0 cellspacing=0 width=128 height=2><tr><td height=1 class=HrShadow><\/td><\/tr><tr><td height=1 class=HrHighLight><\/td><\/tr><\/TABLE><\/td><\/tr>";
var sMenu1 = "<TABLE onmousedown='if (event.button==1) return true; else return false;' border=0 cellpadding=0 cellspacing=0 class=Menu width=160><tr><td width=18 valign=bottom align=center style='background-position:bottom;'><\/td><td width=132 class=RightBg><TABLE border=0 cellpadding=0 cellspacing=0>";
var sMenu2 = "<\/TABLE><\/td><\/tr><\/TABLE>";
var oPopupMenu = null;
oPopupMenu = window.createPopup();

function showContextMenu(event,type)
{
	var style = "";
	style = "BODY {margin:0px;border:0px}";
	style += " TD {font-size:9pt;font-family:Tahoma,Verdana,Segoe,sans-serif}";
	style += " TABLE.Menu {border-top:window 1px solid;border-left:window 1px solid;border-bottom:buttonshadow 1px solid;border-right:buttonshadow 1px solid;background-color:#98DA87}";
	style += "TD.RightBg {background-color:buttonface}";
	style += "TD.MouseOver {background-color:highlight;color:highlighttext;cursor:default;}";
	style += "TD.MouseOut {background-color:buttonface;color:buttontext;cursor:default;}";
	style += "TD.HrShadow {background-color:buttonshadow;}";
	style += "TD.HrHighLight {background-color:buttonhighlight;}";
	style = "<style>" + style + "</style>";

	var width = 150;
	var height = 0;
	var lefter = event.clientX;
	var topper = event.clientY;

	var oPopDocument = oPopupMenu.document;
	var oPopBody = oPopupMenu.document.body;

   //object
	var objRect = event.srcElement;
	if (event.srcElement.tagName.toLowerCase() == 'textbox')
	    objRect = event.srcElement.parentElement;

	var Task_ID =  objRect.getAttribute('table_id');

	var sMenu = style;

  switch(type)
  {
  case 1:

    sMenu += getMenuRow("Edit_Task(" + Task_ID + ")", "Edit Task");
  	height += 20;

  	sMenu += getMenuRow("Edit_UserGroup(" + Task_ID + ")", "User Group Mapping");
  	height += 20;
  	
  	sMenu += getMenuRow("Del_Task(" + Task_ID + ")", "Delete Task");
  	height += 20;

  	break;

  case 2:

  	sMenu += getMenuRow("Add_Task()", "New Task");
  	height += 20;

  	sMenu += sMenuHr;
  	height += 2;

  	sMenu += getMenuRow("SavePosition()", "Save");
  	height += 20;

  	sMenu += getMenuRow("Refresh()", "Refresh");
  	height += 20;

  	break;
  }

	sMenu = sMenu1 + sMenu + sMenu2;

	height += 2;
	if (lefter+width > document.body.clientWidth) lefter = lefter - width + 2;
	if (topper+height > document.body.clientHeight) topper = topper - height + 2;

	oPopupMenu.document.body.innerHTML = sMenu;
	oPopupMenu.show(lefter, topper, width, height,document.body);

	return false;
}

//mouse right click
function DoRightClick()
{
	pub_x = event.clientX;
	pub_y = event.clientY;

  SetSel();

	var objRect = event.srcElement;
	if (event.srcElement.tagName.toLowerCase() == 'textbox') objRect = event.srcElement.parentElement;

    if (objRect.tagName.toLowerCase() == 'roundrect')
    {
        if (event.button == 2) return showContextMenu(event,1);
    }
    else
    {
        if (objRect.tagName.toLowerCase() == 'line')
        {
           //if (event.button == 2) return showContextMenu(event,3);
        }
        else
        {
           if (event.button == 2) return showContextMenu(event,2);
        }
	}
}

//select process
function SetSel()
{
   var flowType = '';
   var flowID = 0;
   var passCount = 0;
   var flowColor = '';
   var strStart="#7DD877";
   var strEnd="#FEA183";
   var strEmail = "#ACACAC";
   var strOut="#EEEEEE";
   var strSelect ="#FFFA94";

   var vml = document.getElementsByTagName('roundrect');
   for (var i = 0; i < vml.length; i++)
   {
      flowType = vml[i].getAttribute('flowType');
      if (flowType == 'start')
      {
         flowColor = strStart;
      }
      else if (flowType == 'end')
      {
         flowColor = strEnd;
      }
      else if (flowType == 'email')
      {
          flowColor = strEmail;
      }
      else
      {
         flowColor = strOut;
      }
      vml[i].fillcolor = flowColor;
   }

   var objRect = event.srcElement;
   if(event.srcElement.tagName.toLowerCase() == 'textbox')
      objRect = event.srcElement.parentElement;

   //process type
   //flowType = objRect.getAttribute('flowType');
   try { if (objRect.tagName == 'roundrect') objRect.fillcolor = strSelect; } catch(e){}
}

//save layout
function SavePosition() {
    
    var id = 0;
    var strSql = '';
    var mf_pixel_left = 0;
    var mf_pixel_top = 0;
    var url = document.getElementById("hidWSPath").value;

    a = document.getElementsByTagName('roundrect');
    for (var i = 0; i < a.length; i++) {
        table_id = eval(a[i].getAttribute('table_id'));
        mf_pixel_left = a[i].style.pixelLeft;
        mf_pixel_top = a[i].style.pixelTop;

        if (table_id > 0) {
            //var param = new SOAPClientParameters();
            //param.add("PID1", mf_pixel_left);
            //param.add("PID2", mf_pixel_top);
            //param.add("PID3", table_id);

            var payLoad = {};
            payLoad["PID1"] = mf_pixel_left;
            payLoad["PID2"] = mf_pixel_top;
            payLoad["PID3"] = table_id;

            try {
                //var r = SOAPClient.invoke(url, "SaveWF", param, false);                
                postRequest(url + "/SaveWF", JSON.stringify(payLoad), function () { });
            }
            catch (err) {                
                alert("Error: " + err.description)
            }
        }
    }
    a = document.getElementsByTagName('shape');
    for (var i = 0; i < a.length; i++) {
        table_id = eval(a[i].getAttribute('table_id'));
        mf_pixel_left = a[i].style.pixelLeft;
        mf_pixel_top = a[i].style.pixelTop;

        if (table_id > 0) {
            //var param = new SOAPClientParameters();
            //param.add("PID1", mf_pixel_left);
            //param.add("PID2", mf_pixel_top);
            //param.add("PID3", table_id);

            var payLoad = {};
            payLoad["PID1"] = mf_pixel_left;
            payLoad["PID2"] = mf_pixel_top;
            payLoad["PID3"] = table_id;

            try {
                //var r = SOAPClient.invoke(url, "SaveWF", param, false);
                
                postRequest(url + "/SaveWF", JSON.stringify(payLoad), function () { });
            }
            catch (err) {
                
                alert("Error: " + err.description)
            }
        }
    }
    var flow_id = document.getElementById("FlowNumber").value;
    window.location = "WFDesigner.aspx?ProcessID=" + flow_id;
}

//delete flow line
function DelFlowRun(fid)
{
   if ((fid == null) || (fid == 0)) return;

   SavePosition();
   document.all('btnSave').click();
}

//refresh
function Refresh()
{
   location.href = location.href;
}

function LoadWindow(URL)
{
  loc_x=(screen.availWidth-700)/2;
  loc_y=(screen.availHeight-550)/2;
  window.open(URL,"set_process","height=500,width=550,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes");
}

//Add Task
function Add_Task()
{
var strProcessID=document.getElementById("FlowNumber").value;
LoadWindow("AddEditTask.aspx?ProcessID=" + strProcessID + "");
}

//Edit Task property
function Edit_Task(Task_ID) {
    var strProcessID = document.getElementById("FlowNumber").value;
    LoadWindow("AddEditTask.aspx?ProcessID=" + strProcessID + "&TaskID=" + Task_ID);
}
//Edit User Group Mapping property
function Edit_UserGroup(Task_ID) {
    var strProcessID = document.getElementById("FlowNumber").value;
    LoadWindow("TaskUserGroupPopup.aspx?ProcessID=" + strProcessID + "&TaskID=" + Task_ID);
}
//delete Task 
function Del_Task(TaskID)
{
   msg='Are you sure to delete this task?';
   if(window.confirm(msg))
   {
      var ProcessID = document.getElementById("FlowNumber").value;
      window.location = "DeleteTask.aspx?ProcessID=" + ProcessID + "&TaskID=" + TaskID;
   }    
}
