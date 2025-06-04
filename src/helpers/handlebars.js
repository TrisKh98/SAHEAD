const Handlebars = require('handlebars');
const moment = require('moment-timezone');

module.exports = {
    sum: (a, b) => a + b,
    // eq: (a, b) => a.toString() === b.toString(),
    eq: (a, b) => {

      if (a == null || b == null) return false; // Kiểm tra nếu a hoặc b là null hoặc undefined
      return a.toString() === b.toString();
    },
    
    toString: (value) => {
      return value ? String(value) : '';
    },

    getFileName: (path) => {
      return path ? path.split('/').pop() : '';
    },
    includes: (array, value) => {
      if (!Array.isArray(array) || !value) return false;
      return array.some(item => item?.toString() === value.toString());
    },
    formatDate: (date) => {
      return date ? moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : '';
    },
    sortable: (field, sort) => {
      const sortType = field === sort.column ? sort.type : 'default';
  
      const icons = {
          default: 'oi oi-elevator',
          asc: 'oi oi-sort-ascending',
          desc: 'oi oi-sort-descending',
      };
  
      const types = {
          default: 'desc',
          asc: 'desc',
          desc: 'asc',
      };
  
      const icon = icons[sortType];
      const type = types[sortType];
    //   const href = Handlebars.escapeExpression('?_sort&column=${field}&type=${type}');
  
    //   const output =  `<a href="${href}">
    //               <span class="${icon}"></span>
    //           </a>`;
      return `<a href="?_sort&column=${field}&type=${type}">
                  <span class="${icon}"></span>
              </a>`;
    //   new Handlebars.SafeString(output);
    },    
      
  };