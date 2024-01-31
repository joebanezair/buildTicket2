import React, { useEffect, useState } from "react";
import Moderator from "../../../context/Moderator";
import { onValue, push, ref } from "firebase/database";


const longteachers = () => {
  const {email} = Moderator();

  
  //filter
  const longDefault = 
  `Common device issues include battery problems, connectivity hiccups, software glitches, storage limitations, screen damage, overheating, audio anomalies, hardware failures, security concerns, compatibility challenges, charging issues, printer malfunctions, network woes, gaming console troubles, and smart home setup difficulties. These recurrent problems affect user experience, requiring timely solutions and technical support.`;
  const emptyQueueMessage = 
   `Hi ${email} your queue is empty`
  const values = {
    emptyQueueMessage,
    longDefault,
  }
  return values;
}

export default longteachers