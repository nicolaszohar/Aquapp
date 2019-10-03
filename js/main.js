
/** 
 * Initilisation
 */
$(document).ready(function(){
    var dbJsonFile = "data/dataAquapp.json";
   $.ajax({url: dbJsonFile, dataType: 'json', cache: false }).done(
    function(data) {  
        $('#lastupdate span').html($.datepicker.formatDate('dd/mm/yy', new Date(data.lastupdate.split(' ')[0]))+' '+data.lastupdate.split(' ')[1]);
        loadInventory(data); 
        loadLogs(data);
        loadControls(data);
        loadLinks(data);
    });
    
    $('#gallery a').colorbox({rel:'group1', slideshow:true, speed: 1500, height:"75%"});
    
    $('#addBtn').click(function(){ $('.addEntry').slideToggle(); });
    
    $('#file_upload').uploadify({
        'uploader'  : 'admin/uploadify.swf',
        'script'    : 'admin/uploadify.php',
        'cancelImg' : 'css/uploadify/cancel.png',
        'folder'    : '/data/pics',
        'buttonText': ' Choix du fichier... ',
        'auto'      : true,
        'onSelect'  : function(event,ID,fileObj) {  $('#filename').val(fileObj.name);  }
    });
    
    initAddForms();
    if(window.location.hash!=''){ openMenu(window.location.hash); } else { openMenu('#inventory'); }
    
    
    // Sort Table Date function
    jQuery.fn.dataTableExt.oSort['uk_date-asc']  = function(a,b) {
	var ukDatea = a.split('/');
	var ukDateb = b.split('/');
	
	var x = (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
	var y = (ukDateb[2] + ukDateb[1] + ukDateb[0]) * 1;
	
	return ((x < y) ? -1 : ((x > y) ?  1 : 0));
    };

    jQuery.fn.dataTableExt.oSort['uk_date-desc'] = function(a,b) {
        var ukDatea = a.split('/');
        var ukDateb = b.split('/');
        
        var x = (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        var y = (ukDateb[2] + ukDateb[1] + ukDateb[0]) * 1;
        
        return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
    };
});


/** 
 * Display clicked menu
 */ 
function openMenu(id){
    $('.pages').hide();
    $('.addForm').hide();
    $('.menu_bar li a').removeClass('selected');
    $(id).show();
    $(id+'Form').show();
    $(id+'Menu').addClass('selected');
    window.location.hash = id;
}


/**
 * Loading Inventory data from JSON file
 * @param  tblId  Id of the table to fill.
 */ 
function loadInventory(data){
    var total = 0;
    $.each(data.dataInventory, function(i,d){
        var pic = d.img ? '<a class="inventoryPics" href="data/pics/'+d.img+'" title="'+d.name+'"><img src="data/pics/'+d.img+'"/></a>':'<img src="data/pics/blank.jpg"/>';
        var lineTotal = d.quantity * d.unitPrice;
        total += lineTotal;
        
        //Construct table
        $('#tableInventory tbody').append(
            addRow(
                addCell(pic, 'center')
                +addCell(d.name, 'left')
                +addCell(d.manufacturer, 'left')
                +addCell(d.description, 'left')
                +addCell(d.category, 'center')
                +addCell($.datepicker.formatDate('dd/mm/yy', new Date(d.buyDate)), 'center')
                +addCell($.datepicker.formatDate('dd/mm/yy', new Date(d.useDate)), 'center')
                +addCell(d.unitPrice.toFixed(2)+'&euro;', 'right')
                +addCell(d.quantity, 'center')
                +addCell(lineTotal.toFixed(2)+'&euro;', 'right')
            )
        );
    });
    $('#total span').html(total.toFixed(2));
    
    // Init sort and layout for table
    $('#tableInventory').dataTable( {
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",               
        "oLanguage": { "sUrl": "data/dataTables.french.txt" }, // tranlsation
        "aoColumns": [null,null,null,null,null,{ "sType": "uk_date" },{ "sType": "uk_date" },null,null,null],
        "aaSorting": [[ 5, "desc" ],[ 4, "asc" ]],
        "bProcessing": true,
        "iDisplayLength": 25
    });
    $('#inventory a.inventoryPics').colorbox({rel:'inventoryPics', maxHeight:'85%'});
}



/**
 * Loading Log data from JSON file
 * @param  tblId  Id of the table to fill.
 */ 
 
function loadLogs(data){
    $.each(data.dataLogs, function(i,d){          
        //Construct table
        $('#tableLogs tbody').append(
            addRow(
                addCell($.datepicker.formatDate('dd/mm/yy', new Date(d.date)), 'center')
                +addCell(d.action, 'left')
                +addCell(d.comment, 'left')
            )
        );
    });
    $('#tableLogs').dataTable( {
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",               
        "oLanguage": { "sUrl": "data/dataTables.french.txt" }, // tranlsation
        "aoColumns": [{ "sType": "uk_date" },null,null],
        "aaSorting": [[ 0, "desc" ]],
        "bProcessing": true,
        "iDisplayLength": 25
    });
}

/**
 * Loading Water Controls data from JSON file
 * @param  tblId  Id of the table to fill.
 */ 
 
var dateTab = new Array();var phTab = new Array();var ghTab = new Array();var khTab = new Array();
var no2Tab = new Array();var no3Tab = new Array(); var cl2Tab = new Array();var tempTab = new Array();

function loadControls(data){

    $.each(data.dataControls, function(i,d){
        //Store data for chart
        dateTab.push(d.date); phTab.push(d.ph); ghTab.push(d.gh); khTab.push(d.kh); no2Tab.push(d.no2); no3Tab.push(d.no3); cl2Tab.push(d.cl2);tempTab.push(d.temp);
        
        //Construct table
        addRowControls(d.date, d.source, d.ph, d.gh, d.kh, d.no2, d.no3, d.cl2, d.temp)
    });
    loadChart();
    $('#tableControls').dataTable( {
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",               
        "oLanguage": { "sUrl": "data/dataTables.french.txt" }, // tranlsation
        "aoColumns": [{ "sType": "uk_date" },null,null,null,null,null,null,null,null],
        "aaSorting": [[ 0, "desc" ]],
        "bProcessing": true,
        "iDisplayLength": 25
    });

    
    
    /**
     * private function
     * Display chart for Water Controls values
     */
    var chart;
    function loadChart(){
        chart = new Highcharts.Chart({
            chart: { renderTo: 'chartAll', type: 'line', marginRight: 80, marginBottom: 25 },
            title: {  text: 'Evolution des paramètres de l\'eau',  x: -20  },
            xAxis: {  categories: dateTab  },
            yAxis: {  plotLines: [{ value: 0, width: 1, color: '#808080'}] },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    this.y + ((this.series.name=='GH' || this.series.name=='KH')?' °d ':' ') + ' ('+$.datepicker.formatDate('dd/mm/yy', new Date(this.x)) +') ' ;
                }

            },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'top', x: -5, y: 100, borderWidth: 0 },
            series: [{ name: 'pH', data: phTab },
                     { name: 'GH', data: ghTab },
                     { name: 'KH', data: khTab }, 
                     { name: 'NO2', data: no2Tab },
                     { name: 'NO3', data: no3Tab },
                     { name: 'Cl2', data: cl2Tab },
                     { name: 'Temp', data: tempTab }]
        });
        
        //Hide some series at init
        chart.series[5].hide();
        chart.series[6].hide();
        
    }
}

function addRowControls(date, source, ph, gh, kh, no2, no3, cl2, temp){
    //Construct table
    $('#tableControls tbody').append(
        addRow( addCell($.datepicker.formatDate('dd/mm/yy', new Date(date)), 'center')
                +addCell(source, 'center')
                +addCell(ph, 'center')
                +addCell(gh, 'center')
                +addCell(kh, 'center')
                +addCell(no2, 'center')
                +addCell(no3, 'center')
                +addCell(cl2, 'center')
                +addCell(temp, 'center')
        )
    );
}


/**
 * Loading Links data from JSON file
 */ 
 
function loadLinks(data){
    $.each(data.dataLinks, function(i,d){ $('ul#tableLinks').append('<li><a href="'+d.url+'">'+d.title+' - '+d.url+'</a></li>'); });
}
 
/** 
 * Init Add Forms events
 */
function initAddForms(){
   
    $('input.date').datepicker({ dateFormat: "yy-mm-dd" });
    
    //AddForms
    $('.addForm').submit(function(){
       
        var dataArray = $(this).serializeArray();
        //$('#file_upload').uploadifyUpload();
        
        $.ajax({  
            type: "POST",  
            url: "admin/add.php5",  
            data: dataArray,  
            success: function(res) {  
                    alert(res);
                    window.location.reload();
            },
            error: function(xhr){ alert('Error'+xhr.status); }
        });
        return false;
    });
}
/**
 * Tools for tables
 */
 function addRow(cells){            return '<tr>'+cells+'</tr>'; }
 function addCell(content, align){  return '<td '+(align?'style="text-align:'+align+'"':'')+'>'+content+'</td>'; }
 

 
 


    

        
        