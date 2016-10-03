var sqlite3 = require('sqlite3').verbose(),
    _str = require('underscore.string'),
    fs = require('fs')
    cli = require('cli')
    options = cli.parse({
      chatname: [ 'c', 'Chatname', 'string', ''],
      database: ['d', 'Database location', 'string', ''],
      output: ['o', 'Output file name', 'string', 'chat.txt']
    });
var text = '';
if(options.chatname && options.database) {
  var db = new sqlite3.Database(options.database);
  db.each("select * from Messages WHERE chatname LIKE '%" + options.chatname + "%'", function(err, row) {
    if(err) {
      db.close();
      throw err;
    }
    var body_xml = _str.stripTags(row.body_xml);
    if(body_xml.indexOf('To view this shared photo, go to')===-1) {
      text += '\n' + row.from_dispname + ': ' + _str.stripTags(_str.unescapeHTML(row.body_xml));
    }
  }, function() {
    fs.writeFileSync(options.output, text + '\n');
  });
}
else {
  console.log('please provide the right arguments');
}