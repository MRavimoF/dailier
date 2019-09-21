
function sayAction(message) {
  return action("SAY", null, message);
}

function recordAction(callback) {
  return action("RECORD", callback, null);
}

function ackAction() {
 return action("ACK", null, "All good")
}

/**
 * Will pick up the first missing entry from participants' daily reports and create
 * a record action for it or ACK action if all done
 */
function dailyReportAction(reportByParticipant) {
  for(let i = 0; i < reportByParticipant.length; i++){
    const report = reportByParticipant[i];
    if(!report.yesterday)
      return [
        sayAction(`So ${report.participant}, what did you do yesterday?`),
        recordAction(`/participants/${report.participant}/report/yesterday`)
      ];


    if(!report.today)
      return [
        sayAction(`So ${report.participant}, what are you planning to do today?`),
        recordAction(`/participants/${report.participant}/report/today`)
      ];


    if(!report.blockers)
      return [
        sayAction(`So ${report.participant}, do you have any blockers?`),
        recordAction(`/participants/${report.participant}/report/blockers`)
      ];
  }

  return ackAction();
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
  dailyReportAction
}