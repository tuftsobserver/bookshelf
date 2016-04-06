// Credit for pulling from google sheets code to http://kovalent.co/blog/google-docs-as-a-backend/
var JSONURL = 'https://spreadsheets.google.com/feeds/list/1QfO2MslmoiQWT8C158_9it0K4kYcPf86jMS9SHVgom4/1/public/basic?alt=json';
var bit1 = '<div class="grid-elem"><div class="block"><a target="_blank" href=\"http://www.goodreads.com/search?utf8=%E2%9C%93&q='
            //Title and author search query for goodreads
var bit2 = '&search_type=books\"><span class="title"><i class="fa fa-bookmark"></i>&ensp;';
            //Title
var bit3 = '</span></a>&emsp;<span class="author">';
            //Author
var bit4 = '</span><p class="rec"><i class="fa fa-quote-left"></i>&ensp;';
            //Rec
var bit5 = '&ensp;<i class="fa fa-quote-right"></i></p><p>&mdash;<span class="name">';
            //Name
var bit6 = '</span></p></div></div>';

// onclick redirects to a goodreads search page

$("body").fadeIn(1000);
$.ajax({
  url:JSONURL,
  success: function(data){
    var rows = [];
    var cells = data.feed.entry;

    for (var i = 0; i < cells.length; i++){
        var rowObj = {};
        rowObj.timestamp = cells[i].title.$t;
        var rowCols = cells[i].content.$t.split(',');
        var tempPrev;
        for (var j = 0; j < rowCols.length; j++){
            var keyVal = rowCols[j].split(':');
            if (keyVal[0].trim() != "title" && keyVal[0].trim() != "author" &&
            keyVal[0].trim() != "whydoyourecommendthisbook" && keyVal[0].trim() != "yourname") {
                // Concatonate this to previous since error w/ splitting commas/colon
                rowObj[tempPrev] += ', ' + keyVal[0].trim();
                for (var k = 1; k < keyVal.length; k++) {
                    rowObj[tempPrev] += ': ' + keyVal[k].trim();
                }
                continue;
            }
            else {
                rowObj[keyVal[0].trim()] = keyVal[1].trim();
                // For error w/ splitting commas/colon
                for (var k = 2; k < keyVal.length; k++) {
                    rowObj[keyVal[0].trim()] += ': ' + keyVal[k].trim();
                }
            }
            tempPrev = keyVal[0].trim();
        }

        var name;
        if (rowObj["yourname"] == undefined)
            name = "Anonymous";
        else name = rowObj["yourname"];

        var toAdd = bit1 + rowObj["title"] + ' ' + rowObj["author"] + bit2 + rowObj["title"] + bit3 + rowObj["author"] + bit4 + rowObj["whydoyourecommendthisbook"] + bit5 + name + bit6;
        document.getElementById("grid").innerHTML = toAdd + document.getElementById("grid").innerHTML;
    }
  }
});