/* eslint-disable no-extend-native */
export default function dateInit() {
  Date.prototype.yyyymmdd = function () {
    const yyyy = this.getFullYear();
    const mm = this.getMonth() < 9 ? `0${this.getMonth() + 1}` : (this.getMonth() + 1); // getMonth() is zero-based
    const dd = this.getDate() < 10 ? `0${this.getDate()}` : this.getDate();
    return [yyyy, mm, dd].join('.');
  };

  Date.prototype.yyyymmddhhmm = function () {
    const yyyymmdd = this.yyyymmdd();
    const hh = this.getHours() < 10 ? `0${this.getHours()}` : this.getHours();
    const min = this.getMinutes() < 10 ? `0${this.getMinutes()}` : this.getMinutes();
    return [yyyymmdd,
      [hh, min].join(':'),
    ].join(' ');
  };

  Date.prototype.yyyymmddhhmmss = function () {
    const yyyymmddhhmm = this.yyyymmddhhmm();
    const ss = this.getSeconds() < 10 ? `0${this.getSeconds()}` : this.getSeconds();
    return [yyyymmddhhmm, ss].join(':');
  };
}
