$('.listElemItem').on('click', '.divElementTab .aElementTab', function() {
    console.log("listElement"); //798
    var tab = $(this).closest('.tab-pane');
    var divElemBq = tab.find("#divElemBQ .card");
    var posY = $(this).offset().top; console.log("posY :: "+posY); 
    var posYdivElemBQ = /*divElemBq.scrollTop();*/ console.log("divElemBQ :: "+posYdivElemBQ);
    if( posY > 664 ){
        var posNewY = posYdivElemBQ+(posY-370);
        if( (posNewY + posYdivElemBQ) > divElemBq.prop('scrollHeight')){
            tab.find("#listElement").height(posNewY + divElemBq.prop('scrollHeight'));
        }
        // divElemBq.scrollTop(posNewY);
    }
    else{
        if( posY < 370 ){
            var posNewY = posYdivElemBQ+(posY-370);
            console.log("posNewY :"+posNewY);
            // divElemBq.scrollTop(posNewY);
        }
    }
    
    var objElem =  $(this);
    var objElemType = objElem.closest(".listElemItem");
    var elemType = "";  console.log(objElemType);
    if( objElemType.length == 1){
        elemType = objElemType.attr("elem-type");
    } console.log(elemType);
    var itemId = objElem.attr("id");

    if (tab.is('#basictab6') && elemType === 'bqSubItem') {
        // TODO make limit function on amaun wps
        // just move to form group validation, easier
        tab.find('#bqAmount').on('change', function(e) {
            var maxAmount = $(this).val() * 0.3;

            var wpsMaxElem = $(this).closest('.tab-pane').find('#divKosPrimaForm #Amaun_Max_WPS');
            wpsMaxElem.val(numberRound(maxAmount, 2));
        });
    }

    getListElemItems(itemId, elemType, tab);
});

$('.listElemItem').on('click', '.divElementTabPPK .aElementTabPPK', function() {
    var tab = $(this).closest('.tab-pane');
    var objElem =  $(this);
    var objElemType = objElem.closest(".listElemItem");
    var elemType = "";  console.log(objElemType);
    if( objElemType.length == 1){
        elemType = objElemType.attr("elem-type");
    } console.log(elemType);
    var itemId = objElem.attr("id");

    getListElemItemsPPK(itemId, elemType, tab);
})

$('.listElemItem').on('click', '.elemHeader', function(e) {
    console.log('.elemHeader');
    var card = $(this).closest('.bqElem');
    var itemId = card.attr('id').replace('bq-', '');

    getListElemTableForm(itemId, card);
});

$('#divElemBQ .listElemItem').on('click', '.divElementTab .aElementTab', function(e) {
    var id = $(this).attr('id');
    var tabpane = $(this).closest('.tab-pane');
    var buttonMenu = tabpane.find('#divMenuElemBQ');
    if (id.includes('bqsi')) {
        buttonMenu.find('#btnAddtoPPKElem').removeClass('collapse');
    }
    else {
        buttonMenu.find('#btnAddtoPPKElem').addClass('collapse');
    }
});

// TODO move this to actionElement.js
// TODO need a better way to show ppk div
$('#divMenuElemBQ .btnAddtoPPKElem').on('click', function(e) {
    console.log('.btnAddtoPPKElem');
    // check if theres no connecting PPK elem first
    var tabpane = $(this).closest('.tab-pane');
    var divElemBQ = tabpane.find('#divElemBQ');
    var selected = divElemBQ.find('.border-primary');
    var divCard = selected.closest('.card');
    var id = divCard.attr('item-id');

    var paramData = {};
    paramData.action = "ADVANCED_SEARCH";
    paramData.item_type_codes = ["ppksi"];
    paramData.query = "( BQ_Sub_Item = &quot;"+id+"&quot; )";
    paramData.details = ["item_id"];

    var exist = false;

    $.ajax({
        async: false,
        type: 'POST',
        url: appPrefix+"/itemSearch",
        data: "param="+encodeURIComponent(JSON.stringify(paramData)),
        xhrFields: { withCredentials: true }
    }).done(function (data) {
        if (data.success) {
            if (data.count != 0) {
                exist = true;
            }
        }
    });

    // get parent elem
    var divElemPPK = tabpane.find('#divElemPPK');
    var topElem = selected.closest('div[item-type-code="bqel"]');
    var topElemId = topElem.attr('item-id');
    var newTopElem = divElemPPK.find('#listElement div[item-id="'+topElemId+'"]');

    // if no PPK elem yet
    if (!exist && !newTopElem.length) {
        // put elem divElemPPK
        topElem.clone().appendTo(divElemPPK.find('#listElement'));
        newTopElem = divElemPPK.find('#listElement div[item-id="'+topElemId+'"]');
        newTopElem.find('.listElemItem').empty();

        // store array of subitem id in elem using data()
        newTopElem.data("ppksi", [id]);
        
        // replace class for event handler 
        var divElemTab = newTopElem.find('.divElementTab');
        divElemTab.removeClass("divElementTab");
        divElemTab.addClass("divElementTabPPK");
        var a = newTopElem.find('.aElementTab');
        a.removeClass('aElementTab');
        a.addClass('aElementTabPPK');

        // add button menu dropdown
        var inpGroup = newTopElem.find('.input-group');
        var spanInp = inpGroup.find('span');
        spanInp.removeClass('col-12');
        spanInp.addClass('col-10');

        var btnMenu = '        <div class="input-group-append col-2 d-flex justify-content-end">';
        btnMenu = btnMenu + '           <div class="btn-group align-self-start dropend">'+
                                    '<button type="button" class="btn btn-secondary waves-effect dropdown-toggle-split dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                    '<i class="fe-more-vertical-"></i></button>'+
                                    '<div class="dropdown-menu">'+
                                        '<a class="dropdown-item btnAddItem" href="javascript: void(0);"><i class="fe-plus text-success pe-1"></i>Item</a>'+
                                        '<a class="dropdown-item btnAddSubItem" href="javascript: void(0);"><i class="fe-plus text-success pe-1"></i>SubItem</a>'+
                                        '<a class="dropdown-item btnDelItem" href="javascript: void(0);"><i class="fe-trash-2 text-danger pe-1"></i>Hapus</a>'+
                                    '</div>'+
                                ' </div>';
        btnMenu = btnMenu + '         </div>';

        inpGroup.append(btnMenu);

        // change elem-type
        newTopElem.find('div[role="tabpanel"] .listElementItem').attr('elem-type', 'ppkItem');
        newTopElem.find('div[role="tabpanel"] .listElementSubItem').attr('elem-type', 'ppkSubItem');
    }
    else if(!exist && newTopElem.length){
        newTopElem.find('.listElemItem').empty();
        var currDataArr = newTopElem.data("ppksi");
        currDataArr.push(id);
        newTopElem.data("ppksi", currDataArr);
    }

    // hide elemBQ
    divElemBQ.addClass('collapse');

    // reveal elemPPK
    divElemPPK.removeClass('collapse');

    // reveal back button and hide edit button
    var buttonMenu = tabpane.find('#divMenuElemBQ');
    buttonMenu.find('#btnAddtoPPKElem').addClass('collapse');
    buttonMenu.find('#btnReturn').removeClass('collapse');

    // enable relevant fields in divFormBQ
    var divFormBQ = tabpane.find('#divFormBQ');
    divFormBQ.find('input, textarea').prop('readonly', false);
    divFormBQ.find('select').prop('disabled', false);

    // reveal save button
    divFormBQ.find('#btnBqSave').removeClass('collapse');
});

// TODO move this to actionElement.js
$('#divMenuElemBQ .btnReturn').on('click', function(e) {
    console.log('.btnReturn');
    var tabpane = $(this).closest('.tab-pane');
    var divElemBQ = tabpane.find('#divElemBQ');

    // reveal elemBQ
    divElemBQ.removeClass('collapse');

    // hide elemPPK
    var divElemPPK = tabpane.find('#divElemPPK');
    divElemPPK.addClass('collapse');

    // hide back button and reveal edit btn
    var buttonMenu = tabpane.find('#divMenuElemBQ');
    buttonMenu.find('#btnAddtoPPKElem').removeClass('collapse');
    buttonMenu.find('#btnReturn').addClass('collapse');

    // disable relevant fields in divFormBQ
    var divFormBQ = tabpane.find('#divFormBQ');
    divFormBQ.find('input, textarea').prop('readonly', true);
    divFormBQ.find('select').prop('disabled', true);

    // hide save button
    divFormBQ.find('#btnBqSave').addClass('collapse');
});

function getListElemTableForm(elemItemId, cardTop) {
    if (!strEmpty(elemItemId)) {
        var divChildContent = $(cardTop).find('.childContent');

        var tab = $(cardTop).closest('.tab-pane');
        var tabName = tab.attr('id').replace('#','');
        var provSumFilter = provSumTabs.includes(tabName);

        var objItem = null;

        var paramData = {};
        paramData.item_id = elemItemId;
        paramData.action = "ITEM_DETAIL";
        paramData.details = ["item_id","item_type_code","title","container_id","metadata"];

        $.ajax({
            url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(paramData)),
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            if (data.success) {
                var results = data.results;
                if (results != null && results.length) {
                    objItem = results[0];
                    if (objItem != null) {
                        var itemObj = null;

                        var metadtObj = objItem['metadata'];
                        if( metadtObj != null ) {

                            itemObj = metadtObj['BQ_Items'];
                            if( itemObj != null && itemObj.length){
                                divChildContent.empty();
                                sortListByIntKey(itemObj,"BQ_Number","asc");
                                itemBQcnt = itemObj.length;
                                $.each(itemObj, function( i, elem ) {
                                    // console.log(elem);

                                    
                                    var hasProvSum = false;
                                    if (provSumFilter) {
                                        hasProvSum = checkElemForProvSum(elem);
                                    }

                                    if ((provSumFilter && hasProvSum) || !provSumFilter) {
                                        var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                                        var elemTitle = getDecodeValue(elem.title);
                                        var elemNum = elem.BQ_Number;
                                        var elemAmount = "0.00";
                                        if( elem.BQ_Amount != null ){
                                            elemAmount = elem.BQ_Amount.display;
                                        }

                                        var card = '';

                                        card += '<div id="bq-'+itemId+'" class="bqElem card" container-id="'+elemItemId+'">';
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

                                        divChildContent.append(card);
                                    }
                                });
                                divChildContent.removeClass("collapse");
                            }

                            itemObj = metadtObj['BQ_Sub_Items'];
                            if (itemObj != null && itemObj.length) {
                                divChildContent.empty();
                                sortListByIntKey(itemObj,"BQ_Number","asc");
                                itemBQcnt = itemObj.length;

                                // append a table
                                var table = '';
                                var columns = null;
                                var columnDefs = null;
                                var tabNum = 0;

                                if (tab.is('#basictab3') || tab.is('#basictab9')) {
                                    var tabId = tab.attr('id');
                                    tabNum = tabId.substr(tabId.length - 1);
                                    // console.log(elemItemId, tabNum)

                                    table += '<div class="row">';
                                    table += '  <div class="col">';
                                    table += '      <div class="bqSubItems card">';
                                    table += '          <div class="card-body">';
                                    table += '              <table id="table-'+elemItemId+'-'+tabNum+'" class="subItemTable table table-sm m-0 dt-responsive dt-head-center nowrap w-100">'
                                    table += '                  <thead class="table-light">';
                                    table += '                      <tr>';
                                    table += '                          <th class="font-weight-medium" rowspan="2">#</th>';
                                    table += '                          <th class="font-weight-medium" rowspan="2" style="width: 40%;"></th>';
                                    table += '                          <th class="font-weight-medium" colspan="4">KONTRAK</th>';
                                    table += '                          <th class="font-weight-medium" colspan="2">TERKINI</th>';
                                    table += '                      </tr>';
                                    table += '                      <tr>';
                                    table += '                          <th class="font-weight-medium">Unit</th>';
                                    table += '                          <th class="font-weight-medium">Kuantiti</th>';
                                    table += '                          <th class="font-weight-medium">Harga Seunit</th>';
                                    table += '                          <th class="font-weight-medium">Amaun</th>';
                                    table += '                          <th class="font-weight-medium">Kuantiti</th>';
                                    table += '                          <th class="font-weight-medium">Amaun</th>';
                                    table += '                      </tr>';
                                    table += '                  </thead>';
                                    table += '                  <tbody class="font-14">';
                                    table += '                  </tbody>';
                                    table += '              </table>';
                                    table += '          </div>';
                                    table += '      </div>';
                                    table += '  </div>';
                                    table += '</div>';
                                    
                                    table += '<div class="row">';
                                    table += '  <div class="col">';
                                    table += '      <ul class="mb-0 list-inline text-end mt-4">';
                                    table += '          <li class="list-inline-item float-end">';
                                    table += '              <button type="button" class="saveTerkini btn btn-primary" id="refTable-'+elemItemId+'">Simpan Terkini</button>';
                                    table += '          </li>';
                                    table += '      </ul>';
                                    table += '  </div>';
                                    table += '</div>';

                                    columns =  [
                                        {"data": null}, {"data": "title"}, 
                                        {"data": "metadata.BQ_Unit.display"},
                                        {"data": "metadata.BQ_Kuantiti.display"},
                                        {"data": "metadata.Harga_Seunit.display"},
                                        {"data": "metadata.BQ_Amount.display"},
                                        {"data": null}, {"data": null}
                                    ];

                                    columnDefs = [
                                        {
                                            targets: 0,
                                            orderable: false, searchable: false,
                                            className: 'text-center',	
                                            render: function(data, type, row, meta){
                                                return data.metadata.BQ_Number;
                                            }
                                        },
                                        {
                                            targets: 1,
                                            render: function (data, type, row, meta){
                                                var dataDt = '<span class="text-wrap">'+ data +'</span>';
                                                return dataDt;
                                            }
                                        },
                                        {
                                            targets: 6,
                                            render: function (data, type, row, meta){
                                                var dataDt = '';
                                                dataDt += '<input type="text" class="form-control kuantitiTerkini" value="" data-parsley-type="number">';
                                                return dataDt;
                                            }
                                        },
                                        {
                                            targets: 7,
                                            render: function (data, type, row, meta){
                                                var dataDt = '';
                                                dataDt += '<input type="text" class="form-control amaunTerkini" value="" readOnly data-parsley-type="number">';
                                                return dataDt;
                                            }
                                        }
                                    ];
                                }
                                else if (tab.is('#basictab7')) {
                                    tabNum = 7;

                                    table += '<div class="row">';
                                    table += '  <div class="col">';
                                    table += '      <div class="bqSubItems card">';
                                    table += '          <div class="card-body">';
                                    table += '              <table id="table-'+elemItemId+'-'+tabNum+'" class="subItemTable table table-sm m-0 dt-responsive dt-head-center nowrap w-100">'
                                    table += '                  <thead class="table-light">';
                                    table += '                      <tr>';
                                    table += '                          <th class="font-weight-medium">#</th>';
                                    table += '                          <th class="font-weight-medium" style="width: 40%;"></th>';
                                    table += '                          <th class="font-weight-medium">Jumlah Peruntukan</th>';
                                    table += '                          <th class="font-weight-medium">Jumlah Digunakan</th>';
                                    table += '                          <th class="font-weight-medium">Baki</th>';
                                    table += '                      </tr>';
                                    table += '                  </thead>';
                                    table += '                  <tbody class="font-14">';
                                    table += '                  </tbody>';
                                    table += '              </table>';
                                    table += '          </div>';
                                    table += '      </div>';
                                    table += '  </div>';
                                    table += '</div>';
                                    
                                    table += '<div class="row">';
                                    table += '  <div class="col">';
                                    table += '      <ul class="mb-0 list-inline text-end mt-4">';
                                    table += '          <li class="list-inline-item float-end">';
                                    table += '              <button type="button" class="savePeruntukan btn btn-primary" id="refTable-'+elemItemId+'">Simpan Peruntukan</button>';
                                    table += '          </li>';
                                    table += '      </ul>';
                                    table += '  </div>';
                                    table += '</div>';

                                    columns =  [
                                        {"data": null}, {"data": "title"},
                                        {"data": null}, {"data": null}, {"data": null}
                                    ];
                                    
                                    columnDefs = [
                                        {
                                            targets: 0,
                                            orderable: false, searchable: false,
                                            className: 'text-center',	
                                            render: function(data, type, row, meta){
                                                return data.metadata.BQ_Number;
                                            }
                                        },
                                        {
                                            targets: 1,
                                            render: function (data, type, row, meta){
                                                var dataDt = '<span class="text-wrap">'+ data +'</span>';
                                                return dataDt;
                                            }
                                        },
                                        {
                                            targets: 2,
                                            render: function (data, type, row, meta){
                                                var dataDt = '';
                                                dataDt += '<input type="text" class="form-control jumlahPeruntukan" value="" data-parsley-type="number">';
                                                return dataDt;
                                            }
                                        },
                                        {
                                            targets: 3,
                                            render: function (data, type, row, meta){
                                                var dataDt = '';
                                                dataDt += '<input type="text" class="form-control jumlahDigunakan" value="" data-parsley-type="number">';
                                                return dataDt;
                                            }
                                        },
                                        {
                                            targets: 4,
                                            render: function (data, type, row, meta){
                                                var dataDt = '';
                                                dataDt += '<input type="text" class="form-control baki" value="" readonly data-parsley-type="number">';
                                                return dataDt;
                                            }
                                        },
                                    ]
                                }

                                divChildContent.append(table);

                                var subItems = [];
                                $.each(itemObj, function( i, elem ) {
                                    // console.log(elem);
                                    var subItemData = {};
                                    subItemData.item_id = elem.item_id;
                                    subItemData.action = "ITEM_DETAIL";
                                    subItemData.details = ["item_id","item_type_code","title","container_id","metadata"];

                                    $.ajax({
                                        async: false,
                                        url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(subItemData)),
                                        xhrFields: { withCredentials: true }
                                    }).done(function (data) {
                                        if (data.success) {
                                            var subItemResults = data.results;
                                            if (subItemResults != null && subItemResults.length) {
                                                var objDetails = subItemResults[0];
                                                if (objDetails != null) {
                                                    var objDetailsMetadata = objDetails.metadata;
                                                    if (objDetailsMetadata != null) {
                                                        var objDetailsBqUnit = objDetailsMetadata.BQ_Unit;
                                                        if (objDetailsBqUnit != null) {
                                                            if ((provSumFilter && objDetailsBqUnit.code === 'OUM017') || !provSumFilter){
                                                                subItems.push(objDetails);
                                                            }
                                                        }
                                                        
                                                    }
                                                }
                                            }
                                        }
                                    })

                                });
                                
                                $('#table-'+elemItemId+'-'+tabNum).DataTable({
                                    "destroy": true,
                                    "language": {"url": translation("dataTable","LanguageUrl")},
                                    "bInfo": false,
                                    "data": subItems,
                                    "columns": columns,
                                    "columnDefs": columnDefs,
                                    order: [],
                                    "lengthChange": false,
                                    "searching": false,
                                    "paging": false,
                                    "ordering": false,
                                });

                                divChildContent.removeClass("collapse");
                            }
                        }
                    }
                }
            }
            else{ errorSwalLogout(data); }
        }).fail(function(data){
            errorSwalFail(data);
        }).always(function(data){
            $(cardTop).attr("load-ind","true");

            if( objItem != null ){
                tab.find('.elemHeader').removeClass("border border-primary border-5");
                $(cardTop).find('.elemHeader').first().addClass("border border-primary border-5");
            }
        });
    }
}

function getListElemItems(elemItemId, elemType, tab) {
    if(!strEmpty(elemItemId)){
        
        var divElemBQ = tab.find("#divElemBQ");
        var divListElem = divElemBQ.find("#tabpanel-"+elemItemId);
        var divListElement = divListElem.find(".listElementItem");
        var divListElementSubItem = divListElem.find(".listElementSubItem");

        var containerId = "";
        if(elemType != "bqElem"){
            var currElemTab = divElemBQ.find("#tab-"+elemItemId);
            var currElemCard = currElemTab.closest('.listElemItem').closest('.card');
            containerId = currElemCard.attr("item-id");
        }
        //console.log(elemType + " " + elemItemId+ " " + containerId);
        
        var divFormBQ = tab.find('#divFormBQ');
        divFormBQ.find('.subItem').addClass('collapse');
        divFormBQ.find("#bqElemType").val(elemType);
        divFormBQ.find("#bqItemId").val(elemItemId);
        divFormBQ.find("#bqItemTypeCode").val("");

        divFormBQ.find('.subItem').addClass('collapse');

        var divKosPrimaForm = null;
        if (tab.is('#basictab6')) {
            divKosPrimaForm = tab.find('#divKosPrimaForm');
        }

        // check if tab is provsum specific
        var tabName = tab.attr('id').replace('#','');
        var provSumFilter = provSumTabs.includes(tabName);

        var objItem = null;
        var itemBQcnt = 0; var subItemBQcnt = 0;
        var metadataDetails = ["BQ_Items","BQ_Sub_Items"];
        
        var bqNumber = "";
        var bqTitle = "";
        var bqAmount = "";

        var paramData = {};
        paramData.item_id = elemItemId;
        paramData.action = "ITEM_DETAIL";
        paramData.details = ["item_id","item_type_code","title","container_id","metadata"];
        //paramData.metadata_details = metadataDetails;

        $.ajax({
            url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(paramData)),
            xhrFields: { withCredentials: true }
        }).done(function (data) {
            if(data.success){
                var results = data.results;
                if( results != null && results.length > 0 ){
                    objItem = results[0];
                    if( objItem != null ){
                        var itemVal = null; var itemDisp = null; var itemObj = null;
                        var elemItemTypeCode = null;

                        objItem.title = getDecodeValue(objItem['title']);
                        elemItemTypeCode = getDecodeValue(objItem['item_type_code']);

                        divFormBQ.find("#bqItemTypeCode").val(elemItemTypeCode);

                        itemObj = objItem['container_id'];
                        itemVal = ""; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                        if(strEmpty(itemVal)){
                            if(elemType == "bqElem"){
                                // itemVal = $('#formTab').find('#bq_item_id').val();
                            }
                            else{
                                itemVal= containerId;
                            }
                        }
                        divFormBQ.find("#bqContainer").val(itemVal);

                        var metadtObj = objItem['metadata'];
                        if( metadtObj != null ){
                            itemVal = getDecodeValue(metadtObj['BQ_Number']);
                            divFormBQ.find("#bqNumber").val(itemVal);
                            bqNumber = itemVal;

                            itemVal = getDecodeValue(metadtObj['title']);
                            divFormBQ.find("#bqTitle").val(itemVal);
                            bqTitle = itemVal;

                            itemVal = getDecodeValue(metadtObj['description']);
                            divFormBQ.find("#bqDescription").val(itemVal);

                            itemObj = metadtObj['BQ_Amount'];
                            itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                            bqAmount = numberRound(itemVal, 2);
                            divFormBQ.find("#bqAmount").val(bqAmount).trigger('change');

                            if( elemType == "bqSubItem" ){
                                itemObj = metadtObj['BQ_Unit'];
                                itemVal = ""; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqUnit").val(getDecodeValue(itemVal)).trigger("change");

                                itemObj = metadtObj['BQ_Kuantiti'];
                                itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqKuantiti").val(itemVal);

                                itemObj = metadtObj['Harga_Seunit'];
                                itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqHargaSeunit").val(numberRound(itemVal, 2));
                            }

                            itemObj = metadtObj['BQ_Sub_Items'];

                            divListElementSubItem.empty();
                            if( itemObj != null ){
                                sortListByIntKey(itemObj,"BQ_Number","asc");
                                subItemBQcnt = itemObj.length;
                                jQuery.each(itemObj, function( i, elem ) {
                                    // console.log(elem);
                                    // if tab needs provsum, do provSum check on elem
                                    var hasProvSum = false;
                                    if (provSumFilter) {
                                        hasProvSum = checkElemForProvSum(elem);
                                    }

                                    // if tab is provsum specific, and elem has provSum, then add
                                    // if not provsum specific then add
                                    if ((provSumFilter && hasProvSum) || !provSumFilter) {
                                        var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                                        var elemTitle = getDecodeValue(elem.title);
                                        var elemAmount = "0.00";
                                        if( elem.BQ_Amount != null ){
                                            elemAmount = elem.BQ_Amount.display;
                                        }

                                        var card = "";
                                        card = card + '<div class="card mb-2" item-id="'+itemId+'" item-type-code="'+itemTypeCode+'">';
                                        card = card + '    <div class="card-header bg-soft-secondary p-1 divElementTab" role="tab" id="tab-'+itemId+'">';
                                        card = card + '      <div id="" class="input-group">';
                                        card = card + '        <span class="font-16 col-10">';
                                        card = card + '            <a id="'+itemId+'" class="aElementTab collapsed" reload="false" data-toggle="collapse" data-parent="#accordion" href="#tabpanel-'+itemId+'" aria-expanded="false" aria-controls="tabpanel-'+itemId+'">';
                                        card = card + '              <div class="row">';
                                        card = card + '                <div class="elemBQNumber col-3">'+elem.BQ_Number+'</div>';
                                        card = card + '                <div class="elemTitle col-9 ps-0">'+elemTitle+'<span class="ms-2"><br>('+elemAmount+')</span></div>';
                                        card = card + '              </div>';
                                        card = card + '            </a>';
                                        card = card + '        </span>';
                                        card = card + '      </div>';
                                        card = card + '    </div>';
                                        card = card + '</div>';

                                        divListElementSubItem.append(card);
                                    }
                                });
                                divListElem.removeClass("collapse")
                            }

                            itemObj = metadtObj['BQ_Items'];

                            divListElement.empty();
                            if( itemObj != null ){
                                sortListByIntKey(itemObj,"BQ_Number","asc");
                                itemBQcnt = itemObj.length;
                                jQuery.each(itemObj, function( i, elem ) {
                                    // console.log(elem);
                                    // if tab needs provsum, do provSum check on elem
                                    var hasProvSum = false;
                                    if (provSumFilter) {
                                        hasProvSum = checkElemForProvSum(elem);
                                    }

                                    // if tab is provsum specific, and elem has provSum, then add
                                    // if not provsum specific then add
                                    if ((provSumFilter && hasProvSum) || !provSumFilter) {
                                        var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                                        var elemTitle = getDecodeValue(elem.title);
                                        var elemAmount = "0.00";
                                        if( elem.BQ_Amount != null ){
                                            elemAmount = elem.BQ_Amount.display;
                                        }

                                        var card = "";
                                        card = card + '<div class="card mb-2" item-id="'+itemId+'" item-type-code="'+itemTypeCode+'">';
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
                                    }
                                });
                                divListElem.removeClass("collapse")
                            }

                            //divFormForm.parsley().validate();
                        }
                    }
                }
            }
            else{ errorSwalLogout(data); }

        }).fail(function(data){
            errorSwalFail(data);
        }).always(function(data){
            var objCard = tab.find(".card[item-id='"+elemItemId+"']");
            objCard.attr("is-load","true");

            if( objItem != null ){

                tab.find(".divElementTab").removeClass("border border-primary border-5");
                tab.find("#tab-"+elemItemId).addClass("border border-primary border-5");

                var divElemTab = tab.find("#tab-"+elemItemId);
                divElemTab.find('.elemBQNumber').text(bqNumber);
                divElemTab.find('.elemTitle').empty().append(bqTitle+'<span class="ms-2"><br>('+bqAmount+')</span>');

                divFormBQ.find("#bqHeader").text('Kemaskini Element');

                if( elemType == "bqSubItem" ){
                    divFormBQ.find("#bqHeader").text('Kemaskini Sub Item');
                    divFormBQ.find(".subItem").removeClass("collapse");
                }
                else if( elemType == "bqItem" ){
                    divFormBQ.find("#bqHeader").text('Kemaskini Item');
                    
                }
                //console.log(subItemBQcnt);
                if( subItemBQcnt > 0 ){
                    var objBtn = objCard.find(".dropend:first .btnAddItem");
                    if( objBtn.length > 0 ){
                        objBtn.addClass('collapse');
                    }                        
                }
                
                //console.log(itemBQcnt);
                if( itemBQcnt > 0 ){
                    var objBtn = objCard.find(".dropend:first .btnAddSubItem");
                    if( objBtn.length > 0 ){
                        objBtn.addClass('collapse');
                    }                        
                }

                if( subItemBQcnt == 0 && itemBQcnt == 0 ){
                    var objBtnItem = objCard.find(".dropend:first .btnAddItem");
                    if( objBtnItem.length > 0 ){ objBtnItem.removeClass('collapse'); }
                    var objBtnSubItem = objCard.find(".dropend:first .btnAddSubItem");
                    if( objBtnSubItem.length > 0 ){ objBtnSubItem.removeClass('collapse'); }
                }

                divFormBQ.removeClass('collapse');
                
                if (divKosPrimaForm != null) {
                    divKosPrimaForm.removeClass('collapse');
                }

                // $('#form-basictab2').parsley().whenValidate("basictabBq").done(function(){
                // });
            }
            // $(window).scrollTop(0);            
        });
    }
}

function getListElemItemsPPK(elemItemId, elemType, tab) {
    if(!strEmpty(elemItemId)){
        var divElemBQ = tab.find("#divElemPPK");
        var divListElem = divElemBQ.find("#tabpanel-"+elemItemId);
        var divListElement = divListElem.find(".listElementItem");
        var divListElementSubItem = divListElem.find(".listElementSubItem");

        var containerId = "";
        if(elemType != "ppkElem"){
            var currElemTab = divElemBQ.find("#tab-"+elemItemId);
            var currElemCard = currElemTab.closest('.listElemItem').closest('.card');
            containerId = currElemCard.attr("item-id");
        }
        
        var divFormBQ = tab.find('#divFormBQ');
        divFormBQ.find('.subItem').addClass('collapse');
        divFormBQ.find("#bqElemType").val(elemType);
        divFormBQ.find("#bqItemId").val(elemItemId);
        divFormBQ.find("#bqItemTypeCode").val("");

        divFormBQ.find('.subItem').addClass('collapse');

        var divKosPrimaForm = null;
        if (tab.is('#basictab6')) {
            divKosPrimaForm = tab.find('#divKosPrimaForm');
        }

        // check if tab is provsum specific
        var tabName = tab.attr('id').replace('#','');
        var provSumFilter = provSumTabs.includes(tabName);

        var objItem = null;
        var itemBQcnt = 0; var subItemBQcnt = 0;
        var metadataDetails = ["BQ_Items","BQ_Sub_Items"];
        
        var bqNumber = "";
        var bqTitle = "";
        var bqAmount = "";

        var paramData = {};
        paramData.item_id = elemItemId;
        paramData.action = "ITEM_DETAIL";
        paramData.details = ["item_id","item_type_code","title","container_id","metadata"];
        // paramData.metadata_details = metadataDetails;

        $.ajax({
            url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(paramData)),
            xhrFields: { withCredentials: true }
        }).done(function (data) {
            if(data.success){
                var results = data.results;
                if( results != null && results.length > 0 ){
                    objItem = results[0];
                    if( objItem != null ){
                        var itemVal = null; var itemDisp = null; var itemObj = null;
                        var elemItemTypeCode = null;

                        objItem.title = getDecodeValue(objItem['title']);
                        elemItemTypeCode = getDecodeValue(objItem['item_type_code']);

                        divFormBQ.find("#bqItemTypeCode").val(elemItemTypeCode);

                        itemObj = objItem['container_id'];
                        itemVal = ""; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                        if(strEmpty(itemVal)){
                            if(elemType == "ppkElem"){
                                // itemVal = $('#formTab').find('#ppk_item_id').val();
                            }
                            else{
                                itemVal= containerId;
                            }
                        }
                        divFormBQ.find("#bqContainer").val(itemVal);

                        var metadtObj = objItem['metadata'];
                        if( metadtObj != null ){
                            itemVal = getDecodeValue(metadtObj['BQ_Number']);
                            divFormBQ.find("#bqNumber").val(itemVal);
                            bqNumber = itemVal;

                            itemVal = getDecodeValue(metadtObj['title']);
                            divFormBQ.find("#bqTitle").val(itemVal);
                            bqTitle = itemVal;

                            itemVal = getDecodeValue(metadtObj['description']);
                            divFormBQ.find("#bqDescription").val(itemVal);

                            if (elemItemId.startsWith('bqel') || elemItemId.startsWith('bqit') || elemItemId.startsWith('bqsi')) {
                                itemObj = metadtObj['BQ_Amount'];
                            }
                            else if (elemItemId.startsWith('ppkel') || elemItemId.startsWith('ppkit')){
                                itemObj = metadtObj['Jumlah_BQ_Terlaras'];
                            }
                            else {
                                itemObj = metadtObj['BQ_Amaun_Terlaras'];
                            }
                            itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                            bqAmount = numberRound(itemVal, 2);
                            divFormBQ.find("#bqAmount").val(bqAmount).trigger('change');

                            if(elemItemId.startsWith('ppksi')){
                                itemObj = metadtObj['BQ_Unit'];
                                itemVal = ""; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqUnit").val(getDecodeValue(itemVal)).trigger("change");

                                itemObj = metadtObj['BQ_Kuantiti_Terlaras'];
                                itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqKuantiti").val(itemVal);

                                itemObj = metadtObj['Harga_Seunit_Terlaras'];
                                itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqHargaSeunit").val(numberRound(itemVal, 2));
                            }
                            else if(elemItemId.startsWith('bqsi')) {
                                itemObj = metadtObj['BQ_Unit'];
                                itemVal = ""; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqUnit").val(getDecodeValue(itemVal)).trigger("change");

                                itemObj = metadtObj['BQ_Kuantiti'];
                                itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqKuantiti").val(itemVal);

                                itemObj = metadtObj['Harga_Seunit'];
                                itemVal = 0.00; if( itemObj != null ){ itemVal = getObjectValue(itemObj); }
                                divFormBQ.find("#bqHargaSeunit").val(numberRound(itemVal, 2));
                            }

                            itemObj = metadtObj['BQ_Sub_Items'];

                            divListElementSubItem.empty();
                            if( itemObj != null ){
                                sortListByIntKey(itemObj,"BQ_Number","asc");
                                subItemBQcnt = itemObj.length;
                                jQuery.each(itemObj, function( i, elem ) {
                                    // console.log(elem);
                                    // if tab needs provsum, do provSum check on elem
                                    var hasProvSum = false;
                                    if (provSumFilter) {
                                        hasProvSum = checkElemForProvSum(elem);
                                    }

                                    // check if sub item id is in data()
                                    var dataArr = null;
                                    if (elemType === 'bqel') {
                                        dataArr = divElemBQ.find('div[item-id="'+elemItemId+'"]').data('ppksi');
                                    }
                                    else {
                                        dataArr = divElemBQ.find('div[item-id="'+elemItemId+'"]').closest('div[item-type-code="bqel"]').data('ppksi');
                                    }

                                    var isInData = true;
                                    if (elem.item_type_code !== 'ppkel' && elem.item_type_code !== 'ppkit' && elem.item_type_code !== 'ppksi'){
                                        isInData = checkElemData(elem, dataArr);
                                    }
                                    

                                    // if tab is provsum specific, and elem has provSum, then add
                                    // if not provsum specific then add
                                    if (((provSumFilter && hasProvSum) || !provSumFilter) && isInData) {
                                        var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                                        var elemTitle = getDecodeValue(elem.title);
                                        // ! bq information not being passed through metadata for ppk elems
                                        // ! need BQ_Number to be passed
                                        // ! ask backend
                                        var elemBQNum = elem.BQ_Number;
                                        if (elemBQNum == null) {elemBQNum = "";}
                                        var elemAmount = "0.00";
                                        if( elem.BQ_Amount != null ){
                                            elemAmount = elem.BQ_Amount.display;
                                        }

                                        var card = "";
                                        card = card + '<div class="card mb-2" item-id="'+itemId+'" item-type-code="'+itemTypeCode+'">';
                                        card = card + '    <div class="card-header bg-soft-secondary p-1 divElementTabPPK" role="tab" id="tab-'+itemId+'">';
                                        card = card + '      <div id="" class="input-group">';
                                        card = card + '        <span class="font-16 col-10">';
                                        card = card + '            <a id="'+itemId+'" class="aElementTabPPK collapsed" reload="false" data-toggle="collapse" data-parent="#accordion" href="#tabpanel-'+itemId+'" aria-expanded="false" aria-controls="tabpanel-'+itemId+'">';
                                        card = card + '              <div class="row">';
                                        card = card + '                <div class="elemBQNumber col-3">'+elemBQNum+'</div>';
                                        card = card + '                <div class="elemTitle col-9 ps-0">'+elemTitle+'<span class="ms-2"><br>('+elemAmount+')</span></div>';
                                        card = card + '              </div>';
                                        card = card + '            </a>';
                                        card = card + '        </span>';
                                        card = card + '        <div class="input-group-append col-2 d-flex justify-content-end">';
                                        card = card + '           <div class="btn-group align-self-start dropend">'+
                                                                    '<button type="button" class="btn btn-secondary waves-effect dropdown-toggle-split dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                                                    '<i class="fe-more-vertical-"></i></button>'+
                                                                    '<div class="dropdown-menu">'+
                                                                        '<a class="dropdown-item btnDelItem" href="javascript: void(0);"><i class="fe-trash-2 text-danger pe-1"></i>Hapus</a>'+
                                                                    '</div>'+
                                                                ' </div>';
                                        card = card + '        </div>';
                                        card = card + '      </div>';
                                        card = card + '    </div>';
                                        card = card + '</div>';

                                        divListElementSubItem.append(card);
                                    }
                                });
                                divListElem.removeClass("collapse")
                            }

                            itemObj = metadtObj['BQ_Items'];

                            divListElement.empty();
                            if( itemObj != null ){
                                sortListByIntKey(itemObj,"BQ_Number","asc");
                                itemBQcnt = itemObj.length;
                                jQuery.each(itemObj, function( i, elem ) {
                                    // console.log(elem);
                                    // if tab needs provsum, do provSum check on elem
                                    var hasProvSum = false;
                                    if (provSumFilter) {
                                        hasProvSum = checkElemForProvSum(elem);
                                    }

                                    // check if sub item id is in data()
                                    var dataArr = null;
                                    if (elemType === 'bqel') {
                                        dataArr = divElemBQ.find('div[item-id="'+elemItemId+'"]').data('ppksi');
                                    }
                                    else {
                                        dataArr = divElemBQ.find('div[item-id="'+elemItemId+'"]').closest('div[item-type-code="bqel"]').data('ppksi');
                                    }
                                    
                                    var isInData = true;
                                    if (elem.item_type_code !== 'ppkel' && elem.item_type_code !== 'ppkit' && elem.item_type_code !== 'ppksi'){
                                        isInData = checkElemData(elem, dataArr);
                                    }

                                    // if tab is provsum specific, and elem has provSum, then add
                                    // if not provsum specific then add
                                    if (((provSumFilter && hasProvSum) || !provSumFilter) && isInData) {
                                        var itemId = elem.item_id; var itemTypeCode = elem.item_type_code;
                                        var elemTitle = getDecodeValue(elem.title);
                                        var elemBQNum = elem.BQ_Number;
                                        if (elemBQNum == null) {elemBQNum = "";}
                                        var elemAmount = "0.00";
                                        if( elem.BQ_Amount != null ){
                                            elemAmount = elem.BQ_Amount.display;
                                        }

                                        var card = "";
                                        card = card + '<div class="card mb-2" item-id="'+itemId+'" item-type-code="'+itemTypeCode+'">';
                                        card = card + '    <div class="card-header p-1 divElementTabPPK" role="tab" id="tab-'+itemId+'">';
                                        card = card + '      <div id="" class="input-group">';
                                        card = card + '        <span class="font-16 col-10">';
                                        card = card + '            <a id="'+itemId+'" class="aElementTabPPK collapsed" reload="false" data-toggle="collapse" data-parent="#accordion" href="#tabpanel-'+itemId+'" aria-expanded="false" aria-controls="tabpanel-'+itemId+'">';
                                        card = card + '              <div class="row">';
                                        card = card + '                <div class="elemBQNumber col-2">'+elemBQNum+'</div>';
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
                                        card = card + '        </div>';
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
                                    }
                                });
                                divListElem.removeClass("collapse")
                            }

                            //divFormForm.parsley().validate();
                        }
                    }
                }
            }
            else{ errorSwalLogout(data); }

        }).fail(function(data){
            errorSwalFail(data);
        }).always(function(data){
            var objCard = tab.find(".card[item-id='"+elemItemId+"']");
            objCard.attr("is-load","true");

            if( objItem != null ){
                tab.find(".divElementTabPPK").removeClass("border border-primary border-5");
                tab.find("#divElemPPK #tab-"+elemItemId).addClass("border border-primary border-5");

                var divElemTab = tab.find("#tab-"+elemItemId);
                divElemTab.find('.elemBQNumber').text(bqNumber);
                divElemTab.find('.elemTitle').empty().append(bqTitle+'<span class="ms-2"><br>('+bqAmount+')</span>');

                divFormBQ.find("#bqHeader").text('Kemaskini Element');

                if( elemType == "ppkSubItem" ){
                    divFormBQ.find("#bqHeader").text('Kemaskini Sub Item');
                    divFormBQ.find(".subItem").removeClass("collapse");
                }
                else if( elemType == "ppkItem" ){
                    divFormBQ.find("#bqHeader").text('Kemaskini Item');
                    
                }
                //console.log(subItemBQcnt);
                if( subItemBQcnt > 0 ){
                    var objBtn = objCard.find(".dropend:first .btnAddItem");
                    if( objBtn.length > 0 ){
                        objBtn.addClass('collapse');
                    }                        
                }
                
                //console.log(itemBQcnt);
                if( itemBQcnt > 0 ){
                    var objBtn = objCard.find(".dropend:first .btnAddSubItem");
                    if( objBtn.length > 0 ){
                        objBtn.addClass('collapse');
                    }                        
                }

                if( subItemBQcnt == 0 && itemBQcnt == 0 ){
                    var objBtnItem = objCard.find(".dropend:first .btnAddItem");
                    if( objBtnItem.length > 0 ){ objBtnItem.removeClass('collapse'); }
                    var objBtnSubItem = objCard.find(".dropend:first .btnAddSubItem");
                    if( objBtnSubItem.length > 0 ){ objBtnSubItem.removeClass('collapse'); }
                }

                divFormBQ.removeClass('collapse');
                
                if (divKosPrimaForm != null) {
                    divKosPrimaForm.removeClass('collapse');
                }

                // $('#form-basictab2').parsley().whenValidate("basictabBq").done(function(){
                // });
            }
            // $(window).scrollTop(0);            
        });
    }
}

$('#divFormBQ').on('change', '#bqKuantiti, #bqHargaSeunit', function () {
    var bqAmount = 0.00;    
    var bqKuantiti = $("#bqKuantiti").val();
    var bqHargaSeunit = $("#bqHargaSeunit").val();

    bqAmount = bqKuantiti * bqHargaSeunit;
    bqAmount = numberRound(bqAmount, 2);
    
    $("#bqAmount").val(bqAmount);
});

$('.tab-pane').on('click', '#btnBqSave', function(e) {
    var currTab = $(this).closest('.tab-pane');

    var isValid = false;
    currTab.parsley().whenValidate("basictabBq").done(function(){
        isValid = true;
    });

    // var ppkkItemId = $('#formTab #item_id').val();
    var ppkkItemId = "ppkk-0c7f977457e349e183b6916db01d612c"; // ! hard code for now
    if (strEmpty(ppkkItemId)) { // if item id empty, check if can save PPKK
        var container_id = $('#formTab #container_id').val();
        var title = $('#formTab #basictab1 #title').val();

        if (strEmpty(container_id) || strEmpty(title)) { // if cannot save, pop out swal and set isValid false
            // TODO swal
            console.log("swal cannot save");
            isValid = false;
        }
        else { // if can save, save PPKK
            var paramMetadata = {
                "item_id": "",
                "item_type_code": "ppkk",
                "container_id": container_id,
                "title": title
            }

            var paramData = {};
            paramData.action = "SAVE_ITEM";
            paramData.metadata = paramMetadata;
            console.log(paramData);

            $.ajax({
                async: false,
                type: 'POST',
                url: "item",
                xhrFields: { withCredentials: true },
                data: "param="+encodeURIComponent(JSON.stringify(paramData))
            }).done(function(data) {
                if (data.success) {
                    console.log(data);
                    ppkkItemId = data.item_id;
                }
                else {
                    errorSwalLogout(data);
                }
            })
        }
    }

    if (isValid) {
        // get item id of selected elem
        var currItemId = currTab.find('#bqItemId').val();
        var itemTypeCode = currTab.find('#bqItemTypeCode').val();
        

        // check if selected elem is ppk or bq
        // if ppk, save normally
        if (itemTypeCode.startsWith('ppk')) {
            // TODO save ppk normally
        }
        else { // if bq, go create new ppk elem(s)
            // TODO move this block to a function
            // traverse to topmost elem, get id of each passed bq/ppk
            var allElemId = [];
            var currItemChild = currTab.find('#divElemPPK div[item-id="'+currItemId+'"]');
            currItemChild.parents('.card').each(function() {
                allElemId.push($(this).attr('item-id'));
            });
            // remove undefined elements
            var cleanedElemId = allElemId.filter(function(elem) {
                return elem != null;
            })

            // reverse array and add final elem
            cleanedElemId.reverse();
            cleanedElemId.push(currItemId);

            // loop, starting with topmost elem all the way down to selected elem
            var done = true;
            var ppkId = ppkkItemId;
            $.each(cleanedElemId, function(i,val) {
                var paramMetadata = {};
                if (i != cleanedElemId.length-1) {
                    if (val.startsWith('bq')) { // this elem is a bq
                        // check if ppk equivalent exist
                        var checkData = {};
                        checkData.action = "ADVANCED_SEARCH";
                        if (val.startsWith('bqel')) {
                            checkData.item_type_codes = ["ppkel"];
                            checkData.query = "( BQ_Element = &quot;"+val+"&quot;)";
                        }
                        else {
                            checkData.item_type_codes = ["ppkit"];
                            checkData.query = "( BQ_Item = &quot;"+val+"&quot;)";
                        }
                        checkData.details = ["item_id"];

                        var exist = false;
                        $.ajax({ 
                            async: false,
                            type: 'POST',
                            url: appPrefix+"/itemSearch",
                            data: "param="+encodeURIComponent(JSON.stringify(checkData)),
                            xhrFields: { withCredentials: true }
                        }).done(function(data) {
                            if (data.success) {
                                if (data.count != 0) {
                                    exist = true;
                                    var results = data.results;
                                    if (results != null && results.length) {
                                        ppkId = results[0].item_id;
                                    }
                                }
                            }
                        });

                        if (!exist) {
                            // use val to get item_details of this bq
                            var paramData = {};
                            paramData.item_id = val;
                            paramData.action = "ITEM_DETAIL";
                            paramData.details = ["item_id","title","metadata"];
                            paramData.metadata_details = ['BQ_Amount', 'description', 'BQ_Number'];
                            
                            $.ajax({
                                async: false,
                                url: appPrefix+"/item?param="+encodeURIComponent(JSON.stringify(paramData)),
                                xhrFields: { withCredentials: true }
                            }).done(function(data) {
                                console.log(data);
                                if (data.success) {
                                    var results = data.results;
                                    if (results != null && results.length) {
                                        var objData = results[0];
                                        if (objData != null) {
                                            var mtdtObj = objData.metadata;
                                            if (mtdtObj != null) {
                                                paramMetadata['Jumlah_BQ'] = getDecodeValue(getObjectValue(mtdtObj.BQ_Amount));
                                                paramMetadata['Jumlah_BQ_Terlaras'] = getDecodeValue(getObjectValue(mtdtObj.BQ_Amount));
                                                paramMetadata['BQ_Number'] = getDecodeValue(mtdtObj.BQ_Number);
                                                paramMetadata['description'] = getDecodeValue(mtdtObj.description);
                                                paramMetadata['title'] = getDecodeValue(objData.title);

                                                if (val.startsWith('bqel')) {
                                                    paramMetadata['BQ_Element'] = val;
                                                }
                                                else {
                                                    paramMetadata['BQ_Item'] = val;
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    done = false;
                                    errorSwalLogout(data);
                                }
                            }).fail(function(data){
                                errorSwalFail(data);
                            });
                        }
                        else {
                            return;
                        }
                    }
                    else { // this elem is ppk. no need to save, just carry over this elem id to next loop
                        ppkId = val;
                        return;
                    }
                }
                else { // if at the final elem
                    // no need to do checks, this is guaranteed to be a bq that does not have a ppk elem
                    // checks already done when .btnAddtoPPKElem is clicked
                    var divFormBQ = currTab.find('#divFormBQ');
                    paramMetadata['title'] = divFormBQ.find('#bqTitle').val();
                    paramMetadata['BQ_Amaun'] = divFormBQ.find('#bqAmount').val();
                    paramMetadata['BQ_Amaun_Terlaras'] = divFormBQ.find('#bqAmount').val();
                    paramMetadata['BQ_Number'] = divFormBQ.find('#bqNumber').val();
                    paramMetadata['description'] = divFormBQ.find("#bqDescription").val();
                    paramMetadata['BQ_Kuantiti'] = divFormBQ.find('#bqKuantiti').val();
                    paramMetadata['BQ_Kuantiti_Terlaras'] = divFormBQ.find('#bqKuantiti').val();
                    paramMetadata['BQ_Sub_Item'] = val; // bq item id here
                    paramMetadata['BQ_Unit'] = divFormBQ.find('#bqUnit').val();
                    paramMetadata['Harga_Seunit_Terlaras'] = divFormBQ.find('#bqHargaSeunit').val();
                }
                
                // create new ppk elem
                paramMetadata.container_id = ppkId;
                paramMetadata.item_id = "";

                var ppkItemTypeCode = {
                    'bqsi': 'ppksi',
                    'bqit': 'ppkit',
                    'bqel': 'ppkel'
                }
                var currItemTypeCode = val.slice(0, val.indexOf('-'));
                paramMetadata.item_type_code = ppkItemTypeCode[currItemTypeCode];

                var ppkData = {};
                ppkData.action = "SAVE_ITEM";
                ppkData.metadata = paramMetadata;
                console.log(ppkData);

                $.ajax({
                    async: false,
                    type: 'POST',
                    url: "item",
                    xhrFields: { withCredentials: true },
                    data: "param="+encodeURIComponent(JSON.stringify(ppkData))
                }).done(function(data) {
                    console.log(data);
                    if (data.success) {
                        // add this new elem to parent elem
                        if (currItemTypeCode !== 'ppkel') {
                            var fieldname = {
                                'ppksi': 'BQ_Sub_Items',
                                'ppkit': 'BQ_Items',
                            }
                            addObjectToItem(ppkId, fieldname[data.item_type_code], data.item_id);
                        }
                        else {
                            // ! for now, only do non-table tabs
                            var tabs = {
                                'basictab2': 'BQ_Perubahan_Kerja',
                                'basictab4': 'BQ_Kesilapan_Keterangan_Kuantiti',
                                'basictab5': 'BQ_WPS_Kos_Prima',
                                'basictab6': 'BQ_Kos_Prima'
                            }
                            addObjectToItem(ppkId, tabs[currTab.attr('id')], data.item_id);
                        }

                        // keep id of new ppk elem, use in next loop as container_id to create child ppk elems
                        ppkId = data.item_id;
                    }
                    else {
                        done = false;
                        errorSwalLogout(data);
                    }
                }).done(function() {
                    // after each save, change attr of elems in divElemPPK
                    var firstDiv = currTab.find('#divElemPPK div[item-id="'+val+'"]');
                    firstDiv.attr('item-id', ppkId);
                    firstDiv.attr('item-type-code', ppkItemTypeCode[currItemTypeCode]);

                    var secondDiv = firstDiv.find('#tab-'+val);
                    secondDiv.attr('id', ppkId);

                    var a = secondDiv.find('.aElementTabPPK');
                    a.attr('id', ppkId);
                    a.attr('href', '#tabpanel-'+ppkId);
                    a.attr('aria-controls', 'tabpanel-'+ppkId);

                    if (itemTypeCode !== 'bqsi'){
                        var thirdDiv = firstDiv.find('#tabpanel-'+val);
                        thirdDiv.attr('id', ppkId);
                        thirdDiv.attr('aria-labelledby', 'tab-'+ppkId);
                    }
                }).fail(function(data){
                    errorSwalFail(data);
                });
            });

            if (done) {
                updateDivPPK(ppkkItemId, currTab.attr('id'), tableTabs.includes(currTab.attr('id')));

                Swal.fire( {
                    title: 'Success',
                    html: 'Item Successfully Updated',
                    icon: 'success',
                    allowOutsideClick: false
                });
            }
        }
    }
});

$('#divNewBQ').on('click', '#btnNewBQ', function () {
    $('#divNewBQ').addClass("collapse");
    $('#divElemBQ').removeClass("collapse");
    $('#divMenuElemBQ').removeClass("collapse");
});

function checkElemData(elem, dataArr) {
    // console.log(elem);
    if (elem.item_type_code !== 'bqsi') {
        var bqItems = [];
        var bqSubItems = [];

        var paramData = {};
        paramData.item_id = elem.item_id;
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

        var isInData = false;
        // if there are subitems, check subitems
        if (bqSubItems.length) {
            $.each(bqSubItems, function(i, val) {
                var dataBool = checkElemData(val, dataArr);
                if (dataBool) {
                    isInData = true;
                    return false;
                }
            });
            return isInData;
        }
        else {
            $.each(bqItems, function(i, val) {
                var dataBool = checkElemData(val, dataArr);
                if (dataBool) {
                    isInData = true;
                    return false;
                }
            })
            return isInData;
        }
    }
    else {
        if (dataArr.includes(elem.item_id)) {
            return true;
        }
        else {
            return false;
        }
    }
}

function updateDivPPK(ppkkId, tab, tableDisp) {
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