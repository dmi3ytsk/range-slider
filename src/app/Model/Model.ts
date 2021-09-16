import Observer from "../Observer/Observer";
import defaultAttributes from "../const";

class Model extends Observer {
  data: any;

  static defaultAttributes = defaultAttributes;

  constructor(options = Model.defaultAttributes) {
    super();
    this.data = options;
  }

}

export default Model;
