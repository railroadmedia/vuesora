<script>

  import Vue from 'vue'
  import NotificationToasts from './NotificationToasts.vue'
  Vue.config.productionTip = false

  export default {
  name: "NotificationToastsContainer",
  props: {
    brandName: {
      type: String,
      default: () => 'drumeo',
    },
    firstName: {
      type: String,
      default: () => 'TEST',
    },
  },
  mounted() {
    var ComponentClass = Vue.extend(NotificationToasts)
    var instance = new ComponentClass({
      propsData: { firstName: 'Yalung', brandName: 'pianote' }
    });
    instance.$mount();
    console.log(this.$refs)
    this.$refs.toastsContainer.appendChild(instance.$el)
  },
};

</script>