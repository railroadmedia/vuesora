<template>
    <div class="container narrow pt-3">
        <h1 class="heading text-center">Pagination</h1>
        <p class="body font-light mb-3 text-center">A Pagination module built to be used anywhere requiring pagination</p>

        <pagination
                :currentPage="currentPage"
                :totalPages="10"
                brand="secondary"
                @pageChange="handlePageChange"></pagination>

        <div class="flex flex-column bg-white shadow corners-3 pa mv-4">
            <h2 class="subheading text-secondary mb">Props</h2>

            <table class="body">
                <thead class="bg-primary text-white">
                <tr>
                    <td class="pa-1 corners-top-5">Prop</td>
                    <td class="pa-1 corners-top-5">Required</td>
                    <td class="pa-1 corners-top-5">Type</td>
                    <td class="pa-1 corners-top-5">Default</td>
                    <td class="pa-1 corners-top-5">Description</td>
                </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">currentPage</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">Number</td>
                    <td class="pa-1">1</td>
                    <td class="pa-1">The current page the module will render as active</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">totalPages</td>
                    <td class="pa-1">Yes</td>
                    <td class="pa-1">Number</td>
                    <td class="pa-1">0</td>
                    <td class="pa-1">The total number of pages the module can render, module will be disabled if prop is not set or set to 0</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">brand</td>
                    <td class="pa-1">no</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1">'recordeo'</td>
                    <td class="pa-1">The brand override to give the component a specific brand's theme color</td>
                </tr>
            </table>
        </div>

        <div class="flex flex-column bg-white shadow corners-3 pa mv-4">
            <h2 class="subheading text-secondary mb">Events</h2>

            <table class="body">
                <thead class="bg-primary text-white">
                <tr>
                    <td class="pa-1 corners-top-5">Event</td>
                    <td class="pa-1 corners-top-5">Description</td>
                </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">pageChange</td>
                    <td class="pa-1">Fired when a page is changed, used to emit events to the parent component, and return the currentPage back down to this component</td>
                </tr>
            </table>
        </div>

        <div class="flex flex-column bg-white shadow corners-3 pa mb-4">
            <h2 class="subheading text-secondary mb">Usage</h2>

            <h4 class="title text-secondary">Vue</h4>
            <v-embed id="PaginationVue" class="mb-3">
                https://gist.github.com/CurtisConway/a899b45da091b7e3ca275889e32be8d3.js
            </v-embed>
        </div>
    </div>
</template>

<script>
    import VEmbed from 'vue-embed';
    import Pagination from "@/components/Pagination.vue";

    export default {
        name: "pagination-docs",
        props: {

        },
        data() {
            return {
                currentPage: 1
            }
        },
        methods: {
            handlePageChange(payload){
                this.currentPage = payload.page;
            }
        },
        components: {
            "v-embed": VEmbed,
            "pagination": Pagination
        }
    };
</script>

<style lang="scss">
</style>
