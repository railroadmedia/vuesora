<template>
    <div class="container tw-my-3 tw-w-full">
        <div v-for="i in content"
            :key="`coach-${i}`"
            class="tw-mb-4">
            <span class="tw-text-sm">{{ i }}</span>
        </div>
        

    </div>
</template>

<script>
export default {
    name: 'FeaturedCoaches',
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },
        preLoadedContent: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            content: this.preLoadedContent ? this.preLoadedContent.data : [],
            coach_params: {
                name: null,
                focus: [],
                short_bio: null,
                card_thumbnail_url: null,
                bio_image: null,
                url: null
            }                       
        }
    },
    mounted() {

    },
    computed: {

    },
    methods: {
    
    }
}
</script>