<template>
    <div class="vs-spin-wrapper">
        <div
            class="vs-spinner"
            :style="`border-top-color:${colorCode};`"
        >
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingAnimation',
    props: {
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
    },
    data() {
        return {
            colorMap: {
                course: '#07A0FF',
                pack: '#07A0FF',
                song: '#F8004F',
                'play-alongs': '#FFB500',
                'student-focus': '#A82FFF',
                rudiment: '#d06835',
                dft: '#0DD3BF',
                'learning-path': '#0B76DB',
                'my-list': '#0B76DB',
                show: '#00C278',
                'semester-pack': '#00BC75',
                drumeo: '#0B76DB',
                guitareo: '#00C9AC',
                pianote: '#F61A30',
                recordeo: '#FFAE00',
            },
        };
    },
    computed: {
        colorCode() {
            return this.colorMap[this.themeColor] || this.colorMap.drumeo;
        },
    },
};
</script>
<style lang="scss">
    .vs-spin-wrapper {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;

        .vs-spinner {
            position: absolute;
            height: 60px;
            width: 60px;
            border: 7px solid transparent;
            top: 50%;
            left: 50%;
            margin: -30px;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;

            &:before, &:after {
                content: '';
                position: absolute;
                border: 7px solid transparent;
                border-radius: 50%;
            }

            &:before {
                border-top-color: inherit;
                top: -16px;
                left: -16px;
                right: -16px;
                bottom: -16px;
                animation: spin .75s linear infinite reverse;
            }

            &:after {
                border-top-color: inherit;
                top: 4px;
                left: 4px;
                right: 4px;
                bottom: 4px;
                animation: spin .87s linear infinite reverse;
            }
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
