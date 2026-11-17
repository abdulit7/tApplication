//Show Modal
(function() {
    window.spawn = window.spawn || function(gen) {
        function continuer(verb, arg) {
            var result;
            try {
                result = generator[verb](arg);
            } catch (err) {
                return Promise.reject(err);
            }
            if (result.done) {
                return result.value;
            } else {
                return Promise.resolve(result.value).then(onFulfilled, onRejected);
            }
        }
        var generator = gen();
        var onFulfilled = continuer.bind(continuer, 'next');
        var onRejected = continuer.bind(continuer, 'throw');
        return onFulfilled();
    };
    window.showModalDialog = window.showModalDialog || function(url, arg, opt) {
        url = url || ''; //URL of a dialog
        arg = arg || null; //arguments to a dialog
        opt = opt || 'dialogWidth:300px;dialogHeight:200px'; //options: dialogTop;dialogLeft;dialogWidth;dialogHeight or CSS styles
        var caller = showModalDialog.caller.toString();        
        var dialog = document.body.appendChild(document.createElement('dialog'));
        dialog.setAttribute('style', opt.replace(/dialog/gi, ''));
        dialog.innerHTML = '<input type="button" id="dialog-close" value="X" style="position: absolute; top: 0; right: 1px;" class="btn" /><iframe id="dialog-body" src="' + url + '" style="border: 0; width: 100%; height: 100%;"></iframe>';
        //dialog.innerHTML = '<a href="#" id="dialog-close" style="position: absolute; top: 0; right: 4px; font-size: 20px; color: #000; text-decoration: none; outline: none;">&times;</a><iframe id="dialog-body" src="' + url + '" style="border: 0; width: 100%; height: 100%;"></iframe>';
        document.getElementById('dialog-body').contentWindow.dialogArguments = arg;
        document.getElementById('dialog-close').addEventListener('click', function(e) {
            e.preventDefault();
            dialog.close();
        });
        dialog.showModal();        

        //if using yield
        if (caller.indexOf('yield') >= 0) {
            return new Promise(function(resolve, reject) {
                dialog.addEventListener('close', function() {
                    var returnValue = document.getElementById('dialog-body').contentWindow.returnValue;
                    document.body.removeChild(dialog);
                    resolve(returnValue);
                });
            });
        }
        //if using eval
        var isNext = false;
        var nextStmts = caller.split('\n').filter(function(stmt) {
            if (isNext || stmt.indexOf('showModalDialog(') >= 0)
                return isNext = true;
            return false;
        });
        dialog.addEventListener('close', function() {            
            var returnValue = document.getElementById('dialog-body').contentWindow.returnValue;            
            document.body.removeChild(dialog);
            nextStmts[0] = nextStmts[0].replace(/(window\.)?showModalDialog\(.*\)/g, JSON.stringify(returnValue));            
            eval('{\n' + nextStmts.join('\n'));
        });
        //throw 'Execution stopped until showModalDialog is closed';
    };
})();

function closeDialog() {
    var ctrl = document.getElementById('dialog-close')
    if (ctrl != null) {
        efroFireEvent_2(ctrl, 'click')
    }
    else {
        window.close();
    }
}

function FireEvent_onclick(ctrlID) {
    var ctrl = document.getElementById(ctrlID)
    efroFireEvent(ctrl, 'click')
}

function efroFireEvent_2(ctrl, event) {
    if (ctrl != null) {
        var IsIE = false;
        var IsDisabled = ctrl.disabled;
        IsIE = navigator.appName == "Microsoft Internet Explorer";

        if (IsIE == true) {
            ctrl.disabled = false
            ctrl.fireEvent('on' + event);
            ctrl.disabled = IsDisabled;
        }
        else {
            var $ = jQuery.noConflict();
            var myctrl = '#' + ctrl.id;
            $(myctrl)[0].disabled = false
            $(myctrl).trigger(event);
            $(myctrl)[0].disabled = IsDisabled
        }
    }
}