/*!
 * AdSense Wrapper v0.1.1
 *
 * Copyright 2011, Brent O'Connor (http://www.epicserve.com/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
var adsense_wrapper = function($) {

    var orig_document_write = document.write;
    var ad_slots_added = false;
    var _ad_slot_arr = [];
    var _url_patterns = [];
    var _current_uri = location.pathname;
    var fill_ad_slot_timeouts = [];
    var timeout_for_buffer = 700;
    var timeout_for_document_write_reset = 0;
    var ad_number = 0;
    var timeout_count = 0;
    var pub_id = "";

    /**
     * Adds ad slots using GA_googleAddSlot and GA_googleFetchAds
     */
    function add_ad_slots(ad_slot_arr) {
        $.each(ad_slot_arr, function(k, v) {
            var ad_slot_arr = v[1];
            GA_googleAddSlot(pub_id, ad_slot_arr);
        });
        GA_googleFetchAds();
        ad_slots_added = true;
    }

    /**
     * Finds the current ad slot from the ad_slot_arr that matches the
     * jquery_elem_selector
     */
    function get_ad_slot(jquery_elem_selector, ad_slot_arr) {
        var ad_slot = "";
        $.each(ad_slot_arr, function(k, fill_ad_arr) {
            if (fill_ad_arr[0] == jquery_elem_selector) {
                ad_slot = fill_ad_arr[1];
                return false; // break the loop
            }
        });
        return ad_slot;
    }

    /**
     * Finds the current ad slot arr by iterating through url_patterns and
     * then returns the ad_slot_arr from the url_pattern that matches the
     * current URL
     */
    function get_ad_slot_arr() {
        var ad_slot_arr = [];
        $.each(_url_patterns, function(k, arr) {
            var url_pattern = new RegExp(arr[0], "gi");
            if (_current_uri.match(url_pattern) !== null) {
                ad_slot_arr = arr[1];
                return false; // break the loop
            }
        });
        return ad_slot_arr;
    }

    return {

        doc_write_buffer: "",

        fill_ad_slot: function(jquery_elem_selector, ad_slot) {
            var self = this;
            timeout_for_document_write_reset = timeout_for_document_write_reset + timeout_for_buffer;
            timeout_count++;
            fill_ad_slot_timeouts['ad'+timeout_count] = window.setTimeout( function() {
                self.doc_write_buffer = "";
                GA_googleFillSlot(ad_slot);
                script_url = self.doc_write_buffer.replace(/<script src\s*=\s*"?(.+?)"?>.+/gi, "$1");
                self.doc_write_buffer = "";
                $.getScript(script_url, function() {
                    ad_number++;
                    if (self.doc_write_buffer.match('iframe') !== null) {

                        // handle things differently for IE
                        $(jquery_elem_selector).html(self.doc_write_buffer);

                    } else {

                        // handle buffer for chrome, safari and Firefox
                        pattern = new RegExp("(<div[^>]+>[^<]+<\\/div>)\\s*<script>([^<]+)<\\/script>", "mi");
                        match = self.doc_write_buffer.match(pattern);
                        div = match[1]
                        script = match[2]
                        $(jquery_elem_selector).html(div);
                        eval(script);

                    }
                });
            }, timeout_for_document_write_reset);
        },

        fill_ad_slots: function(ad_slot_arr) {
            document.write = function(str) {
                self.doc_write_buffer += str;
            };
            var self = this;
            add_ad_slots(ad_slot_arr);
            $.each(ad_slot_arr, function(k, fill_ad_arr) {
                self.fill_ad_slot(fill_ad_arr[0], fill_ad_arr[1]);
            });
            t=window.setTimeout( function() {
                document.write = orig_document_write;
            }, timeout_for_document_write_reset+timeout_for_buffer);
        },

        /* Fill the ad slot while the page is loading */
        fill_ad_slot_at_runtime: function(jquery_elem_selector) {
            var ad_slot_arr = (_ad_slot_arr.length === 0) ? get_ad_slot_arr() : _ad_slot_arr;
            if (ad_slots_added == false) {
                add_ad_slots(ad_slot_arr);
            }
            var ad_slot =  get_ad_slot(jquery_elem_selector, ad_slot_arr);
            GA_googleFillSlot(ad_slot);
        },

        set_pub_id: function(ad_pub_id) {
            pub_id = ad_pub_id;
        },

        set_url_patterns: function(url_patterns) {
            _url_patterns = url_patterns;
        },

        set_ad_slots: function(ad_slot_arr) {
            _ad_slot_arr = ad_slot_arr;
        },

        init: function(ad_pub_id, url_patterns) {
            var self = this;
            _url_patterns = url_patterns;

            self.set_pub_id(ad_pub_id);

            $(function() {
                var ad_slot_arr = get_ad_slot_arr();
                self.fill_ad_slots(ad_slot_arr);
            });

        }

    };

}(jQuery);


/**
 * Shortcut function to adsense_wrapper.fill_ad_slot_at_runtime method
 */
function fill_ad_slot(jquery_elem_selector) {
    adsense_wrapper.fill_ad_slot_at_runtime(jquery_elem_selector);
}

