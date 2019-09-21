
function sayAction(message) {
  return action("SAY", null, message);
}

function recordAction(callback) {
  return action("RECORD", callback, null);
}

function ackAction() {
 return action("ACK", null, "All good")
}

function action(type, callback, data) {
  return {
    type: type,
    callback: callback,
    data: data
  };
}


module.exports = {
  sayAction,
  recordAction,
  ackAction,
}