﻿Bridge.merge(new Bridge.CultureInfo("uk-UA", true), {
    englishName: "Ukrainian (Ukraine)",
    nativeName: "українська (Україна)",

    numberFormat: Bridge.merge(new Bridge.NumberFormatInfo(), {
        naNSymbol: "NaN",
        negativeSign: "-",
        positiveSign: "+",
        negativeInfinitySymbol: "-∞",
        positiveInfinitySymbol: "∞",
        percentSymbol: "%",
        percentGroupSizes: [3],
        percentDecimalDigits: 2,
        percentDecimalSeparator: ",",
        percentGroupSeparator: " ",
        percentPositivePattern: 1,
        percentNegativePattern: 1,
        currencySymbol: "₴",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ",",
        currencyGroupSeparator: " ",
        currencyNegativePattern: 5,
        currencyPositivePattern: 1,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ",",
        numberGroupSeparator: " ",
        numberNegativePattern: 1
    }),

    dateTimeFormat: Bridge.merge(new Bridge.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["Нд","Пн","Вт","Ср","Чт","Пт","Сб"],
        abbreviatedMonthGenitiveNames: ["січ","лют","бер","кві","тра","чер","лип","сер","вер","жов","лис","гру",""],
        abbreviatedMonthNames: ["Січ","Лют","Бер","Кві","Тра","Чер","Лип","Сер","Вер","Жов","Лис","Гру",""],
        amDesignator: "",
        dateSeparator: ".",
        dayNames: ["неділя","понеділок","вівторок","середа","четвер","п'ятниця","субота"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "d MMMM yyyy' р.' H:mm:ss",
        longDatePattern: "d MMMM yyyy' р.'",
        longTimePattern: "H:mm:ss",
        monthDayPattern: "d MMMM",
        monthGenitiveNames: ["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня",""],
        monthNames: ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень",""],
        pmDesignator: "",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd.MM.yyyy",
        shortestDayNames: ["Нд","Пн","Вт","Ср","Чт","Пт","Сб"],
        shortTimePattern: "H:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy' р.'",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.uzzz"
    })
});