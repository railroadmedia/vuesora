<template>
    <div
        class="flex flex-row align-v-top"
        :class="[noWrap ? 'overflow' : 'flex-wrap', {'nmh-1': !displayInline}]"
    >
        <catalogue-routine-card
            v-for="(item, i) in content"
            :key="'grid' + item.id"
            :item="item"
            :content-type="item.type"
            :brand="brand"
            :theme-color="themeColor"
            :use-theme-color="useThemeColor"
            :user-id="userId"
            :is-admin="isAdmin"
            :lock-unowned="lockUnowned"
            :force-wide-thumbs="forceWideThumbs"
            :content-type-override="contentTypeOverride"
            :six-wide="sixWide"
            :display-inline="displayInline"
            @addToList="emitAddToList"
            @showRoutineSoundSlice="showRoutineSoundSlice"
        ></catalogue-routine-card>
        <sound-slice
            :sound-slice-slug="soundSliceSlug"
            :theme-color="themeColor"
            :title="routineTitle"
            :content-id="routineId"
            :user-id="userId"
            @soundSliceClosed="soundSliceClosed"
        ></sound-slice>
    </div>
</template>
<script>
import CatalogueRoutineCard from './_CatalogueRoutineCard.vue';
import SoundSlice from '../../components/SoundSlice/SoundSlice.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

export default {
    name: 'RoutinesCatalogue',
    components: {
        'catalogue-routine-card': CatalogueRoutineCard,
        'sound-slice': SoundSlice,
    },
    mixins: [UserCatalogueEvents],
    props: {
        content: {
            type: Array,
            default: () => [],
        },
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        useThemeColor: {
            type: Boolean,
            default: () => true,
        },
        userId: {
            type: String,
            default: () => '',
        },
        isAdmin: {
            type: Boolean,
            default: () => false,
        },
        brand: {
            type: String,
            default: () => 'drumeo',
        },
        noWrap: {
            type: Boolean,
            default: () => false,
        },
        forceWideThumbs: {
            type: Boolean,
            default: () => false,
        },
        contentTypeOverride: {
            type: String,
            default: () => '',
        },
        lockUnowned: {
            type: Boolean,
            default: () => false,
        },
        sixWide: {
            type: Boolean,
            default: () => false,
        },
        displayInline: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            routineId: '',
            routineTitle: '',
            soundSliceSlug: '',
        };
    },
    methods: {
        showRoutineSoundSlice({ soundSliceSlug, title, routineId }) {
            this.soundSliceSlug = soundSliceSlug;
            this.routineTitle = title;
            this.routineId = routineId;
        },

        soundSliceClosed() {
            this.soundSliceSlug = '';
            this.routineTitle = '';
            this.routineId = '';
        },
    },
};
</script>
