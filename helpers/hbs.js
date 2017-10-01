const moment = require('moment');

module.exports = {
  truncate: function (string, length) {
    if (string.length > length && string.length > 0) {
      var newString = string + " ";
      newString = string.substr(0, length);
      newString = string.substr(0, newString, lastIndexOf(" "));
      newString = (newString.length > 0) ? newString : string.substr(0, length);
      return newString + '...';
    }
    return string;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  select: function (selected, options) {
    return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"').replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
  },
  editIcon: function (storyUser, loggedUser, storyID, floating = true) {
    if (storyUser == loggedUser) {
      if (floating) {
        return `<a href="/stories/edit/${storyID}" class="btn-floating halfway-fab red darken-3"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyID}" class="btn"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return '';
    }
  }
}