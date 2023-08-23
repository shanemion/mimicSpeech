import React from "react";

const PitchAccuracy = ({ synthesizedPitchData, recordedPitchData }) => {
  console.log("Synthesized Pitch:", synthesizedPitchData);
  console.log("Recorded Pitch Index:", recordedPitchData);

  const recordedData = recordedPitchData.data;
  //   const recordedData = synthesizedPitchData;

  let filteredSynthesizedData = synthesizedPitchData.filter(
    (value) => typeof value === "number" && Math.abs(value) > 0.01
  );

  let filteredRecordedData = recordedData.filter(
    (value) => typeof value === "number" && Math.abs(value) > 0.01
  );

  while (filteredRecordedData.length < filteredSynthesizedData.length) {
    filteredRecordedData.push(0.01);
  }

  if (filteredRecordedData.length > filteredSynthesizedData.length) {
    filteredRecordedData = filteredRecordedData.slice(
      0,
      filteredSynthesizedData.length
    );
  }

  console.log("Filtered Synthesized Pitch:", filteredSynthesizedData);
  console.log("Filtered Recorded Pitch:", filteredRecordedData);

  const calculateAccuracy = () => {
    // Calculate the average pitch for each dataset
    const avgSynthesized = filteredSynthesizedData.reduce((a, b) => a + b, 0) / filteredSynthesizedData.length;
    const avgRecorded = filteredRecordedData.reduce((a, b) => a + b, 0) / filteredRecordedData.length;
  
    // Calculate the overall average pitch
    const overallAvg = (avgSynthesized + avgRecorded) / 2;
  
    // Normalize each dataset based on the overall average pitch
    const normalizedSynthesized = filteredSynthesizedData.map(x => x - overallAvg);
    const normalizedRecorded = filteredRecordedData.map(x => x - overallAvg);
  
    // Initialize variables to hold the sum of accuracies and the number of points
    let accuracy = 0;
    let totalAccuracy = 0;
  
    // Loop through each point to calculate the accuracy
    for (let i = 0; i < normalizedSynthesized.length; i++) {
        const distance = Math.abs(normalizedRecorded[i] - normalizedSynthesized[i]);
    
        // Check if the point is within the safe zone
        if (distance <= 50) {
          accuracy += 1;
        } 
        else {
          // Apply custom scaling for points outside the safe zone
          let scalingFactor = 0;
          if (distance <= 60) scalingFactor = 0.90;
          else if (distance <= 70) scalingFactor = 0.75;
          else if (distance <= 80) scalingFactor = 0.65;
            else if (distance <= 90) scalingFactor = 0.45;
            else if (distance <= 100) scalingFactor = 0.25;
            else if (distance <= 110) scalingFactor = 0.15;
            else if (distance <= 120) scalingFactor = 0.10;
            else if (distance <= 130) scalingFactor = 0.05;
            else if (distance <= 140) scalingFactor = 0.03;
            else if (distance <= 150) scalingFactor = 0.02;
            else if (distance <= 160) scalingFactor = 0.01;
          // ... (add more conditions as needed)
          else scalingFactor = 0; // for distances far from the safe zone
    
          accuracy += scalingFactor;
        }
        totalAccuracy += 1;
      }
      
    // Calculate the overall accuracy
    const overallAccuracy = (accuracy / totalAccuracy) * 100;
    const roundedOverallAccuracy = parseFloat(overallAccuracy.toFixed(2));

    return roundedOverallAccuracy;
};


const calculatePurePitchAccuracy = () => {
    let totalPercentAccuracy = 0;
    let count = 0;
  
    // Calculate the rate of change (derivative) for each dataset
    const rateOfChangeSynthesized = filteredSynthesizedData.slice(1).map((val, i) => val - filteredSynthesizedData[i]);
    const rateOfChangeRecorded = filteredRecordedData.slice(1).map((val, i) => val - filteredRecordedData[i]);
  
    for (let i = 0; i < rateOfChangeSynthesized.length; i++) {
      const changeSynthesized = rateOfChangeSynthesized[i];
      const changeRecorded = rateOfChangeRecorded[i];
  
      if (Math.abs(changeSynthesized) > 0.01 && Math.abs(changeRecorded) > 0.01) {
        // Check if the rate of change is within the safe zone (e.g., +/- 5 Hz)
        if (Math.abs(changeSynthesized - changeRecorded) <= 5) {
          totalPercentAccuracy += 1;
        } else {
          // Apply custom scaling for rate changes outside the safe zone
          let scalingFactor = 0;
          const distance = Math.abs(changeSynthesized - changeRecorded);
          if (distance <= 10) scalingFactor = 0.90;
          else if (distance <= 15) scalingFactor = 0.75;
          // ... (add more conditions as needed)
          else scalingFactor = 0; // for distances far from the safe zone
  
          totalPercentAccuracy += scalingFactor;
        }
        count++;
      }
    }
  
    const purePitchAccuracy = (count === 0) ? 0 : (totalPercentAccuracy / count) * 100;
    return parseFloat(purePitchAccuracy.toFixed(2)); // Rounded to 2 decimal places
  };
  
  // Usage
  let purePitchAccuracy = calculatePurePitchAccuracy();
  console.log("Pure Pitch Accuracy:", purePitchAccuracy);


  
  let accuracy = calculateAccuracy();
  console.log("Accuracy:", accuracy);

  return (
    <div className="pitch-accuracy">
      <p>Accuracy: {accuracy}%</p>
        <p>Pure Pitch Accuracy: {purePitchAccuracy}%</p>
    </div>
  );
};

export default PitchAccuracy;

