jquery.wrapText
===============

Find and wrap text in jQuery (or do other things!).

Search from a root element (or elements) for a specified regular expression:

```javascript
var wrapTwitter = function($textNode) {
    $textNode.wrap('<a href="http://twitter.com/'+ $textNode.text() +'">')
};

$('div').wrapText(/@([A-Za-z0-9_]+)/g, wrapTwitter);
```

That will turn this:

```html
<div>@Glench, <span>@Jmondo</span></div>
```

into:

```html
<div><p><a href="http://twitter.com/@Glench">@Glench</a>, <span><a href="http://twitter.com/@Jmondo">@Jmondo</a></span></p></div>
```

BUT WAIT!
---------

What happens if you had something like this?

```html
<div>@Glench, <a href="http://twitter.com/Jmondo">@Jmondo</a></div>
```

As you can see, this plugin naively tries to put a link inside a link, dawg. That's no good. Use the third argument to the plugin t


If you don't provide the `'g'` flag, then this plugin will only match the first match in a text node.


Note: If you get double-wrapping, be more careful with your selectors. For example, try not to use $('div') when there are a bunch of nested divs.


