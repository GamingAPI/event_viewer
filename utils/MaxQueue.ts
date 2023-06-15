/**
 * Simple max queue implementation
 * 
 * Used to limit the number of messages that is cached on the server.
 */
export class MaxQueue {
	elements: any[];
	maxSize: number;
	constructor(args: {
	  maxSize?: number,
	  elements?: any[]
	}) {
	  this.maxSize = args.maxSize || 10;
	  this.elements = [...args.elements || []];
	}
  
	push(...args: any[]) {
	  if(this.getLength() >= this.maxSize){
		this.pop();
	  }
	  return this.elements.push(...args);
	}
  
	pop(...args: any[]) {
	  return this.elements.pop();
	}
	
	getLength() {
	  return this.elements.length;
	}
}