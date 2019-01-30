<template>
    <div class="container narrow pt-3">
        <h1 class="heading text-center">Vuesora</h1>
        <p class="body font-light mb-5 text-center">Vuesora is a CSS and Vue Component Library built for use within the Musora member's areas.</p>

        <div class="flex flex-column pa mb-4">
            <h1 class="title text-secondary mb">Local Development Environment</h1>

            <p class="body mb-3">The interactions between all of the packages that make up the Musora stack can be quite daunting. The commands below should be able to fix most common issues than can occur.</p>

            <h1 class="title text-secondary mb-1">Compiling Assets</h1>

            <p class="body mb-1">Applications use the Laravel Mix wrapper for webpack to compile/transpile all assets in a project, they use the default npm scripts that come installed with Laravel</p>

            <p class="body mb-1">
                <span class="keyword">npm run dev</span> - This command will run a quick compilation with inline source maps, bundle sizes will be big.
            </p>

            <p class="body mb-1">
                <span class="keyword">npm run prod</span> - This command will run a full compilation without sourcemaps, bundle sizes will be smaller. <span class="font-bold">This command should always be run before a deploy!</span>
            </p>

            <p class="body mb-1">
                <span class="keyword">npm run watch</span> - This command will run a quick compilation with inline source maps everytime a file is saved, bundle sizes will be big.
            </p>

            <p class="body mb-3">
                <span class="keyword">npm run watch-poll</span> - This is the exact same command as <span class="keyword">watch</span>, it just uses Chokidar's polling feature so it can watch for changes on the windows file system.
            </p>

            <h1 class="title text-secondary mb-1">Symlinking Vuesora</h1>

            <p class="body mb-1">If you try to run <span class="keyword">npm run dev</span> or <span class="keyword">npm run watch</span> etc.. And you get an error that says something like "module can't be found" and the path looks like it comes from Vuesora, you likely don't have the most recent version installed. Since that version changes constantly, for local development it's best to set up a symbolic link between the projects.</p>

            <p class="body mb-1">
                <span class="keyword">cd /app/vuesora</span>
            </p>

            <p class="body">
                <span class="keyword">npm link</span>
            </p>
            <p class="tiny font-italic mb-1">Wait for the command to finish</p>

            <p class="body mb-1">
                <span class="keyword">cd /app/recordeo</span>
            </p>

            <p class="body mb-3">
                <span class="keyword">npm link vuesora</span>
            </p>

            <h1 class="title text-secondary mb-1">Symlinking Bladesora</h1>

            <p class="body mb-1">If you are trying to build out views for an application and you get a laravel error saying a bladesora view cannot be found, you likely don't have the most recent version installed. Since that version changes constantly, for local development it's best to set up a symbolic link between the projects.</p>

            <p class="body mb-1">
                <span class="keyword">cd /app/recordeo</span>
            </p>

            <p class="body mb-1">
                <span class="keyword">rm -rf /vendor/railroad/bladesora</span>
            </p>

            <p class="body mb-1">
                <span class="keyword">ln -s /app/bladesora /app/recordeo/vendor/railroad</span>
            </p>
        </div>

        <div class="flex flex-column pa mb-4">
            <h1 class="title text-secondary mb">Publishing Vuesora</h1>

            <p class="body mb-3">Publishing vuesora is fairly simple: update the version, push the repo, publish the package, and update your applications package.json.</p>

            <p class="body mb-3">
                <span class="keyword">IMPORTANT</span> - It is recommended that you add your npm and git credentials to your railenv container
            </p>

            <p class="body mb-3">
                <span class="keyword">npm adduser</span> - follow the cli commands, pretty straight forward <a href="https://docs.npmjs.com/cli/adduser">https://docs.npmjs.com/cli/adduser</a>
            </p>

            <p class="body mb-3">
                <span class="keyword">git config --global user.name "\your-username\"</span> - Add a git user name
            </p>

            <p class="body mb-3">
                <span class="keyword">git config --global user.email "\your-email\"</span> - Add a git email address
            </p>

            <span class="bb-grey-1-1 mb-3"></span>

            <p class="body mb-1">
                <span class="keyword">npm version patch</span> - If your railenv container has your git information, this should make a commit with a version tag
            </p>

            <p class="body mb-1">
                Push the Vuesora Repo
            </p>

            <p class="body mb-1">
                <span class="keyword">npm publish</span>
            </p>

            <p class="body mb-1">
                Move into application directory
            </p>

            <p class="body mb-1">
                <span class="keyword">npm install --save-dev vuesora</span> - This will update the applications package.json with the newest version of Vuesora
            </p>

            <p class="body mb-1">
                <span class="keyword">npm run prod</span> - You are now ready to deploy
            </p>

            <va-row class="mt-5 test-row"
                    :wrap="true">
                <va-column class="bg-black xs-4"
                           align-h="center"
                           align-v="center">

                    <h1 class="heading text-white">Hello</h1>
                </va-column>

                <va-column class="bg-black xs-4"
                           align-h="left"
                           align-v="bottom">

                    <h1 class="heading text-white">Hello</h1>
                </va-column>

                <va-column class="bg-black xs-4"
                           align-h="right"
                           align-v="top">

                    <h1 class="heading text-white">Hello</h1>
                </va-column>

                <va-column class="bg-black xs-4"
                           align-h="right"
                           align-v="top">

                    <h1 class="heading text-white">Hello</h1>
                </va-column>

                <va-column class="bg-black xs-4"
                           align-h="right"
                           align-v="top">

                    <va-modal>
                        <h1 slot="activator"
                            class="heading text-white">Hello</h1>


                    </va-modal>
                </va-column>
            </va-row>
        </div>
    </div>
</template>

<script>
    import VaRow from '../components/VaRow/VaRow';
    import VaColumn from '../components/VaColumn/VaColumn';
    import VaModal from '../components/VaModal/VaModal';

    export default {
        name: "home",
        components: {
            VaRow,
            VaColumn,
            VaModal
        },
        data() {
            return {

            }
        }
    };
</script>

<style lang="scss">
    .test-row {
        .flex-column {
            height:75px;
        }
    }
</style>
