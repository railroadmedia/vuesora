<template>
    <div class="settings-drawer captions bg-grey-5 text-white shadow overflow">
        <div class="flex flex-column">
            <div class="flex flex-row">
                <div class="flex flex-column">
                    <ul class="list-style-none body text-right dense font-bold">
                        <li class="pa-1 hover-bg-grey-4 pointer relative"
                            :class="[themeTextClass, 'selected-caption']">
                            English
                        </li>
                        <li class="pa-1 hover-bg-grey-4 pointer">
                            Off
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'player-captions',
    }
</script>