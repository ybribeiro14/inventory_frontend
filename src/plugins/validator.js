import moment from 'moment';

const validator = {
  validate(value) {
    const dateTest = moment(value);

    if (!dateTest.isValid()) {
      return false;
    }
    const idade = dateTest.diff(moment(), 'year');

    if (idade > 120) {
      return false;
    }

    if (idade < -5) {
      return false;
    }

    return true;
  },
};

export default validator;
