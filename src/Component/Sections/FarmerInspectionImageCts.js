import React, { useState, useEffect, useRef } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import styled from "styled-components";
import { FaCamera, FaFile } from "react-icons/fa";
import InspectionCameraView from "../CamStore/InspectionCameraView";

const InspectionContainer = styled.div`
  background-color: #dfdfdf;
  padding: 10px;
  border-bottom: 2px solid gray;
`;

const FarmerInspectionPreview = styled.div`
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

const InspectionPhotoText = styled.p`
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

const FarmerInspectionImageCts = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  setInspectionImage,
  setFInspectionImage,
  inspectpic,
  farmerCode,
}) => {
  const [farmerInspectionImage, setFarmerInspectionImage] = useState(null);
  const [showInspectionCamera, setShowInspectionCamera] = useState(false);
  const [inspectionLocation, setInspectionLocation] = useState(null);
  const [inspectionCapturedDateTime, setInspectionCapturedDateTime] =
    useState(null);

  const isFirstRender = useRef(true);
  const tableAttached = useRef(false);

  const handleOpenInspectionCamera = () => {
    setShowInspectionCamera(true);
  };

  const handleInspectionCameraClose = () => {
    setShowInspectionCamera(false);
  };

  const drawTable = (imageSrc) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw semi-transparent light green background for the table
      context.fillStyle = "rgba(27, 190, 173, 0.4)";
      context.fillRect(10, image.height - 160, canvas.width - 20, 140);

      // Draw table border
      context.strokeStyle = "black";
      context.lineWidth = 1;
      context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

      context.font = "14px Arial";
      context.fillStyle = "black"; // Change text color to black for better visibility

      const lineHeight = 20; // Adjust line height for better readability

      const tableData = [
        { label: "Farmer S/No", value: farmerFieldId },
        { label: "farmerCode", value: farmerCode },
        { label: "Farmer", value: farmerName },
        { label: "Latitude", value: "" },
        { label: "Longitude", value: "" },
        { label: "Captured on", value: "" },
      ];

      // Draw table data
      let y = image.height - 140;
      tableData.forEach(({ label, value }) => {
        context.fillText(`${label}:`, 20, y);
        context.fillText(value, 120, y);
        y += lineHeight;
      });

      // Convert the canvas content to a data URL
      const dataURL = canvas.toDataURL("image/jpeg");
      setFarmerInspectionImage(dataURL);
    };

    image.src = imageSrc;
  };

  const handleCaptureInspection = (dataUri) => {
    setFarmerInspectionImage(dataUri);
    setShowInspectionCamera(false);
    getInspectionLocation();
    drawTable(dataUri);
  };

  const handleInspectionFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmerInspectionImage(reader.result);
        getInspectionLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  const getInspectionLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setInspectionLocation({ latitude, longitude });
          setInspectionCapturedDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting inspection location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (farmerInspectionImage && inspectionLocation && !tableAttached.current) {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw semi-transparent light green background for the table
        context.fillStyle = "rgba(27, 190, 173, 0.4)";
        context.fillRect(10, image.height - 160, canvas.width - 20, 140);

        // Draw table border
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.strokeRect(10, image.height - 160, canvas.width - 20, 140);

        context.font = "14px Arial";
        context.fillStyle = "black"; // Change text color to black for better visibility

        const lineHeight = 20; // Adjust line height for better readability

        const tableData = [
          { label: "Farmer S/No", value: farmerFieldId },
          { label: "farmerCode", value: farmerCode },
          { label: "Farmer", value: farmerName },
          { label: "Latitude", value: inspectionLocation?.latitude.toFixed(7) },
          {
            label: "Longitude",
            value: inspectionLocation?.longitude.toFixed(7),
          },
          { label: "Captured on", value: inspectionCapturedDateTime },
        ];

        // Draw table data
        let y = image.height - 140;
        tableData.forEach(({ label, value }) => {
          context.fillText(`${label}:`, 20, y);
          context.fillText(value, 120, y);
          y += lineHeight;
        });

        // Convert the canvas content to a data URL
        const dataURL = canvas.toDataURL("image/jpeg");
        setFInspectionImage(dataURL);
        tableAttached.current = true;
      };

      image.src = farmerInspectionImage;
    }
  }, [
    farmerInspectionImage,
    inspectionLocation,
    farmerFieldId,
    inspectionCapturedDateTime,
    farmerCode,
    farmerName,
  ]);
  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${inspectpic}`;
  console.log(defaultImageUrl);
  return (
    <InspectionContainer id="inspectionContainer">
      <Headp>Pre Inspection Photo</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleOpenInspectionCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handleInspectionFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showInspectionCamera && (
        <InspectionCameraView
          onCapture={handleCaptureInspection}
          onClose={handleInspectionCameraClose}
        />
      )}
      {farmerInspectionImage && inspectionLocation ? (
        <FarmerInspectionPreview imageUrl={farmerInspectionImage} />
      ) : (
        <InspectionPhotoText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </InspectionPhotoText>
      )}
    </InspectionContainer>
  );
};

export default FarmerInspectionImageCts;

//////////////////////////////////////////old one
// import React, { useState, useEffect } from "react";
// import Camera from "react-html5-camera-photo";
// import "react-html5-camera-photo/build/css/index.css";
// import styled from "styled-components";
// import { FaCamera, FaFile } from "react-icons/fa";
// import InspectionCameraView from "../CamStore/InspectionCameraView";

// const InspectionContainer = styled.div`
//   background-color: #dfdfdf;
//   padding: 10px;
//   border-bottom: 2px solid gray;
// `;

// const FarmerInspectionPreview = styled.div`
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

// const InspectionPhotoText = styled.p`
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

// const FarmerInspectionImageCts = ({
//   onClose,
//   farmerId,
//   farmerFieldId,
//   device_uuid,
//   token,
//   farmerNameTitle,
//   farmerFather,
//   farmerName,
//   setInspectionImage,
//   setFInspectionImage,
//   inspectpic,
// }) => {
//   const [farmerInspectionImage, setFarmerInspectionImage] = useState(null);
//   const [showInspectionCamera, setShowInspectionCamera] = useState(false);
//   const [inspectionLocation, setInspectionLocation] = useState(null);
//   const [inspectionCapturedDateTime, setInspectionCapturedDateTime] =
//     useState(null);

//   const handleOpenInspectionCamera = () => {
//     setShowInspectionCamera(true);
//   };

//   const handleInspectionCameraClose = () => {
//     setShowInspectionCamera(false);
//   };

//   const handleCaptureInspection = (dataUri) => {
//     setFarmerInspectionImage(dataUri);
//     setShowInspectionCamera(false);
//     getInspectionLocation();
//   };

//   const handleInspectionFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFarmerInspectionImage(reader.result);
//         getInspectionLocation();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getInspectionLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setInspectionLocation({ latitude, longitude });
//           console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

//           // Set inspection capturedDateTime to the current date and time
//           setInspectionCapturedDateTime(new Date().toLocaleString());
//         },
//         (error) => {
//           console.error("Error getting inspection location:", error.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     if (farmerInspectionImage && inspectionLocation) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         canvas.width = image.width;
//         canvas.height = image.height;

//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         context.strokeStyle = "#3498db";
//         context.lineWidth = 2;

//         context.strokeRect(0, 0, canvas.width, canvas.height);

//         context.font = "14px Arial";
//         context.fillStyle = "white";

//         const sNoText = `Farmer S/No : ${farmerFieldId}`;
//         const latitudeText = `Latitude   : ${inspectionLocation?.latitude.toFixed(
//           7
//         )}`;
//         const longitudeText = `Longitude : ${inspectionLocation?.longitude.toFixed(
//           7
//         )}`;
//         const farmerNameText = `Farmer :  ${farmerName}`;
//         const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
//         const dateTimeText = `Captured on: ${inspectionCapturedDateTime}`;

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
//         setFarmerInspectionImage(dataURL);
//         setFInspectionImage(dataURL);
//       };

//       image.src = farmerInspectionImage;
//     }
//   }, [
//     farmerInspectionImage,
//     inspectionLocation,
//     farmerName,
//     farmerFather,
//     farmerNameTitle,
//     inspectionCapturedDateTime,
//   ]);
//   const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${inspectpic}`;
//   return (
//     <InspectionContainer id="inspectionContainer">
//       <Headp>Pre Inspection Photo</Headp>
//       <ButtonContainer>
//         <CameraButton onClick={handleOpenInspectionCamera}>
//           <FaCamera />
//         </CameraButton>
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleInspectionFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {showInspectionCamera && (
//         <InspectionCameraView
//           onCapture={handleCaptureInspection}
//           onClose={handleInspectionCameraClose}
//         />
//       )}
//       {farmerInspectionImage && inspectionLocation && (
//         <FarmerInspectionPreview
//           imageUrl={farmerInspectionImage}
//         ></FarmerInspectionPreview>
//       )}
//       {farmerInspectionImage ? null : (
//         <InspectionPhotoText>
//           <img
//             src={defaultImageUrl}
//             alt="Default"
//             style={{ width: "100%", height: "-webkit-fill-available" }}
//           />
//         </InspectionPhotoText>
//       )}
//     </InspectionContainer>
//   );
// };

// export default FarmerInspectionImageCts;
