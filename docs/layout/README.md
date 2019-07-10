# Layout & Styles

## Grid System

Vuesora uses a 12 point grid system. Built using the flex-box css spec, the grid is used to layout an application’s 
content. It contains 5 types of media breakpoints that are used for targeting specific screen sizes or orientations. 
The modifier classes represent a fraction of the pages width over 12.

### Breakpoints

| Breakpoint      | Acronym | Type                      | Range
|-----------------|---------|---------------------------|-------
| Extra Small     | `xs`    | Small to large handset    | < 640px
| Small           | `sm`    | Small to medium tablet    | 641px - 1025px
| Medium          | `md`    | Large tablet to laptop    | 1026px - 1240px
| Large           | `lg`    | Desktop (1080p)           | 1241px - 1940px
| Extra Large     | `xl`    | Hi-res and ultrawide      | > 1940px

### Usage

All content MUST be placed in a parent `.container` this creates the basic responsive page container, flex content 
can then be placed inside, and behave as expected. `.container` can be given the `.fluid` class and it will always take 
up 100% of the viewports width.

```html
<div class="container">
    ...
</div>

<!-- OR -->

<div class="container fluid">
    ...
</div>
```

Flex containers can then be created using the `.flex` class, this will create a container with the `display: flex;` 
property with the grow and shrink properties set to 1, and the flex basis at auto (including all children). 
To control the flex direction either use the `.flex-row` or `.flex-column` classes.

- `.flex-row` will make it's child content flow along the X-Axis
- `.flex-column` will make it's child content flow along the Y-Axis
- This means that the child containers will take up the amount of space specified in the flex-basis property 
(on the axis of the parents' flex-direction).

```html
<div class="container">
    <div class="flex flex-row">
        <div class="flex flex-column">
            ...
        </div>
        <div class="flex flex-column">
            ...
        </div>
    </div>
</div>
```

In order to specify the `flex-basis` property we use the grid modifier classes, prepended by the breakpoint acronym, 
and appended by the numerator (between 1 and 12), it looks something like this `.{ acronym }-{ numerator }`. 


For example: the modifier class `.sm-10` specifies that the container will take up 10 out of 12 units or 83.33%, 
starting at the small breakpoint. Keep in mind that flex containers with a modifier class will have the `flex-grow` and 
`flex-shrink` properties set to 0. (This way they will always be the width/height specified in the modifier.)

```html
<div class="container">
    <div class="flex flex-row">
        <div class="flex flex-column xs-12 sm-4 md-3">
            ...
        </div>
        <div class="flex flex-column xs-12 sm-8 md-9">
            ...
        </div>
    </div>
</div>
```

### Visibility

Responsive visibility is also achieved using the same convention as the grid, simply prepend the 
breakpoint acronym with the hide property and append it with the condition `.hide-{ acronym }-{ condition }`. 
For example `.hide-sm-only` will hide the element ONLY on the small breakpoint, `.hide-sm-up` will hide the element 
from the small breakpoint and up, only visible on the extra small breakpoint. The same works the other way with 
`.hide-sm-down`.

```html
<div class="hide-xs-only">
    ...
</div>
```

## Spacing

Vuesora uses a dynamic spacing system built off of a variable titled `$gutterWidth` which is defined at **1.875rem 
(roughly 32px)**. To add spacing to an element either use the margin or padding modifiers using the following convention 
`.{ type }{ part }-{ amount }`.

The `{ type }` applies the type of spacing:

- `p` - applies padding
- `m` - applies margin

The `{ part }` applies it a specific part of the element:

- `a` - applies spacing to all sides
- `v` - applies spacing to the top and bottom
- `h` - applies spacing to the left and right
- `t` - applies spacing to the top
- `b` - applies spacing to the bottom
- `l` - applies spacing to the left
- `r` - applies spacing to the right

The `{ amount }` applies the amount of spacing:

- `1` - `$gutterWidth` divided by 3
- `2` - `$gutterWidth` divided by 2
- `3` - `$gutterWidth`
- `4` - `$gutterWidth` multiplied by 1.5
- `5` - `$gutterWidth` multiplied by 1.666

```html
<div class="pa-3 mb-3">
    ...
</div>
```

_Alternatively, you can choose to omit the `{ amount }` to give it a responsive spacing amount. 
(Equivalent to 2 on desktop and tablet sizes and 1 on mobile sizes) Ex: `.pa`_

## Typography

### Fonts

Vuesora's default fonts are as follows:

| Font Style               | Font Name    
|--------------------------|--------------
| Sans-Serif               | Open Sans, Roboto Condensed    
| Serif                    | Bree Serif, Times New Roman     
| Monospace                | Courier New  

### Font Sizes

For the sake of consistency, Vuesora has 7 standards for font sizes. Font sizes are responsive.

| Name            | Class          | Weight | xs     | md     | lg
|-----------------|----------------|--------|--------|--------|-------
| Display         | `.display`     | 700    | 32px   | 36px   | 40px
| Heading         | `.heading`     | 700    | 24px   | 28px   | 32px
| Subheading      | `.subheading`  | 600    | 20px   | 22px   | 24px
| Title           | `.title`       | 600    | 18px   | 18px   | 20px
| Body            | `.body`        | 400    | 16px   | 16px   | 16px
| Tiny            | `.tiny`        | 400    | 13px   | 13px   | 13px
| X-Tiny          | `.x-tiny`      | 400    | 10px   | 10px   | 10px

### Helper Classes

**You can also customize all Typography with various helper classes:**

| Helper Class             | Description  
|--------------------------|--------------
| `.font-compressed`       | Line Height: 1.25em   
| `.font-light`            | Font Weight: 300   
| `.font-regular`          | Font Weight: 400   
| `.font-bold`             | Font Weight: 700
| `.font-underline`        | Underline
| `.font-strike`           | Strikethrough
| `.font-italic`           | Italics
| `.dense`                 | Roboto Condensed
| `.uppercase`             | All characters capitalized
| `.capitalize`            | First letter of every word capitalized
| `.text-left`             | Left Align
| `.text-right`            | Right Align
| `.text-center`           | Center Align
| `.break-words`           | Break words that extend wider than the parent container

