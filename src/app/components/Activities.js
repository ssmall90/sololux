import React from 'react';

const Activities = ({ activities }) => {
  return (
    <div>
      {activities.map((activity, index) => (
        <div key={index}>{activity}</div>
      ))}
    </div>
  );
};

export default Activities;