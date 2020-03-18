/**
 *
 * 接口1
 * getDaysOfMonth(timestamp)
 * 获取指定时间所在月份的总天数
 * @param timestamp : number  代表自1970年1月1日00:00:00 (世界标准时间) 起经过的毫秒数。
 * @returns number   返回指定月份的天数
 *
 *
 *
 * 接口2
 * getDaysOfMonth(dateString)
 * 获取指定时间所在月份的总天数
 * @param dateString : string  日期的字符串值。该字符串应该能被 Date.parse() 方法识别
 * @returns number   返回指定月份的天数
 *
 *
 *
 * 接口3
 * getDaysOfMonth(date)
 * 获取指定时间实例所在月份的总天数
 * @param date : Date  Date 实例。
 * @returns number   返回指定月份的天数
 *
 *
 * 接口4
 * getDaysOfMonth(year, month)
 * 获取指定月份的总开数
 * @param year : number  年份
 * @param month : number  月份
 * @returns number   返回指定月份的天数
 *
 *
 * 接口5
 * getDaysOfMonth()
 * 获取当前时间实例所在月份的总天数
 * @param date : Date  Date 实例。
 * @returns number   返回当前时间所在月份的总天数
 */
Date.getDayNumberOfMonth = function getDayNumberOfMonth(year, month) {

  switch (arguments.length) {
    case 2:{
      var date = new Date(year,month);
      break;
    }

    case 1:{
      var initValue = year;
      if (year instanceof Date){
        initValue = year.getTime();
      }
      date = new Date(initValue);
      break;
    }

    default:{
      date = new Date();
    }

  }


  date.setMonthOffset(1);
  date.setDate(0);
  var dayNum = date.getDate();
  return dayNum;
}


/**
 * 获取该日期所在月份的天数
 */
Date.prototype.getDayNumber = function getDayNumber() {
  return Date.getDayNumberOfMonth(this);
}





/**
 * setYearOffset(offset)
 * 设置年份偏移量 正数：向未来偏移，负数，表示向过去偏移
 * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
 * @returns number   偏移后的年份
 */
Date.prototype.setYearOffset = function setYearOffset(offset) {
  if (offset) {
    var num = this.getFullYear();
    this.setFullYear(num+offset);
  }

  return this.getFullYear();
}



/**
 * setMonthOffset(offset)
 * 设置月份偏移量 正数：向未来偏移，负数，表示向过去偏移
 * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
 * @returns number   偏移后的月份
 */
Date.prototype.setMonthOffset = function setMonthOffset(offset) {
  if (offset) {
    var num = this.getMonth();
    this.setMonth(num+offset);
  }

  return this.getMonth();
}





/**
 * setDateOffset(offset)
 * 设置天偏移量 正数：向未来偏移，负数，表示向过去偏移
 * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
 * @returns number   偏移后的天
 */
Date.prototype.setDateOffset = function setDateOffset(offset) {
  if (offset) {
    var num = this.getDate();
    this.setDate(num+offset);
  }

  return this.getDate();
}



/**
 * setHourOffset(offset)
 * 设置小时偏移量 正数：向未来偏移，负数，表示向过去偏移
 * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
 * @returns date : number   偏移后的小时
 */
Date.prototype.setHourOffset = function setHourOffset(offset) {
  if (offset) {
    var num = this.getHours();
    this.setHours(num+offset);
  }

  return this.getHours();
}






/**
 * setMinuteOffset(offset)
 * 设置分钟偏移量 正数：向未来偏移，负数，表示向过去偏移
 * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
 * @returns number   偏移后的分钟
 */
Date.prototype.setMinuteOffset = function setMinuteOffset(offset) {
  if (offset) {
    var num = this.getMinutes();
    this.setMinutes(num+offset);
  }

  return this.getMinutes();
}







/**
 * setSecondOffset(offset)
 * 设置秒数偏移量 正数：向未来偏移，负数，表示向过去偏移
 * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
 * @returns number   偏移后的秒数
 */
Date.prototype.setSecondOffset = function setSecondOffset(offset) {
  if (offset) {
    var num = this.getSeconds();
    this.setMinutes(num+offset);
  }

  return this.getSeconds();
}





/**
 * setMillisecondOffset(offset)
 * 设置亳秒数偏移量 正数：向未来偏移，负数，表示向过去偏移
 * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
 * @returns number   偏移后的亳秒数
 */
Date.prototype.setMillisecondOffset = function setMillisecondOffset(offset) {
  if (offset) {
    var num = this.getMilliseconds();
    this.setMilliseconds(num+offset);
  }

  return this.getMilliseconds();
};






//获取从开始到结束的步长为step的所有时间

/*Date.getAllDate  = function(start,step,end) {

  switch (step) {
    case

  }


};*/
