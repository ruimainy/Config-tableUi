; var idb_TabConfig = {
    singleModel: 1,
    multipleModel: 2
};

(function ($, win) {
    jQuery.fn.extend({
        idb_Table: function (c) {
            var idb = win.idb;
            var that = this;
            var container = $(this);
            var itemCheckSpanClass = idb.unit.getRandomString(5);

            var config = $.extend(true, {}, c);

            if (config.checkable != undefined && config.checkable.model == undefined) {
                config.checkable.model = idb_TabConfig.multipleModel;
            }

            var data = null;
            var index = 0,
                pageCount = 0;
            var expandHeadItemWidth = "47px";

            var tab = $('<table/>', {
                'class': 'tableCss'
            }).html("");
            if (config.tableWidth != undefined) {
                tab.css("width", config.tableWidth);
            }
            tab.appendTo(container);

            var tabHead = $('<thead/>', {}).html("");
            tabHead.appendTo(tab);

            var tabBody = $('<tbody/>', {}).html("");
            tabBody.appendTo(tab);

            var pageNav = null;
            if (config.pageNum != undefined) {
                pageNav = $('<div/>', {
                    'class': 'pageNumClass'
                }).html("");
                if (config.tableWidth != undefined) {
                    //限定Table宽度 下方导航栏需宽度减2 左右boader均为1
                    var navWidth = parseInt(config.tableWidth.substring(0, config.tableWidth.length - 2)) - 2;
                    pageNav.css("width", navWidth + "px");
                }
                pageNav.appendTo(container);
                pageNav.idb_PageNav({
                    "pageSize": config.pageNum.pageSize,
                    "navPageSize": 4
                });
                pageNav.css({
                    'display': 'none'
                });
                pageNav.setNavItemClickCb(pageIndexClick);
            }

            var _prevId = '';
            var _chker_all = null;

            var _sortOrderDesc = true, sortTitleColumn = null;

            createTitle();

            function reset() {
                _prevId = "";
                // _chker_all = null;
            }

            function bindingData() {
                reset();
                showPageData(index);
            }

            function showPageData(ind) {
                index = ind;
                // tabHead.empty();
                tabBody.empty();
                // createTitle();
                createBody(data[config.schema.data]);
                tabBody.children("tr:even").css("background", "#F9F9F9");
            }

            function createTitle() {
                var headerTr = $('<tr/>', {
                    'class': 'fontB tl'
                }).appendTo(tabHead);

                var title = config.Titles;
                var tds = "",
                    _w, _cField = [];

                if (config.checkable != undefined && config.checkable.title != undefined) {
                    var chkTd = generateHeaderItem(null, { "width": "41px", "class": "sysTitle" });
                    chkTd.appendTo(headerTr);

                    if (config.checkable.model == idb_TabConfig.multipleModel) {
                        _chker_all = $('<span/>', {
                            'class': 'chkempty',
                            'spanchk': 'chkerAllBtn'
                        })
                            .bind('click', function () {
                                $(this).toggleClass("chked");

                                if ($(this).hasClass("chked")) {
                                    container.find($("span[spanChk = chkItem_span_" + itemCheckSpanClass + "]")).addClass("chked");
                                } else {
                                    container.find($("span[spanChk = chkItem_span_" + itemCheckSpanClass + "]")).removeClass("chked");
                                }

                            });
                        _chker_all.appendTo(chkTd);
                    }
                };

                for (var i in title) {

                    var _titleSort = generateHeaderItem(title[i], { "width": (title[i].width != undefined) ? title[i].width : "" });
                    var _strtEvent = {
                        click: function () {

                            if ($(this).find('a').attr('field') != sortTitleColumn) {
                                _sortOrderDesc = true;
                                sortTitleColumn = $(this).find('a').attr('field');

                                $('<img/>', {})
                                    .attr('src', '/Library/idb/images/shunxu_up.png' ).css('margin-left','5px')
                                    .appendTo($(this));
                                $(this).siblings().find('img').remove();

                            } else {
                                _sortOrderDesc = (!_sortOrderDesc);
                            }

                            _sortOrderDesc == true
                                    ? $(this).find('img').attr('src', '/Library/idb/images/shunxu_up.png' ).css('margin-left','5px')
                                    : $(this).find('img').attr('src', '/Library/idb/images/shunxu_down.png' ).css('margin-left','5px');

                            config.sorted.sortby(sortTitleColumn, _sortOrderDesc);

                        }
                    };

                    _titleSort.bind(
                            title[i].sortable == true ? _strtEvent : _strtEvent = ''
                        ).appendTo(headerTr);

                    if (title[i].field != undefined) {
                        _cField.push(title[i].field);
                    }
                };

                if (config.expand != undefined) {
                    if (config.expand.title != undefined) {
                        generateHeaderItem(null, { "class": "sysTitle", "style": "width:" + expandHeadItemWidth }).appendTo(headerTr);
                    };
                };
            }

            function generateHeaderItem(content, tdC) {

                if (content != null) {

                    var _sortAbtn = $('<a/>', {
                        'style': 'float:left'
                    })
                                .attr('field', content.field != undefined ? _attr = content.field : _attr = '')
                                .html(content.title);
                    return $("<td/>", tdC).html(_sortAbtn);

                } else {
                    return $("<td/>", tdC).html(content);
                }
            }

            function expandFn(cellData) {
                var cellHtml = "";
                cellHtml = $('<td/>', {
                    'class': 'listTd'
                })
                    .css({
                        'background': '#f9f9f9',
                        'padding': '0',
                        'width': '47px'
                    })
                    .html(function () {
                        //var _cd = (cellData == undefined) ? '' : cellData[config.Titles[0].field];
                        var _cd = idb.unit.getRandomString(5);

                        var toggleA = $('<a/>', {
                            'id': "toggle_" + _cd,
                            'href': 'javascript:;',
                            'class': 'expandBtn expandClose'
                        })
                            .bind('click', function () {
                                var _self = $(this);
                                var _parentTr = _self.parent().parent();
                                var _conspan = function () {
                                    var ct = parseInt(config.Titles.length);
                                    if (config.expand != undefined) {
                                        ct++;
                                    };
                                    if (config.checkable != undefined) {
                                        ct++;
                                    };
                                    return ct;
                                }();

                                if (_parentTr.siblings(".insertClass").length > 0) {
                                    _parentTr.siblings(".insertClass").remove();
                                    $(".expandBtn").removeClass('expandOpen').addClass('expandClose');
                                }

                                if (_self.attr('id') != _prevId) {
                                    var _creTd = $('<tr>', {
                                        "class": "insertClass"
                                    });
                                    _creTd.append($('<td>', {
                                        "colspan": _conspan
                                    }).css({ 'text-align': 'left', 'padding': '0' }));

                                    _parentTr.after(_creTd);
                                    _self.removeClass().addClass('expandOpen expandBtn');
                                    _prevId = _self.attr("id");

                                } else {
                                    _prevId = "";
                                    return;
                                }

                                _creTd.find('td').html("Loading.......<br/><br/>");

                                var expandObj = config.expand.expandDiv(cellData);

                                _creTd.find('td').html("");

                                if (expandObj instanceof jQuery) {
                                    $(_creTd).find('td').append(expandObj);
                                } else {
                                    _creTd.find('td').html(expandObj);
                                };

                                if (config.expand.afterExpand != undefined) {
                                    config.expand.afterExpand(cellData);
                                }
                            });
                        return toggleA;
                    });
                return cellHtml;
            }

            function chkboxSelect(n) {
                var chkabout = "";
                chkabout = $('<td/>', {})
                    .css({
                        'background': '#f9f9f9',
                        'height': '41px',
                        'line-height': '41px;',
                        'padding': '0'
                    })
                    .html(function () {
                        var _span = $('<span/>')
                            .attr({
                                spanChk: 'chkItem_span_' + itemCheckSpanClass,
                                inx: n,
                                "class": 'chkempty'
                            })
                            .bind('click', function () {
                                if (config.checkable.model == idb_TabConfig.singleModel) {
                                    $(this).addClass("chked").parent().parent().siblings().children().children().removeClass('chked');
                                    if (config.checkable.checkedFn != undefined) {
                                        config.checkable.checkedFn(data[config.schema.data][n]);
                                    }
                                } else if (config.checkable.model == idb_TabConfig.multipleModel) {
                                    $(this).toggleClass("chked");
                                    autoChkAllSelect();
                                } else {
                                    alert("FFFFFFFFFFFFFFFFFFF");
                                }
                            });
                        return _span;
                    });
                return chkabout;
            }

            function autoChkAllSelect() {
                var _ck = container.find($("[spanchk = chkItem_span_" + itemCheckSpanClass + "]"));
                // console.log(_ck.length)
                for (var i = 0, j = _ck.length; i < j; i++) {
                    if (!_ck.eq(i).hasClass("chked")) {
                        container.find($("[spanchk = chkerAllBtn]")).removeClass("chked");
                        return;
                    }
                };
                container.find($("[spanchk = chkerAllBtn]")).addClass("chked");
            }

            function createBody(displayData) {
                var maxDataCount = 0;

                if (config.pageNum != undefined) {
                    maxDataCount = (displayData.length < config.pageNum.pageSize)
                        ? displayData.length
                        : config.pageNum.pageSize;

                    if (config.pageNum.needAutoFill != undefined && config.pageNum.needAutoFill == true) {
                        maxDataCount += (maxDataCount < config.pageNum.pageSize)
                        ? (config.pageNum.pageSize - maxDataCount)
                        : 0;
                    }
                } else {
                    maxDataCount = displayData.length;
                }

                for (var i = 0; i < maxDataCount; i++) {
                    var tr = $('<tr/>', {});

                    if (config.checkable != undefined) {
                        if (i < displayData.length) {
                            chkboxSelect(i).appendTo(tr);
                        } else {
                            $('<td/>', {}).appendTo(tr);
                        }
                    }
                    for (var j = 0; j < c.Titles.length; j++) {
                        $('<td/>', {}).html(function () {
                            if (config.Titles[j].cellFn != undefined) {
                                if (c.Titles[j].field != undefined) {
                                    if (displayData[i] != undefined) {
                                        return c.Titles[j].cellFn(displayData[i][c.Titles[j].field], displayData[i]);
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return c.Titles[j].cellFn(displayData[i]);
                                }
                            } else if (c.Titles[j].field != undefined) {
                                if (displayData[i] != undefined) {
                                    $(this).attr('title', displayData[i][c.Titles[j].field]);
                                    return displayData[i][c.Titles[j].field];
                                } else {
                                    return null;
                                }
                            } else {
                                alert('error');
                            }
                            ;
                        }).appendTo(tr);
                    }
                    if (config.expand != undefined) {
                        if (i < displayData.length) {
                            expandFn(displayData[i]).appendTo(tr);
                        } else {
                            $('<td/>', {}).appendTo(tr);
                        }
                    }

                    tr.appendTo(tabBody);
                }
            }

            function pageIndexClick(ind) {
                index = ind;
                if (config.pageNum != undefined && config.pageNum.indexChangeCb != undefined) {
                    config.pageNum.indexChangeCb(index, config.pageNum.pageSize);
                }
            }

            this.setData = function (ind, d) {
                if (_chker_all != null) {
                    _chker_all.removeClass("chked");
                }
                index = parseInt(ind);
                data = d;

                if (pageNav != null) {
                    d[config.schema.total] > 0
                                ? pageNav.show()
                                : pageNav.hide();
                }

                if (config.pageNum != undefined) {
                    pageCount = parseInt(d[config.schema.total] / config.pageNum.pageSize);
                    if ((d[config.schema.total] % config.pageNum.pageSize) != 0) {
                        pageCount++;
                    };
                }

                bindingData();

                if (config.pageNum != undefined) {
                    pageNav.setData(d[config.schema.total], ind);
                }
            };

            this.refersh = function () {
                bindingData();
            };

            this.getData = function () {
                return data;
            };

            this.width = function () {
                return container.width();
            };

            this.getCheckedData = function () {
                var dDarr = [],
                    newDataArr = [];
                var chkLength = $("[spanChk = chkItem_span_" + itemCheckSpanClass + "]");

                for (var i = 0; i < chkLength.length; i++) {
                    if (chkLength.eq(i).hasClass("chked")) {
                        dDarr.push(chkLength.eq(i).attr("inx"));
                    }
                }
                for (var j = 0; j < dDarr.length; j++) {
                    newDataArr.push(data.Data[dDarr[j]]);
                }
                return newDataArr;
            };

            this.closeExpand = function () {

                var _t = tabBody.children('tr'), i = 0;
                for (; i < _t.length ; i++) {
                    if (_t.eq(i).hasClass('insertClass')) {
                        _t.eq(i).remove();
                        _t.eq(i - 1).find('a.expandBtn').removeClass('expandOpen').addClass('expandClose');
                        break;
                    }

                }


                // var expandItem = container.find(".insertClass");
                // if (expandItem.length > 0) {
                //     expandItem.eq(0).remove();
                //     container.children(".expandBtn").removeClass('expandOpen').addClass('expandClose');
                // }

            };

            return this;
        },
        idb_PageNav: function (c) {
            var that = this;
            var container = this;
            var pageNumRoot = null;
            var previewNavPageBtn, nextNavPageBtn, showPreviewBtn, showNextBtn, pageSizeTxt;
            var totalItemCount = 0;
            var navItemCount;
            var pageSize = c.pageSize == undefined ? 4 : parseInt(c.pageSize);
            // console.log(c.pageSize)

            var pageIndex = 1;
            var selectedNavIndex = 1;
            var navPageIndex = 1;

            var navPageSize = c.navPageSize == undefined ? 3 : parseInt(c.navPageSize);
            var navPageCount;
            var navItemClickCb = null;
            var start, end;

            container.html("");
            generateContent();

            function generateContent() {
                container.empty();

                previewNavPageBtn = $("<a/>", {
                    'class': 'borderRadius RadiusPrevBtn',
                    'style': 'margin-left:22px;'
                });
                previewNavPageBtn.bind("click", showPreview);
                previewNavPageBtn.appendTo(container);

                showPreviewBtn = $("<a/>", {
                    'class': 'borderRadius openBtn'
                });
                showPreviewBtn.bind("click", showPreviewFn);
                showPreviewBtn.appendTo(container);

                pageNumRoot = $("<div/>", {
                    "style": "float:left",
                    "class": idb.unit.getRandomString(5)
                }).html("");
                pageNumRoot.appendTo(container);

                showNextBtn = $("<a/>", {
                    'class': 'borderRadius downBtn'
                });
                showNextBtn.bind("click", showNextFn);
                showNextBtn.appendTo(container);

                nextNavPageBtn = $("<a/>", {
                    'class': 'borderRadius RadiusNextBtn'
                });
                nextNavPageBtn.bind("click", showNext);
                nextNavPageBtn.appendTo(container);

                pageSizeTxt = $("<p/>", {
                    'style': 'float:right;margin:5px 46px 0 0;padding:0;'
                })
                .appendTo(container);


            }


            function showPreviewFn() {

                if ((selectedNavIndex - 1) < 1) {
                    return;
                }

                if ((selectedNavIndex - 1) < start) {
                    showNext();
                }

                pageNumRemoveClass(selectedNavIndex);
                selectedNavIndex--;
                pageNumAddClass(selectedNavIndex);

                if (navItemClickCb != null) {
                    navItemClickCb(selectedNavIndex);
                }
            }

            function showNextFn() {

                if ((selectedNavIndex + 1) > navItemCount) {
                    return;
                }

                if ((selectedNavIndex + 1) > end) {
                    showNext();
                }

                pageNumRemoveClass(selectedNavIndex);
                selectedNavIndex++;
                pageNumAddClass(selectedNavIndex);

                if (navItemClickCb != null) {
                    navItemClickCb(selectedNavIndex);
                }
            }

            function generatePageNum() {
                pageNumRoot.empty();

                start = (navPageIndex - 1) * navPageSize + 1;
                end = (navPageIndex * navPageSize <= navItemCount)
                                                    ? navPageIndex * navPageSize
                                                    : navItemCount;
                var aIndex;
                for (var i = start; i <= end; i++) {
                    $("<a/>", {
                        "index": i,
                        "href": "javascript:;",
                        'class': 'borderRadius'
                    }).html(i).bind("click", function () {
                        selectedNavIndex = parseInt($(this).attr("index"));
                        pageNumAddClass(selectedNavIndex)
                        if (navItemClickCb != null) {
                            pageIndex = selectedNavIndex;
                            navItemClickCb(pageIndex);
                        };
                        pageToPageNum(selectedNavIndex);
                    }).appendTo(pageNumRoot);
                };
                pageNumAddClass(selectedNavIndex);
                pageToPageNum(selectedNavIndex);
            }

            function pageToPageNum(inx) {
                if (inx == undefined) {
                    inx = 1;
                }
                var aTo = (inx - 1) * c.pageSize + 1;
                var toB = (inx - 1) * c.pageSize + c.pageSize;
                if (totalItemCount < toB) {
                    toB = totalItemCount;
                }
                pageSizeTxt.html(aTo + '-' + toB + '个/' + totalItemCount + '个');
            }


            function pageNumAddClass(n) {
                var aGroup = pageNumRoot.find('a.borderRadius');
                aGroup.removeClass("borderRadiusSelectBg");

                for (var i = aGroup.length - 1; i >= 0; i--) {
                    if ($(aGroup[i]).attr("index") == n) {
                        $(aGroup[i]).addClass('borderRadiusSelectBg');
                        break;
                    }
                };
            }

            function pageNumRemoveClass(n) {
                var aGroup = pageNumRoot.find('a.borderRadius');
                aGroup.removeClass("borderRadiusSelectBg");
                //$(aGroup[index = (n - 1)]).removeClass('borderRadiusSelectBg');

                for (var i = aGroup.length - 1; i >= 0; i--) {
                    if ($(aGroup[i]).attr("index") == n) {
                        $(aGroup[i]).addClass('borderRadiusSelectBg');
                        break;
                    }
                };
            }

            function showPreview() {

                if (totalItemCount == 0) return;

                navPageIndex--;
                if (navPageIndex <= 0) {
                    navPageIndex = 1;
                }

                generatePageNum();
            }

            function showNext() {

                if (totalItemCount == 0) return;

                navPageIndex++;
                if (navPageIndex >= navPageCount) {
                    navPageIndex = navPageCount;
                }
                generatePageNum();
            }

            this.setData = function (dataTotalCount, indx) {
                totalItemCount = dataTotalCount;
                selectedNavIndex = indx;

                navPageIndex = 1;
                while ((indx - navPageSize) > 0) {
                    indx -= navPageSize;
                    navPageIndex++;
                }

                navItemCount = parseInt(dataTotalCount / pageSize);
                if (dataTotalCount % pageSize != 0) {
                    navItemCount++;
                }

                navPageCount = parseInt(navItemCount / navPageSize);
                if (navItemCount % navPageSize != 0) {
                    navPageCount++;
                }

                if (that.getStartItemIndex < totalItemCount) {
                    that.reset();
                }

                generatePageNum();

                // console.log( dataTotalCount + ":" + indx + ":" + c.pageSize );
                if (dataTotalCount < ((indx - 1) * c.pageSize)) {
                    Math.floor(dataTotalCount / c.pageSize) == 0
                        ? indx = 1
                        : indx = Math.floor(dataTotalCount / c.pageSize);

                    if (navItemClickCb != null) {
                        pageIndex = indx;
                        navItemClickCb(pageIndex);
                    }
                }
            };

            this.setNavItemClickCb = function (cb) {
                navItemClickCb = cb;
            };

            this.getStartItemIndex = function () {
                return (pageIndex - 1) * pageSize + 1;
            };

            this.getEndItemIndex = function () {
                return (pageIndex * pageSize < totalItemCount) ? pageIndex * pageSize : totalItemCount;
            };

            this.reset = function () {
                selectedNavIndex = 1;
                pageIndex = 1;
                navPageIndex = 1;

                generatePageNum();
            };

            return this;
        }
    });
})(jQuery, window);