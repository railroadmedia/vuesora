<template>
    <div id="app">
        <nav-button
                @click.native="menuActive = !menuActive"
                :class="{ 'active': menuActive }" />

        <div id="nav" :class="{ 'active': menuActive }">
            <img class="logo" src="https://s3.amazonaws.com/musora-center/logos/vuesora.svg">

            <hr>

            <router-link to="/">Home</router-link>
        </div>

        <div id="view">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import NavButton from './components/NavButton.vue'

    export default {
        name: 'app',
        components: {
            'nav-button': NavButton
        },
        data() {
            return {
                menuActive: false
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

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
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
        padding:$gutterWidth / 3;
        z-index:49;

        @include medium {
            padding:$gutterWidth / 2;
            left:300px;
            width:calc(100% - 300px);
        }
    }

    #nav a {
        font-weight: bold;
        color: $darkGray;
    }

    #nav a.router-link-exact-active {
        color: $secondary;
    }
</style>
