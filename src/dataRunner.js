import {ListenerHandler} from './listen.js';

// Class to handle running functions.
export class DataRunner {

  // data list
  #dataList;
  // function runner
  #functionRunner;

  /**
   * Current data index
   *
   * @type {number}
   */
  #dataIndex = 0;

  // result array
  #results;

  /**
   * Status
   *
   * @type {string}
   */
  #status = 'ready';

  /**
   * Listener handler.
   *
   * @type {ListenerHandler}
   */
  #listenerHandler = new ListenerHandler();

  /**
   * Get the status.
   */
  getStatus() {
    return this.#status;
  };

  /**
   * Get the results.
   */
  getResults() {
    return this.#results;
  };

  /**
   * Get the data header.
   */
  getDataHeader() {
    var header = [];
    for (let data of this.#dataList) {
      header.push(data.name);
    }
    return header;
  };

  /**
   * Set the data list.
   */
  setDataList(list) {
    if (list.length === 0) {
      throw new Error('Empty list provided.');
    }
    this.#dataList = list;
  };

  /**
   * Set the function runner.
   */
  setFunctionRunner(runner) {
    this.#functionRunner = runner;
  };

  /**
   * Set the status.
   */
  #setStatus(newStatus) {
    this.#status = newStatus;
    this.#fireEvent({type: 'status-change', value: this.#status});
  }

  /**
   * Cancel the process.
   */
  cancel() {
    this.#setStatus('cancelling');
  };

  /**
   * Run the process: load the data and pass it to the function runner.
   */
  run() {
    // reset results
    if (this.#dataIndex === 0) {
      this.#results = [];
    }

    // current data
    var data = this.#dataList[this.#dataIndex];

    // console output
    console.log('Launch with: \'' + data.name + '\'');
    // status
    this.#setStatus('running');

    // read according to type
    if (typeof data.file === 'undefined') {
      // XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('GET', data.url, true);
      request.responseType = 'arraybuffer';
      request.onload = (event) => {
        this.#onloadBuffer(event.target.response);
      };
      request.send(null);
    } else {
      // FileReader
      var reader = new FileReader();
      reader.onload = (event) => {
        this.#onloadBuffer(event.target.result);
      };
      reader.readAsArrayBuffer(data.file);
    }
  };

  /**
   * Handle loaded data. Once done call another run or stop.
   * @param {Object} buffer The data buffer.
   */
  async #onloadBuffer(buffer) {

    // call the runner and store the results
    this.#results.push(await this.#functionRunner.run(buffer));

    // check status
    if (this.getStatus() !== 'cancelled') {
      // launch next
      ++this.#dataIndex;
      if (this.#dataIndex < this.#dataList.length) {
        this.run();
      } else {
        this.#dataIndex = 0;
        this.#setStatus('done');
      }
    }
  }

  /**
   * Add an event listener to this class.
   * @param {String} type The event type.
   * @param {Object} callback The method associated with the provided
   *   event type, will be called with the fired event.
   */
  addEventListener(type, callback) {
    this.#listenerHandler.add(type, callback);
  };
  /**
   * Remove an event listener from this class.
   * @param {String} type The event type.
   * @param {Object} callback The method associated with the provided
   *   event type.
   */
  removeEventListener(type, callback) {
    this.#listenerHandler.remove(type, callback);
  };
  /**
   * Fire an event: call all associated listeners with the input event object.
   * @param {Object} event The event to fire.
   */
  #fireEvent(event) {
    this.#listenerHandler.fireEvent(event);
  }

};
