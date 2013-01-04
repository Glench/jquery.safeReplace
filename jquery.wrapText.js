(function( $ ){

    $.fn.wrapText = function(regexp, wrapFunc, doNotFollowSelector) {
        // there's no need to do $(this) because
        // "this" is already a jquery object
        var $this = this;
        var notMatchSelector = notMatchSelector || null;
        var wrapText = function(elem) { // elem must be an element node
            var nodes = elem.childNodes,
            i = nodes.length,
            node, interestNode, a, result;
            while (node = nodes[--i]) {
                if (node.nodeType === 1) {
                    // recurse down to next node unless we specify a selector
                    // to not recurse down into (such as an anchor if we are
                    // wrapping text in anchors to not have nested anchors)
                    if (doNotFollowSelector) {
                        if(!$(node).is(doNotFollowSelector)) {
                            wrapText(node);
                        }
                    } else {
                        wrapText(node);
                    }
                } else if (node.nodeType === 3) {
                    // 1: Please note that the regexp has NO global flag,
                    //    and that `node.textContent` shrinks when an address is found
                    while (result = regexp.exec(node.textContent)) {
                        // 2: Contact <SPLIT> me@example.com for details
                        node = node.splitText(result.index);

                        // 2: Contact <SPLIT>me@example.com<SPLIT> for details
                        node = node.splitText(result[0].length);

                        // node containing just the text we want
                        wrapFunc($(node.previousSibling));
                    }
                }
            }
        };

        // loop through each matched element
        $this.each(function(index, element) {
            wrapText(element);
        });
    };
})( jQuery );
