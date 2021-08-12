<template>
    <a
        :href="item.url+'?sortby_val=published_on'"
        class="content-table-row tw-flex bt-grey-1-1 tw-no-underline tw-px-4 tw-py-5"
        :class="[brandHoverColor]"
    >
        <!-- Avatar -->

        <!-- Result Body -->
        <div class="tw-flex tw-flex-col tw-text-black tw-mr-10">
            <p
                class="tw-font-bold tw-mb-1"
                v-html="item.thread.title"
            >
            </p>
            <p
                class="tw-text-sm tw-mb-1"
                v-html="postBodyHighlighted"
            ></p>
            <!-- Reply Date -->
            <p class="tw-text-xs tw-text-gray-500 tw-italic">
                Replied <strong>{{ item.createdOn }}</strong> by <strong>{{ item.authorUsername }}</strong>
            </p>
        </div>
        <!-- Repy Count -->
        <div class="tw-justify-center tw-items-center tw-text-gray-600 tw-italic tw-text-xs hide-sm-down tw-uppercase basic-col tw-hidden md:tw-flex">
            <i class="fa fa-comment-lines tw-mr-1"></i> 
            <strong>{{ (item.thread.replyAmount - 1) }}</strong>
            
        </div>
        <!-- Topic/Category -->
        <div class="tw-flex-col tw-justify-center tw-text-gray-600 tw-italic tw-text-xs hide-sm-down basic-col tw-capitalize tw-hidden md:tw-flex">
            {{ topicIdMap }}
        </div>
        <!-- Arrow -->
        <div class="tw-flex tw-flex-col tw-justify-center icon-col">
            <i class="fas fa-arrow-circle-right flex-center rounded text-light tw-p-2"></i>
        </div>
    </a>
</template>
<script>
export default {
    name: 'ForumSearchResult',
    props: {
        item: {
            type: Object,
            default: () => {},
        },

        term: {
            type: String,
            default: () => '',
        },

        brand: {
            type: String,
            default: () => '',
        },
    },
    computed: {
        postBodyHighlighted() {
            const regex = new RegExp(this.term, 'gi');
            const matches = this.item.postBody.match(regex);
            let bodyString = this.item.postBody;

            // We find all matches and insert an opening and closing span tag around that match
            // The reason we start with the closing tag is so that it doesn't change the index of the "end"
            // variable after we add the opening span tag
            // - Curtis Sept 2018

            if (matches) {
                matches.forEach((match) => {
                    const start = this.item.postBody.indexOf(match);
                    const end = start + this.term.length;

                    // insert closing span tag
                    bodyString = `${this.item.postBody.substr(0, end)}</span>${this.item.postBody.substr(end)}`;
                    // insert opening span tag
                    bodyString = `${bodyString.substr(0, start)}<span class="tw-font-bold tw-text-black">${bodyString.substr(start)}`;
                });
            }

            return bodyString;
        },

        topicIdMap() {
            const topics = {
                1: 'general',
                2: 'gear',
                3: 'website feedback',
                4: 'off topic',
            };

            return topics[this.item.thread.topic];
        },

        brandHoverColor() {
            return 'hover:tw-bg-'+this.brand+'-100'
        },

        avatarClassObject() {
            return {
                subscriber: ['edge', 'lifetime', 'team', 'admin', 'guitar', 'piano'].indexOf(this.item.access_level) !== -1,
                edge: this.item.access_level === 'edge',
                pack: this.item.access_level === 'pack',
                team: ['team', 'admin'].indexOf(this.item.access_level) !== -1,
                guitar: this.item.access_level === 'guitar',
                piano: this.item.access_level === 'piano',
                lifetime: this.item.access_level === 'lifetime',
            };
        },
    },
};
</script>
