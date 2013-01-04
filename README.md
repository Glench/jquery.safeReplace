jquery.wrapText
===============

Find and wrap text in jQuery (or do other things!).

Search from a root element (or elements) for text matching a regular expression:

```javascript
var wrapTwitterLink = function($textNode) {
    $textNode.wrap('<a href="http://twitter.com/'+ $textNode.text() +'">')
};

$('div').wrapText(/@([A-Za-z0-9_]+)/g, wrapTwitterLink);
```

That will turn this:

```html
<div><span>@Glench</span></div>
```

into:

```html
<div><span><a href="http://twitter.com/@Glench">@Glench</a></span></div>
```

BUT WAIT!
---------

What happens if you had something like this and ran the plugin?

```html
<div><a href="http://twitter.com/Glench">@Glench</a>
```

Well...

```html
<div><a href="http://twitter.com/Glench"><a href="http://twitter.com/@Glench">@Glench</a></a>
```

As you can see, this plugin naively tries to put a link inside a link, dawg. That's no good. Use the third argument to the plugin to limit what you traverse:

```javascript
$('div').wrapText(/@([A-Za-z0-9_]+)/g, wrapTwitterLink, 'a');
```

Now we won't look for text in 'a' elements.

API
---
    $(selector).wrapText(regExp, wrappingFunc [, doNotFollowSelector])

<table>
    <tr>
        <th>Argument</th>
        <th>Explanation</th>
        <th>Example</th>
    </tr>
    <tr>
        <td><em>regExp</em></td>
        <td>A regular expression to match against. Note that if you don't provide the <code>'g'</code> flag, this plugin will only return the first match in a text node.</td>
        <td><code>/\d+/g</code></td>
    </tr>
    <tr>
        <td><em>wrappingFunc</em></td>
        <td>When the plugin finds a match, it will execute this function. The first argument is a jQuery text node with just the text matched. The second argument is the jQuery object parent where the match was found. Note that no jQuery functions that user inner JavaScript functions will work, as this is a text node. That means no <code>append()</code> or <code>prepend()</code>. Use <code>before</code> and <code>after()</code> instead.</td>
        <td><code><pre>function($matchingNode, $parent) {
    $matchingNode.wrap("/");
}</pre></code></td>
    </tr>
    <tr>
        <td><em>doNotFollowSelector</em></td>
        <td>A jQuery selector used to determine if this plugin should traverse into an element. If an element in the traversal matches this selector, it will be skipped.</td>
        <td><code>'a:visible'</code></td>
    </tr>
</table>

Note: If you get double-wrapping, be more careful with your selectors. For example, try not to use $('div') when there are a bunch of nested divs.


