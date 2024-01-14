/// <reference path="jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
/// <reference path="main-hub.js" />
var DataCache = { "test": { "test1": "test2" } };
var informistHub = null;
var chipContainer, fruitInput, commaSeparatedOutput;
var newsBasket = [];
var newspermission = "CEW,CMW,CCW";
var MainPermission;
var activatedNewsBox = 'newsTable';
var category = '';
var tableName;
var masterRequestWire;
var requestStoryCalled = false;
newsSelected = false;
var arr = [{ DateTime: "", Data: "" }];
const streamArray = new Map();
isSocketDisconnected = false;
var searchParams = {};

var menuRequest = {};
var storyBox = {};
requestedBy = false;
function ConnectToServer() {
    try {
        if ($.connection.hub != null) {
            $.connection.hub.stop();
        }
    }
    catch (ignore) {
        alert(ignore);
    }

    try {
        // $.connection.hub.url = "http://localhost:5608/informist/hubs";
        // alert("connecting");
        $.connection.hub.url = String("http://172.17.81.34:5608/informist/hubs");
        $.connection.hub.logging = true;
        informistHub = $.connection.InformistService;
        informistHub.client.onSuccess = function (strMessage, strType) {
            // alert('connected..onsuccess');
        }

        informistHub.client.onHeartBeat = function (strMessage) {
            console.log('heartbeat');
        }

        // informistHub.client.onUserDetails = function (response) {
        //     console.log('onUserDetails');
        //     console.log(response);
        //     if (response && response.Permissions) {
        //         MainPermission = response.Permissions;
        //         MainUserPreference = response.Preference;
        //         const preferenceArray = JSON.parse(MainUserPreference);
        //         MainUserPreference = JSON.stringify(preferenceArray).replace(/^\[\"|\"\]$/g, '')
        //         window.localStorage.setItem("MainPermissionwires", response.Permissions);
        //         window.localStorage.setItem("MainUserPreference", response.Preference);
        //         console.log(MainPermission);
        //         console.log('MainUserPreference');
        //         console.log(MainUserPreference);

        //         for (const tableName in MainUserPreference) {
        //             const { strNewsWire, strkeyword } = userPreferenceData[tableName];
        //             const safeStrKeyword = strkeyword || '';

        //             if (!isNaN(Number(tableName))) {
        //                 continue;
        //             }

        //             console.log('Table Name:', tableName);
        //             console.log('News Wire:', strNewsWire);
        //             console.log('Search Keyword:', safeStrKeyword);

        //             RequestSearchNews(strNewsWire, safeStrKeyword, tableName, true, this.user_id);

        //             // Additional logic if needed based on the tableName
        //             if (tableName === 'newsTable' || tableName === 'newsTable2') {
        //                 for (const wire in this.wireMappings) {
        //                     if (strNewsWire.includes(wire)) {
        //                         if (tableName === 'newsTable') {
        //                             this.newsTableheadline = this.wireMappings[wire];
        //                         } else if (tableName === 'newsTable2') {
        //                             this.newsTableheadline2 = this.wireMappings[wire];
        //                         }
        //                         break;
        //                     }
        //                 }
        //             }
        //         }


        //     } else {
        //         console.error('Permissions not found in the response or not in the expected format.');
        //     }
        // }

        informistHub.client.onUserDetails = function (response) {
            console.log('onUserDetails');
            console.log(response);

            if (response) {
                MainPermission = response.Permissions;
                MainUserPreference = response.Preference;
                const preferenceArray = JSON.parse(MainUserPreference);
                MainUserPreference = JSON.stringify(preferenceArray).replace(/^\[\"|\"\]$/g, '');

                window.localStorage.setItem("MainPermissionwires", MainPermission);
                window.localStorage.setItem("MainUserPreference", MainUserPreference);

                if (Array.isArray(preferenceArray) && preferenceArray.length > 0) {
                    const userPreferenceData = preferenceArray[0];
                    for (const tableName in userPreferenceData) {
                        console.log(tableName);
                        const { strNewsWire, strkeyword } = userPreferenceData[tableName];
                        const safeStrKeyword = strkeyword || '';
                        if (tableName === 'searchTable') {
                            continue;
                        }


                        console.log('Table Name:', tableName);
                        console.log('News Wire:', strNewsWire);
                        console.log('Search Keyword:', safeStrKeyword);

                        RequestSearchNews(strNewsWire, safeStrKeyword, tableName, true, this.user_id);

                        // Additional logic if needed based on the tableName
                        if (tableName === 'newsTable' || tableName === 'newsTable2') {
                            for (const wire in this.wireMappings) {
                                if (strNewsWire.includes(wire)) {
                                    if (tableName === 'newsTable') {
                                        this.newsTableheadline = this.wireMappings[wire];
                                    } else if (tableName === 'newsTable2') {
                                        this.newsTableheadline2 = this.wireMappings[wire];
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                console.error('Permissions not found in the response or not in the expected format.');
            }
        }




        informistHub.client.onPreferenceUpdate = function (response) {
            console.log(response);
            // alert(response);
        }

        function addTableRow(tableName, newsData) {
            const table = document.querySelector(`.${tableName}  tbody`);
            console.log(tableName);
            var newRow = table.insertRow(0);
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            cell1.style.minWidth = '75px';
            convertTo24Hour
            var formattedTime = newsData.storydate.split(' ')[1];
            cell1.innerHTML = formattedTime;
            cell1.title = newsData.storydate;
            cell2.title = newsData.headline;
            cell2.style.width = '100%';
            cell2.style.fontWeight = 'bold';
            cell2.style.userSelect = 'none';
            cell1.style.userSelect = 'none';
            cell1.style.fontWeight = 'bold';
            cell2.innerHTML = newsData.headline;
            cell2.style.overflow = 'hidden';
            cell2.style.textOverflow = 'ellipsis';
            cell2.style.whiteSpace = 'nowrap';

            if (!newsData.headline.startsWith('--')) {
                if (!newsSelected) {
                    if (!newsData.headline.startsWith('--'))
                        var newsStoryContent;
                    if (tableName === 'newsTable') {
                        newsStoryContent = document.querySelector('.newsStoryPanel .newsStoryContent');
                    } else if (tableName === 'newsTable2') {
                        newsStoryContent1 = document.querySelector('.newsStoryPanel .newsStoryContent');
                        newsStoryContent = document.querySelector('.newsStoryPanel2 .newsStoryContent2');
                    } else {
                        newsStoryContent = document.querySelector('.newsStoryPanel .newsStoryContent');
                    }
                    if (newsStoryContent) {
                        var modifiedFulltext = newsData.storyText;
                        newsData.userSelect = 'none';
                        newsStoryContent.innerHTML = modifiedFulltext;
                    } else {
                        var modifiedFulltext = newsData.storyText;
                        newsStoryContent1.innerHTML = modifiedFulltext;
                    }
                }

                newRow.ondblclick = function () {
                    newRow.style.fontStyle = 'italic';
                    newRow.style.backgroundColor = 'blue !important';
                    cell2.style.fontWeight = 'normal';
                    cell1.style.fontWeight = 'normal';
                    RequestStory(newsData.storyno, tableName);
                    if (tableName === 'searchTable') {
                        openModal(newsData.headline);
                        var newsPanel = document.querySelector('.NewsPanel-Box-Story');
                        if (newsPanel) {
                            newsPanel.scrollTop = 0;
                        }
                    }
                    newRow.classList.remove('unread-news');
                    newsSelected = true;
                };

            } else {
                newRow.ondblclick = function () {
                    newRow.classList.remove('unread-news');
                };
            }
        }


        informistHub.client.onNewsImage = function (rwire, response) {
            console.log('searchParams');
            console.log(JSON.stringify(searchParams));
            console.log(rwire);
            console.log(response);

            const rwires = rwire.split(',');
            rwires.forEach((rw) => {
                for (const callerelement in searchParams) {
                    const cellElement = callerelement;
                    var newsDataItems = [];
                    requestStoryCalled = false;
                    try {
                        newsDataItems = JSON.parse(response);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                    if (rw.includes(searchParams[callerelement].strNewsWire)) {
                        if ((callerelement == 'searchTable' && rwire == searchParams[callerelement].strNewsWire)) {
                            tableName = callerelement;
                            var itemAdded = false;
                            for (var i = newsDataItems.length - 1; i >= 0; i--) {
                                const newsItem = newsDataItems[i];
                                addTableRow(callerelement, newsItem);
                                itemAdded = true;
                            }
                            searchParams[callerelement].requestedBy = false;
                        } else {
                            if (searchParams[callerelement].strkeyword === null || searchParams[callerelement].strkeyword === '') {
                                if (searchParams[callerelement].requestedBy) {
                                    tableName = callerelement;
                                    var itemAdded = false;
                                    for (var i = newsDataItems.length - 1; i >= 0; i--) {
                                        const newsItem = newsDataItems[i];
                                        if (!newsDataItems[i].headline.startsWith('--')) {
                                            if (!requestStoryCalled) {
                                                activatedNewsBox = tableName;
                                                RequestStory(newsItem.storyno, activatedNewsBox);
                                                requestStoryCalled = true;
                                            }
                                        }
                                        addTableRow(callerelement, newsItem);
                                        itemAdded = true;
                                    }
                                    searchParams[callerelement].requestedBy = false;
                                }
                            } else if (searchParams[callerelement].strkeyword.includes('/') && searchParams[callerelement].strkeyword.split('/').length === 2) {
                                const [category] = searchParams[callerelement].strkeyword.split('/');
                                const matchedNewsDataItems = newsDataItems.filter(item => item.category.includes(category));
                                tableName = callerelement;
                                var itemAdded = false;
                                for (var i = matchedNewsDataItems.length - 1; i >= 0; i--) {
                                    const newsItem = matchedNewsDataItems[i];
                                    if (!newsItem.headline.startsWith('--')) {
                                        if (!requestStoryCalled) {
                                            activatedNewsBox = tableName;
                                            RequestStory(newsItem.storyno, activatedNewsBox);
                                            requestStoryCalled = true;
                                        }
                                    }
                                    addTableRow(tableName, newsItem);
                                    itemAdded = true;
                                }
                                searchParams[callerelement].requestedBy = false;

                            } else if (newsDataItems.some(item => item.headline.includes(searchParams[callerelement].strkeyword))) {
                                tableName = callerelement;
                                var itemAdded = false;
                                for (var i = newsDataItems.length - 1; i >= 0; i--) {
                                    const newsItem = newsDataItems[i];
                                    if (!newsItem.headline.startsWith('--')) {
                                        if (!requestStoryCalled) {
                                            activatedNewsBox = tableName;
                                            RequestStory(newsItem.storyno, activatedNewsBox);
                                            requestStoryCalled = true;
                                        }
                                    }
                                    addTableRow(tableName, newsItem);
                                    itemAdded = true;
                                }
                                searchParams[callerelement].requestedBy = true;
                            }
                        }
                    }
                }
            });
        }

        // informistHub.client.onNewsImage = function (rwire, response) {
        //     console.log('searchParams');
        //     console.log(JSON.stringify(searchParams));

        //     for (const callerelement in searchParams) {
        //         const cellElement = callerelement;
        //         var newsDataItems = [];
        //         requestStoryCalled = false;
        //         try {
        //             newsDataItems = JSON.parse(response);
        //         } catch (error) {
        //             console.error('Error parsing JSON:', error);
        //         }

        //         if (callerelement === 'searchTable' || rwire.includes(searchParams[callerelement].strNewsWire)) {
        //             if (searchParams[callerelement].strkeyword === null || searchParams[callerelement].strkeyword === '') {
        //                 if (searchParams[callerelement].requestedBy) {
        //                     tableName = callerelement;
        //                     var itemAdded = false;
        //                     for (var i = newsDataItems.length - 1; i >= 0; i--) {
        //                         const newsItem = newsDataItems[i];
        //                         if (!newsDataItems[i].headline.startsWith('--')) {
        //                             if (!requestStoryCalled) {
        //                                 activatedNewsBox = tableName;
        //                                 RequestStory(newsItem.storyno, activatedNewsBox);
        //                                 requestStoryCalled = true;
        //                             }
        //                         }
        //                         addTableRow(callerelement, newsItem);
        //                         itemAdded = true;
        //                     }
        //                     searchParams[callerelement].requestedBy = false;
        //                 }
        //             } else if (searchParams[callerelement].strkeyword.includes('/') && searchParams[callerelement].strkeyword.split('/').length === 2) {
        //                 const [category] = searchParams[callerelement].strkeyword.split('/');
        //                 const matchedNewsDataItems = newsDataItems.filter(item => item.category.includes(category));
        //                 tableName = callerelement;
        //                 var itemAdded = false;
        //                 for (var i = matchedNewsDataItems.length - 1; i >= 0; i--) {
        //                     const newsItem = matchedNewsDataItems[i];
        //                     if (!newsItem.headline.startsWith('--')) {
        //                         if (!requestStoryCalled) {
        //                             activatedNewsBox = tableName;
        //                             RequestStory(newsItem.storyno, activatedNewsBox);
        //                             requestStoryCalled = true;
        //                         }
        //                     }
        //                     addTableRow(tableName, newsItem);
        //                     itemAdded = true;
        //                 }
        //                 searchParams[callerelement].requestedBy = false;
        //             } else if (newsDataItems.some(item => item.headline.includes(searchParams[callerelement].strkeyword))) {
        //                 tableName = callerelement;
        //                 var itemAdded = false;
        //                 for (var i = newsDataItems.length - 1; i >= 0; i--) {
        //                     const newsItem = newsDataItems[i];
        //                     if (!newsItem.headline.startsWith('--')) {
        //                         if (!requestStoryCalled) {
        //                             activatedNewsBox = tableName;
        //                             RequestStory(newsItem.storyno, activatedNewsBox);
        //                             requestStoryCalled = true;
        //                         }
        //                     }
        //                     addTableRow(tableName, newsItem);
        //                     itemAdded = true;
        //                 }
        //                 searchParams[callerelement].requestedBy = true;
        //             }
        //         }
        //     }
        // };


        informistHub.client.onNewsUpdates = function (strnews) {
            console.log(strnews);
            try {
                const newsItem = JSON.parse(strnews);
                let matchFound = false;
                for (const callerelement in searchParams) {
                    if (searchParams.hasOwnProperty(callerelement)) {
                        const cellElement = callerelement;
                        const keyword = searchParams[callerelement].strkeyword;

                        if (keyword === null || keyword === '') {
                            if (newsItem['cmw-wires'].includes(searchParams[callerelement].strNewsWire)) {
                                tableName = callerelement;

                                addTableRow(tableName, newsItem);

                                matchFound = true;
                                break;
                            }
                        } else {
                            if (keyword.includes('/') && keyword.split('/').length === 2) {
                                const [category] = keyword.split('/');
                                if (
                                    newsItem.category.includes(category)
                                ) {
                                    tableName = callerelement;
                                    addTableRow(tableName, newsItem);
                                    matchFound = true;
                                    break;
                                }
                            } else if (newsItem.headline.includes(keyword)) {

                                tableName = callerelement;
                                addTableRow(tableName, newsItem);
                                matchFound = true;
                                break;
                            }
                        }
                    }
                }

                if (!matchFound) {
                    console.log('No matching table found for the news item.');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        informistHub.client.onStoryImage = function (strResponse) {


            var storyResponse = JSON.parse(strResponse);
            var storyNo = storyResponse[0].storyno;
            for (var tableName in storyBox) {
                var storyBoxEntry = storyBox[tableName];
                if (storyBoxEntry.storyno === storyNo) {
                    var newsStoryContent;
                    var newsStoryContent1;
                    if (tableName === 'newsTable') {
                        newsStoryContent = document.querySelector('.newsStoryPanel .newsStoryContent');
                    } else if (tableName === 'newsTable2') {
                        newsStoryContent = document.querySelector('.newsStoryPanel2 .newsStoryContent2');
                        newsStoryContent1 = document.querySelector('.layout1 .newsStoryPanel .newsStoryContent');
                    } else if (tableName === 'searchTable') {
                        modalNewsContent = document.getElementById('modalNewsContent');
                    }
                    else {
                        newsStoryContent = document.querySelector('.layout1 .newsStoryPanel .newsStoryContent');
                        continue;
                    }

                    if (newsStoryContent) {
                        var newsPanel = document.querySelector('.NewsPanel-Box');
                        if (newsPanel) {
                            newsPanel.scrollTop = 0;
                        }
                        var modifiedFulltext = storyResponse[0].fulltext;
                        console.log(newsStoryContent1);
                        newsStoryContent.innerHTML = modifiedFulltext;
                    } else if (modalNewsContent) {
                        var newsPanel = document.querySelector('.NewsPanel-Box-Story');
                        if (newsPanel) {
                            newsPanel.scrollTop = 0;
                        }
                        var modalNewsContent = document.getElementById('modalNewsContent');
                        if (modalNewsContent) {
                            modalNewsContent.innerHTML = storyResponse[0].fulltext;
                        }
                    } else {
                        var newsPanel = document.querySelector('.NewsPanel-Box');
                        if (newsPanel) {
                            newsPanel.scrollTop = 0;
                        }
                        var modifiedFulltext = storyResponse[0].fulltext;
                        console.log(newsStoryContent1);
                        newsStoryContent1.innerHTML = modifiedFulltext;
                    }

                }
            }
        };


        // informistHub.client.onMenuDetails = function (response) {
        //     console.log(response);
        //     try {
        //         response.forEach(item => {
        //             if (item.child_menus) {
        //                 try {
        //                     item.child_menus = JSON.parse(item.child_menus);
        //                 } catch (parseError) {
        //                     console.error('Error parsing child_menus:', parseError);
        //                     console.log('Substring causing the issue:', item.child_menus.slice(0, 100));
        //                 }
        //             }
        //         });

        //         // this.jsonData = JSON.stringify(response);

        //         menuRequest[masterRequestWire] = response;
        //         localStorage.setItem('menuRequest', JSON.stringify(menuRequest));
        //         console.log(JSON.stringify(menuRequest));
        //         this.jsonData = JSON.stringify(menuRequest);
        //         console.log('masterRequestWire');
        //         console.log(masterRequestWire);
        //         resetAndAddSelectElements.call(this);
        //     } catch (error) {
        //         console.error('Error modifying response:', error);
        //     }
        // };

        informistHub.client.onMenuDetails = function (response) {
            console.log(response);
            try {
                response.forEach(item => {
                    if (item.child_menus) {
                        try {
                            item.child_menus = JSON.parse(item.child_menus);
                        } catch (parseError) {
                            console.error('Error parsing child_menus:', parseError);
                            console.log('Substring causing the issue:', item.child_menus.slice(0, 100));
                        }
                    }
                });

                menuRequest[masterRequestWire] = response;
                localStorage.setItem('menuRequest', JSON.stringify(menuRequest));
                console.log(JSON.stringify(menuRequest));
                this.jsonData = JSON.stringify(menuRequest);
                console.log('masterRequestWire');
                console.log(masterRequestWire);
                resetAndAddSelectElements.call(this);

            } catch (error) {
                console.error('Error modifying response:', error);
            }
        };

        informistHub.client.onConnection = function (strMessage) {
            alert(strMessage);
        };

        $.connection.hub.start({ transport: ['webSockets', 'longPolling'] }).done(
            function () {
                $('#connection').hide();
                isSocketDisconnected = false;
            })

            .fail(function (error) {
                console.log(error.toString());
            });

        $.connection.hub.reconnecting(function () {
            // alert("Reconnecting");
        });

        $.connection.hub.reconnected(function () {
            // alert('reconnected')
        });

        $.connection.hub.disconnected(function () {
            // alert('disconnect');
            $('#connection').text('Offline').addClass('btn-danger');
            isSocketDisconnected = true;
        });

        $.connection.hub.connectionSlow(function () {
            // alert("slow connection")
        });
    }
    catch (e) {
        setTimeout(ConnectToServer, 2000);
        if (document.getElementById('result') != null) {
            //document.getElementById('result').innerHTML = "Connection Timeout..Retrying";
            document.getElementById('result').innerHTML = e.toString();
        }
    }
}

// function resetAndAddSelectElements() {
//     const existingSelectElements = document.querySelectorAll('.new-select');
//     existingSelectElements.forEach((element) => {
//         element.remove();
//     });

//     const menuRequestDataString = localStorage.getItem('menuRequest');
//     console.log(menuRequestDataString);

//     if (menuRequestDataString) {
//         try {
//             const menuRequestData = JSON.parse(menuRequestDataString);
//             console.log(JSON.stringify(menuRequestData));

//             const container = document.querySelector('.main-filter-panel') || document.querySelector('.filter-panel');

//             if (container) {
//                 if (menuRequestData && menuRequestData[masterRequestWire]) {
//                     const parsedData = menuRequestData[masterRequestWire];

//                     // Always find the referenceElement before inserting new elements
//                     const children = Array.from(container.children);
//                     const referenceElement = children[children.length - 2];

//                     parsedData.forEach((menuItem) => {
//                         const label = menuItem.menu_name;
//                         const colDiv = document.createElement('div');
//                         colDiv.className = 'col-md-2 new-select my-2';

//                         const formGroupDiv = document.createElement('div');
//                         formGroupDiv.className = 'form-group';

//                         const selectElement = document.createElement('select');
//                         selectElement.className = 'form-select search-control search-select';
//                         selectElement.name = label;
//                         selectElement.id = label;
//                         selectElement.required = true;

//                         // Event listener for the 'change' event of the select element
//                         selectElement.addEventListener('change', (event) => {
//                             const target = event.target;
//                             const selectedValue = target.value;
//                             if (selectedValue) {
//                                 localStorage.setItem('category_Selection', selectedValue);
//                             }
//                         });

//                         const optgroup = document.createElement('optgroup');
//                         optgroup.label = label;

//                         // Iterate over the child menus and create options
//                         menuItem.child_menus.forEach((item) => {
//                             const option = document.createElement('option');
//                             option.value = item.menu_code;
//                             option.text = item.menu_name;
//                             optgroup.appendChild(option);
//                         });

//                         // Append elements to the DOM
//                         selectElement.appendChild(optgroup);
//                         formGroupDiv.appendChild(selectElement);
//                         colDiv.appendChild(formGroupDiv);

//                         // Check if the container is still present in the document before inserting elements
//                         if (container.contains(referenceElement)) {
//                             // Insert the new elements before the second-to-last child
//                             container.insertBefore(colDiv, referenceElement);
//                         } else {
//                             console.log('Container not found in the document');
//                         }
//                     });
//                 } else {
//                     console.log(`${masterRequestWire} data not available in menuRequest`);
//                 }
//             } else {
//                 console.log('No container found with class .main-filter-panel or .filter-panel');
//             }
//         } catch (error) {
//             console.error('Error parsing JSON from localStorage:', error);
//         }
//     } else {
//         console.log('menuRequest data not found in localStorage');
//     }
// }

function resetAndAddSelectElements() {
    const maxAttempts = 20;
    let attempts = 0;
    const existingSelectElements = document.querySelectorAll('.new-select');
    existingSelectElements.forEach((element) => {
        element.remove();
    });

    const intervalId = setInterval(() => {
        const container = document.querySelector('.main-filter-panel') || document.querySelector('.filter-panel');
        attempts++;

        if (container) {
            clearInterval(intervalId);
            try {
                const menuRequestDataString = localStorage.getItem('menuRequest');

                if (menuRequestDataString) {
                    const menuRequestData = JSON.parse(menuRequestDataString);
                    console.log(JSON.stringify(menuRequestData));

                    const parsedData = menuRequestData[masterRequestWire];

                    const container = document.querySelector('.main-filter-panel') || document.querySelector('.filter-panel');
                    const children = Array.from(container.children);
                    const referenceElement = children[children.length - 2];
                    if (container) {
                        parsedData.forEach((menuItem) => {
                            const label = menuItem.menu_name;
                            const colDiv = document.createElement('div');
                            colDiv.className = 'col-md-2 new-select my-2';

                            const formGroupDiv = document.createElement('div');
                            formGroupDiv.className = 'form-group';

                            const selectElement = document.createElement('select');
                            selectElement.className = 'form-select search-control search-select';
                            selectElement.name = label;
                            selectElement.id = label;
                            selectElement.required = true;

                            // Add an empty option element
                            const emptyOption = document.createElement('option');
                            emptyOption.value = '';
                            emptyOption.text = label;
                            emptyOption.style.fontWeight = 'bold';
                            selectElement.appendChild(emptyOption);

                            selectElement.addEventListener('change', (event) => {
                                const target = event.target;
                                const selectedValue = target.value;
                                if (selectedValue) {
                                    localStorage.setItem('category_Selection', selectedValue);
                                }
                            });

                            menuItem.child_menus.forEach((item) => {
                                const option = document.createElement('option');
                                option.value = item.menu_code;
                                option.text = item.menu_name;
                                selectElement.appendChild(option);
                            });

                            formGroupDiv.appendChild(selectElement);
                            colDiv.appendChild(formGroupDiv);

                            if (container.contains(referenceElement)) {
                                // Insert the new elements before the second-to-last child
                                container.insertBefore(colDiv, referenceElement);
                            } else {
                                console.log('Container not found in the document');
                            }
                        });
                    }
                    else {
                        console.log('No container found with class .main-filter-panel or .filter-panel');
                    }
                } else {
                    console.log('menuRequest data not found in localStorage');
                }
            } catch (error) {
                console.error('Error parsing JSON from localStorage:', error);
            }
        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            console.log('Container not found after maximum attempts.');
        }
    }, 1000);
}





function SerchNewsImage(tableName) {
    informistHub.client.onNewsImageFunction(tableName);
}

//Login request to signalR
function RequestLogin() {
    var param1 = "informist";
    var param2 = "informist";
    informistHub.server.requestLogin(param1, param2);
}

//Quote request to signalR
function RequestQuote(strSymbol) {
    console.log("Request Quote " + strSymbol);
    if (strSymbol.indexOf('#') == 0 || strSymbol.indexOf('*') > -1 || strSymbol.indexOf('?') > -1) {
        //-- informistHub.server.requestChain(strSymbol);      
        RequestChainPerScreen(strSymbol);
    }
    else {
        informistHub.server.requestQuote(strSymbol);
        SymbolCollection += strSymbol + ",";
    }
}

//Chain request to signalR
function RequestChain(strChain) {
    //--informistHub.server.requestChain(strChain);
    RequestChainPerScreen(strChain);
}





//Chain request as per screen height to signalR
function RequestChainPerScreen(strChain) {
    informistHub.server.requestChainPerScreen(strChain, $(window).height() - 20);
}


function RequestNews(strNewsWire, strkeyword, callerelement, user_id) {
    searchParams[callerelement] = {
        strNewsWire: strNewsWire,
        strkeyword: strkeyword,
        requestedBy: true
    };
    setPreference(user_id, searchParams);

    console.log(searchParams)
    informistHub.server.requestSearchNews(strNewsWire, strkeyword);
    clearTableRows(callerelement);
}


function requestMenuDetails(user_id, accessToken, wire) {
    masterRequestWire = wire;
    if (menuRequest[masterRequestWire]) {
        resetAndAddSelectElements.call(this);
        console.log(`Menu data for ${wire} is already available. Skipping server request.`);

    } else {
        informistHub.server.requestMenuDetails(user_id, accessToken, wire);
    }
}

function heartBeat(strmessage) {
    informistHub.server.heartBeat(strmessage);
}

function RequestSearchNews(strNewsWire, strkeyword, callerelement, requestedBy, user_id) {
    if (searchParams.hasOwnProperty(callerelement)) {
        delete searchParams[callerelement];
    }
    searchParams[callerelement] = {
        strNewsWire: strNewsWire,
        strkeyword: strkeyword,
        requestedBy: requestedBy
    };

    setPreference(user_id, searchParams);
    localStorage.setItem("requestNews", JSON.stringify(searchParams));
    setTimeout(function () {
        informistHub.server.requestSearchNews(strNewsWire, strkeyword);
    }, 1000);
    clearTableRows(callerelement);
}

function RequestSearchNewsOnFly(strNewsWire, strkeyword, callerelement, requestedBy) {
    if (searchParams.hasOwnProperty(callerelement)) {
        delete searchParams[callerelement];
    }
    searchParams[callerelement] = {
        strNewsWire: strNewsWire,
        strkeyword: strkeyword,
        requestedBy: requestedBy
    };

    const searchParamsJson = JSON.stringify(searchParams);
    informistHub.server.updatePreference(searchParamsJson);
    console.log(searchParamsJson);


    localStorage.setItem("requestNews", JSON.stringify(searchParams));
    informistHub.server.requestSearchNewsOnFly(strNewsWire, strkeyword);
    clearTableRows(callerelement);
}

function clearTableRows(className) {
    var tables = document.getElementsByClassName(className);
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        var tbody = table.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
        }
    }
}



function RequestStory(newsStoryNo, tableName) {
    if (storyBox[tableName]) {
        storyBox[tableName].storyno = newsStoryNo;
    } else {
        storyBox[tableName] = {
            storyno: newsStoryNo,
        };
    }

    informistHub.server.requestStory(newsStoryNo);
    console.log(storyBox);
}




function RequestHistory(strSymbol, strResolution) {
    informistHub.server.requestHistory(strSymbol, "250", strResolution);
}

function RequestSymbolSearch(strText, strType) {
    informistHub.server.requestSymbolSearch(strText, strType, marketpermission);
}


function requestSearchPanel(tableName) {

}


// Cancel requested quote
function UnSubscribe(strSymbol) {
    informistHub.server.unSubscribeAll('A');
}

function Connect() {
    //informistHub.server.requestQuote("RELINDUS.BS");
    //informistHub.server.requestQuote("IDXCOMP=IDP");    
    //informistHub.server.requestQuote("RELINDUS.BS");    
    //informistHub.server.requestNews("","","","CMW","30");
    //informistHub.server.requestStory("CTW394307 - 03-12-2015dBQHNKNG");
    //informistHub.server.requestHistory("EUR=P","10","1");	
    //informistHub.server.requestHistory("AXISBANK.NS","10","1440");	
    //informistHub.server.requestHistory("ACC.NS","100","1440");	
    //informistHub.server.requestChain(".NG.BS")
}

//Cell color change on high low
function FlashToOriginal(obj) {
    obj.style.backgroundColor = " transparent"
}


function Authenticate(user_id, accessToken) {
    informistHub.server.requestUserDetaisl(user_id, accessToken);
    console.log(user_id + ',' + accessToken);
}

function RequestMyList(strMessage) {
    var symbols = strMessage.split(',');
    for (i = 0; i < symbols.length; i++) {
        if (symbols[i].indexOf(";") == -1) {
            var columns = "";
            for (c = 0; c < quoteFields.length; c++) {
                if (c == 0) {
                    //var sym = "";
                    //if (symbols[i].indexOf('=') > -1) {
                    //    sym = symbols[i].split('=')[0];
                    //}
                    //else if (symbols[i].indexOf('.') > -1) {
                    //    sym = symbols[i].split('.')[0];
                    //}
                    //columns += '<td>' + sym + '</td>'
                    columns += "<td data-field='" + quoteFields[c] + "'></td>";
                }
                else {
                    var fieldID = quoteFields[c];
                    columns += "<td align='right' data-field='" + fieldID + "'></td>";
                }
            }
            $('#tablegrid  tbody').append("<TR onclick='GetFullQuote(this)' data-symbol='" + symbols[i] + "'>" + columns + "</TR>");
            RequestQuote(symbols[i]);
        }
        else {
            var columns = "";
            for (c = 0; c < quoteFields.length; c++) {
                if (c == 0) {
                    columns += '<td style="color:red;" colspan=' + quoteFields.length + 1 + '>' + symbols[i].replace(';', ''); + '</td>'
                }
                else {
                    // var fieldID = FieldMapping[quoteFields[c]];
                    // columns += "<td></td>";
                }
            }
            $('#tablegrid  tbody').append("<TR >" + columns + "</TR>");
        }
    }
}

function RequestPreference() {
    informistHub.server.requestUserPreference(myPreference.DeviceId);
}

function UpdateMyListItems(strName, strDescription, strSymbol, strFields, strAction) {
    informistHub.server.updateMyList(strName, strDescription, strSymbol, strFields, strAction);
}

function setPreference(user_id, details) {
    const detailsJsonString = JSON.stringify(details);
    informistHub.server.updatePreference(user_id, detailsJsonString);
}


function sortResults(prop, asc) {
    arr.sort(function (a, b) {
        if (a.DateTime != "") {
            var c = new Date(a.DateTime);
            var d = new Date(b.DateTime);
            return c - d;
        }
    });
}

// function convertTo24Hour(time) {
//     var hours = parseInt(time.substr(0, 2));
//     if (time.indexOf('AM') != -1 && hours == 12) {
//         time = time.replace('12', '0');
//     }
//     if (time.indexOf('PM') != -1 && hours < 12) {
//         time = time.replace(hours, (hours + 12));
//     }
//     var tempTime = time.replace(/(AM|PM)/, '');
//     if (tempTime.indexOf(':') > 2) {
//         tempTime = tempTime.substr(1, tempTime.length - 1);
//     }
//     return tempTime;
// }

function convertTo24Hour(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    if (!isNaN(dateTime.getTime())) {
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    } else {
        return "Invalid date";
    }
}


function openSearchPanel(tableName, searchbox, user_id, access_token) {
    var activatedTable = tableName;
    var storedDataString = window.localStorage.getItem('requestNews');

    if (storedDataString) {
        try {
            var storedData = JSON.parse(storedDataString);
            if (Object.keys(storedData).length > 0) {
                for (var storedTableName in storedData) {
                    var storedInfo = storedData[storedTableName];
                    var strNewsWire = storedInfo.strNewsWire || '';
                    var strKeyword = storedInfo.strkeyword || '';
                    if (storedTableName === activatedTable) {
                        this.category = '';
                        this.mainwire = strNewsWire.replace('@', '');
                        requestMenuDetails(user_id, access_token, this.mainwire);
                    }
                }
            }
        } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
        }
    } else {
        RequestNews("@CMW", "", "newsTable");
        RequestNews("@CEW", "", "newsTable2");
    }
}



function getCompaniesName(access_token, searchText) {
    const baseUrl = 'http://172.17.81.34:8080/api/';
    const endpoint = 'categories/master_company/';
    console.log('Function: ' + searchText);
    const url = `${baseUrl}${endpoint}?name=${searchText}`;
    const headers = {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
    };

    fetch(url, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateDatalist(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
function updateDatalist(data) {
    console.log(data);
    const symbolList = document.getElementById('DataSymbol');
    symbolList.innerHTML = '';

    data.forEach(company => {
        const option = document.createElement('option');
        option.value = company.isin;
        option.textContent = company.name;
        symbolList.appendChild(option);
    });
}


function openModal(headline) {
    var modal = document.getElementById('newsModal');
    modal.style.display = 'block';
    var modalNewsHeader = document.getElementById('modalNewsHeader');
    modalNewsHeader.innerHTML = headline;
    var modalNewsContent = document.getElementById('modalNewsContent');
    var modifiedFulltext = storyResponse[0].fulltext;
    modalNewsContent.innerHTML = modifiedFulltext;
}

function closeModal() {
    var modal = document.getElementById('newsModal');
    modal.style.display = 'none';
}
function searchListPanel(data) {
    const searchData = data;
    const menuRequestDataString = localStorage.getItem('menuRequest');
    const menuRequestData = JSON.parse(menuRequestDataString);

    const searchListPanel = document.getElementById('searchListPanel');
    searchListPanel.innerHTML = '';

    if (menuRequestData[searchData]) {
        searchListPanel.disabled = false;
        const topLevelMenus = menuRequestData[searchData];
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Topics';
        searchListPanel.appendChild(defaultOption);

        for (const topLevelMenu of topLevelMenus) {
            if (topLevelMenu.child_menus && topLevelMenu.child_menus.length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = topLevelMenu.menu_name;

                for (const childMenu of topLevelMenu.child_menus) {
                    const option = document.createElement('option');
                    option.value = childMenu.menu_code;
                    option.textContent = childMenu.menu_name;
                    optgroup.appendChild(option);
                }

                searchListPanel.appendChild(optgroup);
            }
        }
    }

    else {

        const option = document.createElement('option');
        option.value = 'No data available';
        option.textContent = 'No data available';
        searchListPanel.appendChild(option);
    }
}





function searchMenuList() {
    this.permittedWiresString = window.localStorage.getItem("MainPermissionwires");
    this.MainUserPreference = window.localStorage.getItem("MainUserPreference");

    if (this.MainUserPreference) {
        try {
            const userPreferenceData = this.MainUserPreference;
            const permittedWires = JSON.parse(this.permittedWiresString);
            const packageCodes = [...new Set(permittedWires.map(item => item.subpackagecode))];

            this.permittedwires = packageCodes.join(',');
            this.allWirePackageCodes = packageCodes;

            const groupedNews = permittedWires.reduce((result, item) => {
                if (!result[item.subpackagecode]) {
                    result[item.subpackagecode] = [];
                }
                result[item.subpackagecode].push(item);
                return result;
            }, {});

            this.wirePermission = [];

            for (const packageCode in groupedNews) {
                if (groupedNews.hasOwnProperty(packageCode)) {
                    const newsItems = groupedNews[packageCode];
                    this.wirePermission.push(newsItems[0]);

                    this.wireMappings = this.wirePermission.reduce((result, item) => {
                        result[item.subpackagecode] = item.sub_package_name;
                        return result;
                    }, {});
                }
            }
            const selectElement = document.getElementById("SearchList");
            selectElement.innerHTML = "";
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.text = "Select Wire";
            selectElement.appendChild(defaultOption);

            for (const wire of this.wirePermission) {
                const optionElement = document.createElement("option");
                optionElement.value = wire.subpackagecode;
                optionElement.text = wire.sub_package_name;
                selectElement.appendChild(optionElement);
            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
}
