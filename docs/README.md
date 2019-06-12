# Project Setup

## Local Development Environment

The interactions between all of the packages that make up the Musora stack can be quite daunting. 
The commands below should be able to fix most common issues than can occur.

### Compiling Assets

Applications use the Laravel Mix wrapper for webpack to compile/transpile all assets in a project, 
they use the default npm scripts that come installed with Laravel.

`npm run dev`  - This command will run a quick compilation with inline source maps, bundle sizes will be big.

`npm run watch` - This command will run a quick compilation with inline source maps everytime a file is saved, 
bundle sizes will be big.'

`npm run prod` - This command will run a full compilation without sourcemaps, bundle sizes will be smaller. 
**This command should always be run before a deploy!**
              
              
### Symlinking Vuesora

If you try to run `npm run dev` or `npm run watch` etc.. And you get an error that says something like 
`module can't be found` and the path looks like it comes from Vuesora, you likely don't have the most 
recent version installed. Since that version changes constantly, for local development it's best to set up a 
symbolic link between the projects.

Creating a symlink in NPM is as simple as hoisting the NPM package as a global package, and linking it in the project
that uses it as a dependency. You can achieve that with the following commands.

`cd /app/vuesora`

`npm link` - Wait for the command to finish

`cd /app/pianote`

`npm link vuesora`

Alternatively, you can chain everything in one command.

`cd /app/vuesora; npm link; cd /app/pianote; npm link vuesora; npm run watch`

### Symlinking Bladesora

If you are trying to build out views for an application and you get a laravel error saying a bladesora view cannot 
be found, you likely don't have the most recent version installed. Since that version changes constantly, for 
local development it's best to set up a symbolic link between the projects. Creating a symbolic link with a PHP package
should be done with the Railenvironment CLI

`r symlink bladesora pianote`

### Publishing Vuesora

Publishing Vuesora is fairly simple: update the version, push the repo, publish the package, and update your 
applications package.json.

**Before you can publish Vuesora you need to add your npm and git credentials to your 
Railenvironment Docker Container.**

`npm adduser` - follow the cli commands, pretty straight forward <https://docs.npmjs.com/cli/adduser>

`git config --global user.name "\your-username\"` - Add a git user name

`git config --global user.email "\your-email\"` - Add a git email address

---

To publish the package run the following NPM commands:

`npm version patch` - If your Railenvironment Docker Container has your git information, this should make a 
commit with a version tag

Push the Vuesora repository and the subsequent tag that was created

`npm publish`

Move into application directory

`npm install --save vuesora` - This will update the applications package.json with the newest version of Vuesora

`npm run prod` - You are now ready to deploy
