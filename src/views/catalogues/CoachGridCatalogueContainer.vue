<template>
    <div
        class="flex flex-row align-v-top test-coach"
        :class="[noWrap ? 'overflow' : 'flex-wrap', {'nmh-1': !displayInline}]"
    >

    </div>
</template>
<script>

export default {
    name: 'ContentCatalogueContainer',
};
</script>
