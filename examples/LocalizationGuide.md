## Localization
Providing new localizations for the strings your YAMDBF Client sends to Discord is pretty simple overall
but it would be inaccurate to say there's not a lot of work that will go into it. There are a lot of strings
throughout all of the framework functionality and default commands that get sent to Discord so there is
potentially a lot of translating to be done if you wish to provide localizations for any additional languages.

## .lang files
The first thing to cover is the file format. `.lang` is a simple data file format created specifically for
the purpose of providing strings for localization throughout the framework. It's slightly reminiscent of XML
but far simpler in that it only serves to hold key/value pairs where the value is a string. Here are a couple
simple examples:
```
[EXAMPLE_FOO] This is a single line string [/EXAMPLE_FOO]

[EXAMPLE_BAR]
This is a multi-line string.
	Whitespace, like the tab at the beginning of this line
  or the two spaces at the beginning of this line are preserved.

Newlines are preserved as well, though you can \nadd newlines mid-line
as seen in the line above this, here -----------^
[/EXAMPLE_BAR]
```
The identifying string within the opening and closing tag is the key that will be used when retrieving
the string via `Lang.res()` or a ResourceLoader from `Lang.createResourceLoader()`.

>Note: The closing tag key must match the opening tag key. Nested tags are not supported and, if attempted, will be 
parsed as part of the raw string value of the outer-most surrounding tag

Single-line and inline comments are also allowed, using the syntax `##`:
```
[EXAMPLE_BAZ]
## This is an example of a single-line comment
## Here's another

foo bar baz ## And here's an inline comment
[/EXAMPLE_BAZ] 
```
Comments are removed when parsing. Any text not enclosed within key-tags is inherently treated as a comment
and is ignored when parsing.

## Templating
Unrelated to the `.lang` file format, but arguably the most important part of the localization system as a whole,
is the templating system. Any token surrounded with `{{ }}` or `{{ ?}}` is a template, and can be replaced at runtime
via matching keys within a {@link TemplateData} object passed to `Lang.res()` or a ResourceLoader from
`Lang.createResourceLoader()`. For example:
```
[TEMPLATE_EXAMPLE]
foo {{ barTemplate }} baz
[/TEMPLATE_EXAMPLE]

Lang.res('en_us', 'TEMPLATE_EXAMPLE', { barTemplate: 'bar' }) // Produces: 'foo bar baz'
```
Templates with a question mark (`{{ foo ?}}`) are "maybe templates". If a value is not given for that template it will
be removed when loaded. If a maybe template is the only thing occupying a line and no value is given for it, it will be
removed and a blank line will not be left behind:
```
[MAYBE_TEMPLATE_EXAMPLE]
foo{{ barTemplate ?}}baz
{{ emptyTemplate ?}}
boo
[/MAYBE_TEMPLATE_EXAMPLE]

Lang.res('en_us', 'MAYBE_TEMPLATE_EXAMPLE') // Produces: 'foobaz\nboo'
```
>Note: Passing empty strings for maybe templates results in them being removed in the same manner as if no value was given

## Template scripting
I don't speak any other languages myself but I'm aware that translating between languages is hardly ever a static 1:1 thing.
Pluralization, for example, is something that would hardly be able to be represented via simple static translation for all
languages. This is where template scripting becomes useful. Template scripting is done within `{{! !}}` template braces.
(Note the `!`s). This template syntax is important as the script won't be able to be interpreted if not within the proper
template braces.


Using the topic of pluralization from earlier, an example can be given from a template script currently in place for one of
the strings for the default help Command:
```
[CMD_HELP_ALIASES]
## 'Aliases: foo, bar' | 'Alias: foo'
{{! args.aliases.split(',').length > 1 ? 'Aliases' : 'Alias' !}}: {{ aliases }}
[/CMD_HELP_ALIASES]
```
>Note: A template script itself is just interpreted Javascript that must return a value. A template script that does not return a
value will simply have the template removed from the output string in the same manner as maybe templates. Implicit returns are
possible in a manner similar to arrow functions. If the script is complex enough to necessitate an actual return statement
then an implicit return is not possible


Template scripts receive two parameter values within their scope at runtime, the first of which is the {@link TemplateData}
object passed to the resource loader that is loading the string resource containing the template script in question. This
parameter is called `args`. The second parameter, called `res`, is a {@link ResourceLoader} function that can be used
for loading other string resources for the same language in case you need to nest localizable strings.

It's easiest to imagine that the script itself is surrounded by an anonymous function declaration taking the parameters
`args`, and `res` with simple arrow-function style implicit returns converted explicitly. Using the example script from above:
```
// {{! args.aliases.split(',').length > 1 ? 'Aliases' : 'Alias' !}}
function(args, res) {
	return args.aliases.split(',').length > 1 ? 'Aliases' : 'Alias';
}
```
When working with template scripts, and really templates in general, knowing what is going to be passed to the localization
string and thus the template script is important. Be sure to pay close attention to the original defaults and their use of
templates to get an idea of what to expect. And, of course, being sure to test the results at runtime never hurts.
