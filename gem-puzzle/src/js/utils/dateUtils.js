

export default function dateInit(){


Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    return [yyyy, mm, dd].join('.');
                
  };
  
  Date.prototype.yyyymmddhhmm = function() {
    var yyyymmdd = this.yyyymmdd();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    return [yyyymmdd 
            ,[hh, min].join(':')
           ].join(' ');
  };
  
  Date.prototype.yyyymmddhhmmss = function() {
    var yyyymmddhhmm = this.yyyymmddhhmm();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    return [yyyymmddhhmm, ss].join(':');
  };
}