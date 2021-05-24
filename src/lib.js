import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import nanoid from 'nanoid';
import he from 'he';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getYear = (data) => dayjs(data).year();

const getDateFormat = (data, format) => dayjs(data).format(format);

const getDateRelativeTime = (data) => dayjs(data).fromNow();

const getTime = (data, format) => dayjs.duration(data, 'minutes').format(format);

const getId = () => nanoid();

const sortDate = (dateA, dateB) => dayjs(dateB.date).diff(dayjs(dateA.date));

const escapeText = (text) => he.escape(text);

const checkIncludeDataInPeriod = (date, period) => dayjs().diff(dayjs(date), period) < 1;

export {
  getYear,
  getDateFormat,
  getId,
  sortDate,
  getTime,
  escapeText,
  Chart,
  ChartDataLabels,
  checkIncludeDataInPeriod,
  getDateRelativeTime
};
