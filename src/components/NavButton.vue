<template>
    <div id="nav-button">
        <i></i>
    </div>
</template>

<script>
export default {
    name: 'NavButton',
};
</script>

<style lang="scss" scoped>
    @import '../assets/sass/partials/_variables.scss';

    #nav-button {
        position:fixed;
        top:5px;
        left:5px;
        border:1px solid $lightGray;
        border-radius:3px;
        height:30px;
        width:30px;
        background:#fff;
        z-index:100;
        @include flexCenter();

        @include medium {
            display:none;
        }

        &.active {
            i {
                background-color:transparent;

                &:before {
                    top: 0;
                    transform: rotate(45deg);
                }

                &:after {
                    bottom: 0;
                    transform: rotate(-45deg);
                }
            }
        }

        i {
            display: inline-block;
            background-color: #000;
            position: relative;
            width: 15px;
            height: 2px;
            top: -1px;
            vertical-align: middle;
            transition: background .2s ease-in-out;

            &:before, &:after {
                background-color: #000;
                content: "";
                position: absolute;
                width: 100%;
                height: 2px;
                left: 0;
                transition: all .2s ease-in-out;
            }

            &:before {
                top:-5px;
            }

            &:after {
                bottom:-5px;
            }
        }
    }
</style>
