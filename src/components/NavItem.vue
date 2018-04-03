<template>
    <div class="nav-item">
        <router-link :to="routerLink">
            <slot></slot>
        </router-link>

        <div class="sub-nav-items" v-if="currentRoute === routerLink && subNavItems.length">
            <a v-for="(item, i) in subNavItems"
               :key="i">
                {{ item }}
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'nav-item',
        props: {
            routerLink: {
                type: String,
                default: () => ''
            },

            subNavItems: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            currentRoute(){
                return this.$route.fullPath
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../assets/sass/partials/_variables.scss';

    .nav-item {
        display:block;
        padding:#{$gutterWidth / 2} #{$gutterWidth / 3};
        border-bottom:1px solid transparentize($lightGray, .75);
        text-align:left;

        a {
            font-weight: bold;
            color: $darkGray;
            text-decoration:none;

            &.router-link-exact-active {
                color: $secondary;
            }
        }

        .sub-nav-items {
            display:block;
            padding:#{$gutterWidth / 2} #{$gutterWidth / 3} 0;

            a {
                display:block;
                font-weight:400;
                padding:#{$gutterWidth / 4} #{$gutterWidth / 3};

                &:last-child {
                    padding-bottom:0;
                }
            }
        }
    }
</style>