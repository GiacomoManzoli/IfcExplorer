<template>
  <div>
    <h2>Query by GUID</h2>
    <input type="text" v-model="guid" placeholder="GUID"/>  
    <button @click="queryByGuid" :disabled="guid === ''">Esegui query</button>
  </div>
</template>

<script>

export default {
  name: "query-guid",
  data() {
    return {
      guid: ''
    };
  },

  methods: {
    queryByGuid() {
      this.$emit('queryByGuid', this.guid);
    }
  }
};
</script>
