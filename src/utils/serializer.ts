export default class Serializer{
	private readonly types: any[];
	constructor(types: any[]){
		this.types = types;
	}

	serialize(object: any) {
		let idx = this.types.findIndex((e)=> {
			return e.name == object.constructor.name
		});
		if (idx == -1) throw "type  '" + object.constructor.name + "' not initialized";
		console.log([idx, Object.entries(object)]);
		return JSON.stringify([idx, Object.entries(object)]);
	}
	deserialize(jstring: string) {
		let array = JSON.parse(jstring);
		let type = this.types[array[0]];
		let object = new type();
		array[1].map((e: any)=>{
			object[e[0]] = e[1];
		});
		return object;
	}
}