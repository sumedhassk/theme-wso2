/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* check if jquery is loaded */
if (typeof(jQuery) === 'undefined') {
    throw 'jQuery is required.';
}

var resTextRatio = 0.2;

(function($) {

    /* ========================================================================
     * import required files function
     * ======================================================================== */
    $.required = function(file, filetype){
        var markup = 'undefined';

        if (filetype == 'js'){ //if filename is a external JavaScript file
            markup = document.createElement('script');
            markup.setAttribute("type","text/javascript");
            markup.setAttribute("src", file);
        }
        else if (filetype == 'css'){ //if filename is an external CSS file
            markup = document.createElement('link');
            markup.setAttribute("rel", "stylesheet");
            markup.setAttribute("type", "text/css");
            markup.setAttribute("href", file);
        }

        if (typeof markup != 'undefined'){
            if (filetype == 'js') {
                $('html script[src*="theme-wso2.js"]').before(markup);
            }
            else if (filetype == 'css'){
                $('head link[href*="main.less"]').before(markup);
            }
        }
    };


    /* ========================================================================
     * add browser meta data to html tag
     * ======================================================================== */
     $.browser_meta = function(){
         $('html')
             .attr('data-useragent', navigator.userAgent)
             .attr('data-platform', navigator.platform)
             .addClass(((!!('ontouchstart' in window) || !!('onmsgesturechange' in window)) ? ' touch' : ''));
     };
    

    /* ========================================================================
     * loading function
     * ======================================================================== */
    $.fn.loading = function(action) {
        var html = '<div class="loading-animation"> \
                        <div class="logo"> \
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" \
                                 viewBox="0 0 14 14" enable-background="new 0 0 14 14" xml:space="preserve"> \
                                <path class="circle" stroke-width="1.4" stroke-miterlimit="10" d="M6.534,0.748C7.546,0.683,8.578,0.836,9.508,1.25 c1.903,0.807,3.339,2.615,3.685,4.654c0.244,1.363,0.028,2.807-0.624,4.031c-0.851,1.635-2.458,2.852-4.266,3.222 c-1.189,0.25-2.45,0.152-3.583-0.289c-1.095-0.423-2.066-1.16-2.765-2.101C1.213,9.78,0.774,8.568,0.718,7.335 C0.634,5.866,1.094,4.372,1.993,3.207C3.064,1.788,4.76,0.867,6.534,0.748z"/> \
                                <path class="pulse-line" stroke-width="0.55" stroke-miterlimit="10" d="M12.602,7.006c-0.582-0.001-1.368-0.001-1.95,0 c-0.491,0.883-0.782,1.4-1.278,2.28C8.572,7.347,7.755,5.337,6.951,3.399c-0.586,1.29-1.338,3.017-1.923,4.307 c-1.235,0-2.38-0.002-3.615,0"/> \
                            </svg> \
                            <div class="signal"></div> \
                        </div> \
                        <p>LOADING...</p> \
                    </div> \
                    <div class="loading-bg"></div>';

        return $(this).each(function(){
            if (action === 'show') {
                $(this).prepend(html).addClass('loading');
            }
            if (action === 'hide') {
                $(this).removeClass('loading');
                $('.loading-animation, .loading-bg', this).remove();
            }
        });
    };


    /* ========================================================================
     * extended popover function
     * ======================================================================== */
    $.fn.popover_extended = function(){
        var elem = $(this);

        /**
         * button click function
         */
        $(elem).click(function(e){
            e.preventDefault();
            $(elem).not(this).next('.popover').removeClass('in').hide();
            $(this).next('.popover').toggle().toggleClass('in');
        });

        /**
         * Bind popover hide function to the document.
         */
        $(document).bind('click', function(e) {
            if(($(e.target).closest(elem).length !== 1) && ($(e.target).closest('.popover').length === 0)){
                $(elem).next('.popover').removeClass('in').hide();
            }
        });
    };


    /* ========================================================================
     * input file browse function
     * ======================================================================== */
    $.file_input = function(){
        var elem = '.file-upload-control';
        return $(elem).each(function(){

            /**
             * input value change function
             */
            $(elem+' :file').change(function(){
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);
            });

            /**
             * button click function
             */
            $(elem+' .browse').click(function(){
                $(this).parents('.input-group').find(':file').click();
            });

            /**
             * file select function
             */
            $(elem+' :file').on('fileselect', function(event, numFiles, label) {
                var input = $(this).parents('.input-group').find(':text'),
                    log = numFiles > 1 ? numFiles + ' files selected' : label;

                if(input.length) {
                    input.val(log);
                } else {
                    if(log){
                        alert(log);
                    }
                }
            });

        });
    };


    /* ========================================================================
     * responsive text function
     * ======================================================================== */
    $.fn.res_text = function(compress, options){

        // Setup options
        var compressor = compress || 1,
            settings = $.extend({
                'minFontSize' : Number.NEGATIVE_INFINITY,
                'maxFontSize' : Number.POSITIVE_INFINITY
            }, options);

        return this.each(function(){

            /**
             * store the object
             */
            var $this = $(this);

            /**
             * resizer() resizes items based on the object width divided by the compressor * 10
             */
            var resizer = function() {
                $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };

            /**
             *  call once to set.
             */
            resizer();

            /**
             *  call on resize. Opera debounces their resize by default.
             */
            $(window).on('resize.fittext orientationchange.fittext', resizer);

        });

    };

    /* ========================================================================
     * datatables_extended function
     * ======================================================================== */
    $.fn.datatables_extended = function(settings){

        var elem = $(this);

        $(elem).DataTable(
            $.extend({},{
                bSortCellsTop: true,
                responsive: true,
                initComplete: function() {
                    this.api().columns().every(function () {

                        var column = this;
                        var filterColumn = $('.filter-row th', elem);

                        if (filterColumn.eq(column.index()).hasClass('select-filter')) {
                            var select = $('<select class="form-control"><option value="">All</option></select>')
                                .appendTo(filterColumn.eq(column.index()).empty())
                                .on('change', function () {
                                    var val = $.fn.dataTable.util.escapeRegex(
                                        $(this).val()
                                    );

                                    column
                                        .search(val ? '^' + val + '$' : '', true, false)
                                        .draw();
                                });

                            $(column).each(function () {
                                if ($(column.nodes()).attr('data-search')) {
                                    var titles = [];
                                    column.nodes().unique().sort().each(function (d, j) {
                                        var title = $(d).attr('data-display');
                                        if ($.inArray(title, titles) < 0) {
                                            titles.push(title);
                                            if (title !== undefined) {
                                                select.append('<option value="' + title + '">' + title + '</option>')
                                            }
                                        }
                                    });
                                }
                                else {
                                    column.data().unique().sort().each(function (d, j) {
                                        select.append('<option value="' + d + '">' + d + '</option>')
                                    });
                                }
                            });
                        }
                        else if (filterColumn.eq(column.index()).hasClass('text-filter')) {

                            var title = filterColumn.eq(column.index()).attr('data-for');
                            $(filterColumn.eq(column.index()).empty()).html('<input type="text" class="form-control" placeholder="Search for ' + title + '" />');

                            filterColumn.eq(column.index()).find('input').on('keyup change', function () {
                                column
                                    .search($(this).val())
                                    .draw();
                            });
                        }

                    });
                    $(".icon .text").res_text(resTextRatio);
                }
            },settings)
        );

        $('[data-click-event=toggle-list-view]').click(function(){
            $('#device-grid').toggleClass('grid-view');
        });
    };


}(jQuery));

$(document).ready(function(){
    //$.browser_meta();
    $.file_input();
    $('[data-click-event=popover]').popover_extended();
    $('.dropdown-menu input').click(function(e){
        e.stopPropagation();
    });
    $(".icon .text").res_text(resTextRatio);
    $('.select2').select2();

});

$(window).scroll(function(){
    $(".icon .text").res_text(resTextRatio);
});

$(document).bind('click', function() {
    $(".icon .text").res_text(resTextRatio);
});







