<template>
<div class="container">
  <h2>{{ (dataObject.name)? dataObject.name : dataObject.type}} </h2>
  <table>   
    <tr><td>GUID</td><td>{{ dataObject.guid }}</td></tr>
    <tr><td>OID</td><td>{{ dataObject.oid }}</td></tr>
    <tr><td>Type</td><td>{{ dataObject.type }}</td></tr> 
    <tr v-for="(value, index) in dataObject.values" :key="index">

      <template v-if="value.kind==='SimpleDataValue'">
        <td>{{value.name}}</td><td>{{ value.value || "[No value]" }}</td>      
      </template>

      <template v-if="value.kind==='ReferenceDataValue'">
        <td>{{value.name}}</td>
        <td>
          <span @click="selectOid(value.oid)" class="reference">{{ `[REF: ${value.oid}]` }}</span> 
          {{ value.value }}
          </td>      
      </template>

      <template v-if="value.kind==='ListDataValue'">
        <td>[LIST] {{value.name}}</td>
        <td>
          <ul class="detail-ul">
            <li v-for="(iv, index) in value.value" :key="index">
              <template v-if="iv.kind==='SimpleDataValue'">
                {{ iv.value }}
              </template>

              <template v-if="iv.kind==='ReferenceDataValue'">
                <span @click="selectOid(iv.oid)" class="reference">{{ `[REF: ${iv.oid}]` }}</span> {{ iv.value }}
              </template>

              <template v-if="iv.kind==='ListDataValue'">
                ListDataValue
              </template>
            </li>
          </ul>
        </td>      
      </template>
    </tr> 
    
  </table>
</div>
</template>

<script>
export default {
  name: "object-detail",
  props: ["dataObject"],
  methods: {
    selectOid(oid) {
      this.$emit('selectedOid', oid);
    }
  }
};
</script>

<style>
ul.detail-ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.reference {
  text-decoration: underline;
  color: darkblue;
  cursor: pointer;
}

.container {
  padding: 10px;
}
</style>

