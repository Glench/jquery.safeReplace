jquery.safeReplace
===============

Search and replace without messing up removing html content! Very awesome for browser extensions like in Chrome and Firefox.

```javascript
$('div').safeReplace('half-empty', 'half-full');
```

Turns this:

```html
<div><span>half-empty</span></div>
```

into this:
```html
<div><span>half-full</span></div>
```

Regular Expression
------------------

Search from a root element (or elements) for text matching a regular expression.

```javascript
$('div').safeReplace(/@[A-Za-z0-9_]+/g, '@Glench');
```

Turns this:

```html
<div><span>@Jmondo</span></div>
```

into this:
```html
<div><span>@Glench</span></div>
```

Also supports *capture groups*:

```javascript
$('div').safeReplace(/(@[A-Za-z0-9_]+)/g, '$1_sucks');
```

Turns this:

```html
<div><span>@Jmondo</span></div>
```
```html
<div><span>@Jmondo_sucks</span></div>
```

Function
--------

Replacing with a static string not good enough? Use a function to manipulate the text:

```javascript
var wrapTwitterLink = function($textNode, matchedText, match) {
    $textNode.wrap('<a href="http://twitter.com/'+ matchedText +'">');
};

$('div').safeReplace(/@([A-Za-z0-9_]+)/g, wrapTwitterLink);
```

Turn this:

```html
<div><span>@Glench</span></div>
```

into:

```html
<div><span><a href="http://twitter.com/@Glench">@Glench</a></span></div>
```

You could also do the above example like this:

```javascript
$('div').safeReplace(/@([A-Za-z0-9_]+)/g, '<a href="http://twitter.com/$1">$1</a>');
```

BUT WAIT!
---------

What happens if you had something like this and ran the above example?

```html
<div><a href="http://twitter.com/Glench">@Glench</a></div>
```

Well...

```html
<div><a href="http://twitter.com/Glench"><a href="http://twitter.com/@Glench">@Glench</a></a></div>
```

As you can see, this plugin naively tries to put a link inside a link, dawg. That's no good. Use the third argument to the plugin to limit what you traverse:

```javascript
$('div').safeReplace(/@([A-Za-z0-9_]+)/g, wrapTwitterLink, 'a');
```

Now we won't look for text in 'a' elements. By default, safeReplace won't look at html, script, iframe, and many other elements.

API
---

    $(selector).safeReplace(finder, replacer [, doNotFollowSelector])

<table>
    <tr>
        <th>Argument</th>
        <th>Explanation</th>
        <th>Example</th>
    </tr>
    <tr>
        <td><code>finder</code></td>
        <td>A string or regular expression to match against. Note that if you don't provide the <code>'g'</code> flag to regular expressions, this plugin will only return the first match in a text node.</td>
        <td><code>/\d+/g</code></td>
    </tr>
    <tr>
        <td><code>replacer</code></td>
        <td>A string or a function that will replace <code>finder</code>. If a function, the first argument is a jQuery text node of the matched text. The second argument is the matched text. The third argument is the <a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp/exec">RegExp match object</a>. Note that no jQuery functions that user inner JavaScript functions will work, as this is a text node. That means no <code>append()</code> or <code>prepend()</code>. Use <code>before</code> and <code>after()</code> instead.</td>
        <td><code><pre>function($matchingNode, matchedText, regExpMatch) {
    $matchingNode.wrap("/");
}</pre></code></td>
    </tr>
    <tr>
        <td><em>doNotFollowSelector</em></td>
        <td>A jQuery selector used to determine if this plugin should traverse into an element. If an element in the traversal matches this selector, it will be skipped. By default: <code>'html,head,style,title,link,meta,script,object,iframe'</code></td>
        <td><code>'a:visible'</code></td>
    </tr>
</table>

Note: If you get double-wrapping, be more careful with your selectors. For example, try not to use $('div') when there are a bunch of nested divs.


