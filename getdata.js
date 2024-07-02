function getDateFormat(dateRaw, cut, dayPosition, monthPosition, yearPosition) {
    dateRaw = dateRaw.replace(/\,|'/g,'').replace(/st|th|nd|rd/gi,'').trim();
       
     let day   =  dateRaw.split(cut)[dayPosition].trim(), 
         month =  dateRaw.split(cut)[monthPosition].trim(), 
         year  = dateRaw.split(cut)[yearPosition].trim();

       if (day < 10 && day.length < 2) {day = "0" + day;}

       if(dateRaw.search(/[a-z]/gi)>-1){ 
         if(month.search(/jan|ene/i)>-1){month = "01";}
         if(month.search(/feb|fév/i)>-1){month = "02";}
         if(month.search(/mar|mär/i)>-1){month = "03";}
         if(month.search(/apr|avr|abr/i)>-1){month = "04";}
         if(month.search(/may|mai/i)>-1){month = "05";}
         if(month.search(/jun|juin/i)>-1){month = "06";}
         if(month.search(/jul|juil/i)>-1){month = "07";}
         if(month.search(/aug|août|ago/i)>-1){month = "08";}
         if(month.search(/sep/i)>-1){month = "09";}
         if(month.search(/oct|okt/i)>-1){month = "10";}
         if(month.search(/nov/i)>-1){month = "11";}
         if(month.search(/dec|dez/i)>-1){month = "12";}
       }
       
    if (year < 100 && year.length < 3) {year = "20" + year;}
       
    var datum = month +"/"+  day +"/"+ year;
    
    return datum;
}