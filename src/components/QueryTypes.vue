<template>
  <div>
    <h2>Query by types</h2>
    <h3>Tipi disponibili</h3>
    <input type="text" v-model="typesFilter" placeholder="Filtra lista"/>
    <ul style="height:100px; overflow-y:scroll;">
      <li v-for="(type, index) in filteredTypes" :key="index">
        <span @click="toggleType(type)">{{type}}</span>
      </li>
    </ul>
    <h3>Tipi selezionati</h3>
    <ul style="height:100px; overflow-y:scroll;">
      <li v-for="(type, index) in selectedTypes" :key="index">
        <span @click="toggleType(type)">{{type}}</span>
      </li>
    </ul>
    <button @click="clearSelected">Pulisci selezione</button>
    <button @click="loadAll" :disabled="selectedTypes.length === 0">Esegui query</button>
    
  </div>
</template>

<script>
import bimServerApi from "../utils/bimServerClient";

function getTypesFromSummary(revisionSummary) {
  let types = revisionSummary.list.reduce((partial, summaryContainer) => {
    //console.log(`----- ${summaryContainer.name} -----`);
    let types = summaryContainer.types.map(type => type.name);
    //console.log(types);
    //console.log(`Tipi trovati: ${types.length}`);
    return partial.concat(types);
  }, []);
  return types;
}

export default {
  name: "query-types",
  props: ["project"],
  data() {
    return {
      typesFilter: "",
      selectedTypes: [],
      types: null,
      summary: null
    };
  },
  computed: {
    filteredTypes: function() {
      if (this.typesFilter === "") return this.types;
      let regex = new RegExp(`${this.typesFilter}`, "gi");
      return this.types.filter(type => type.match(regex) !== null);
    }
  },

  methods: {
    toggleType(type) {
      //console.log(type);
      let index = this.selectedTypes.indexOf(type);
      if (index === -1) {
        this.selectedTypes.push(type);
      } else {
        this.selectedTypes.splice(index, 1);
      }
    },
    clearSelected() {
      this.selectedTypes = [];
    },
    loadAll() {
      this.$emit("selectedTypes", this.selectedTypes);
    },
    getRevisionSummary() {
      console.log("getRevisionSummary");
      bimServerApi
        .promiseCall("ServiceInterface", "getRevisionSummary", {
          roid: this.project.rid
        })
        .then(data => {
          //onsole.log(data);
          this.summary = data;
          let types = getTypesFromSummary(data);
          this.types = types;

          console.log(types);
        });
    }
  },

  mounted() {
    this.getRevisionSummary();
  }
};
</script>
