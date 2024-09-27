jQuery(function($) {
    'use strict';
    $(document).ready(function() {
        var toggleDesCount = 0;
        var setCountNumber = 0;
        var plugin_url = WPT_DATA.plugin_url;
        var include_url = WPT_DATA.include_url;
        var content_url = WPT_DATA.content_url;
        var myArgs = false;
        $(document.body).on('wpt_fragents_loaded',function(Event,args){
            myArgs = args;
        });

        $(document.body).on('change','.product-type-variable .wpt-mini-filter select',function(){
            var key = $(this).data('key');
            loadVariableMiniFilter(key);
        });

        loadVariableMiniFilter(false);
        function loadVariableMiniFilter(clicked_on_fiter){
            $('.product-type-variable .wpt-mini-filter select').each(function(){
                var selected = '';
                var thisSelect = $(this);
                var currentValue = thisSelect.val();
                if(currentValue !== '' && $(this).hasClass('filter_select_' + clicked_on_fiter)){
                    return;
                }
                var key = $(this).data('key');
				var customizedKey = key.replace(/[^A-Z0-9]+/ig, "_");
                var label = $(this).data('label');
                var Arr = {};
                var targetRowClass = 'tr.wpt-row.visible_row';
                if(clicked_on_fiter){
                    targetRowClass = 'tr.wpt-row.visible_row';
                    // if(clicked_on_fiter == key) return;
                    thisSelect = $(this).html('<option value="">' + label + '</option>');
                }
                var selectorKey = key.replace(' ', ".");
                var elSelector = targetRowClass + ' .wpt_' + selectorKey + '>div';
                $(elSelector).each(function(){
                    var valkey = $(this).text();
                    valkey = $.trim(valkey);
                    var newvalkey = valkey.replace(/[^A-Z0-9]+/ig, "_");
                    newvalkey = customizedKey + '_' + newvalkey;
                    if(valkey == '' || valkey == ' ') return;
                    Arr[valkey]=valkey;
                    $(this).closest('tr.wpt-row').addClass(newvalkey).addClass('filter_row');
                });
                Object.keys(Arr).forEach(function(item) {
                    var realKey = item.replace(/[^A-Z0-9]+/ig, "_");
                    realKey = customizedKey + '_' + realKey;
                    if(currentValue == realKey){
                        selected = 'selected';
                    }
                    
                    thisSelect.append('<option value="' + realKey + '" ' + selected + '>' + item + '</option>');
                });
                
            });

            /**
             * This is for 'Advance Cascade Filter' 
             * If cascade filter is on then all data is load which is not the perpose of mini filter
             * this fumction will load only visible product data
             */
            setTimeout(function(){
                if(typeof $('select.filter_select.filter').select2 !== 'function') return;

                // Turn of this for now. We have to fix it 
                // $('select.filter_select.filter').select2();
            },500); 
        }
        
        $(document.body).on('wpt_ajax_loaded',function(){

            //Audio issue has been solved by Saiful
            var audioType = $('td.type_audio').length;
            if(audioType > 0){
                $.getScript("https://code.jquery.com/jquery-1.11.2.min.js");
                $.getScript(plugin_url + "/woo-product-table-pro/assets/js/audio/player.js");
                $.getScript(plugin_url + "/woo-product-table-pro/assets/js/audio/handle-media-player.js");

            }

            var audioPlayer;
            setTimeout(function(){
                
                audioPlayer = $('.wpt_audio_player').length;
                if(audioPlayer > 0){

                    $.getScript(plugin_url + "/woo-product-table-pro/assets/js/musicplayer.js");
                    $.getScript(plugin_url + "/woo-product-table-pro/assets/js/audio.js");
                }
            },500);
            loadVariableMiniFilter(false);

        });

        /**
         * footer cart animation
         * Cart icon spining on footer mini cart 
         * and blur effect on footer cart
         */
         function footerCartAnimation(){
            $('a.wpt-view-n .wpt-bag').addClass('wpt-spin4 animate-spin');
            $('.wpt-new-footer-cart').addClass('wpt-fcart-anim');
            $('.wpt-fcart-coll-expand').addClass('animated');            
        }
        var config_json = $('#wpt_table').data('config_json');
        if ( typeof config_json === 'undefined' ){
            return false;
        }
                
        $('body').on('click','.wpt_click_to_view', function(){
            $(this).closest('.toggle_on').toggleClass('toggle-show');
            $(this).closest('.toggle_on').find('.item_inside_cell,.col_inside_tag').fadeToggle('medium');
        });
        
        
        //Select2
        if(typeof $('.wpt-wrap .search_select').select2 === 'function' && $('.wpt-wrap .search_select').length > 0 && WPT_DATA.select2 !== 'disable' ){
            $('.wpt-wrap .search_select.cf_query.cf_query_multiple').select2({//.query
                placeholder: WPT_DATA.search_select_placeholder,
                tags: true,
                allowClear: true,
            });
            $('.wpt-wrap .search_select.cf_query.cf_query_').select2();

        }
        
        var qucit_qty_empt = WPT_DATA.quick_qty_empty_value;

        /****************** NEW CODE *********************/
        $(document).on('wc_fragments_refreshed',function(){
            setCartCount();
            // quickQtyWiseTotalZero();
        });
        $(document).on('wpt_query_done',function(){
            setZeroAndCartCount();
            quickQtyWiseTotalZero();
        });
        $(document).on('wpt_ajax_loaded',function(){
            setZeroAndCartCount();
            quickQtyWiseTotalZero();
        });

        $(document).on('wpt_paginate_done',function(){
            setZeroAndCartCount();
            quickQtyWiseTotalZero();
        });
        
        setZeroAndCartCount();
        quickQtyWiseTotalZero();

        function quickQtyWiseTotalZero(){
            setTimeout(function(){
                $('.item_inside_cell.wpt_quick_qty,.col_inside_tag.quick_qty').each(function(){
                    var thisInput = $(this).find('.quantity_cart_plus_minus');
                    var value = parseInt(thisInput.val());
                    if(value > 0){
                        thisInput.trigger('change');
                    }else{
                        var thisTotal = thisInput.closest('tr.wpt_row').find('.wpt_total_item');
                        var decimalSep = thisTotal.data('price_decimal_separator');
                        thisTotal.find('strong').html("0" + decimalSep + "00");
                    }
                });
            },1000);
            
        }

        function setZeroAndCartCount(){
            if($('.quantity_cart_plus_minus').length < 1){
                return;
            }
            setZeroInput();
            
        }
        function setZeroInput(){
            $('.quantity_cart_plus_minus').val(qucit_qty_empt);
            $('.quantity_cart_plus_minus').attr('min',0);
        }
        
        function setCartCount(){
            if($('.quantity_cart_plus_minus').length < 1){
                return;
            }
            setCountNumber++;

            if(setCountNumber == 1 && myArgs){
                setTimeout(function(){
                    $.each( myArgs.per_items, function( key, value ) {
                        if('string' === typeof key){
                            $( '#product_id_' + key + ' input.input-text.qty.text' ).val( value.quantity );
    
                        }
                    });
                    setCountNumber = 0;
                }, 1200);
            }
        }
        
        $(document).on('wc_fragments_refreshed',function(){
            setCartCount();
        });
        $(document).on('wc_fragments_refresh',function(){
            setCartCount();
        });
        $(document).on('removed_from_cart',function(){
            setCartCount();
        });
        
        
        
        $(document).on('keyup','.quantity_cart_plus_minus', updateQtyByInputChange);
        $('body').on('change','.quantity_cart_plus_minus', updateQtyByInputChange);
        function updateQtyByInputChange(){
            var quick_qty_length = $('.quantity_cart_plus_minus').length;
            if(quick_qty_length < 1){
                return;
            }
            footerCartAnimation();
            var qty_val = $(this).val();
            var product_id = $(this).closest('tr').data('product_id');
            var loader_html = "<span class='wpt-loader-quick-cart wpt-loader-" + product_id + "' ></span>";
            $(this).closest('.quick_qty,.wpt_quick_qty').append(loader_html);
            let data = {
                action:         'wpt_quckcart_ajax_update',
                qty_val:    qty_val,
                product_id:product_id,
            };
            $( document ).trigger( 'quick_qty_button_changing', data );
            $.ajax({
                type: 'POST',
                url: WPT_DATA.ajax_url,
                data: data,
                complete: function(){
                        $( document.body ).trigger( 'updated_cart_totals' );
                        $( document.body ).trigger( 'wc_fragments_refreshed' );
                        $( document.body ).trigger( 'wc_fragments_refresh' );
                        $( document.body ).trigger( 'wc_fragment_refresh' );

                        $('.wpt-loader-' + product_id ).remove();
                        $( document ).trigger( 'quick_qty_button_changed', data );

                },
                success: function(response) {
                    var fragments = response.fragments;
                    try{
                        /******IF NOT WORK CART UPDATE, JUST ADD A RIGHT SLASH AT THE BEGINING OF THIS LINE AND ACTIVATE BELLOW CODE***********/
                        if ( fragments ) {
                            $.each( fragments, function( key, value ) {
                                if('string' === typeof key && typeof $( key ) === 'object'){
                                    $( key ).replaceWith( value );

                                }
                            });
                        }
                    }catch(e){
                        //e:getMessage();
                    }
                },
                error: function() {
                    console.log("something went wrong when try to change by quick qty");
                },
            });
            if( qty_val == 0 ){
                $(this).val(qucit_qty_empt);
            }

        }


        //Advance search cascade filter on ajax
        $(document.body).on('change', '.search_box_wrapper select.search_select.query', function () {

            let selector = $(this).attr('id');
            $(this).closest('.wpt-wrap').attr('current_selector', selector);
        });


        $('div.wpt-wrap table#wpt_table').each(function(){

            //On first load, I have checked it first time to reduce loading speed
            if(config_json.advance_cascade_filter !== 'on'){
                return;
            }

            var table_id = $(this).data('temp_number');

            var founded_searchbox = $("#table_id_" + table_id + " .wpt-search-full-wrapper .search_single.search_single_texonomy").length;
            if(founded_searchbox < 1) return;

            var data = {
                table_id: table_id,
            }
            cascadeFilteringSelect( data );
        });

        

        $(document.body).on('wpt_ajax_load_data', function (e, data) { //wpt_query_done it's an another trigger
            if( config_json.advance_cascade_filter !== 'on' ){
                return;
            }
            var table_id = data.table_id;
            var founded_searchbox = $("#table_id_" + table_id + " .wpt-search-full-wrapper .search_single.search_single_texonomy").length;
            if(founded_searchbox < 1) return;

            cascadeFilteringSelect( data );
        });
        
        // $(document.body).on('click','.cascade-filter-reset-btn',function(e){
        //     e.preventDefault();
        //     let temp_number = $(this).data('temp_number');
        //     let thisResetButton = $(this);
            
        //     $('#table_id_' + temp_number + ' div.search_box_wrapper select.search_select').each(function(){
        //         $(this).val($(this).find('option:first').val());
        //         $(this).find('option:first').attr('selected','selected')
        //     });
        //     setTimeout(function(){
        //         $('#table_id_' + temp_number + ' div.search_box_wrapper select.search_select').trigger('change');
        //         thisResetButton.remove();
        //     },100);

        //     // var targetTableArgs = $('div#table_id_' + temp_number + ' table#wpt_table').attr('data-data_json');
        //     // try{
        //     //     targetTableArgs = JSON.parse(targetTableArgs);
        //     //     cascadeFilteringSelect( targetTableArgs );
        //     //     //$(this).remove();
        //     // }catch(e){
        //     //     console.log(e);
        //     // }


        // });

        function cascadeFilteringSelect( args ){

            if(config_json.advance_cascade_filter !== 'on'){
                return;
            }
            let table_id = args.table_id;
            let currntTax = $('#table_id_' + table_id + ' .search_box_wrapper select.search_select.query');
            let taxs = new Array();
            let values = new Array();
            currntTax.each(function (i, a) {
                let key = $(this).data('key');
                let id = $(this).attr('id');
                let value = $(this).val();

                taxs[i] = key;
                values[id] = value;
            });

            let query = args.args;
            let class_name = 'cascade-filtering';
            currntTax.addClass(class_name);
            let ajax_url = WPT_DATA.ajax_url;
            var data = {
                action: 'wpt_cascade_filter',
                data: args,
            }
            $.ajax({
                url: ajax_url,
                method: 'POST',
                data: data,
                success: function (result) {
                    let select = result;
                    if (select !== '') {
                        try {
                            // let select = JSON.parse(result);

                            $.each(select, function (index, value) {
                                let selector = 'select#' + index + '_' + table_id;
                                let prevValue = values[index + '_' + table_id];

                                let myTargetSelector = $('#table_id_' + table_id).attr('current_selector');
                                myTargetSelector = 'select#' + myTargetSelector;
                                let firstOptionValue = $(selector).find('option').first().html();
                                let html = '<option value="">' + firstOptionValue + '</option>';
                                $.each(value, function (i_index, i_value) {
                                    let option_selected = '';
                                    if (prevValue === i_index) {
                                        option_selected = 'selected';
                                    }
                                    html += "<option value='" + i_index + "' " + option_selected + ">" + i_value + "</option>";
                                });
                                if (selector !== myTargetSelector) {
                                    //$(selector).html(html);
                                }
                                $(selector).html(html);
                            });
                        } catch (error) {

                        }
                    }

                    currntTax.removeClass(class_name);
                },
                failed: function () {

                }


            });

        }
        
        //Toggle Descriptions item
        $(document.body).on("wpt_ajax_loaded", function () {
            ToggleDescriptionItem();
            
            
        });
        ToggleDescriptionItem();
        function ToggleDescriptionItem(){
            $("td.td_or_cell.wpt_toggle_description").each(function(){
                let button = $(this).find('button.show-more-button.button'); //previous -  $(this).find('.col_inside_tag.toggle_description button.show-more-button.button');
                let colspan = button.data("col_count");
                let product_id = button.data("product_id");
                let thisRow = $(this).closest("tr.wpt_row");

                let thisTd = $(this).closest("td.wpt_toggle_description");

                let htmlData = "",eachLintHtml;
                thisTd.find("div.item_inside_cell").not('.wpt_toggle_description').each(function(){
                    eachLintHtml = $(this).html();
                    $(this).remove();
                    if( typeof eachLintHtml !== 'undefined' ){
                        htmlData += "<div class='inside_toggle_description'>" + eachLintHtml + "</div>";
                    }
                     
                });

                let adiClass = "visible_row wpt_row no_filter";
                let finalHtml = "<tr id='show-row-id-" + product_id + "' style='display:none;' class='show-additional-row " + adiClass + "'><td colspan='" + colspan + "'>" + htmlData + "</td></tr>";
                thisRow.after(finalHtml);
            });

            $(document.body).on('click','tr.visible_row.wpt_row.wpt-row td.wpt_toggle_description .show-more-button',function(){
                if( toggleDesCount !== 0 ){
                    return;
                }
                toggleDesCount++;
                setTimeout(function(){
                    toggleDesCount = 0;
                },400);

                let product_id = $(this).data("product_id");
                $(this).toggleClass("button-active");
                let open_text = $(this).data("open_text");
                let close_text = $(this).data("close_text");
                let targetEl = $("#show-row-id-" + product_id);
                let showAttr = $(this).attr("show");
                if(showAttr == "yes"){
                    var open_icon = '<i class="wpt-note"></i>'
                    $(this).html( open_icon + open_text);
                    $(this).attr("show", "now");
                    targetEl.hide();
                }else{
                    var close_icon = '<i class="wpt-cancel-circled"></i>';//wpt-cancel-circled
                    $(this).html(close_icon + close_text);
                    $(this).attr("show", "yes");
                    targetEl.show();
                }
            });
            
        }
        $(window).load(function() {
            var galarry_thumbs = $('.wpt_gallery_thumbnails').length;
            if(galarry_thumbs < 1) return;
            $('.wpt_gallery_thumbnails').each(function (){
                var findrow = $(this).closest('tr.wpt_row');
                var product_id = findrow.attr('data-product_id');
                var thumb_id = $(this).find('#wpt_thumb_'+product_id);
                var gallery_id = $(this).find('#wpt_gallery_'+product_id);
                thumb_id.flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemWidth: 40,
                    itemMargin: 5,
                    asNavFor: gallery_id,
                });
                gallery_id.flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    sync: thumb_id
                });
            });
        });
    });
});