<template>
<div id="app">
  <!--<h2>Progetti presenti:</h2>
  <ul>
      <li v-for="project in projects" :key="project.oid">
          <button>{{project.name}}</button>
      </li>
  </ul>-->
  <div>
    <project-info v-if="currentProject"
      :project="currentProject">
    </project-info>
  </div>
  <div class="main">
    <div class="left-col">
      <query-guid @queryByGuid="queryByGuid"></query-guid>
      <query-oid @queryByOid="queryByOid"></query-oid>
      <query-types
        v-if="currentProject"
        :project="currentProject"
        @selectedTypes="selectedTypesQuery"></query-types>
    </div>
    <div class="central-col"> 
      <cytoscape-holder :nodes="dataObjects"
        @selectedDataObject="selectedDataObject"></cytoscape-holder>
    </div>
    <div class="right-col">
        {{currentQuery}}
        <object-detail 
          v-if="currentObject"
          :data-object="currentObject"
          @selectedOid="selectedOid"></object-detail>
    </div>
  </div>
</div>

</template>

<script>
import Project from "./model/Project";
import DataObject from "./model/DataObject";

import QueryTypes from "./components/QueryTypes";
import QueryGuid from "./components/QueryByGUID";
import QueryOid from "./components/QueryByOID";

import CytoscapeHolder from "./components/CytoscapeHolder";
import ProjectInfo from "./components/ProjectInfo";
import ObjectDetail from "./components/ObjectDetail";

const BIM_SERVER_ADDRESS = "http://localhost:8888";
const USERNAME = "bim@888sp.it";
const PASSWORD = "bim";

import bimServerApi from "./utils/bimServerClient";

import Dummy from './model/DummyObject'

let x = new Dummy("12");
console.log(x);


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
  name: "app",
  components: { QueryGuid, QueryOid, ProjectInfo, QueryTypes, CytoscapeHolder, ObjectDetail },
  data() {
    return {
      message: "Welcome to Your Vue.js App",
      projects: [],
      dataObjects: null,
      currentProject: null,
      currentQuery: '',
      currentObject: null
    };
  },

  methods: {
    selectedDataObject(dataObject) {
      console.log("evHandler");
      this.currentObject = dataObject;
    },
    selectedOid(oid) {
      bimServerApi.promiseCall("LowLevelInterface", "getDataObjectByOid", {
        roid: this.currentProject.rid,
        oid: oid
      })
      .then((data) => {
        let dataObject = new DataObject(data);
        this.currentObject = dataObject;
        this.dataObjects.push(dataObject);
      });
    },
    queryByOid(oid) {
      this.currentQuery = `Select by Oid: ${oid}`;
      let p = bimServerApi.promiseCall("LowLevelInterface", "getDataObjectByOid", {
          roid: this.currentProject.rid,
          oid: oid
        })
        .then((data) => {
          console.log(data);
          let dataObject = new DataObject(data);
          console.log(new DataObject(data));
          this.currentObject = dataObject;
          this.dataObjects = [dataObject];
        });
    },
    queryByGuid(guid) {
      this.currentQuery = `Select by GUID: ${guid}`;
      let p = bimServerApi.promiseCall("LowLevelInterface", "getDataObjectByGuid", {
          roid: this.currentProject.rid,
          guid: guid
        })
        .then((data) => {
          console.log(data);
          let dataObject = new DataObject(data);
          this.currentObject = dataObject;
          this.dataObjects = [dataObject];
        });
    },

    selectedTypesQuery(selectedTypes) {
      this.currentQuery = `Select by types: [${selectedTypes.join(', ')}]`;
      let promises = selectedTypes.reduce((partial, type) => {
        let p = bimServerApi
          .promiseCall("LowLevelInterface", "getDataObjectsByType", {
            roid: this.currentProject.rid,
            packageName: this.currentProject.schema,
            className: type,
            flat: false
          })
          .then(data => {
            console.log(data);
            return data.map(d => new DataObject(d));
          });
        partial.push(p);
        return partial;
      }, []);

      Promise.all(promises)
        .then(allDataObjects => {
          // riduce l'array di array in un unico array
          console.log(allDataObjects);
          //return [];
          return allDataObjects.reduce(
            (partial, dataObjects) => partial.concat(dataObjects),
            []
          );
        })
        .then(allDataObjects => {
          console.log(allDataObjects);
          this.dataObjects = allDataObjects;
        });
    }
  },

  mounted() {
    let othis = this;
    console.group("api-init");
    bimServerApi.init(function(client, serverInfo) {
      // console.log(client === bimServerApi); -> true!!
      let serverState = serverInfo.serverState;
      let serverVersion = serverInfo.version.fullString;
      console.log(
        `API initialized - Status: ${serverState} - Version: ${serverVersion}`
      );
      bimServerApi.login(USERNAME, PASSWORD, data => {
        console.log("Logged-in");
        console.groupEnd("api-init");
        bimServerApi.call(
          "ServiceInterface",
          "getAllProjects",
          {
            onlyTopLevel: "true",
            onlyActive: "true"
          },
          function(projects) {
            othis.projects = projects.map(
              rawProject => new Project(rawProject)
            );
            //console.log(othis.projects);
            // TODO: change me
            othis.currentProject = othis.projects[0];
          }
        );
      });
    });
  }
};
</script>

<style>
.left-col {
  width: 300px;
  background: green;
}

.central-col {
  flex: 1 1 auto;
}

.right-col {
  background: red;
  
}

.main {
  flex: 1 1 auto;
  display: flex;
  flex-flow: row;
}

#app {
  display: flex;
  flex-flow: column;
}


</style>
