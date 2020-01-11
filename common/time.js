/**
 * 时间处理类
 */
module.exports =
{
    /**
     * 时间搓转为 yyyy-MM-dd HH:mm:ss 格式
     * @param time
     */
     getTime_YMDhms(time)
    {
        let date = new Date(time * 1000);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let strM = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        let strD = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        let strH = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let strMinute = minute < 10 ? ('0' + minute) : minute;
        let strSecond = second < 10 ? ('0' + second) : second;
        return y + '-' + strM + '-' + strD + ' ' + strH + ':' + strMinute + ':' + strSecond;
    },

     getTime_YMD(time)
    {
        let date = new Date(time * 1000);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let strM = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        let strD = d < 10 ? ('0' + d) : d;
        return y + '-' + strM + '-' + strD;
    },

    //格式化日期：yyyy-MM-dd HH:mm:ss 格式
     getDate_YMDhms(date)
    { 
        let time = date.getTime() / 1000;
        return this.getTime_YMDhms(time);
    },

    //格式化日期：yyyy-MM-dd 
     getDate_YMD(date)
    { 
        let time = date.getTime() / 1000;
        return this.getTime_YMD(time);
    } ,

    //取一周的第几天
     getWeekDay(date)
    {
        let nowDayOfWeek = date.getDay(); //周的第几天
        return nowDayOfWeek == 0 ? 7: nowDayOfWeek;
    } ,

    //取今天时间
     getToday_YMD()
    {
        let date = new Date();
        let time = date.getTime() / 1000;
        return this.getTime_YMD(time);
    },

    //取昨天时间
     getYesterday_YMDhms()
    {
        let date = new Date();
        date = this.dateAddDay(date, -1);//昨天
        let time = date.getTime() / 1000;
        return this.getTime_YMD(time);
    },

    //获得本周的开始日期 
     getWeekBeg_YMDhms() 
    { 
        let now = new Date(); //当前日期 
        let nowDayOfWeek = this.getWeekDay(now); //今天本周的第几天 
        let nowDay = now.getDate(); //当前日 
        let nowMonth = now.getMonth(); //当前月 
        let nowYear = now.getFullYear(); //当前年 
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1); 
        return this.getDate_YMD(weekStartDate); 
    }, 

    //获得上周的开始日期 
     getLastWeekBeg_YMDhms() 
    { 
        let now = new Date(); //当前日期 
        let nowDayOfWeek = this.getWeekDay(now); //今天本周的第几天 
        let nowDay = now.getDate(); //当前日 
        let nowMonth = now.getMonth(); //当前月 
        let nowYear = now.getFullYear(); //当前年 
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1 - 7); 
        return this.getDate_YMD(weekStartDate); 
    },

    //获得上周的结束日期 
     getLastWeekEnd_YMDhms() 
    { 
        let now = new Date(); //当前日期 
        let nowDayOfWeek = this.getWeekDay(now); //今天本周的第几天 
        let nowDay = now.getDate(); //当前日 
        let nowMonth = now.getMonth(); //当前月 
        let nowYear = now.getFullYear(); //当前年 
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
        return this.getDate_YMD(weekStartDate); 
    },

    //获得本月的开始日期 
    getMonthBeg_YMDhms()
    { 
        let now = new Date(); //当前日期 
        let nowMonth = now.getMonth(); //当前月 
        let nowYear = now.getFullYear(); //当前年 
        let monthStartDate = new Date(nowYear, nowMonth, 1); 
        return this.getDate_YMD(monthStartDate); 
    }, 

    //获得上月开始时间
     getLastMonthBeg_YMDhms()
    {
        let now = new Date(); //当前日期 
        let nowYear = now.getFullYear(); //当前年 
        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
        let lastMonth = lastMonthDate.getMonth();
        let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return this.getDate_YMD(lastMonthStartDate); 
    },

    //获得上月结束时间
     getLastMonthEnd_YMDhms()
    {
        let now = new Date(); //当前日期 
        let nowYear = now.getFullYear(); //当前年 
        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
        let lastMonth = lastMonthDate.getMonth();
        var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));
        return this.getDate_YMD(lastMonthEndDate); 
    },

    //时间减去或增加1天
     dateAddDay(date, day)
    {
        let res = date;
        res.setDate(date.getDate() + day);
        return res;
    },

    //获得某月的天数 
     getMonthDays(myMonth)
    { 
        let now = new Date(); //当前日期 
        let nowYear = now.getFullYear(); //当前年
        let monthStartDate = new Date(nowYear, myMonth, 1); 
        let monthEndDate = new Date(nowYear, myMonth + 1, 1); 
        let days = (monthEndDate.getTime() - monthStartDate.getTime())/(1000 * 60 * 60 * 24); 
        return days; 
    } 

}
