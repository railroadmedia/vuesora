<template>
    <svg xmlns="http://www.w3.org/2000/svg"
        :aria-labelledby="iconName"
        version="1.1"
        :width="width" 
        :height="height" 
        :viewBox="viewBox"
    >
        <title lang="en">{{ iconName }}</title>
        <use 
            :xlink:href="iconID" 
            x="0" 
            y="0"
        >
        </use>
    </svg>
</template>
<script>

export default {
    name: 'SVGIcon',
    props: {
        iconName: {
            type: String,
            default: 'box',
        },
        width: {
            type: [Number, String],
            default: '100%',
        },
        height: {
            type: [Number, String],
            default: '100%',
        },
        viewBox: {
            type: [Number, String],
            default: '0 0 32 32',
        },
    },
    computed: {
        iconID() {
            return `#icon-${this.iconName}`;
        },
    },
};
</script>

<style scoped>
    svg:not(:root) {
        overflow: visible;
    }
</style>
