<template>
    <div class="container narrow pt-3">
        <h1 class="heading text-center">
            Form Inputs
        </h1>
        <p class="body font-light mb-3 text-center">
            Everything you need to create beautiful forms.
        </p>

        <div class="flex flex-column bg-white shadow corners-3 pa mb-4">
            <p class="body">
                All form inputs must be wrapped inside of a <span class="keyword">.form-group</span> element and all labels must come <strong>AFTER</strong> the input
            </p>
        </div>

        <div
            id="text-input"
            class="flex flex-column bg-white shadow corners-3 pa mb-4"
        >
            <h2 class="subheading text-secondary">
                Text Input
            </h2>

            <div class="flex flex-row align-center">
                <div class="flex flex-column xs-12 sm-8 md-6">
                    <div class="form-group mb">
                        <input
                            id="textTest"
                            type="text"
                        >
                        <label for="textTest">Text Input</label>
                    </div>
                    <div class="form-group mb">
                        <input
                            id="emailTest"
                            type="email"
                        >
                        <label for="emailTest">Email Input</label>
                    </div>
                    <div class="form-group">
                        <input
                            id="passwordTest"
                            type="email"
                        >
                        <label for="passwordTest">Password Input</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Forms from '../../assets/js/classes/forms';

export default {
    name: 'FormInputs',
    props: {

    },
    data() {
        return {

        };
    },
    mounted() {
        Forms.addInputEventListeners();
    },
    methods: {
    },
    beforeDestory() {
        Forms.removeInputEventListeners();
    },
};
</script>

<style lang="scss">

    .video-container {
        width: 100%;
        margin: 0 auto;
    }
</style>
