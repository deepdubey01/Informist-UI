

$(document).ready(function () {
    $('.dataTable').DataTable();
});

$(function () {
    $(".resizable").resizable({
        handles: 's',
        minHeight: 100,
        containment: ".expand-fullscreen",
    });
});



$('#multiple-checkboxes').multiselect({
    includeSelectAllOption: true,
});



var $table = $('#table');
$(function () {
    $('#toolbar').find('select').change(function () {
        $table.bootstrapTable('refreshOptions', {
            exportDataType: $(this).val()
        });
    });
})

var trBoldBlue = $("table");


$(trBoldBlue).on("click", "tr", function () {
    $(this).toggleClass("bold-blue");
});




document.addEventListener("DOMContentLoaded", function () {
    var chipContainer = document.getElementById('chipContainer');
    var fruitInput = document.getElementById('fruitInput');
    var commaSeparatedOutput = document.getElementById('commaSeparatedOutput');
    var chipsForm = document.getElementById('chipsForm');

    fruitInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addChip();
        }
    });

    chipsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        displayFormData();
    });

    function addChip() {
        var chipValue = fruitInput.value.trim();
        if (chipValue === '') {
            return;
        }

        var chipElement = document.createElement('div');
        chipElement.className = 'badge badge-secondary example-chip';
        chipElement.textContent = chipValue;
        var closeButton = document.createElement('button');
        closeButton.className = 'close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function () {
            removeChip(chipElement);
        });
        chipElement.appendChild(closeButton);
        chipContainer.appendChild(chipElement);
        fruitInput.value = '';
    }

    function removeChip(chipElement) {
        chipContainer.removeChild(chipElement);
    }

    function displayFormData() {
        var allChips = Array.from(chipContainer.children).map(function (chipElement) {
            return chipElement.textContent.replace('×', '').trim();
        });
        console.log('All Fruits:', JSON.stringify(allChips));
    }

});



$(document).ready(function () {
    $(".sd-CustomSelect").multipleSelect({
        selectAll: false,
        onOptgroupClick: function (view) {
            $(view).parents("label").addClass("selected-optgroup");
        }
    });
});