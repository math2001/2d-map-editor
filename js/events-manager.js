var EM;

EM = (function() {
  function EM() {}

  EM.listeners = {};

  EM.debug = false;

  EM.on = function(eventName, fn) {
    if (typeof this.listeners[eventName] === "undefined") {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(fn);
    return this;
  };

  EM.off = function(eventName, fnToRemove) {
    this.listeners[eventName].remove(fn);
    return this;
  };

  EM.emit = function(eventName, data) {
    var dataToRender, fn, i, len, ref;
    if (typeof this.listeners[eventName] === "undefined") {
      return console.error("Unknown event '" + eventName + "'");
    }
    if (typeof data === 'string') {
      dataToRender = '"{}"'.format(data);
    } else {
      dataToRender = data;
    }
    if (this.debug) {
      console.info('fire', '"{}"'.format(eventName), 'with', dataToRender);
    }
    ref = this.listeners[eventName];
    for (i = 0, len = ref.length; i < len; i++) {
      fn = ref[i];
      fn(data);
    }
    return this;
  };

  EM.fire = function() {
    return this.emit.apply(this, arguments);
  };

  return EM;

})();


// var events = (function() {
//     var topics = {};
//     var hOP = topics.hasOwnProperty;

//     return {
//         subscribe: function(topic, listener) {
//             // Create the topic's object if not yet created
//             if (!hOP.call(topics, topic)) {
//                 topics[topic] = [];
//             }

//             // Add the listener to queue
//             var index = topics[topic].push(listener) - 1;

//             // Provide handle back for removal of topic
//             return {
//                 remove: function() {
//                     delete topics[topic][index];
//                 }
//             };
//         },
//         publish: function(topic, info) {
//             if (!hOP.call(topics, topic)) {
//                 return
//             }

//             topics[topic].forEach(function(item) {
//                 item(info != undefined ? info : {});
//             });
//         }
//     };
// })();
