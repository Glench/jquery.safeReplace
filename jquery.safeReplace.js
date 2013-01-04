(function( $ ) {

    $.fn.safeReplace = function(regexp, replacer, doNotFollowSelector) {
        // there's no need to do $(this) because
        // "this" is already a jquery object
        var $this = this;
        doNotFollowSelector = doNotFollowSelector || 'html,head,style,title,link,meta,script,object,iframe';

        // due to the nature of how we cycle through regexp matches,
        // the global flag actually behaves opposite as expected, so have to
        // construct a new regex with the same flags but the opposite of 'g'
        regexp = (typeof regexp == 'string') ? new RegExp(regexp, 'g') : regexp;
        var regexpFlags = '';
        if (regexp.ignoreCase) { regexpFlags += 'i'; }
        if (regexp.multiline) { regexpFlags += 'm'; }
        if (!regexp.global) { regexpFlags += 'g'; }
        regexp = new RegExp(regexp.source, regexpFlags);

        var safeReplace = function(elem) { // elem must be an element node
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
                            safeReplace(node);
                        }
                    } else {
                        safeReplace(node);
                    }
                } else if (node.nodeType === 3) {
                    while ((result = regexp.exec(node.textContent)) !== null) {
                        // 2: Contact <SPLIT> me@example.com for details
                        node = node.splitText(result.index);

                        // 2: Contact <SPLIT>me@example.com<SPLIT> for details
                        node = node.splitText(result[0].length);

                        // node containing just the text we want
                        if (typeof replacer == 'string') {
                            node.previousSibling.textContent = replacer;
                        } else {
                            replacer($(node.previousSibling), result, $(elem));
                        }
                    }
                }
            }
        };

        // loop through each matched element
        $this.each(function(index, element) {
            safeReplace(element);
        });
    };
})( jQuery );