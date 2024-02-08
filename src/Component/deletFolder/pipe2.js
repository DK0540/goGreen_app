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
//   farmerCode,
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

//         // Draw semi-transparent light green background for the table
//         context.fillStyle = "rgba(27, 190, 173, 0.4)";
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
//           { label: "farmerCode", value: farmerCode },
//           { label: "Farmer", value: farmerName },
//           { label: "Latitude", value: pipeLocation?.latitude.toFixed(7) },
//           { label: "Longitude", value: pipeLocation?.longitude.toFixed(7) },
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
//   }, [
//     farmerPipeImage,
//     pipeLocation,
//     farmerFieldId,
//     pipeCapturedDateTime,
//     farmerCode,
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

/////////////////////////////////////////////new
// import React, { useState, useEffect, useRef } from "react";
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
//   farmerCode,
// }) => {
//   const [showPipeCamera, setShowPipeCamera] = useState(false);
//   const [pipeLocation, setPipeLocation] = useState(null);
//   const [pipeCapturedDateTime, setPipeCapturedDateTime] = useState(null);
//   const isFirstRender = useRef(true); // Ref to track first render

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
//     // Ensure effect runs only once after the first render
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }

//     if (farmerPipeImage && pipeLocation) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         canvas.width = image.width;
//         canvas.height = image.height;

//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         // Draw semi-transparent light green background for the table
//         context.fillStyle = "rgba(27, 190, 173, 0.4)";
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
//           { label: "farmerCode", value: farmerCode },
//           { label: "Farmer", value: farmerName },
//           { label: "Latitude", value: pipeLocation?.latitude.toFixed(7) },
//           { label: "Longitude", value: pipeLocation?.longitude.toFixed(7) },
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
//   }, [
//     farmerPipeImage,
//     pipeLocation,
//     farmerFieldId,
//     pipeCapturedDateTime,
//     farmerCode,
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

////////////////////////////////////////=====================working good in below one.
// import React, { useState, useEffect, useRef } from "react";
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
//   farmerCode,
// }) => {
//   const [showPipeCamera, setShowPipeCamera] = useState(false);
//   const [pipeLocation, setPipeLocation] = useState(null);
//   const [pipeCapturedDateTime, setPipeCapturedDateTime] = useState(null);
//   const isFirstRender = useRef(true);
//   const tableAttached = useRef(false);

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
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }

//     if (farmerPipeImage && pipeLocation && !tableAttached.current) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         canvas.width = image.width;
//         canvas.height = image.height;

//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         // Draw semi-transparent light green background for the table
//         context.fillStyle = "rgba(27, 190, 173, 0.4)";
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
//           { label: "farmerCode", value: farmerCode },
//           { label: "Farmer", value: farmerName },
//           { label: "Latitude", value: pipeLocation?.latitude.toFixed(7) },
//           { label: "Longitude", value: pipeLocation?.longitude.toFixed(7) },
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
//         tableAttached.current = true;
//       };

//       image.src = farmerPipeImage;
//     }
//   }, [
//     farmerPipeImage,
//     pipeLocation,
//     farmerFieldId,
//     pipeCapturedDateTime,
//     farmerCode,
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

///////////////////////////////////////////////////////////////al are good
import React, { useState, useEffect, useRef } from "react";
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
  const isFirstRender = useRef(true);
  const tableAttached = useRef(false);

  const handleOpenPipeCamera = () => {
    setShowPipeCamera(true);
  };

  const handlePipeCameraClose = () => {
    setShowPipeCamera(false);
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
      setFarmerPipeImage(dataURL);
    };

    image.src = imageSrc;
  };

  const handleCapturePipe = (dataUri) => {
    setFarmerPipeImage(dataUri);
    setShowPipeCamera(false);
    getPipeLocation();

    // Call the function to draw the table
    drawTable(dataUri);
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (farmerPipeImage && pipeLocation && !tableAttached.current) {
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
          { label: "Latitude", value: pipeLocation?.latitude.toFixed(7) },
          { label: "Longitude", value: pipeLocation?.longitude.toFixed(7) },
          { label: "Captured on", value: pipeCapturedDateTime },
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
        setFarmerPipeImage(dataURL);
        tableAttached.current = true;
      };

      image.src = farmerPipeImage;
    }
  }, [
    farmerPipeImage,
    pipeLocation,
    farmerFieldId,
    pipeCapturedDateTime,
    farmerCode,
  ]);

  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${postpipepic}`;

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
