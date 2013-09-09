(function( $ ) {

    $.fn.safeReplace = function(regexp, replace, doNotFollowSelector, doNotFollowHidden) {
        // there's no need to do $(this) because
        // "this" is already a jquery object
        var $this = this;


        // escape string in order to construct a regexp
        var regexpEscape = function(s) {
            return s.replace(/[\-\/\\\^$*+?.()|\[\]{}]/g, '\\$&');
        };

        // shim for matching element by css selector
        if (!Element.prototype.matchesSelector) {
            Element.prototype.matchesSelector =
                Element.prototype.matches ||
                Element.prototype.webkitMatchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector;
        }

        // due to the nature of how we cycle through regexp matches,
        // the global flag actually behaves opposite as expected, so have to
        // construct a new regex with the same flags but the opposite of 'g'
        if (typeof regexp == 'string') {
            regexp = new RegExp(regexpEscape(regexp), 'g');
        }
        var regexpFlags = '';
        if (regexp.ignoreCase) { regexpFlags += 'i'; }
        if (regexp.multiline) { regexpFlags += 'm'; }
        if (!regexp.global) { regexpFlags += 'g'; }
        regexp = new RegExp(regexp.source, regexpFlags);

        // if a string is provided, turn into a function
        var replacer;
        if (typeof replace == 'string') {
            replacer = function($matchedTextNode, matchedText, regExpMatch) {
                var newElement = matchedText.replace(regexp, replace);
                $matchedTextNode.replaceWith(newElement);
            };
        } else {
            replacer = replace;
        }

        // by default do not traverse dumb elements
        var doNotFollowDefault = 'html,head,style,title,link,meta,script,object,iframe,noscript';
        if (doNotFollowSelector) {
            doNotFollowSelector = doNotFollowSelector+ ',' +doNotFollowDefault;
        } else {
            doNotFollowSelector = doNotFollowDefault;
        }

        // add option for traversing hidden elements
        var followHidden = !doNotFollowHidden;
        var nodeIsHidden = function(node) {
            // roughly follows jquery ':hidden' selector
            return (node.style.display == 'none' ||
            (node.attributes.type && node.attributes.type.value == 'hidden'));
            // does not check for width/height = 0 because it's too slow!
        };

        var safeReplace = function(elem) {
            // can either be a normal element (has children) or a text node
            var nodes = elem.childNodes,
            i = nodes.length,
            node, a, result,
            splitNode = function(node) {
                while ((result = regexp.exec(node.data)) !== null) {
                    // 2: Contact <SPLIT> me@example.com for details
                    node = node.splitText(result.index);

                    // 2: Contact <SPLIT>me@example.com<SPLIT> for details
                    node = node.splitText(result[0].length);

                    // node containing just the text we want
                    replacer($(node.previousSibling), result[0], result);
                }
            };

            if (!i) {
                // if it has no child elements, a text node was passed in
                splitNode(elem);
            }
            while (node = nodes[--i]) {
                if (node.nodeType === 1) {
                    // recurse down to next node unless we specify a selector
                    // to not recurse down into (such as an anchor if we are
                    // wrapping text in anchors to not have nested anchors)
                    if (doNotFollowSelector) {
                        if (!node.matchesSelector(doNotFollowSelector) &&
                        (followHidden || !nodeIsHidden(node)) &&
                        node.textContent.trim() !== '') {
                            safeReplace(node);
                        }
                    } else {
                        safeReplace(node);
                    }
                } else if (node.nodeType === 3) {
                    splitNode(node);
                }
            }
        };

        // loop through each matched element
        $this.not(doNotFollowSelector).each(function(index, element) {
            safeReplace(element);
        });

        // make chainable
        return $this;
    };
})( jQuery );
