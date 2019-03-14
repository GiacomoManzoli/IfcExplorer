<template>
  <div class="cy-container">
    <div id="cy"></div>
  </div>
</template>

<script>
const cytoscape = require("cytoscape");

let cy = null;

let addedNodes = new Set();

function addNodeToCytoscape(cy, dataObject) {
  cy.add({
    group: "nodes",
    data: {
      id: dataObject.oid,
      name: dataObject.getStringDescription(),
      object: dataObject,
      weight: 200
    }
  });
  addedNodes.add(dataObject.oid);
}

function addEdgesToCytoscape(cy, dataObject) {
  dataObject.values.forEach(val => {
    if (val.kind === "ListDataValue") {
      val.value.map(innerVal => {
        if (innerVal.kind === "ReferenceDataValue") {
          if (addedNodes.has(innerVal.oid)) {
            cy.add({
              group: "edges",
              data: { source: dataObject.oid, target: innerVal.oid }
            });
          }
        }
      });
    }
  });
}
let mapNodes = new Map();

export default {
  name: "cytoscape-holder",
  props: ["nodes"],
  watch: {
    nodes: function(newNodes) {
      console.log(this.nodes.length, newNodes.length);
      cy.startBatch();
      cy.elements().remove();
      this.nodes.forEach(dataObject => addNodeToCytoscape(cy, dataObject));
      this.nodes.forEach(dataObject => addEdgesToCytoscape(cy, dataObject));
      cy.endBatch();
      cy.resize(); // Necessario!
      let layout = cy.layout({ name: "grid" });
      layout.run();
      //cy.fit();
      console.log("Cytoscape update done!");
    }
  },
  mounted() {
    // Inizializza cytoscape
    const othis = this;
    cy = cytoscape({
      container: document.querySelector("#cy"),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: cytoscape
        .stylesheet()
        .selector("node")
        .css({
          shape: "rectangle",
          content: "data(name)",
          "text-wrap": "wrap",
          "text-valign": "center",
          width: 50,
          height: 50,
          color: "white",
          "text-outline-width": 2,
          "background-color": "#999",
          "text-outline-color": "#999"
        })
        .selector("edge")
        .css({
          // "curve-style": "bezier",
          // "target-arrow-shape": "triangle",
          // "target-arrow-color": "#ccc",
          "line-color": "#ccc",
          width: 1
        })
        .selector(":selected")
        .css({
          "background-color": "black",
          "line-color": "black",
          "target-arrow-color": "black",
          "source-arrow-color": "black"
        })
        .selector(".faded")
        .css({
          opacity: 0.25,
          "text-opacity": 0
        }),

      layout: {
        name: "breadthfirst"
      }
    });

    cy.on("tap", "node", function(e) {
      let nodeData = e.target.data();
      let dataObject = nodeData.object;
      console.log("selected node");
      othis.$emit('selectedDataObject', dataObject);
    });
  }
};
</script>

<style>
.cy-container {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1100;
}

#cy {
  position: absolute;
  overflow: hidden !important;
  z-index: 1110;
  width: 100%;
  height: 100%;
}
</style>
