import moment from "moment";

export default function dateFilter(str, format, locale = "en-gb") {
  const localMoment = moment(str);
  localMoment.locale(locale);
  return localMoment.format(format);
}
