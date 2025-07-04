/**
 * ListenerHandler class: handles add/removing and firing listeners.
 * @constructor
 */
export class ListenerHandler {
  /**
   * listeners.
   */
  #listeners = {};

  /**
   * Add an event listener.
   * @param {string} type The event type.
   * @param {Object} callback The method associated with the provided
   *  event type, will be called with the fired event.
   */
  add(type, callback) {
    // create array if not present
    if (typeof this.#listeners[type] === 'undefined') {
      this.#listeners[type] = [];
    }
    // add callback to listeners array
    this.#listeners[type].push(callback);
  };

  /**
   * Remove an event listener.
   * @param {string} type The event type.
   * @param {Object} callback The method associated with the provided
   *   event type.
   */
  remove(type, callback) {
    // check if the type is present
    if (typeof this.#listeners[type] === 'undefined') {
      return;
    }
    // remove from listeners array
    for (var i = 0; i < this.#listeners[type].length; ++i) {
      if (this.#listeners[type][i] === callback) {
        this.#listeners[type].splice(i, 1);
      }
    }
  };

  /**
   * Fire an event: call all associated listeners with the input event object.
   * @param {Object} event The event to fire.
   */
  fireEvent(event) {
    // check if they are listeners for the event type
    if (typeof this.#listeners[event.type] === 'undefined') {
      return;
    }
    // fire events
    for (let listener of this.#listeners[event.type]) {
      listener(event);
    }
  };
};
