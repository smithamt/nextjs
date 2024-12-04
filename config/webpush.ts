import webpush from "web-push";

const publicVapidKey =
  "BKQCSa2JUu4L-5JT4NE2G-98cWp_6TU78yHd387DWzrGipNBg2kCV9t3HOZxWgZtlw7cfnkV-ryh2z8JnZ9YfsA";
const privateVapidKey = "yiB0SIzvtdjyu7y3LNtvp3W0bOpkEVfOWzZ1m6SOJL4";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

export { webpush };
