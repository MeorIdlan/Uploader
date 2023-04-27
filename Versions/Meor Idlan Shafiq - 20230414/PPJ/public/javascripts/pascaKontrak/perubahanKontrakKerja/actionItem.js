var noBqTab = [
    'basictab1',
    'basictab8',
    'basictab10',
];
var provSumTabs = [
    'basictab5',
    'basictab6',
    'basictab7',
];
var tableTabs = [
    'basictab3',
    'basictab7',
    'basictab9',
];

$('#btnNewItem').on('click', function (e) {
    console.log('#btnNewItem - click');
    $('#divListItems').addClass('collapse');
    $('#divForm').removeClass('collapse');
    $('#divMenu #btnCloseForm').removeClass('collapse');
    initForm(true);
});

$('#divMenu').on('click', '#btnCloseForm', function (e) {
    console.log('#btnCloseForm - click');

    $('#divListItems').removeClass('collapse');
    $('#divForm').addClass('collapse');
    $('#divMenu #btnCloseForm').addClass('collapse');
});

$('#dtListItems').on('click', '.editItem ', function (e) {
    e.preventDefault();
    initForm(false);
    console.log('.editItem - click');
    var trElem = $(this).parents('tr');
    if( trElem.hasClass('child') ){ trElem = trElem.prev('.parent'); }

    var dtable = $('#dtListItems').DataTable();    
    var trRow = dtable.row( trElem );

    var trElemData = trRow.data();
    getItems(trElemData.item_id);
});

$('#dtListItems').on('click', '.deleteItem ', function (e) {
    e.preventDefault();

    console.log('.deleteItem - click');
    var trElem = $(this).parents('tr');
    if( trElem.hasClass('child') ){ trElem = trElem.prev('.parent'); }

    var dtable = $('#dtListItems').DataTable();   
    var trRow = dtable.row( trElem );

    var trElemData = trRow.data();
    console.log(trElemData);
    deleteItems(trElemData.item_id);
});

$('.tab-content').on('click', '.btnRemoveObject', function() {
    var objField =  $(this).closest(".objectField");
    objField.find(".objectFieldValue").val('');
    objField.find(".objectFieldDisplay").val('');
});

// event handler for showing tab
$('.tab-content #Jenis_PPK').on('change', 'input[type="checkbox"]', function(e) {
    var checkbox = $(this);
    var code = checkbox.attr('code');
    var tab = $('#tab_'+code);

    // if checkbox is visible, then show/hide tabs
    var isVis = !checkbox.parent('div').parent('div').hasClass('collapse');
    if (isVis) {
        var checked = checkbox.prop('checked');
        if (checked) {
            // workaround for bootstrap style making text in tab as white, even when tab is not selected
            tab.on('shown.bs.collapse', function() {
                tab.removeClass('collapse show');
            });

            tab.collapse('show');
            tab.addClass('d-flex');
        }
        else {
            tab.addClass('collapse show');
            tab.collapse('hide');
            tab.removeClass('d-flex');
        }
    }
});

// event handler to show headers on other tabs
$('.tab-content #Jenis_PPK').on('change', 'input[type="checkbox"]', function(e) {
    var checkbox = $(this);
    var checked = checkbox.prop('checked');
    var code = checkbox.attr('code');

    if (code === 'JPPK02') {
        var kptKerjaDiv = $('#formTab #basictab8 #keputusanMesyuaratMenu #keputusanKerja').closest('.keputusanType');
        if (checked) {
            kptKerjaDiv.removeClass('collapse');
        }
        else {
            kptKerjaDiv.addClass('collapse');
        }

        var perakuanKerjaDiv = $('#formTab #basictab9 #divPerakuanPPJHK #perakuanKerja').closest('.perakuanType');
        if (checked) {
            perakuanKerjaDiv.removeClass('collapse');
        }
        else {
            perakuanKerjaDiv.addClass('collapse');
        }
    }
    if (code === 'JPPK03') {
        var keputusanWPSDiv = $('#formTab #basictab8 #keputusanMesyuaratMenu #keputusanWPS').closest('.keputusanType');
        if (checked) {
            keputusanWPSDiv.removeClass('collapse');
        }
        else {
            keputusanWPSDiv.addClass('collapse');
        }

        var perakuanWPSDiv = $('#formTab #basictab9 #divPerakuanPPJHK #perakuanWPS').closest('.perakuanType');
        if (checked) {
            perakuanWPSDiv.removeClass('collapse');
        }
        else {
            perakuanWPSDiv.addClass('collapse');
        }
    }
    if (code === 'JPPK04') {
        var keputusanProvQtyDiv = $('#formTab #basictab8 #keputusanMesyuaratMenu #keputusanProvQty').closest('.keputusanType');
        if (checked) {
            keputusanProvQtyDiv.removeClass('collapse');
        }
        else {
            keputusanProvQtyDiv.addClass('collapse');
        }

        var perakuanProvQtyDiv = $('#formTab #basictab9 #divPerakuanPPJHK #perakuanProvQty').closest('.perakuanType');
        if (checked) {
            perakuanProvQtyDiv.removeClass('collapse');
        }
        else {
            perakuanProvQtyDiv.addClass('collapse');
        }
    }
    if (code === 'JPPK05') {
        var keputusanKesilapanDiv = $('#formTab #basictab8 #keputusanMesyuaratMenu #keputusanKesilapan').closest('.keputusanType');
        if (checked) {
            keputusanKesilapanDiv.removeClass('collapse');
        }
        else {
            keputusanKesilapanDiv.addClass('collapse');
        }

        var perakuanKesilapanDiv = $('#formTab #basictab9 #divPerakuanPPJHK #perakuanKesilapan').closest('.perakuanType');
        if (checked) {
            perakuanKesilapanDiv.removeClass('collapse');
        }
        else {
            perakuanKesilapanDiv.addClass('collapse');
        }
    }
    if (code === 'JPPK06') {
        var perakuanWPSTidakDigunakanDiv = $('#formTab #basictab9 #divPerakuanPPJHK #perakuanWPSTidakDigunakan').closest('.perakuanType');
        if (checked) {
            perakuanWPSTidakDigunakanDiv.removeClass('collapse');
        }
        else {
            perakuanWPSTidakDigunakanDiv.addClass('collapse');
        }
    }
});

// event handlers changing button orientation in tab8
$('.tab-content #keputusanMesyuaratMenu .keputusanType .card-body').on('show.bs.collapse', function(e) {
    // rotate
    var chevronIcon = $(this).closest('.keputusanType').find('i');
    chevronIcon.css('transform', 'rotate(90deg)');
    chevronIcon.attr('rotated', 1);
});

$('.tab-content #keputusanMesyuaratMenu .keputusanType .card-body').on('hide.bs.collapse', function(e) {
    // undo rotate
    var chevronIcon = $(this).closest('.keputusanType').find('i');
    chevronIcon.css('transform', 'rotate(0)');
    chevronIcon.attr('rotated', 0);
})

// event handlers changing button orientation in tab9
$('.tab-content #divPerakuanPPJHK .perakuanType .card-body').on('show.bs.collapse', function(e) {
    // rotate
    var chevronIcon = $(this).closest('.perakuanType').find('i');
    chevronIcon.css('transform', 'rotate(90deg)');
    chevronIcon.attr('rotated', 1);
});

$('.tab-content #divPerakuanPPJHK .perakuanType .card-body').on('hide.bs.collapse', function(e) {
    // undo rotate
    var chevronIcon = $(this).closest('.perakuanType').find('i');
    chevronIcon.css('transform', 'rotate(0)');
    chevronIcon.attr('rotated', 0);
})

// TODO need a function that loads PPK elems
// need to search for PPK elem after a sst is selected.
// then load PPK elems onto divElemPPK in that tab

// event handler to load senarai bq
$('#divForm .nav-item').on('click', function(e) {
    var aElem = $(this).find('a');
    var aHref = aElem.attr('href');
    var tabName = aHref.replace('#', '');

    // checking if tab needs bq display
    var bqTab = true;
    if (noBqTab.includes(tabName)) {
        bqTab = false;
    }

    // get pdk id
    // var pdkId = $('#pdk_item_id').val();
    var pdkId = 'pdk01-ca1a2d8415d64a9eb13b4ccebd3b8a34'; // ! temporary hardcode
    var loaded = $("#divForm #formTab "+aHref+" .listElemItem").attr('load-ind');

    // checking if tab needs provsum filter
    var provSumFilter = false;
    if (provSumTabs.includes(tabName)) {
        provSumFilter = true;
    }

    // checking if tab needs bq to be displayed in a table
    var tableDisp = false;
    if (tableTabs.includes(tabName)) {
        tableDisp = true;
    }

    if (!strEmpty(pdkId) && !loaded && bqTab) {
        getBqElements(pdkId, tabName, provSumFilter, tableDisp);
    }
});

// event handler that calculates baki
$('.tab-content').on('change', '#Jumlah_Peruntukan, #Jumlah_Guna', function(e) {
    var peruntukan = $('#Jumlah_Peruntukan').val();
    var guna = $('#Jumlah_Guna').val();
    if (strEmpty(peruntukan)) {
        peruntukan = 0;
    }
    if (strEmpty(guna)) {
        guna = 0;
    }

    // check if valid numbers first
    if (Number(peruntukan) == peruntukan && Number(guna) == guna) {
        var baki = peruntukan - guna;

        // display nicely
        $('#Jumlah_Peruntukan').val(numberRound(peruntukan, 2));
        $('#Jumlah_Guna').val(numberRound(guna, 2));
        $('#Amaun').val(numberRound(baki, 2));
    }
});

function getBqElements(pdkId, tab, provSumFilter, tableDisp) {
    var objItem = null;
    var tplBQcnt = 0;

    var paramData = {};
    paramData.action = "ADVANCED_SEARCH";
    paramData.item_type_codes = ["bq01"];
    paramData.query = "( container_id = &quot;"+pdkId+"&quot;)";
    paramData.details = ["item_id","item_number","title","metadata"];
    paramData.metadata_details = ["TemplateBQ"];

    var bqObj = null;
    $.ajax({ 
        async: false,
        type: 'POST',
        url: appPrefix+"/itemSearch",
        data: "param="+encodeURIComponent(JSON.stringify(paramData)),
        xhrFields: { withCredentials: true }
    }).done(function (data) {
        if(data.success){
            var results = data.results;
            if( results != null && results.length > 0 ){
                objItem = results[0];
                if( objItem != null ){
                    var itemVal = null; var itemObj = null;                
                    var metadtObj = objItem['metadata'];
                    if( metadtObj != null ){
                        itemVal = getDecodeValue(objItem['item_id']);
                        $('#bq_item_id').val(itemVal);

                        itemObj = metadtObj['TemplateBQ'];
                        // console.log(itemObj);
                        if( itemObj != null ){
                            tplBQcnt = itemObj.length;
                            bqObj = itemObj;
                        }

                        // if provSumFilter true, call checkElem function for each item in itemObj
                        // then call dispBq for each item that passes the check
                        if (provSumFilter) {
                            preLoaderShow();
                            var elemDisp = [];
                            $.each(itemObj, function(i, val) {
                                var hasProvSum = checkElemForProvSum(val);
                                if (hasProvSum) { elemDisp.push(val); }
                            });
                            preLoaderNone();

                            dispBqElements(elemDisp, tab, tableDisp);
                        }
                        else {
                            dispBqElements(itemObj, tab, tableDisp);
                        }
                    }
                }
            }
        }
        else{ errorSwalLogout(data); }

    }).fail(function(data){
        errorSwalFail(data);
    }).always(function(data){
        if( objItem != null ){
            if( tplBQcnt > 0 ){
                $('#' + tab + ' #divElemBQ').removeClass('collapse');
                $('#' + tab + ' #divMenuElemBQ').removeClass("collapse");
            }
            else{
                $('#' + tab + ' #divElemBQ').addClass('collapse');
                $('#' + tab + ' #divFormBQ').addClass('collapse');
                $('#' + tab + ' #divMenuElemBQ').addClass("collapse");
                $('#' + tab + ' #divKosPrimaForm').addClass('collapse');
            }
        }
    });

    // TODO TemplateBQ equivalent for ppk
    // first, find ppkel that is made from one from the bq
    var found = false;
    var ppkkId = null;
    $.each(bqObj, function(i,val) {
        var ppkData = {};
        ppkData.action = "ADVANCED_SEARCH";
        ppkData.item_type_codes = ["ppkel"];
        ppkData.query = "( BQ_Element = &quot;"+val.item_id+"&quot;)";
        ppkData.details = ["item_id","container_id"];
        
        $.ajax({ 
            async: false,
            type: 'POST',
            url: appPrefix+"/itemSearch",
            data: "param="+encodeURIComponent(JSON.stringify(ppkData)),
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            if (data.success) {
                if (data.count) {
                    ppkkId = data.results[0].container_id;
                    found = true;
                }
            }
            else{ errorSwalLogout(data); }
        }).fail(function(data){
            errorSwalFail(data);
        });

        // if found, exit each loop
        // if not found, continue each loop
        return !found;
    });

    // if ppkk id found, get details
    if (ppkkId != null) {
        var ppkkData = {};
        ppkkData.item_id = ppkkId;
        ppkkData.action = "ITEM_DETAIL";
        ppkkData.details = ["item_id","title","metadata"];

        var tabs = {
            'basictab2': 'BQ_Perubahan_Kerja',
            'basictab4': 'BQ_Kesilapan_Keterangan_Kuantiti',
            'basictab5': 'BQ_WPS_Kos_Prima',
            'basictab6': 'BQ_Kos_Prima'
        }
        ppkkData.metadata_details = [tabs[tab]];
        
        $.ajax({
            async: false,
            url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(ppkkData)),
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            if(data.success) {
                var results = data.results;
                if (results != null && results.length) {
                    var objData = results[0];
                    if (objData != null) {
                        var metadtObj = objData.metadata;
                        if (metadtObj != null) {
                            // ! no bqAmount, bqNumber passed
                            var itemObj = metadtObj[tabs[tab]];

                            dispPPKElements(itemObj, tab, tableDisp);
                        }
                    }
                }
            }
            else{ errorSwalLogout(data); }
        }).fail(function(data){
            errorSwalFail(data);
        });
    }
}

// recursive function to check every item and subitem under bqElem
// cases:
// if elem is subitem (bqsi): check if provSum. if provSum return true, else return false
// if elem is item or elem (bqit, bqel):
//      get item_detail for elem, and call function for all items in BQ_Sub_Items and BQ_Items
//      if elem is item and has no item & subitem, return false
function checkElemForProvSum(bqElem) {
    if (bqElem.item_type_code !== 'bqsi') { // bqit or bqel
        var bqItems = [];
        var bqSubItems = [];

        var paramData = {};
        paramData.item_id = bqElem.item_id;
        paramData.action = "ITEM_DETAIL";
        paramData.details = ["item_id","item_type_code","title","container_id","metadata"];
        paramData.metadata_details = ['BQ_Items', "BQ_Sub_Items"];

        $.ajax({
            async: false,
            url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(paramData)),
            xhrFields: { withCredentials: true }
        }).done(function (data) {
            if(data.success){
                var results = data.results;
                if( results != null && results.length > 0 ){
                    objItem = results[0];
                    if( objItem != null ){
                        // put BQ_Items and BQ_Sub_Items in arrays
                        var metadtObj = objItem['metadata'];
                        if (metadtObj != null) {
                            var subItems = metadtObj['BQ_Sub_Items'];
                            if (subItems != null && subItems.length) {
                                $.each(subItems, function(i, val) {
                                    bqSubItems.push(val);
                                });
                            }

                            var items = metadtObj['BQ_Items'];
                            if (items != null && items.length) {
                                $.each(items, function(i, val) {
                                    bqItems.push(val);
                                })
                            }
                        }
                    }
                }
            }
            else{ errorSwalLogout(data); }
        })

        var hasProvSum = false;
        // if there are subitems, check subitems
        if (bqSubItems.length) {
            $.each(bqSubItems, function(i, val) {
                var psBool = checkElemForProvSum(val);
                if (psBool) { // as long as there is one bq with provSum, no need to check for the rest
                    hasProvSum = true;
                    return false;
                }
            });
            return hasProvSum;
        }
        else {
            $.each(bqItems, function(i, val) {
                var psBool = checkElemForProvSum(val);
                if (psBool) {
                    hasProvSum = true;
                    return false;
                }
            })
            return hasProvSum;
        }
    }
    else {
        if (bqElem.BQ_Unit.code === 'OUM017') {
            return true;
        }
        else {
            return false;
        }
    }
}

function dispBqElements(templateBQ, tab, tableDisp){
    var divFormForm = $("#divForm #formTab #" + tab);

    var divListElement = divFormForm.find("#divElemBQ #listElement");
    
    divListElement.empty();
    if( templateBQ != null){
        sortListByIntKey(templateBQ,"BQ_Number","asc");
        if (tableDisp) {
            $.each(templateBQ, function(i, elem) {
                // console.log(elem)
                var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                var elemNum = elem.BQ_Number;
                var elemTitle = getDecodeValue(elem.title);
                var elemAmount = "0.00";
                if( elem.BQ_Amount != null ){
                    elemAmount = elem.BQ_Amount.display;
                }

                var card = '';

                card += '<div id="bq-'+itemId+'" class="bqElem card">';
                card += '   <div class="row card-header border elemHeader">';
                card += '       <div class="col d-flex text-primary font-weight-bold">';
                card += '           <div class="elemNumber font-16 p-2">';
                card += '              '+elemNum;
                card += '           </div>'
                card += '           <div class="flex-grow-1 font-16 elemName p-2">';
                card += '              '+elemTitle;
                card += '           </div>';
                card += '           <div class="elemAmount font-16 p-2">';
                card += '              '+elemAmount;
                card += '           </div>';
                card += '       </div>';
                card += '   </div>';
                card += '   <div class="childContent card-body collapse">'
                card += '   </div>';
                card += '</div>';

                divListElement.append(card);
            })

        }
        else {
            jQuery.each(templateBQ, function( i, elem ) {
                // console.log(elem);
                var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                var elemTitle = getDecodeValue(elem.title);
                var elemAmount = "0.00";
                if( elem.BQ_Amount != null ){
                    elemAmount = elem.BQ_Amount.display;
                }
    
                var card = "";
                card = card + '<div class="card" item-id="'+itemId+'" item-type-code="'+itemTypeCode+'">';
                card = card + '    <div class="card-header p-1 divElementTab" role="tab" id="tab-'+itemId+'">';
                card = card + '      <div id="" class="input-group">';
                card = card + '        <span class="font-16 col-12">';
                card = card + '            <a id="'+itemId+'" class="aElementTab collapsed" reload="false" data-toggle="collapse" data-parent="#accordion" href="#tabpanel-'+itemId+'" aria-expanded="false" aria-controls="tabpanel-'+itemId+'">';
                card = card + '              <div class="row">';
                card = card + '                <div class="elemBQNumber col-2">'+elem.BQ_Number+'</div>';
                card = card + '                <div class="elemTitle col-10">'+elemTitle+'<span class="ms-2"><br>('+elemAmount+')</span></div>';
                card = card + '              </div>';
                card = card + '            </a>';
                card = card + '        </span>';
                card = card + '      </div>';
                card = card + '    </div>';
    
    
                card = card + '    <div id="tabpanel-'+itemId+'" class="collapse" role="tabpanel" aria-labelledby="tab-'+itemId+'">';
                card = card + '        <div class="card-body py-2 pe-0">';
                card = card + '             <div class="">';
                card = card + '                 <div class="listElemItem listElementItem" elem-type="bqItem"></div>';
                card = card + '                 <div class="listElemItem listElementSubItem" elem-type="bqSubItem"></div>';
                card = card + '             </div>';
                card = card + '        </div>';
                card = card + '    </div>';
                card = card + '</div>';
    
                divListElement.append(card);
            });
        }
        divListElement.attr('load-ind', true);
    }

};

function dispPPKElements(templateBQ, tab, tableDisp){
    var divFormForm = $("#divForm #formTab #" + tab);

    var divListElement = divFormForm.find("#divElemPPK #listElement");
    
    divListElement.empty();
    if( templateBQ != null){
        sortListByIntKey(templateBQ,"BQ_Number","asc");
        if (tableDisp) {
            $.each(templateBQ, function(i, elem) {
                // console.log(elem)
                var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                var elemNum = elem.BQ_Number;
                var elemTitle = getDecodeValue(elem.title);
                var elemAmount = "0.00";
                if( elem.BQ_Amount != null ){
                    elemAmount = elem.BQ_Amount.display;
                }

                var card = '';

                card += '<div id="bq-'+itemId+'" class="bqElem card">';
                card += '   <div class="row card-header border elemHeader">';
                card += '       <div class="col d-flex text-primary font-weight-bold">';
                card += '           <div class="elemNumber font-16 p-2">';
                card += '              '+elemNum;
                card += '           </div>'
                card += '           <div class="flex-grow-1 font-16 elemName p-2">';
                card += '              '+elemTitle;
                card += '           </div>';
                card += '           <div class="elemAmount font-16 p-2">';
                card += '              '+elemAmount;
                card += '           </div>';
                card += '       </div>';
                card += '   </div>';
                card += '   <div class="childContent card-body collapse">'
                card += '   </div>';
                card += '</div>';

                divListElement.append(card);
            })

        }
        else {
            jQuery.each(templateBQ, function( i, elem ) {
                // console.log(elem);
                var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                var elemTitle = getDecodeValue(elem.title);
                var elemAmount = "0.00";
                if( elem.BQ_Amount != null ){
                    elemAmount = elem.BQ_Amount.display;
                }
    
                var card = "";
                card = card + '<div class="card" item-id="'+itemId+'" item-type-code="'+itemTypeCode+'">';
                card = card + '    <div class="card-header p-1 divElementTabPPK" role="tab" id="tab-'+itemId+'">';
                card = card + '      <div id="" class="input-group">';
                card = card + '        <span class="font-16 col-10">';
                card = card + '            <a id="'+itemId+'" class="aElementTabPPK collapsed" reload="false" data-toggle="collapse" data-parent="#accordion" href="#tabpanel-'+itemId+'" aria-expanded="false" aria-controls="tabpanel-'+itemId+'">';
                card = card + '              <div class="row">';
                card = card + '                <div class="elemBQNumber col-2">'+elem.BQ_Number+'</div>';
                card = card + '                <div class="elemTitle col-10">'+elemTitle+'<span class="ms-2"><br>('+elemAmount+')</span></div>';
                card = card + '              </div>';
                card = card + '            </a>';
                card = card + '        </span>';
                card = card + '        <div class="input-group-append col-2 d-flex justify-content-end">';
                card = card + '           <div class="btn-group align-self-start dropend">'+
                                            '<button type="button" class="btn btn-secondary waves-effect dropdown-toggle-split dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                            '<i class="fe-more-vertical-"></i></button>'+
                                            '<div class="dropdown-menu">'+
                                                '<a class="dropdown-item btnAddItem" href="javascript: void(0);"><i class="fe-plus text-success pe-1"></i>Item</a>'+
                                                '<a class="dropdown-item btnAddSubItem" href="javascript: void(0);"><i class="fe-plus text-success pe-1"></i>SubItem</a>'+
                                                '<a class="dropdown-item btnDelItem" href="javascript: void(0);"><i class="fe-trash-2 text-danger pe-1"></i>Hapus</a>'+
                                            '</div>'+
                                        ' </div>';
                card = card + '         </div>';
                card = card + '      </div>';
                card = card + '    </div>';
    
    
                card = card + '    <div id="tabpanel-'+itemId+'" class="collapse" role="tabpanel" aria-labelledby="tab-'+itemId+'">';
                card = card + '        <div class="card-body py-2 pe-0">';
                card = card + '             <div class="">';
                card = card + '                 <div class="listElemItem listElementItem" elem-type="ppkItem"></div>';
                card = card + '                 <div class="listElemItem listElementSubItem" elem-type="ppkSubItem"></div>';
                card = card + '             </div>';
                card = card + '        </div>';
                card = card + '    </div>';
                card = card + '</div>';
    
                divListElement.append(card);
            });
        }
        divListElement.attr('load-ind', true);
    }

};

function getItems(itemId) {
    if (!strEmpty(itemId)) {
        var divFormForm = $("#divForm #formTab");
        var appObj = null;
            
        var paramData = {};
        paramData.item_id = itemId;
        paramData.action = "ITEM_DETAIL";
        paramData.details = ["item_id","title","metadata"];

        $.ajax({
            url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(paramData)),
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            var results = data.results;
            if( results != null && results.length > 0 ) {
                appObj = results[0];
                if(appObj != null) {
                    var itemVal = null; var itemObj = null;
                    var metadtObj = appObj['metadata'];
                    if (metadtObj != null) {
                        // item id
                        itemVal = getDecodeValue(appObj.item_id);
                        divFormForm.find("#item_id").val(itemVal);

                        // item number
                        itemVal = getDecodeValue(metadtObj.item_number);
                        divFormForm.find("#item_number").val(itemVal);

                        // no rujukan
                        itemObj = metadtObj['container_id'];
                        if (itemObj != null) {
                            itemVal = getDecodeValue(itemObj.item_id);
                            divFormForm.find("#container_id").val(itemVal).trigger('change');
                            itemVal = getDecodeValue(itemObj.item_number);
                            divFormForm.find("#disp_container_id").val(itemVal);
                        }

                        // no ppk
                        itemVal = getDecodeValue(metadtObj['No_PPK']);
                        divFormForm.find("#No_PPK").val(itemVal);

                        // tindakan
                        itemVal = getDecodeValue(metadtObj['title']);
                        divFormForm.find("#title").val(itemVal);

                        // status ppk
                        itemVal = getDecodeValue(getObjectValue(metadtObj["Status_PPK"]));
                        setRadioField(divFormForm, 'Status_PPK', itemVal);

                        // jenis ppk
                        itemObj = metadtObj['Jenis_PPK'];
                        if (itemObj != null) {
                            var divJenisPPK = divFormForm.find('#Jenis_PPK');
                            $.each(itemObj, function(i, val) {
                                divJenisPPK.find('input[type="checkbox"][code="'+val.code+'"]')
                                    .prop('checked', true).trigger('change');
                            });
                        }

                        divFormForm.parsley().validate();
                    }
                }
            }
            else{ errorSwalLogout(data); }
        }).fail(function(data){
            errorSwalFail(data);
        }).always(function(data){
            if( appObj != null ){
                divFormForm.find("#item_id").val(itemId);
                
                $('#divListItems').addClass('collapse');
                $('#divForm').removeClass('collapse');
                $('#divMenu #btnCloseForm').removeClass('collapse');
            }
        });
    }
}

function deleteItems(itemId) {
    if(!strEmpty(itemId)){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1abc9c",
            cancelButtonColor: "#f1556c",
            confirmButtonText: "Yes, delete it."
          }).then(function (result) {
            if (result.value) {
                var deleteData = {};
                deleteData.item_ids = [itemId];

                $.ajax({
                    type: 'DELETE',
                    url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(deleteData)),
                    xhrFields: { withCredentials: true }
                }).done(function (data) {
                    if( data.success ){
                        if (data.success_list.length == 1){
                            var dtListItem = $("#divListItems").find('#dtListItems').DataTable();
                            var listItem = dtListItem.rows().data().toArray();
                            jQuery.each( listItem, function( i, item ) {
                                if( item.item_id == itemId ){
                                    listItem.splice(i, 1);
                                    return false;
                                }
                            });

                            if( dtListItem != null ){
                                dtListItem.rows('.selected').deselect();
                                dtListItem.clear().rows.add(listItem).draw();
                            }

                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Your file has been deleted.',
                                icon: 'success',
                                confirmButtonColor: "#1abc9c",
                            });

                        }
                        else if (data.failed_list.length >  0){
                            failedListSwal(data.failed_list);
                        }
                    }
                    else{
                        errorSwalLogout(data);
                    }
                });
            }
        });
    }
}