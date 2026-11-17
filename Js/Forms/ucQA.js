function result_change(e) {
    var hidScoreObj, objScore, lblMaxMarks, sender, row, value, maxMarks;
    var QuestionID, QuestionGroupID;

    //console.log('result_change called');
    if (typeof $ === 'undefined' || $ === null) {
        $ = jQuery.noConflict();
    }
    value = e.target.value;
    hidScoreObj = $('[id$="hidScoreObj"]');    
    objScore = JSON.parse(hidScoreObj.val());
    sender = $("#" + e.target.id);    
    row = sender.closest('tr');

    lblMaxMarks = row.find('[id$="lblMaxMarks"]');
    QuestionID = row.find('[id$="hidQuestionID"]').val();
    QuestionGroupID = row.find('[id$="hidQuestionGroupID"]').val();

    maxMarks = lblMaxMarks.html();
    value = isNaN(value) || value.trim() === "" ? 0 : parseFloat(value);
    maxMarks = isNaN(maxMarks) || maxMarks.trim() === "" ? 0 : parseFloat(maxMarks);
    //console.log(value, maxMarks);

    if (value > maxMarks) {
        e.target.style.backgroundColor = '#fc8f8f';
    }
    else {
        e.target.style.backgroundColor = '#fff';
        objScore[QuestionGroupID][QuestionID] = value;

        //console.log('objScore : ', objScore);
        
        hidScoreObj.val(JSON.stringify(objScore));
        CalculateTotalObtained();
    }

    
}

function CalculateTotalObtained() {
    var hidScoreObj, txtObtainedMarks, txtTotalMarks, ddlResult, spanPercentage, passingPercentage, totalMarks, obtainedPercentage, keys, childKeys,
        total, isPassed;
        
    total = 0;
    hidScoreObj = $('[id$="hidScoreObj"]');
    txtObtainedMarks = $('[id$="txtObtainedMarks"]');
    totalMarks = parseFloat($('[id$="txtTotalMarks"]').val());
    passingPercentage = parseFloat($('[id$="hidPassingPercentage"]').val());
    spanPercentage = $('#spanPercentage');
    ddlResult = $('[id$="ddlResult"]');
    
    if (typeof hidScoreObj !== 'undefined' && hidScoreObj !== null) {        
        objScore = JSON.parse(hidScoreObj.val());
        keys = Object.keys(objScore);
        keys.map(function(item, index) {
            childKeys = Object.keys(objScore[item]);
            childKeys.map(function(childItem) {
                total += objScore[item][childItem];
            });
        });

        total = total > totalMarks ? totalMarks : total;
        total = Math.round(total * 100) / 100;
        obtainedPercentage = (total * 100) / totalMarks;
        obtainedPercentage = Math.round(obtainedPercentage * 100) / 100;
        isPassed = obtainedPercentage >= passingPercentage;

        if (typeof txtObtainedMarks !== 'undefined' && txtObtainedMarks !== null) {
            txtObtainedMarks.val(total.toString());
            spanPercentage.html("Percentage : " + obtainedPercentage.toString() + " %");
            ddlResult.val(isPassed ? "P" : "F");
        }
    }
}

function makeRemarksConditionallyMandatory(e, conditionText) {
    var $ddlOptionsSelectedText, $rfv_txtRemarksID, rfv_txtRemarks;
    $ = jQuery.noConflict();
    $ddlOptionsSelectedText = $('#' + e.target.id + ' option[value="' + e.target.value + '"]').text();
    $rfv_txtRemarksID = $('#' + e.target.id).siblings('[id$="rfv_txtRemarks"]').attr('id');
    rfv_txtRemarks = document.getElementById($rfv_txtRemarksID);
    ValidatorEnable(rfv_txtRemarks, conditionText.toLowerCase() === $ddlOptionsSelectedText.toLowerCase());
}