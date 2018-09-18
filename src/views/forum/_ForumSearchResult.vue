<template>
    <a :href="item.url"
       class="content-table-row flex flex-row bt-grey-1-1 no-decoration pa-1">
        <div class="flex flex-column avatar-col align-v-center">
            <div class="thumb-img square rounded bg-center"
                 :style="'background-image:url(' + item.authorAvatar + ');'"></div>
        </div>

        <div class="flex flex-column align-v-center pl-1 title-column overflow">

            <p class="body text-black font-bold item-title" v-html="item.thread.title">
            </p>

            <div class="pl search-result-post">
                <p class="tiny text-grey-4 font-italic" v-html="postBodyHighlighted"></p>

                <p class="x-tiny text-dark uppercase font-italic">
                    replied <strong>{{ item.createdOn }}</strong> by <strong>{{ item.authorUsername }}</strong>
                </p>
            </div>
        </div>

        <div class="flex flex-column align-center basic-col text-dark font-italic x-tiny hide-sm-down uppercase">
            {{ topicIdMap }}
        </div>

        <div class="flex flex-column align-center basic-col text-dark font-italic x-tiny hide-sm-down uppercase">
            {{ (item.thread.replyAmount - 1) }} {{ (item.thread.replyAmount - 1) === 1 ? 'reply' : 'replies' }}
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="square body">
                <i class="fas fa-arrow-circle-right flex-center rounded text-light"></i>
            </div>
        </div>
    </a>
</template>
<script>
    import BrandClasses from '../../mixins/BrandClasses.js'

    export default {
        mixins: [BrandClasses],
        name: 'forum-search-result',
        props: {
            item: {
                type: Object,
                default: () => {}
            },

            term: {
                type: String,
                default: () => ''
            }
        },
        computed: {
            postBodyHighlighted(){
                const regex = new RegExp(this.term, 'gi');
                const matches = this.item.postBody.match(regex);
                let bodyString = this.item.postBody;

                // We find all matches and insert an opening and closing span tag around that match
                // The reason we start with the closing tag is so that it doesn't change the index of the "end"
                // variable after we add the opening span tag
                // - Curtis Sept 2018

                if(matches){
                    matches.forEach(match => {
                        let start = this.item.postBody.indexOf(match);
                        let end = start + this.term.length;

                        // insert closing span tag
                        bodyString = this.item.postBody.substr(0, end) + '</span>' + this.item.postBody.substr(end);
                        // insert opening span tag
                        bodyString = bodyString.substr(0, start) + '<span class="font-bold text-black">' + bodyString.substr(start);
                    });
                }

                return bodyString;
            },

            topicIdMap() {
                const topics = {
                    1: 'general',
                    2: 'gear',
                    3: 'website feedback',
                    4: 'off topic'
                };

                return topics[this.item.thread.topic];
            }
        },
        mounted(){

        }
    }
</script>