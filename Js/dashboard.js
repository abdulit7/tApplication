$(function() {
    $('.dragbox')
	.each(function () {
	    
	    $(this).find('.mycollapse').click(function() {
	        $(this).parent().siblings('.dragbox-content').toggle();

	    })
		.end()

	});
    $ = jQuery.noConflict();
    $('.column').sortable({
        connectWith: '.column',
        handle: 'h2',
        cursor: 'move',
        placeholder: 'placeholder',
        forcePlaceholderSize: true,
        opacity: 0.4,
        start: function(event, ui) {
            //Firefox, Safari/Chrome fire click event after drag is complete, fix for that
            //            if ($.browser.mozilla || $.browser.safari)
            //                $(ui.item).find('.dragbox-content').toggle();
        },
        stop: function(event, ui) {
            ui.item.css({ 'top': '0', 'left': '0' }); //Opera fix
            //if (!$.browser.mozilla && !$.browser.safari) {
                //updateWidgetData();
            //}
        }
		,
        update: function(event, ui) {
            updateWidgetData();
        }

    })
	.disableSelection();
});

function updateWidgetData() {
    var items = [];
    $('.column').each(function() {
        var columnId = $(this).attr('id');
        $('.dragbox', this).each(function(i) {
            var collapsed = 0;
            if ($(this).find('.dragbox-content').css('display') == "none")
                collapsed = 1;
            var item = $(this).attr('id') + "|" + columnId + "|" + i;
            items.push(item);
        });
    });
    var sortorder = items;

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(function() {
        $.ajax({
            url: 'wsHelper.asmx/SaveDashboard',
            data: 'data=' + $.toJSON(sortorder),
            dataType: 'json',
            type: 'post',
            success: function(data) {
                if (data.success) {
                    $("#errorMsg").addClass('success').html(data.message).fadeIn('slow');
                } else {
                    $("#errorMsg").addClass('error').html(data.message).fadeIn('slow');
                }
            }
        });
    }, 250);

}

function onAddClick() {
    alert('Add Dashlets');
}

function onRemoveClick(itemId) {
    if (confirm('This widget will be removed, ok?')) {
        $.ajax({
            type: "POST",
            url: "wsHelper.asmx/DeleteDashboard",
            data: "data=" + $.toJSON(itemId),
            dataType: "json",
            success: function(response) {
                //$("#" + itemId).remove();
                window.location.reload();
            }
        });


    }

}
