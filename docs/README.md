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

There a few npm scripts available for local development in Vuesora:          

- `test:e2e` - Run all End to End Tests
- `test:unit` - Run all Unit Tests
- `docs:dev` - Build the docs for local development with a url at localhost
- `docs:build` - Build the docs for production under the docs directory
- `lib:watch` - Watch the library for changes and create a new build on every change
- `lib:build` - Build the library for production
              
### Symlinking Vuesora

Creating a symlink in NPM is as simple as hoisting the NPM package as a global package, and linking it in the project
that uses it as a dependency. You can achieve that with the following steps:

1. `cd /app/vuesora`

2. `./symlink.sh`

This command will prompt you to select an application to symlink Vuesora with, simply select the one you wish to
develop for and wait.

What this will do is start up a watch process on Vuesora, aswell as the app you are developing for. This means
that whenever a file is changed in either Vuesora, or the app you are developing for, Webpack will create a
new bundle for you.

Keep in mind that this workflow should be reserved for **LOCAL DEVELOPMENT ONLY**. If you wish to deploy your
changes to production you need to build the app for production and create a new version, you can view how to do 
that below.

### Publishing Vuesora

**Before you can publish Vuesora you need to add your npm and git credentials to your 
Railenvironment Docker Container.**

`npm adduser` - follow the cli commands, pretty straight forward <https://docs.npmjs.com/cli/adduser>

`git config --global user.name "\your-username\"` - Add a git user name

`git config --global user.email "\your-email\"` - Add a git email address

---

To publish the package, just run the bash script: 

`./publish.sh`

This command will do several things:
- Build the library
- Commit the new build
- Create a new version tag
- Commit and push the version tag
- Commit and push the repository
- Publish the new version

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

Vuesora itself just exports a Vue component library, exposed as a plugin.

#### Vue

```javascript
import Vuesora from 'vuesora';

Vue.use(Vuesora);

new Vue({
    el: '#app',
});
```

#### Javascript

Vuesora's files also have 2 styles of Javascript modules. 

1. Classes and Services that are referenced by a constant:

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