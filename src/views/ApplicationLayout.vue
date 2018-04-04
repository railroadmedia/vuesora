<template>
    <div class="container pt-3">
        <h1 class="heading text-center">Application Layout</h1>
        <p class="body font-light mb-5 text-center">All of the properties for basic page flow and consistency, from the grid, to spacing, to the typography.</p>

        <div id="grid-system" class="flex flex-column bg-white shadow corners-3 pa">
            <h2 class="subheading text-secondary">Grid System</h2>
            <p class="body mb-3">Vuesora uses a 12 point grid system. Built using the <span class="keyword">flex-box</span> css spec, the grid is used to layout an application’s content. It contains 5 types of media breakpoints that are used for targeting specific screen sizes or orientations. The modifier classes represent a fraction of the pages width over 12.</p>
            <h4 class="title text-secondary">Breakpoints</h4>
            <table class="mb-3 body">
                <thead class="bg-primary text-white">
                    <tr>
                        <td class="pa-1 corners-top-5">Breakpoint</td>
                        <td class="pa-1 corners-top-5">Acronym</td>
                        <td class="pa-1 corners-top-5">Type</td>
                        <td class="pa-1 corners-top-5">Range</td>
                    </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1">Extra Small</td>
                    <td class="pa-1 font-bold">xs</td>
                    <td class="pa-1">small to large handset</td>
                    <td class="pa-1">< 640px</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1">Small</td>
                    <td class="pa-1 font-bold">sm</td>
                    <td class="pa-1">small to medium tablet</td>
                    <td class="pa-1">641px - 1025px</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1">Medium</td>
                    <td class="pa-1 font-bold">md</td>
                    <td class="pa-1">large tablet to laptop</td>
                    <td class="pa-1">1026px - 1240px</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1">Large</td>
                    <td class="pa-1 font-bold">lg</td>
                    <td class="pa-1">desktop</td>
                    <td class="pa-1">1241px - 1940px</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1">Extra Large</td>
                    <td class="pa-1 font-bold">xl</td>
                    <td class="pa-1">4k and ultra-wides</td>
                    <td class="pa-1">< 1940px</td>
                </tr>
            </table>

            <h4 class="title text-secondary">Usage</h4>
            <p class="body mb-1">All content MUST be placed in a parent <span class="keyword">.container</span> this creates the basic responsive page container, flex content can then be placed inside, and behave as expected. <span class="keyword">.container</span> can be given the <span class="keyword">.fluid</span> class and it will always take up 100% of the viewports width.</p>
            <p class="body mb-1">Flex containers can then be created using the <span class="keyword">.flex</span> class, this will create a container with the <span class="keyword">display: flex;</span> property with the grow and shrink properties set to 1, and the flex basis at auto (including all children). To control the flex direction either use the <span class="keyword">.flex-row</span> or <span class="keyword">.flex-column</span> classes.</p>
            <ul class="body mb-1">
                <li><span class="keyword">.flex-row</span> will make the the content flow along the X-Axis</li>
                <li><span class="keyword">.flex-column</span> will make the the content flow along the Y-Axis</li>
                <li>This means that the child containers will take up the amount of space specified in the <span class="keyword">flex-basis</span> property <i>(on the axis of the parents' flex-direction)</i>, which is by default - <span class="keyword">auto</span></li>
            </ul>
            <p class="body mb-3">In order to specify the <span class="keyword">flex-basis</span> property we use the grid modifier classes, prepended by the breakpoint acronym, and appended by the numerator (between 1 and 12), it looks something like this <span class="keyword">.{ acronym }-{ numerator }</span>. For example: the modifier class <span class="keyword">.sm-10</span> specifies that all the container will take up 10 out of 12 units or 83.33%, starting at the <span class="keyword">small</span> breakpoint. Keep in mind that flex containers with a modifier class will have the <span class="keyword">flex-grow</span> and <span class="keyword">flex-shrink</span> properties set to 0. (This way they will always be the width/height specified in the modifier.)</p>

            <div class="flex flex-row collapsed flex-wrap mb-3">
                <div class="flex flex-column xs-12 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-primary">12</div>
                </div>
                <div class="flex flex-column xs-6 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">6</div>
                </div>
                <div class="flex flex-column xs-6 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">6</div>
                </div>
                <div class="flex flex-column xs-4 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">4</div>
                </div>
                <div class="flex flex-column xs-4 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">4</div>
                </div>
                <div class="flex flex-column xs-4 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">4</div>
                </div>
                <div class="flex flex-column xs-3 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">3</div>
                </div>
                <div class="flex flex-column xs-3 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">3</div>
                </div>
                <div class="flex flex-column xs-3 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">3</div>
                </div>
                <div class="flex flex-column xs-3 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">3</div>
                </div>
                <div class="flex flex-column xs-2 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">2</div>
                </div>
                <div class="flex flex-column xs-2 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">2</div>
                </div>
                <div class="flex flex-column xs-2 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">2</div>
                </div>
                <div class="flex flex-column xs-2 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">2</div>
                </div>
                <div class="flex flex-column xs-2 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">2</div>
                </div>
                <div class="flex flex-column xs-2 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">2</div>
                </div>
                <div class="flex flex-column xs-8 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">8</div>
                </div>
                <div class="flex flex-column xs-4 test-col mb ph">
                    <div class="flex flex-column align-center bg-secondary text-white">4</div>
                </div>
                <div class="flex flex-column xs-3 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">3</div>
                </div>
                <div class="flex flex-column xs-6 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">6</div>
                </div>
                <div class="flex flex-column xs-2 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">2</div>
                </div>
                <div class="flex flex-column xs-1 test-col mb ph">
                    <div class="flex flex-column align-center bg-primary text-white">1</div>
                </div>
            </div>

            <p class="body font-bold text-secondary">Offsets</p>
            <p class="body mb-3">Offsets can also be applied to flex containers if a specific amount of white space is required. Simply use the modifier class with the offset property. It works exactly like the flex basis modifier just with the <span class="keyword">offset</span> keyword added, so it looks something like <span class="keyword">.{ acronym }-offset-{numerator}</span>, where the numerator is still a number between 1-12. For example: the modifier class <span class="keyword">.sm-offset-3</span> will specify an offset of 3/12 units or 25% starting at the small breakpoint.</p>

            <div class="flex flex-row collapsed flex-wrap mb-3">
                <div class="flex flex-column xs-8 xs-offset-2 test-col mb">
                    <div class="flex flex-column align-center text-white bg-primary">8</div>
                </div>
                <div class="flex flex-column xs-4 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-secondary">4</div>
                </div>
                <div class="flex flex-column xs-4 xs-offset-4 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-secondary">4</div>
                </div>
                <div class="flex flex-column xs-3 xs-offset-3 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-primary">3</div>
                </div>
                <div class="flex flex-column xs-3 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-primary">3</div>
                </div>
                <div class="flex flex-column xs-6 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-secondary">6</div>
                </div>
                <div class="flex flex-column xs-2 xs-offset-1 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-secondary">2</div>
                </div>
                <div class="flex flex-column xs-2 xs-offset-1 test-col mb ph">
                    <div class="flex flex-column align-center text-white bg-secondary">2</div>
                </div>
            </div>

            <p class="body mb-3"><i>Keep in mind that using offsets can have unintended behaviors when it comes to wrapping flex containers. If you have child containers that don't take up the full width of the parent, following children will likely stay on the same row, if you wish to create separate rows, use a another <span class="keyword">.flex-row</span></i></p>

            <p class="body font-bold text-secondary">Visibility</p>
            <p class="body mb-3">Responsive visibility is also achieved using the same convention as the grid and offsets, simply prepend the breakpoint acronym with the hide property and append it with the condition <span class="keyword">.hide-{ acronym }-{ condition }</span>. For example <span class="keyword">.hide-sm-only</span> will hide the element ONLY on the small breakpoint, <span class="keyword">.hide-sm-up</span> will hide the element from the small breakpoint and up, only visible on the extra small breakpoint. The same works the other way with <span class="keyword">.hide-sm-down</span>.</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "application-layout",
        data() {
            return {

            }
        },
        components: {

        },
        methods: {
            scrollToSection(element){
                const section = document.getElementById(element),
                      view = document.getElementById('view');

                view.scrollTop = section.offsetTop;
            }
        },
        created(){
            this.$root.$on('scrollTo', payload => {
                this.scrollToSection(payload.element);
            })
        },
        beforeDestroy(){
            this.$root.$off('scrollTo');
        }
    };
</script>

<style lang="scss" scoped>
    @import '../assets/sass/partials/_variables.scss';

    .test-col {
        height:40px;

        div {
            font-size:10px;
        }
    }
</style>
