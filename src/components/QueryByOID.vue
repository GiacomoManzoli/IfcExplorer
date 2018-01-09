<template>
  <div>
    <h2>Query by oid</h2>
    <input type="text" v-model="oid" placeholder="oid"/>  
    <button @click="query" :disabled="oid === ''">Esegui query</button>
  </div>
</template>

<script>
export default {
  name: "query-oid",
  data() {
    return {
      oid: ""
    };
  },

  methods: {
    query() {
      this.$emit("queryByOid", this.oid);
    }
  }
};
</script>
