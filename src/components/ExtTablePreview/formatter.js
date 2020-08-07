import moment from 'moment';

const formatDate = value => moment.format(value, 'YYYY-MM-DD');
const formatText = value => value;

export default {
  formatDate,
  formatText,
};
