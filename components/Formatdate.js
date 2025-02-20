import { View } from 'react-native';
import React from 'react';
import { format } from 'date-fns';
import moment from 'moment';

const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd-MM-yyyy');
};

const formatTime = (dateString) => {
  return format(new Date(dateString), 'hh:mm a');
};

const Formatdate = () => {
  // Ensure no errors, even with an empty return
  return <View />;
};

export default Formatdate;


export const GetDateRangeToDisplay=()=>{
    const dateList=[];
    for(let i=0; i<=7;i++)
    {
        dateList.push({
            date:moment().add(i,'days'). format('DD'),
            day:moment().add(i,'days').format('ddd'),
            formatedDate:moment().add(i,'days').format('L')
        })
    }
    return dateList;
}