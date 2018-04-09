<template>
    <div id="app">
        <nav-button
                @click.native="menuActive = !menuActive"
                :class="{ 'active': menuActive }" />

        <div id="nav"
             :class="{ 'active': menuActive }"
             class="shadow">
            <img class="logo" src="https://s3.amazonaws.com/musora-center/logos/vuesora.svg">
            <hr>

            <nav-item routerLink="/"
                      :currentRoute="currentRoute">
                Home
            </nav-item>

            <nav-item routerLink="/application-layout"
                      :currentRoute="currentRoute"
                      :subNavItems="['Grid System', 'Spacing', 'Typography']">
                Application Layout
            </nav-item>

            <h4 class="body font-bold">Components</h4>
            <nav-item routerLink="/docs/media-element">
                Media Element
            </nav-item>
            <!--<nav-item routerLink="/">-->
                <!--Content Table-->
            <!--</nav-item>-->
        </div>

        <div id="view">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import NavButton from './components/NavButton.vue';
    import NavItem from './components/NavItem.vue';

    export default {
        name: 'app',
        components: {
            'nav-button': NavButton,
            'nav-item': NavItem,
        },
        data() {
            return {
                menuActive: false
            }
        },
        computed: {
            currentRoute(){
                return this.$route.fullPath
            }
        },
        methods: {
            consoleSomething(){
                console.log('hello?');
            }
        }
    }
</script>

<style lang="scss">
    @import './assets/sass/partials/_variables.scss';
    @import './assets/sass/app.scss';

    body {
        overflow:hidden;
    }

    #nav {
        position: fixed;
        box-sizing:border-box;
        left: 0;
        top: 0;
        width: 300px;
        height:100%;
        padding: 30px;
        border-right:1px solid $lightGray;
        z-index:50;
        background:#fff;
        will-change:transform;
        transition:transform .2s ease-in-out;
        transform:translateX(-100%);

        @include medium {
            transform:translateX(0);
        }

        &.active {
            transform:translateX(0);
        }

        h4 {
            color:#fff;
            text-align:left;
            margin-top:$gutterWidth;
            margin-bottom:0;
            padding:$gutterWidth / 4;
            background-color:$primary;
            border-radius:5px 5px 0 0;
        }

        hr {
            opacity:.25;
            margin-bottom:$gutterWidth;
        }

        .logo {
            display:block;
            max-width:150px;
            margin:0 auto $gutterWidth;
        }
    }

    #view {
        position:fixed;
        box-sizing:border-box;
        left:0;
        top:0;
        width:100%;
        height:100%;
        overflow:auto;
        background:$backgroundGray;
        z-index:49;

        @include medium {
            padding:$gutterWidth / 2;
            left:300px;
            width:calc(100% - 300px);
        }
    }
</style>
