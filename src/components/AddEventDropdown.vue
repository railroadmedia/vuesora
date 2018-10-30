<template>
    <div class="add-event-dropdown">
        <div class="flex flex-column bg-white shadow corners-3">

            <div v-for="platform in platforms"
                 class="addeventatc pointer"
                 data-render="inline-buttons"
                 data-styling="none"
                 :data-direct="platform">
                <p class="body capitalize pa-1">{{ platform }}</p>
                <span class="start">{{ startTime }}</span>
                <span class="timezone">UTC</span>
                <span class="title">{{ eventTitle }}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'add-event-dropdown',
        props: {
            startTime: {
                type: String,
                default:() => ''
            },
            eventTitle: {
                type: String,
                default:() => ''
            }
        },
        data(){
            return {
                platforms: ['apple', 'google', 'outlook', 'outlookcom', 'yahoo']
            }
        }
    }
</script>