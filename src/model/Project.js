export default class Project {
    constructor(rawProject) {
        this.name = rawProject.name;
        this.oid = rawProject.oid;
        this.rid = rawProject.lastRevisionId;
        this.schema = rawProject.schema;
    };
}