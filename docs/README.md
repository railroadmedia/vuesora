# Usage Guide

Vuesora is a one-stop shop custom front-end framework. Vuesora powers the front-end for all of Musora's web applications - Drumeo, Guitareo, Pianote, and Recordeo.

It consists of 2 main modules:

- A complete CSS framework - with a 12 point grid system based off of the flex-box spec. Vuesora is built on an
helper class system, with helpers for all sorts of modifiers, from typography, to colors, borders, and dozens of 
styled components - Vuesora allows views to be built with minimal specific CSS.

- A custom Vue Component library. Any of the application's components that require complex DOM manipulation have their
 own custom Vue component.


## Local Development Environment

Since Vuesora is a series of modules on NPM, we need to install the modules, import them into our project, and bundle
them into our projects code. Follow the steps below to set up your local development environment.             
              
### Symlinking Vuesora

Creating a symlink in NPM is as simple as hoisting the NPM package as a global package, and linking it in the project
that uses it as a dependency. You can achieve that with the following steps:

1. `cd /app/vuesora`

2. `npm link`

3. `cd /app/pianote`

4. `npm link vuesora`

Alternatively, you can chain everything in one command.

`cd /app/vuesora; npm link; cd /app/pianote; npm link vuesora; npm run watch`

### Publishing Vuesora

Publishing Vuesora is fairly simple: update the version, push the repo, publish the package, and update your 
applications package.json.

**Before you can publish Vuesora you need to add your npm and git credentials to your 
Railenvironment Docker Container.**

`npm adduser` - follow the cli commands, pretty straight forward <https://docs.npmjs.com/cli/adduser>

`git config --global user.name "\your-username\"` - Add a git user name

`git config --global user.email "\your-email\"` - Add a git email address

---

To publish the package:

1. `npm version patch` - If your Railenvironment Docker Container has your git information, this should make a 
commit with a version tag

2. Push the Vuesora repository and the subsequent tag that was created

3. `npm publish`

4. Move into application directory

5. `npm install --save vuesora` - This will update the applications package.json with the newest version of Vuesora

6. `npm run prod` - You are now ready to deploy

### Symlinking Bladesora

Bladesora is a library of shared blade templates for Musora applications. They are static components
without any javascript logic. Bladesora helps keeps the applications DRY by keeping the same directives
used across all applications in a central repository. Creating a symbolic link with a PHP package should be done 
with the Railenvironment CLI

`r symlink bladesora pianote`

_Note that at the time of writing this. Bladesora is still an integral part of the application logic, but there are 
plans to deprecate it in the future._

### Publishing Bladesora

To publish a composer package:

- Create and push a tag with the new version number, that's it. 
- In a few minutes your package will be available via `r pianote composer update`

## Using Vuesora

### Project Structure

Since Vuesora is an NPM module, using it consists of 3 steps:

1. Install the package
2. Import the modules into local files
3. Compile modules into your applications code

Your applications assets directory should look something like:

```
└─ resources
   └─ assets
      ├─ js
      |   └─ app.js
      └─ sass
          └─ app.scss
```

### Importing Modules

#### Javascript

Vuesora has 2 styles of Javascript modules. 

1. Classes and Services are referenced by a constant:

```javascript
import ContentService from 'vuesora/src/assets/js/services/content';
import VideoTracker from 'vuesora/src/assets/js/classes/video-tracker';

const content = await ContentService.getContentById('1234');
const videoTracker = new VideoTracker();
```

2. Functions that are exported as IIFE's _(Immediately Invoked Function Expression)_, with the intention to invoke 
immediately at runtime:

_Note that in a world of modules, IIFEs should almost never have to be used, these are slowly being faded out._

```javascript
import 'vuesora/src/assets/js/functions/navigation';
```

#### Vue

```javascript
import EmailForm from 'vuesora/src/components/EmailForm';
import UserExpBar from 'vuesora/src/components/UserExpBar';
import ContentCatalogue from 'vuesora/src/views/catalogues';

Vue.use(EmailForm);
Vue.use(UserExpBar);
Vue.use(ContentCatalogue);

new Vue({
    el: '#app',
});
```

#### Sass

```sass
@import "~vuesora/src/assets/sass/partials/_variables.scss";
@import '~vuesora/src/assets/sass/app.scss';
```

### Compiling Assets

Applications use the [Laravel Mix](https://laravel-mix.com/docs/4.0/basic-example) wrapper for webpack to 
compile/transpile all assets in a project, your `webpack.mix.js` file should look similar to the sample below:

```javascript
let mix = require('laravel-mix');
let autoprefixer = require('autoprefixer');

// SASS
mix.sass('resources/assets/members/sass/app.scss', 'public/assets/members/css');

// JS
mix.js('resources/assets/members/js/app.js', 'public/assets/members/js');

// CONFIG
mix.extract(['vue']);
mix.options({
    extractVueStyles: false,
    postCss: [autoprefixer]
});
mix.webpackConfig({
    module: {
        rules: [{
            test: /\.js?$/,
            use: [{
                loader: 'babel-loader',
                options: Object.assign(mix.config.babel())
            }]
        }]
    },
    resolve: {
        modules: ['./node_modules'],
        symlinks: false
    },
    devtool: mix.inProduction() ? 'none' : 'source-map'
});
mix.version();
```

This configuration will take your app.js and app.scss files and do several things to them:

- Concatenate and minify all modules included in the entry files, to an output file in the `/public/assets` directory
- Autoprefix experimental css rules with their vendor prefixes, for cross browser compatibility
- Transform ES6/Harmony syntax into browser readable javascript

The default npm scripts that come bundled with laravel and laravel mix are perfect for our use case.

`npm run dev`  - This command will run a quick compilation with inline source maps, bundle sizes will be big.

`npm run watch` - This command will run a quick compilation with inline source maps everytime a file is saved, 
bundle sizes will be big.'

`npm run prod` - This command will run a full compilation without sourcemaps, bundle sizes will be smaller. 
**This command should always be run before a deploy!**

### Using Assets

Create a `layout.blade.php` file in your project:

```html
<html>
<head>
    <!-- Include bundled css assets -->
    <link rel="stylesheet" href="{{ mix('assets/members/css/app.css') }}">
    
    @yield('styles')
</head>
<body>
    @yield('content')
    
    <!-- Include bundled js assets -->
    <script src="{{ mix('assets/members/js/manifest.js') }}"></script>
    <script src="{{ mix('assets/members/js/vendor.js') }}"></script>
    <script src="{{ mix('assets/members/js/app.js') }}"></script>
    
    @yield('scripts')
</body>
</html>
```

Extend the layout in any of your views:

```html
@extends('members.layout')

@section('styles')
    <!-- ... -->
@endsection

@section('scripts')
    <!-- ... -->
@endsection

@section('content')
    <!-- ... -->
@endsection
```

## Advanced Workflows

### Code Splitting

Musora applications are not Single Page Applications, so code splitting has to work a little differently
than the traditional approach.

In the above examples the application assumes you only want a single entry and a single output. However,
With the amount of transpilation and polyfills needed for Vuesora, bundles can quickly scale to
unmaintanable sizes.

It is recommended to split your bundles up into the different main features that make up the application.
For example, the following sample assumes you want to incorporate a `lesson-page.js` bundle into your
application, let's say the `lesson-page.js` bundle contains the heavyweight javascript needed
for the video player. 


```
└─ resources
   └─ assets
      ├─ js
      |   ├─ app.js
      |   └─ lesson-page.js
      └─ sass
          └─ app.scss
```

Your `lesson-page.js` bundle should look something like the following. What this does is import the Single File
Components from Vuesora, which are exported as a Vue plugin. You then use the plugin with the current Vue instance.


This structure allows you to import and export all Vuesora components _À la carte_.

```javascript
import Comments from 'vuesora/src/views/comments';
import ContentAssignment from 'vuesora/src/components/ContentAssignment';
import MediaElement from 'vuesora/src/components/MediaElement';

Vue.use(Comments);
Vue.use(ContentAssignment);
Vue.use(MediaElement);
```

In your `webpack.mix.js` file you need to include the new bundle. The following line will take
your `lesson-page.js` bundle in the `/resources/assets` directory and minify it in the `/public/assets`
directory

```javascript
mix.js('resources/assets/members/js/lesson-page.js', 'public/assets/members/js');
```

In your global layout file, you need to include another section to inject components:

```html
<html>
<head>
    <!-- Include bundled css assets -->
    <link rel="stylesheet" href="{{ mix('assets/members/css/app.css') }}">
    
    @yield('styles')
</head>
<body>
    @yield('content')
    
    <!-- Include bundled js assets -->
    <script src="{{ mix('assets/members/js/manifest.js') }}"></script>
    <script src="{{ mix('assets/members/js/vendor.js') }}"></script>
    @yield('inject-components')
    <script src="{{ mix('assets/members/js/app.js') }}"></script>
    
    @yield('scripts')
</body>
</html>
```

We don't want to cache/download that code on every single view, since it's only needed in a
specific section of the app. So lastly, in your `lesson-page.js` view. You want to use the `inject-components` 
section to inject that `lesson-page.js` bundle you created in the earlier step.

```html
@extends('members.layout')

@section('styles')
    <!-- ... -->
@endsection

@section('inject-components')
    <script src="{{ mix('assets/members/js/lesson-page.js') }}"></script>
@endsection

@section('scripts')
    <!-- ... -->
@endsection

@section('content')
    <!-- ... -->
@endsection

```

Now your Video Player javascript is only included on the view that requires it, and users can experience
faster startups, and a more performant application outside of that view. 

It's still a manageable bundle size aswell, so you can leverage the browser or Cloudflare cache, for an even 
more performant experience.