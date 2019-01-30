<template>
    <div class="container narrow pt-3">
        <h1 class="heading text-center">Application Layout</h1>
        <p class="body font-light mb-5 text-center">All of the properties for basic page flow and consistency, from the grid, to spacing, to the typography.</p>

        <!-- GRID SYSTEM -->
        <div id="grid-system" class="flex flex-column pa mb-4">
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
                    <td class="pa-1">> 1940px</td>
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

            <h4 class="title text-secondary">Offsets</h4>
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

            <h4 class="title  text-secondary">Visibility</h4>
            <p class="body mb-3">Responsive visibility is also achieved using the same convention as the grid and offsets, simply prepend the breakpoint acronym with the hide property and append it with the condition <span class="keyword">.hide-{ acronym }-{ condition }</span>. For example <span class="keyword">.hide-sm-only</span> will hide the element ONLY on the small breakpoint, <span class="keyword">.hide-sm-up</span> will hide the element from the small breakpoint and up, only visible on the extra small breakpoint. The same works the other way with <span class="keyword">.hide-sm-down</span>.</p>
        </div>

        <!-- SPACING -->
        <div id="spacing" class="flex flex-column pa mb-5">
            <h2 class="subheading text-secondary">Spacing</h2>
            <p class="body mb-3">Vuesora uses a dyamic spacing system built off of a variable titled <span class="keyword">$gutterWidth</span> which is defined at 1.875rem (roughly 32px). To add spacing to an element either use the margin or padding modifiers using the following convention <span class="keyword">{ type }{ part }-{ amount }</span>.</p>

            <p class="body">The <span class="keyword">{ type }</span> applies the type of spacing:</p>
            <ul class="body mb-3">
                <li><span class="keyword">p</span> - applies padding.</li>
                <li><span class="keyword">m</span> - applies margin.</li>
            </ul>

            <p class="body">The <span class="keyword">{ part }</span> applies to a specific part of the element:</p>
            <ul class="body mb-3">
                <li><span class="keyword">a</span> - applies spacing to all sides</li>
                <li><span class="keyword">v</span> - applies spacing to the top and bottom.</li>
                <li><span class="keyword">h</span> - applies spacing to the left and right.</li>
                <li><span class="keyword">t</span> - applies spacing to the top.</li>
                <li><span class="keyword">b</span> - applies spacing to the bottom.</li>
                <li><span class="keyword">l</span> - applies spacing to the left.</li>
                <li><span class="keyword">r</span> - applies spacing to the right.</li>
            </ul>

            <p class="body">The <span class="keyword">{ amount }</span> applies the amount of spacing:</p>
            <ul class="body mb-3">
                <li><span class="keyword">1</span> - $gutterWidth divided by 3</li>
                <li><span class="keyword">2</span> - $gutterWidth divided by 2</li>
                <li><span class="keyword">3</span> - $gutterWidth</li>
                <li><span class="keyword">4</span> - $gutterWidth multiplied by 1.5</li>
                <li><span class="keyword">5</span> - $gutterWidth multiplied by 1.666</li>
            </ul>

            <p class="body mb-3">For Example: <span class="keyword">.pa-3</span> will add the base amount of spacing to all edges of an element as padding.</p>

            <p class="body"><i>Alternatively, you can choose to omit the <span class="keyword">{ amount }</span> to give it a responsive spacing amount. (Equivalent to 2 on desktop and tablet sizes and 1 on mobile sizes) Ex: <span class="keyword">.pa</span></i></p>
        </div>

        <div id="typography" class="flex flex-column pa">
            <h2 class="subheading text-secondary">Typography</h2>
            <p class="body mb-3">For the sake of consistency, Vuesora has 8 standards for font sizes. Simply give any element a class matching the table below ex. <span class="keyword">.heading</span> will give you the heading font style</p>


            <table class="body">
                <thead class="bg-primary text-white">
                    <tr>
                        <td class="pa-1 corners-top-5">Sample</td>
                        <td class="pa-1 corners-top-5">Large</td>
                        <td class="pa-1 corners-top-5">Medium</td>
                        <td class="pa-1 corners-top-5">Small</td>
                        <td class="pa-1 corners-top-5">Weight</td>
                    </tr>
                </thead>
                <tr class="bg-light">
                    <td class="display pa-1">Display</td>
                    <td class="pa-1">40px</td>
                    <td class="pa-1">36px</td>
                    <td class="pa-1">32px</td>
                    <td class="pa-1">700</td>
                </tr>
                <tr class="bg-light">
                    <td class="heading pa-1">Heading</td>
                    <td class="pa-1">32px</td>
                    <td class="pa-1">28px</td>
                    <td class="pa-1">24px</td>
                    <td class="pa-1">700</td>
                </tr>
                <tr class="bg-light">
                    <td class="subheading pa-1">Subheading</td>
                    <td class="pa-1">24px</td>
                    <td class="pa-1">22px</td>
                    <td class="pa-1">20px</td>
                    <td class="pa-1">600</td>
                </tr>
                <tr class="bg-light">
                    <td class="title pa-1">Title</td>
                    <td class="pa-1">20px</td>
                    <td class="pa-1">18px</td>
                    <td class="pa-1">18px</td>
                    <td class="pa-1">600</td>
                </tr>
                <tr class="bg-light">
                    <td class="body pa-1">Body</td>
                    <td class="pa-1">16px</td>
                    <td class="pa-1">16px</td>
                    <td class="pa-1">16px</td>
                    <td class="pa-1">400</td>
                </tr>
                <tr class="bg-light">
                    <td class="tiny pa-1">Tiny</td>
                    <td class="pa-1">13px</td>
                    <td class="pa-1">13px</td>
                    <td class="pa-1">13px</td>
                    <td class="pa-1">400</td>
                </tr>
                <tr class="bg-light">
                    <td class="x-tiny pa-1">X-Tiny</td>
                    <td class="pa-1">10px</td>
                    <td class="pa-1">10px</td>
                    <td class="pa-1">10px</td>
                    <td class="pa-1">400</td>
                </tr>
            </table>

            <p class="mt-2 body dense mb-3">If you wish to use the compressed font in Vuesora, add the <span class="keyword">.dense</span> class to the element</p>
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

<style lang="scss">
    @import '../assets/sass/partials/_variables.scss';

    .test-col {
        height:40px;

        div {
            font-size:10px;
        }
    }
</style>
