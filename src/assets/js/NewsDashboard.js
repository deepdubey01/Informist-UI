$.widget("custom.newsdashboard1", {
    // default options
    options: {
        name: "newsdashboard1",

    },

    // The constructor
    _create: function () {
        var that = this;
        this.index = null;
        this.element.attr('id', this.options.name);

        var layout = new jqxSplitLayout("#jqxLayout1", {

            dataSource: [
                {
                    orientation: "horizontal",
                    items: [
                        {
                            //content: "<table  style='width:100%;height:40vh' id='upperTable'><tr><th class='informisttd'>Time</th><th class='informisttd'>Headline</th></tr></table>"
                            content: "<div id='upperTable'></div>"
                        },
                        {
                            //content: "<table style='width:100%;height:40vh' class='infomisttable' id='lowerTable'><tr><th class='informisttd'>Time</th><th class='informisttd'>Headline</th></tr></table>"
                            content: "<div id='lowerTable'></div>"
                        }
                    ]
                },
                {
                    content: '<panel id="fulltext1"></panel>'
                }
            ]
        })


        this.element.append(layout);


        setTimeout(function () {

            $("#upperTable").jqxDataTable(
                {
                    width: '100%',
                    pageable: true,
                    pagerMode: 'simple',
                    altRows: true,
                    theme: 'energyblue',
                    columns: [
                        { text: 'Time', dataField: 'datetime', width: '15%' },
                        { text: 'Headlines', dataField: 'headlines', width: '85%' }
                    ]
                });

            // varNewsDashboard1.FillGrid($("#upperTable"));
            //varNewsDashboard1.FillGrid($("#lowerTable"));
        }, 200);

        setTimeout(function () {
            $("#lowerTable").jqxDataTable(
                {
                    width: '100%',
                    pageable: true,
                    theme: 'energyblue',
                    pagerMode: 'advanced',
                    altRows: true,
                    columns: [
                        { text: 'Time', dataField: 'datetime', width: '15%' },
                        { text: 'Headlines', dataField: 'headlines', width: '85%' }
                    ]
                });
        }, 200);

    }

});

var varNewsDashboard1 = {

    data: {
        accesstoken: "",
    },

    NewsImage1: function (rwire, resposne) {
        var newsDataItem = JSON.parse(resposne);
        for (i = 0; i < newsDataItem.length; i++) {

            var headline = newsDataItem[i].headline;
            var datetime = newsDataItem[i].storydate.split('T')[0];
            var data = new Array();
            data.push({ "datetime": datetime, "headlines": newsDataItem[i].headline, storyid: newsDataItem[i].storyno });
            $("#upperTable").jqxDataTable('addRow', null, data, 'first')

            if (!newsDataItem[i].headline.startsWith("--")) {
                $("#fulltext1").html(newsDataItem[i].storyText);
            }
        }
        $("#upperTable").on("rowDoubleClick", function (event) {
            var args = event.args;
            var Rows = args.row;
            RequestStory(Rows.storyid);
        });
    },

    UpdateFullText1: function (strstory) {
        $("#fulltext1").html(strstory);
    },
    NewsImage2: function (rwire, resposne) {
        var newsDataItem = JSON.parse(resposne);
        for (i = 0; i < newsDataItem.length; i++) {

            var headline = newsDataItem[i].headline;
            var datetime = newsDataItem[i].storydate.split('T')[0];
            var data = new Array();
            data.push({ "datetime": datetime, "headlines": newsDataItem[i].headline, storyid: newsDataItem[i].storyno });
            $("#lowerTable").jqxDataTable('addRow', null, data, 'first')

            //if (!newsDataItem[i].headline.startsWith("--")) {
            //    $("#fulltext1").html(newsDataItem[i].storyText);
            //}
        }
    },

    UpdateNews: function (newsdata) {
        var newsDataItem = JSON.parse(newsdata);
        console.log(newsDataItem.headline);
        var data = new Array();
        data.push({ "datetime": "10:10:10", "headlines": newsDataItem.headline })
        $("#upperTable").jqxDataTable('addRow', null, data, 'first')

        if (!newsDataItem.headline.startsWith("--")) {
            $("#fulltext1").html(newsDataItem.storyText);
        }

    },

    Login: function (element) {
        var param = {};
        var jsonData = {};
        jsonData["email_id"] = "admin@gmail.com";
        jsonData["password"] = "Admin@123";

        $.ajax({
            type: "POST",
            async: false,
            url: "http://172.17.81.34:8080/api/admin/login/",
            data: JSON.stringify(jsonData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result.data);
                var accesstoken = result.data.access_token;
                Global.accesstoken = accesstoken;
                console.log('printed ' + accesstoken);

            },
            error: function (ex) {
                console.log(ex);
            }
        });
    },

    FillGrid: function (element) {
        for (i = 0; i < 12; i++) {
            var row = '<tr><td>18:05:36</td><td>find the rowCount and insert the new row at the bottom of the table.<td></td></tr>';
            element.append(row);
        }
    }


};