class SimpleDataValue {
    constructor(rawValue) {
        this.name = rawValue.fieldName;
        this.value = rawValue.stringValue;
        this.kind = "SimpleDataValue";
    };
}

class ReferenceDataValue {
    constructor(rawValue) {
        this.name = rawValue.fieldName;
        this.value = rawValue.typeName;
        this.oid = rawValue.oid;
        this.kind = "ReferenceDataValue";
    };
} 

class ListDataValue {
    constructor(rawValue) {
        this.name = rawValue.fieldName;
        this.value = rawValue.values.map(buildValue);
        this.kind = "ListDataValue";
    };
}

function buildValue(val) {
    switch (val.__type) {
        case "SSimpleDataValue":
            return new SimpleDataValue(val);
        case "SListDataValue":
            return new ListDataValue(val);
        case "SReferenceDataValue":
            return new ReferenceDataValue(val);
    }
}

export default class DataObject {
   constructor(rawObject) {
       this.guid = rawObject.guid;
       this.name = rawObject.name;
       this.oid = rawObject.oid;
       this.values = rawObject.values.map(buildValue);
       this.type = rawObject.type;
   }
   
    getStringDescription() {
        return [this.type, this.name, `(${this.oid})`].join('\n').replace('\n\n', '\n');
    }

}