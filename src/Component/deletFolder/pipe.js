import React, { useState, useEffect } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import styled from "styled-components";
import { FaCamera, FaFile } from "react-icons/fa";
import PipeCameraView from "../CamStore/PipeCameraView";

const PipeImageContainer = styled.div`
  background-color: #dfdfdf;
  padding: 10px;
  border-bottom: 2px solid gray;
`;

const FarmerPipePreview = styled.div`
  max-width: 150px;
  height: 130px;
  background-color: #2ecc71;
  background-image: ${(props) =>
    props.imageUrl ? `url(${props.imageUrl})` : "none"};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-top: -81px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  right: -230px;
  gap: 18px;
  margin-top: 5px;
`;

const CameraButton = styled.button`
  background-color: green;
  color: white;
  padding: 3px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  width: 70px;
  font-size: 17px;
  margin-bottom: 0;
`;

const FileUploadButton = styled.label`
  background-color: blue;
  color: white;
  padding: 3px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  width: 64px;
  text-align: center;
  font-size: 18px;
`;

const PipePhotoText = styled.p`
  max-width: 150px;
  height: 130px;
  margin-top: -81px;
  color: #777777;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #777777;
  border-radius: 8px;
`;
const Headp = styled.p`
  margin-top: -4px;
  font-size: 16px;
  font-weight: 500;
  color: #818181;
`;

const FarmerPipeImageCts = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  farmerPipeImage,
  setFarmerPipeImage,
  postpipepic,
  farmerCode,
}) => {
  const [showPipeCamera, setShowPipeCamera] = useState(false);
  const [pipeLocation, setPipeLocation] = useState(null);
  const [pipeCapturedDateTime, setPipeCapturedDateTime] = useState(null);

  const handleOpenPipeCamera = () => {
    setShowPipeCamera(true);
  };

  const handlePipeCameraClose = () => {
    setShowPipeCamera(false);
  };

  const handleCapturePipe = (dataUri) => {
    setFarmerPipeImage(dataUri);
    setShowPipeCamera(false);
    getPipeLocation();
  };

  const handlePipeFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmerPipeImage(reader.result);
        getPipeLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  const getPipeLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setPipeLocation({ latitude, longitude });
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          setPipeCapturedDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting pipe location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  //   useEffect(() => {
  //     if (farmerPipeImage && pipeLocation) {
  //       const image = new Image();

  //       image.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const context = canvas.getContext("2d");

  //         canvas.width = image.width;
  //         canvas.height = image.height;

  //         context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //         // Draw light green background for the table
  //         context.fillStyle = "lightgreen";
  //         context.fillRect(10, image.height - 160, canvas.width - 20, 140);

  //         // Draw table border
  //         context.strokeStyle = "black";
  //         context.lineWidth = 1;
  //         context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

  //         context.font = "14px Arial";
  //         context.fillStyle = "black"; // Change text color to black for better visibility

  //         const lineHeight = 20; // Adjust line height for better readability

  //         const tableData = [
  //           { label: "Farmer S/No", value: farmerFieldId },
  //           { label: "Latitude", value: pipeLocation?.latitude.toFixed(7) },
  //           { label: "Longitude", value: pipeLocation?.longitude.toFixed(7) },
  //           { label: "Farmer", value: farmerName },
  //           { label: farmerNameTitle, value: farmerFather },
  //           { label: "Captured on", value: pipeCapturedDateTime },
  //         ];

  //         // Draw table data
  //         let y = image.height - 140;
  //         tableData.forEach(({ label, value }) => {
  //           context.fillText(`${label}:`, 20, y);
  //           context.fillText(value, 120, y);
  //           y += lineHeight;
  //         });

  //         // Convert the canvas content to a data URL
  //         const dataURL = canvas.toDataURL("image/jpeg");
  //         setFarmerPipeImage(dataURL);
  //       };

  //       image.src = farmerPipeImage;
  //     }
  //   }, [farmerPipeImage, pipeLocation, farmerFieldId, pipeCapturedDateTime]);

  //   useEffect(() => {
  //     if (farmerPipeImage && pipeLocation) {
  //       const image = new Image();

  //       image.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const context = canvas.getContext("2d");

  //         canvas.width = image.width;
  //         canvas.height = image.height;

  //         context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //         // Draw light green background for the table
  //         context.fillStyle = "lightgreen";
  //         context.fillRect(10, image.height - 160, canvas.width - 20, 140);

  //         // Draw table border
  //         context.strokeStyle = "black";
  //         context.lineWidth = 1;
  //         context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

  //         context.font = "bold 14px Arial";
  //         context.fillStyle = "black"; // Change text color to black for better visibility

  //         const lineHeight = 20; // Adjust line height for better readability

  //         const headings = [
  //           "Farmer Code",
  //           "Farmer S/No",
  //           "Farmer",
  //           "Latitude",
  //           "Longitude",
  //           "Captured on",
  //         ];

  //         const data = [
  //           farmerCode,
  //           farmerFieldId,
  //           farmerName,
  //           pipeLocation?.latitude.toFixed(7),
  //           pipeLocation?.longitude.toFixed(7),
  //           pipeCapturedDateTime,
  //         ];

  //         // Draw table headings
  //         let y = image.height - 100 + lineHeight; // Start just below the top border
  //         headings.forEach((heading, index) => {
  //           context.fillText(heading, index * 140 + 20, y); // Adjust spacing based on column index
  //         });

  //         context.font = "14px Arial"; // Reset font style for data
  //         context.fillStyle = "black"; // Reset text color for data

  //         // Draw table data
  //         data.forEach((value, index) => {
  //           context.fillText(value, index * 140 + 20, y + lineHeight); // Adjust spacing based on column index
  //         });

  //         // Convert the canvas content to a data URL
  //         const dataURL = canvas.toDataURL("image/jpeg");
  //         setFarmerPipeImage(dataURL);
  //       };

  //       image.src = farmerPipeImage;
  //     }
  //   }, [
  //     farmerPipeImage,
  //     pipeLocation,
  //     farmerFieldId,
  //     pipeCapturedDateTime,
  //     farmerNameTitle,
  //     farmerCode,
  //   ]);

  /////////////
  // useEffect(() => {
  //   if (farmerPipeImage && pipeLocation) {
  //     const image = new Image();

  //     image.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");

  //       canvas.width = image.width;
  //       canvas.height = image.height;

  //       context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //       // Draw light green background for the table
  //       context.fillStyle = "lightgreen";
  //       context.fillRect(10, image.height - 160, canvas.width - 20, 140);

  //       // Draw table border
  //       context.strokeStyle = "black";
  //       context.lineWidth = 1;
  //       context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

  //       context.font = "bold 12px Arial"; // Decrease font size for headers
  //       context.fillStyle = "black"; // Change text color to black for better visibility

  //       const lineHeight = 20; // Adjust line height for better readability

  //       const headings = [
  //         "Farmer Code",
  //         "Farmer S/No",
  //         "Farmer",
  //         "Latitude",
  //         "Longitude",
  //         "Captured on",
  //       ];

  //       const data = [
  //         farmerCode,
  //         farmerFieldId,
  //         farmerName,
  //         pipeLocation?.latitude.toFixed(7),
  //         pipeLocation?.longitude.toFixed(7),
  //         pipeCapturedDateTime,
  //       ];

  //       // Calculate column width based on the canvas width and number of columns
  //       const columnWidth = (canvas.width - 20) / headings.length;

  //       // Draw table headings with borders
  //       let x = 10; // Start at the leftmost position
  //       headings.forEach((heading, index) => {
  //         context.fillText(
  //           heading,
  //           x + columnWidth * index,
  //           image.height - 130
  //         ); // Adjust y position as per your requirement
  //         // Draw border for the header cell
  //         context.strokeRect(
  //           x + columnWidth * index,
  //           image.height - 160,
  //           columnWidth,
  //           lineHeight
  //         );
  //       });

  //       context.font = "12px Arial"; // Decrease font size for data
  //       context.fillStyle = "black"; // Reset text color for data

  //       // Draw table data with borders
  //       data.forEach((value, index) => {
  //         context.fillText(value, 10 + columnWidth * index, image.height - 110); // Adjust y position as per your requirement
  //         // Draw border for the data cell
  //         context.strokeRect(
  //           10 + columnWidth * index,
  //           image.height - 140,
  //           columnWidth,
  //           lineHeight
  //         );
  //       });

  //       // Convert the canvas content to a data URL
  //       const dataURL = canvas.toDataURL("image/jpeg");
  //       setFarmerPipeImage(dataURL);
  //     };

  //     image.src = farmerPipeImage;
  //   }
  // }, [
  //   farmerPipeImage,
  //   pipeLocation,
  //   farmerFieldId,
  //   pipeCapturedDateTime,
  //   farmerNameTitle,
  //   farmerCode,
  // ]);

  //////////////////////////////////////////////////=========okay below
  //   useEffect(() => {
  //     if (farmerPipeImage && pipeLocation) {
  //       const image = new Image();

  //       image.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const context = canvas.getContext("2d");

  //         canvas.width = image.width;
  //         canvas.height = image.height;

  //         context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //         // Draw light green background for the table
  //         context.fillStyle = "lightgreen";
  //         context.fillRect(10, image.height - 160, canvas.width - 20, 140);

  //         // Draw table border
  //         context.strokeStyle = "black";
  //         context.lineWidth = 1;
  //         context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

  //         context.font = "bold 12px Arial"; // Decrease font size for headers
  //         context.fillStyle = "black"; // Change text color to black for better visibility

  //         const lineHeight = 20; // Adjust line height for better readability

  //         const headings = [
  //           "Farmer Code",
  //           "Farmer S/No",
  //           "Farmer",
  //           "Latitude",
  //           "Longitude",
  //           "Captured on",
  //         ];

  //         const data = [
  //           farmerCode,
  //           farmerFieldId,
  //           farmerName,
  //           pipeLocation?.latitude.toFixed(7),
  //           pipeLocation?.longitude.toFixed(7),
  //           pipeCapturedDateTime,
  //         ];

  //         // Calculate column width based on the canvas width and number of columns
  //         const columnWidth = (canvas.width - 20) / headings.length;

  //         // Draw table headings with borders
  //         let x = 10; // Start at the leftmost position
  //         headings.forEach((heading, index) => {
  //           // Calculate text width for the current header
  //           const textWidth = context.measureText(heading).width;
  //           const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
  //           context.fillText(
  //             heading,
  //             x + (cellWidth - textWidth) / 2,
  //             image.height - 130
  //           ); // Center text horizontally in cell
  //           // Draw border for the header cell
  //           context.strokeRect(x, image.height - 145, cellWidth, lineHeight);
  //           x += cellWidth; // Move to the next cell
  //         });

  //         context.font = "12px Arial"; // Decrease font size for data
  //         context.fillStyle = "black"; // Reset text color for data

  //         // Draw table data with borders
  //         let dataX = 10; // Start at the leftmost position
  //         data.forEach((value, index) => {
  //           // Calculate text width for the current data
  //           const textWidth = context.measureText(value).width;
  //           const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
  //           context.fillText(
  //             value,
  //             dataX + (cellWidth - textWidth) / 2,
  //             image.height - 110
  //           ); // Center text horizontally in cell
  //           // Draw border for the data cell
  //           context.strokeRect(dataX, image.height - 125, cellWidth, lineHeight);
  //           dataX += cellWidth; // Move to the next cell
  //         });

  //         // Convert the canvas content to a data URL
  //         const dataURL = canvas.toDataURL("image/jpeg");
  //         setFarmerPipeImage(dataURL);
  //       };

  //       image.src = farmerPipeImage;
  //     }
  //   }, [
  //     farmerPipeImage,
  //     pipeLocation,
  //     farmerFieldId,
  //     pipeCapturedDateTime,
  //     farmerNameTitle,
  //     farmerCode,
  //   ]);

  //okay above one

  ////////////////////===================================perfect below
  // useEffect(() => {
  //   if (farmerPipeImage && pipeLocation) {
  //     const image = new Image();

  //     image.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");

  //       canvas.width = image.width;
  //       canvas.height = image.height;

  //       context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //       // Decrease the table size
  //       const tableWidth = canvas.width - 40; // Reduce the width by 20 on each side
  //       const tableHeight = 120; // Reduce the height of the table

  //       // Draw light green background for the table
  //       context.fillStyle = "lightgreen";
  //       context.fillRect(
  //         20,
  //         image.height - tableHeight,
  //         tableWidth,
  //         tableHeight
  //       );

  //       // Draw table border
  //       context.strokeStyle = "black";
  //       context.lineWidth = 1;
  //       context.strokeRect(
  //         20,
  //         image.height - tableHeight,
  //         tableWidth,
  //         tableHeight
  //       );

  //       context.font = "bold 10px Arial"; // Decrease font size for headers
  //       context.fillStyle = "black"; // Change text color to black for better visibility

  //       const lineHeight = 15; // Adjust line height for better readability

  //       const headings = [
  //         "Farmer Code",
  //         "Farmer S/No",
  //         "Farmer",
  //         "Latitude",
  //         "Longitude",
  //         "Captured on",
  //       ];

  //       const data = [
  //         farmerCode,
  //         farmerFieldId,
  //         farmerName,
  //         pipeLocation?.latitude.toFixed(7),
  //         pipeLocation?.longitude.toFixed(7),
  //         pipeCapturedDateTime,
  //       ];

  //       // Calculate column width based on the table width and number of columns
  //       const columnWidth = tableWidth / headings.length;

  //       // Draw table headings with borders
  //       let x = 20; // Start at the leftmost position
  //       headings.forEach((heading, index) => {
  //         // Calculate text width for the current header
  //         const textWidth = context.measureText(heading).width;
  //         const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
  //         context.fillText(
  //           heading,
  //           x + (columnWidth - textWidth) / 2,
  //           image.height - tableHeight + 15
  //         ); // Center text horizontally in cell
  //         // Draw border for the header cell
  //         context.strokeRect(
  //           x,
  //           image.height - tableHeight,
  //           columnWidth,
  //           lineHeight
  //         );
  //         x += columnWidth; // Move to the next cell
  //       });

  //       context.font = "10px Arial"; // Decrease font size for data
  //       context.fillStyle = "black"; // Reset text color for data

  //       // Draw table data with borders
  //       let dataX = 20; // Start at the leftmost position
  //       data.forEach((value, index) => {
  //         // Calculate text width for the current data
  //         const textWidth = context.measureText(value).width;
  //         const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
  //         context.fillText(
  //           value,
  //           dataX + (columnWidth - textWidth) / 2,
  //           image.height - tableHeight + 30
  //         ); // Center text horizontally in cell
  //         // Draw border for the data cell
  //         context.strokeRect(
  //           dataX,
  //           image.height - tableHeight + 15,
  //           columnWidth,
  //           lineHeight
  //         );
  //         dataX += columnWidth; // Move to the next cell
  //       });

  //       // Convert the canvas content to a data URL
  //       const dataURL = canvas.toDataURL("image/jpeg");
  //       setFarmerPipeImage(dataURL);
  //     };

  //     image.src = farmerPipeImage;
  //   }
  // }, [
  //   farmerPipeImage,
  //   pipeLocation,
  //   farmerFieldId,
  //   pipeCapturedDateTime,
  //   farmerNameTitle,
  //   farmerCode,
  // ]);

  ////////////////////above good
  // useEffect(() => {
  //   if (farmerPipeImage && pipeLocation) {
  //     const image = new Image();

  //     image.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");

  //       canvas.width = image.width;
  //       canvas.height = image.height;

  //       context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //       // Decrease the table size
  //       const tableWidth = canvas.width - 40; // Reduce the width by 20 on each side
  //       const tableHeight = 120; // Reduce the height of the table

  //       // Draw light green background for the table
  //       context.fillStyle = "lightgreen";
  //       context.fillRect(
  //         20,
  //         image.height - tableHeight,
  //         tableWidth,
  //         tableHeight
  //       );

  //       // Draw table border
  //       context.strokeStyle = "black";
  //       context.lineWidth = 1;
  //       context.strokeRect(
  //         20,
  //         image.height - tableHeight,
  //         tableWidth,
  //         tableHeight
  //       );

  //       context.font = "bold 10px Arial";
  //       context.fillStyle = "black";

  //       const lineHeight = 15;

  //       const headings = [
  //         "Farmer Code",
  //         "Farmer S/No",
  //         "Farmer",
  //         "Latitude",
  //         "Longitude",
  //         "Captured on",
  //       ];

  //       const data = [
  //         farmerCode,
  //         farmerFieldId,
  //         farmerName,
  //         pipeLocation?.latitude.toFixed(7),
  //         pipeLocation?.longitude.toFixed(7),
  //         pipeCapturedDateTime,
  //       ];

  //       // Calculate column width based on the table width and number of columns
  //       const columnWidth = tableWidth / headings.length;

  //       // Draw table headings with borders
  //       let x = 20; // Start at the leftmost position
  //       headings.forEach((heading, index) => {
  //         // Calculate text width for the current header
  //         const textWidth = context.measureText(heading).width;
  //         const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
  //         context.fillText(
  //           heading,
  //           x + (columnWidth - textWidth) / 2,
  //           image.height - tableHeight + 15
  //         ); // Center text horizontally in cell
  //         // Draw border for the header cell
  //         context.strokeRect(
  //           x,
  //           image.height - tableHeight,
  //           columnWidth,
  //           lineHeight
  //         );
  //         x += columnWidth; // Move to the next cell
  //       });

  //       context.font = "10px Arial"; // Decrease font size for data
  //       context.fillStyle = "black"; // Reset text color for data

  //       // Draw table data with borders
  //       let dataX = 20; // Start at the leftmost position
  //       data.forEach((value, index) => {
  //         // Calculate text width for the current data
  //         const textWidth = context.measureText(value).width;
  //         const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
  //         context.fillText(
  //           value,
  //           dataX + (columnWidth - textWidth) / 2,
  //           image.height - tableHeight + 30
  //         ); // Center text horizontally in cell
  //         // Draw border for the data cell
  //         context.strokeRect(
  //           dataX,
  //           image.height - tableHeight + 15,
  //           columnWidth,
  //           lineHeight
  //         );
  //         dataX += columnWidth; // Move to the next cell
  //       });

  //       // Convert the canvas content to a data URL
  //       const dataURL = canvas.toDataURL("image/jpeg");
  //       setFarmerPipeImage(dataURL);
  //     };

  //     image.src = farmerPipeImage;
  //   }
  // }, [
  //   farmerPipeImage,
  //   pipeLocation,
  //   farmerFieldId,
  //   pipeCapturedDateTime,
  //   farmerNameTitle,
  //   farmerCode,
  // ]);

  useEffect(() => {
    if (farmerPipeImage && pipeLocation) {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Decrease the table size
        const tableWidth = canvas.width - 40; // Reduce the width by 20 on each side
        const tableHeight = 120; // Reduce the height of the table

        // Draw table background
        context.fillStyle = "rgba(255, 255, 255, 0)"; // Transparent background
        context.fillRect(
          20,
          image.height - tableHeight,
          tableWidth,
          tableHeight
        );

        // Draw table border
        context.strokeStyle = "white"; // Border color white
        context.lineWidth = 1;
        context.strokeRect(
          20,
          image.height - tableHeight,
          tableWidth,
          tableHeight
        );

        context.font = "bold 10px Arial";
        context.fillStyle = "white"; // Text color white

        const lineHeight = 15;

        const headings = [
          "Farmer Code",
          "Farmer S/No",
          "Farmer",
          "Latitude",
          "Longitude",
          "Captured on",
        ];

        const data = [
          farmerCode,
          farmerFieldId,
          farmerName,
          pipeLocation?.latitude.toFixed(7),
          pipeLocation?.longitude.toFixed(7),
          pipeCapturedDateTime,
        ];

        // Calculate column width based on the table width and number of columns
        const columnWidth = tableWidth / headings.length;

        // Draw table headings with borders
        let x = 20; // Start at the leftmost position
        headings.forEach((heading, index) => {
          // Calculate text width for the current header
          const textWidth = context.measureText(heading).width;
          const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
          context.fillText(
            heading,
            x + (columnWidth - textWidth) / 2,
            image.height - tableHeight + 15
          ); // Center text horizontally in cell
          // Draw border for the header cell
          context.strokeRect(
            x,
            image.height - tableHeight,
            columnWidth,
            lineHeight
          );
          x += columnWidth; // Move to the next cell
        });

        context.font = "10px Arial"; // Decrease font size for data
        context.fillStyle = "white"; // Reset text color for data

        // Draw table data with borders
        let dataX = 20; // Start at the leftmost position
        data.forEach((value, index) => {
          // Calculate text width for the current data
          const textWidth = context.measureText(value).width;
          const cellWidth = Math.max(textWidth + 10, columnWidth); // Add padding to text width for better alignment
          context.fillText(
            value,
            dataX + (columnWidth - textWidth) / 2,
            image.height - tableHeight + 30
          ); // Center text horizontally in cell
          // Draw border for the data cell
          context.strokeRect(
            dataX,
            image.height - tableHeight + 15,
            columnWidth,
            lineHeight
          );
          dataX += columnWidth; // Move to the next cell
        });

        // Convert the canvas content to a data URL
        const dataURL = canvas.toDataURL("image/jpeg");
        setFarmerPipeImage(dataURL);
      };

      image.src = farmerPipeImage;
    }
  }, [
    farmerPipeImage,
    pipeLocation,
    farmerFieldId,
    pipeCapturedDateTime,
    farmerNameTitle,
    farmerCode,
  ]);

  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${postpipepic}`;
  console.log(defaultImageUrl);
  return (
    <PipeImageContainer id="pipeImageContainer">
      <Headp>Post inspection photo with pipe</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleOpenPipeCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handlePipeFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showPipeCamera && (
        <PipeCameraView
          onCapture={handleCapturePipe}
          onClose={handlePipeCameraClose}
        />
      )}

      {farmerPipeImage && pipeLocation ? (
        <FarmerPipePreview imageUrl={farmerPipeImage} />
      ) : (
        <PipePhotoText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </PipePhotoText>
      )}
    </PipeImageContainer>
  );
};

export default FarmerPipeImageCts;
//////////////////////////////////////////////////////////table updated
// import React, { useState, useEffect } from "react";
// import Camera from "react-html5-camera-photo";
// import "react-html5-camera-photo/build/css/index.css";
// import styled from "styled-components";
// import { FaCamera, FaFile } from "react-icons/fa";
// import PipeCameraView from "../CamStore/PipeCameraView";

// const PipeImageContainer = styled.div`
//   background-color: #dfdfdf;
//   padding: 10px;
//   border-bottom: 2px solid gray;
// `;

// const FarmerPipePreview = styled.div`
//   max-width: 150px;
//   height: 130px;
//   background-color: #2ecc71;
//   background-image: ${(props) =>
//     props.imageUrl ? `url(${props.imageUrl})` : "none"};
//   background-size: cover;
//   background-position: center;
//   border-radius: 8px;
//   margin-top: -81px;
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   right: -230px;
//   gap: 18px;
//   margin-top: 5px;
// `;

// const CameraButton = styled.button`
//   background-color: green;
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;
//   width: 70px;
//   font-size: 17px;
//   margin-bottom: 0;
// `;

// const FileUploadButton = styled.label`
//   background-color: blue;
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;
//   width: 64px;
//   text-align: center;
//   font-size: 18px;
// `;

// const PipePhotoText = styled.p`
//   max-width: 150px;
//   height: 130px;
//   margin-top: -81px;
//   color: #777777;
//   font-size: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border: 2px dashed #777777;
//   border-radius: 8px;
// `;
// const Headp = styled.p`
//   margin-top: -4px;
//   font-size: 16px;
//   font-weight: 500;
//   color: #818181;
// `;

// const FarmerPipeImageCts = ({
//   onClose,
//   farmerId,
//   farmerFieldId,
//   device_uuid,
//   token,
//   farmerNameTitle,
//   farmerFather,
//   farmerName,
//   farmerPipeImage,
//   setFarmerPipeImage,
//   postpipepic,
// }) => {
//   const [showPipeCamera, setShowPipeCamera] = useState(false);
//   const [pipeLocation, setPipeLocation] = useState(null);
//   const [pipeCapturedDateTime, setPipeCapturedDateTime] = useState(null);

//   const handleOpenPipeCamera = () => {
//     setShowPipeCamera(true);
//   };

//   const handlePipeCameraClose = () => {
//     setShowPipeCamera(false);
//   };

//   const handleCapturePipe = (dataUri) => {
//     setFarmerPipeImage(dataUri);
//     setShowPipeCamera(false);
//     getPipeLocation();
//   };

//   const handlePipeFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFarmerPipeImage(reader.result);
//         getPipeLocation();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getPipeLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setPipeLocation({ latitude, longitude });
//           console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

//           setPipeCapturedDateTime(new Date().toLocaleString());
//         },
//         (error) => {
//           console.error("Error getting pipe location:", error.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   // useEffect(() => {
//   //   if (farmerPipeImage && pipeLocation) {
//   //     const image = new Image();

//   //     image.onload = () => {
//   //       const canvas = document.createElement("canvas");
//   //       const context = canvas.getContext("2d");

//   //       canvas.width = image.width;
//   //       canvas.height = image.height;

//   //       context.drawImage(image, 0, 0, canvas.width, canvas.height);

//   //       // Draw light green background for the table
//   //       context.fillStyle = "lightgreen";
//   //       context.fillRect(10, image.height - 160, canvas.width - 20, 140);

//   //       // Draw table border
//   //       context.strokeStyle = "black";
//   //       context.lineWidth = 1;
//   //       context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

//   //       context.font = "14px Arial";
//   //       context.fillStyle = "black"; // Change text color to black for better visibility

//   //       const lineHeight = 20; // Adjust line height for better readability

//   //       const tableData = [
//   //         { label: "Farmer S/No", value: farmerFieldId },
//   //         { label: "Latitude", value: pipeLocation?.latitude.toFixed(7) },
//   //         { label: "Longitude", value: pipeLocation?.longitude.toFixed(7) },
//   //         { label: "Farmer", value: farmerName },
//   //         { label: farmerNameTitle, value: farmerFather },
//   //         { label: "Captured on", value: pipeCapturedDateTime },
//   //       ];

//   //       // Draw table data
//   //       let y = image.height - 140;
//   //       tableData.forEach(({ label, value }) => {
//   //         context.fillText(`${label}:`, 20, y);
//   //         context.fillText(value, 120, y);
//   //         y += lineHeight;
//   //       });

//   //       // Convert the canvas content to a data URL
//   //       const dataURL = canvas.toDataURL("image/jpeg");
//   //       setFarmerPipeImage(dataURL);
//   //     };

//   //     image.src = farmerPipeImage;
//   //   }
//   // }, [farmerPipeImage, pipeLocation, farmerFieldId, pipeCapturedDateTime]);

//   useEffect(() => {
//     if (farmerPipeImage && pipeLocation) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         canvas.width = image.width;
//         canvas.height = image.height;

//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         // Draw light green background for the table
//         context.fillStyle = "lightgreen";
//         context.fillRect(10, image.height - 160, canvas.width - 20, 140);

//         // Draw table border
//         context.strokeStyle = "black";
//         context.lineWidth = 1;
//         context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

//         context.font = "bold 14px Arial";
//         context.fillStyle = "black"; // Change text color to black for better visibility

//         const lineHeight = 20; // Adjust line height for better readability

//         const headings = [
//           "Farmer S/No",
//           "Latitude",
//           "Longitude",
//           "Farmer",
//           farmerNameTitle,
//           "Captured on",
//         ];

//         const data = [
//           farmerFieldId,
//           pipeLocation?.latitude.toFixed(7),
//           pipeLocation?.longitude.toFixed(7),
//           farmerName,
//           farmerFather,
//           pipeCapturedDateTime,
//         ];

//         // Draw table headings
//         let y = image.height - 160 + lineHeight; // Start just below the top border
//         headings.forEach((heading, index) => {
//           context.fillText(heading, index * 140 + 20, y); // Adjust spacing based on column index
//         });

//         context.font = "14px Arial"; // Reset font style for data
//         context.fillStyle = "black"; // Reset text color for data

//         // Draw table data
//         data.forEach((value, index) => {
//           context.fillText(value, index * 140 + 20, y + lineHeight); // Adjust spacing based on column index
//         });

//         // Convert the canvas content to a data URL
//         const dataURL = canvas.toDataURL("image/jpeg");
//         setFarmerPipeImage(dataURL);
//       };

//       image.src = farmerPipeImage;
//     }
//   }, [
//     farmerPipeImage,
//     pipeLocation,
//     farmerFieldId,
//     pipeCapturedDateTime,
//     farmerNameTitle,
//   ]);

//   const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${postpipepic}`;
//   console.log(defaultImageUrl);
//   return (
//     <PipeImageContainer id="pipeImageContainer">
//       <Headp>Post inspection photo with pipe</Headp>
//       <ButtonContainer>
//         <CameraButton onClick={handleOpenPipeCamera}>
//           <FaCamera />
//         </CameraButton>
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handlePipeFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {showPipeCamera && (
//         <PipeCameraView
//           onCapture={handleCapturePipe}
//           onClose={handlePipeCameraClose}
//         />
//       )}

//       {farmerPipeImage && pipeLocation ? (
//         <FarmerPipePreview imageUrl={farmerPipeImage} />
//       ) : (
//         <PipePhotoText>
//           <img
//             src={defaultImageUrl}
//             alt="Default"
//             style={{ width: "100%", height: "-webkit-fill-available" }}
//           />
//         </PipePhotoText>
//       )}
//     </PipeImageContainer>
//   );
// };

// export default FarmerPipeImageCts;

//================================================================>>pipe section
// import React, { useState, useEffect } from "react";
// import Camera from "react-html5-camera-photo";
// import "react-html5-camera-photo/build/css/index.css";
// import styled from "styled-components";
// import { FaCamera, FaFile } from "react-icons/fa";
// import PipeCameraView from "../CamStore/PipeCameraView";

// const PipeImageContainer = styled.div`
//   background-color: #dfdfdf;
//   padding: 10px;
//   border-bottom: 2px solid gray;
// `;

// const FarmerPipePreview = styled.div`
//   max-width: 150px;
//   height: 130px;
//   background-color: #2ecc71;
//   background-image: ${(props) =>
//     props.imageUrl ? `url(${props.imageUrl})` : "none"};
//   background-size: cover;
//   background-position: center;
//   border-radius: 8px;
//   margin-top: -81px;
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   right: -230px;
//   gap: 18px;
//   margin-top: 5px;
// `;

// const CameraButton = styled.button`
//   background-color: green;
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;
//   width: 70px;
//   font-size: 17px;
//   margin-bottom: 0;
// `;

// const FileUploadButton = styled.label`
//   background-color: blue;
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;
//   width: 64px;
//   text-align: center;
//   font-size: 18px;
// `;

// const PipePhotoText = styled.p`
//   max-width: 150px;
//   height: 130px;
//   margin-top: -81px;
//   color: #777777;
//   font-size: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border: 2px dashed #777777;
//   border-radius: 8px;
// `;
// const Headp = styled.p`
//   margin-top: -4px;
//   font-size: 16px;
//   font-weight: 500;
//   color: #818181;
// `;

// const FarmerPipeImageCts = ({
//   onClose,
//   farmerId,
//   farmerFieldId,
//   device_uuid,
//   token,
//   farmerNameTitle,
//   farmerFather,
//   farmerName,
//   farmerPipeImage,
//   setFarmerPipeImage,
//   postpipepic,
// }) => {
//   const [showPipeCamera, setShowPipeCamera] = useState(false);
//   const [pipeLocation, setPipeLocation] = useState(null);
//   const [pipeCapturedDateTime, setPipeCapturedDateTime] = useState(null);

//   const handleOpenPipeCamera = () => {
//     setShowPipeCamera(true);
//   };

//   const handlePipeCameraClose = () => {
//     setShowPipeCamera(false);
//   };

//   const handleCapturePipe = (dataUri) => {
//     setFarmerPipeImage(dataUri);
//     setShowPipeCamera(false);
//     getPipeLocation();
//   };

//   const handlePipeFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFarmerPipeImage(reader.result);
//         getPipeLocation();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getPipeLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setPipeLocation({ latitude, longitude });
//           console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

//           setPipeCapturedDateTime(new Date().toLocaleString());
//         },
//         (error) => {
//           console.error("Error getting pipe location:", error.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     if (farmerPipeImage && pipeLocation) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         canvas.width = image.width;
//         canvas.height = image.height;

//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         context.font = "14px Arial";
//         context.fillStyle = "white";

//         const sNoText = `Farmer S/No : ${farmerFieldId}`;
//         const latitudeText = `Latitude   : ${pipeLocation?.latitude.toFixed(
//           7
//         )}`;
//         const longitudeText = `Longitude : ${pipeLocation?.longitude.toFixed(
//           7
//         )}`;
//         const farmerNameText = `Farmer :  ${farmerName}`;
//         const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
//         const dateTimeText = `Captured on: ${pipeCapturedDateTime}`;

//         context.font = "bold 14px Arial"; // Set bold font
//         context.fillText(sNoText, 20, image.height - 140); // Place at the top
//         context.font = "14px Arial"; // Reset font

//         context.fillText(latitudeText, 10, image.height - 120);
//         context.fillText(longitudeText, 10, image.height - 100);
//         context.fillText(farmerNameText, 10, image.height - 80);
//         context.fillText(farmerNameTitleText, 10, image.height - 60);
//         context.fillText(dateTimeText, 10, image.height - 40);

//         // Convert the canvas content to a data URL
//         const dataURL = canvas.toDataURL("image/jpeg");
//         setFarmerPipeImage(dataURL);
//       };

//       image.src = farmerPipeImage;
//     }
//   }, [farmerPipeImage, pipeLocation, farmerFieldId, pipeCapturedDateTime]);

//   const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${postpipepic}`;
//   console.log(defaultImageUrl);
//   return (
//     <PipeImageContainer id="pipeImageContainer">
//       <Headp>Post inspection photo with pipe</Headp>
//       <ButtonContainer>
//         <CameraButton onClick={handleOpenPipeCamera}>
//           <FaCamera />
//         </CameraButton>
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handlePipeFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {showPipeCamera && (
//         <PipeCameraView
//           onCapture={handleCapturePipe}
//           onClose={handlePipeCameraClose}
//         />
//       )}

//       {farmerPipeImage && pipeLocation ? (
//         <FarmerPipePreview imageUrl={farmerPipeImage} />
//       ) : (
//         <PipePhotoText>
//           <img
//             src={defaultImageUrl}
//             alt="Default"
//             style={{ width: "100%", height: "-webkit-fill-available" }}
//           />
//         </PipePhotoText>
//       )}
//     </PipeImageContainer>
//   );
// };

// export default FarmerPipeImageCts;
