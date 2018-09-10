var moment = require('moment');
var someTimestamp = moment().valueOf();
var createdAt = 11;
var date = moment(createdAt);
console.log(date.format('h:mm a'));
