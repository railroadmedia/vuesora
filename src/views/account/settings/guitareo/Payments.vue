<template>
    <div class="flex flex-column pa-3 flex-auto">
        <h2 class="heading pb-3">Your Active Payment Methods</h2>
        <p class="body pb-2">Your Guitareo subscription will automatically be charged to default the credit card below. If you want to use a different credit card for, just add a new payment method and select the new one as default</p>

        <div class="flex flex-row pt-1">
            <div class="flex flex-column sm-4">
                <p class="body text-center xs-offset-1"><strong>DEFAULT</strong></p>
            </div>
            <div class="flex flex-column sm-4">
                <p class="body"><strong>IDENTIFICATION</strong></p>
            </div>
            <div class="flex flex-column sm-4">
                <p class="body"><strong>EXPIRES</strong></p>
            </div>
        </div>
        <div
            class="flex flex-row pt-1"
            v-for="card in cards"
            :key="'activeMethod' + card.id">
            <div class="flex flex-column sm-4">
                <div class="flex flex-row">
                    <div class="flex flex-column xs-1">
                        <input type="radio" id="one" :value="card.id" name="card" v-model="selected">
                    </div>
                    <div class="flex flex-column">
                        <label for="one">
                        <p class="body text-center"><span>{{ card.primary ? 'YES': '-' }}</span></p>
                        </label>
                    </div>
                </div>
            </div>
            <div class="flex flex-column sm-4">
                <p class="body"><span>{{ 'VISA' }} - {{ card.lastfour }}</span></p>
            </div>
            <div class="flex flex-column sm-4">
                <p class="body"><span>{{ formatCcDate(card.expires) }}</span></p>
            </div>
        </div>

        <div class="flex flex-row pv-3">
            <button type="submit" class="btn xs-6 sm-3">
                <span class="text-white bg-guitareo">Make Default</span>
            </button>
            <button type="submit" class="btn xs-6 ml-1 sm-3">
                <span class="bg-black inverted text-black">Delete</span>
            </button>
        </div>

        <div class="flex flex-row">
            <a class="body" href="#">Click here to add another payment method</a>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';

    export default {
        name: 'settings-payments',
        props: {
            user: {
                type: Object,
                default: () => { return {} }
            },
            cards: {
                type: Array,
                default: () => []
            },
            cardUrl: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                selected: ''
            }
        },
        methods: {
            formatCcDate(date) {
                return moment(date).format('YYYY-MM').toLowerCase();
            }
        },
        mounted() {
            console.log(
                "settings-payments component mounted, cardUrl: %s, user: %s, cards: %s",
                JSON.stringify(this.cardUrl),
                JSON.stringify(this.user),
                JSON.stringify(this.cards)
            );

            if (this.cards.length) {
                this.cards.forEach((card) => {
                    if (card.primary) {
                        this.selected = card.id;
                    }
                });
            }
        }
    }
</script>
<style lang="scss">
</style>
