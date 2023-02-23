import React from 'react';
import { Text } from 'react-native-paper';
import ReactTimeAgo from 'react-time-ago';

const TimeAgo = (props) => {
  return <ReactTimeAgo {...props} component={Time} />;
};

const Time = ({ children, style }) => {
  return <Text style={style}>{children}</Text>;
};

export default TimeAgo;
