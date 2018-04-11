import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ApplicationLayout from "./views/ApplicationLayout.vue";
import MediaElementDocs from "./views/docs/MediaElementDocs.vue";
import FormInputs from "./views/docs/FormInputs.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/application-layout",
            name: "application-layout",
            component: ApplicationLayout
        },
        {
            path: "/docs/media-element",
            name: "media-player-docs",
            component: MediaElementDocs
        },
        {
            path: "/docs/form-inputs",
            name: "form-inputs-docs",
            component: FormInputs
        },
    ]
});
