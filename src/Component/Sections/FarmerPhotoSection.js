import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "react-html5-camera-photo/build/css/index.css";
import { FaCamera, FaFile } from "react-icons/fa";
import CameraView from "../CamStore/CameraView";

const FarmerPhotoContainer = styled.div`
  background-color: #f3f3f3ed; /* Set red background color */
  padding: 10px;
  border-bottom: 2px solid gray;
  border-top: 2px solid gray;
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
  background-color: green; /* Set green button color */
  color: white;
  padding: 3px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  width: 70px;
  font-size: 17px;
  margin-bottom: 0; /* Remove bottom margin */
`;

const FileUploadButton = styled.label`
  background-color: blue; /* Set blue button color */
  color: white;
  padding: 3px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  width: 64px;
  text-align: center;
  font-size: 18px;
`;

// const FarmerPhotoPrview = styled.div`
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
const FarmerPhotoPrview = styled.div`
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

const FarmerPhotoText = styled.p`
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

const FarmerPhotoSection = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  setCapturedImage,
  farmerPhoto,
  setFarmerPhoto,
  fphoto,
  farmerCode,
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState(null);
  const [capturedDateTime, setCapturedDateTime] = useState(null);

  const isFirstRender = useRef(true);
  const tableAttached = useRef(false);

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
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
      setFarmerPhoto(dataURL);
    };

    image.src = imageSrc;
  };

  const handleCapture = (dataUri) => {
    setFarmerPhoto(dataUri);
    setShowCamera(false);
    getCurrentLocation();
    drawTable(dataUri);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmerPhoto(reader.result);
        getCurrentLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
          // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          // Set capturedDateTime to the current date and time
          setCapturedDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting location:", error.message);
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
    if (farmerPhoto && location && !tableAttached.current) {
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
          {
            label: "Latitude",
            value: location?.latitude.toFixed(7),
          },
          {
            label: "Longitude",
            value: location?.longitude.toFixed(7),
          },
          { label: "Captured on", value: capturedDateTime },
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
        setFarmerPhoto(dataURL);
        tableAttached.current = true;
      };

      image.src = farmerPhoto;
    }
  }, [farmerPhoto, location, farmerFieldId, capturedDateTime, farmerCode]);

  // Correct usage of template literals
  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${fphoto}`;
  console.log(defaultImageUrl);
  return (
    <FarmerPhotoContainer id="farmerPhotoContainer">
      <Headp>Farmer Photo</Headp>
      <ButtonContainer>
        {/* Camera button */}
        <CameraButton onClick={handleOpenCamera}>
          <FaCamera />
        </CameraButton>

        {/* File upload button */}
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {/* Farmer Photo Preview or Empty Text */}
      {showCamera && (
        <CameraView onCapture={handleCapture} onClose={handleCameraClose} />
      )}
      {farmerPhoto && location && (
        <FarmerPhotoPrview imageUrl={farmerPhoto}></FarmerPhotoPrview>
      )}
      {farmerPhoto ? null : (
        <FarmerPhotoText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </FarmerPhotoText>
      )}
    </FarmerPhotoContainer>
  );
};

export default FarmerPhotoSection;

//////////////////////////////////old good working
// import React from "react";
// import styled from "styled-components";
// import { FaCamera, FaFile } from "react-icons/fa";

// const FarmerPhotoContainer = styled.div`
//   background-color: #f3f3f3ed; /* Set red background color */
//   padding: 10px;
//   border-bottom: 2px solid gray;
//   border-top: 2px solid gray;
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
//   background-color: green; /* Set green button color */
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;

//   width: 70px;
//   font-size: 17px;
//   margin-bottom: 0; /* Remove bottom margin */
// `;

// const FileUploadButton = styled.label`
//   background-color: blue; /* Set blue button color */
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;

//   width: 64px;
//   text-align: center;
//   font-size: 18px;
// `;

// // const FarmerPhotoPrview = styled.div`
// //   max-width: 150px;
// //   height: 130px;
// //   background-color: #2ecc71;
// //   background-image: ${(props) =>
// //     props.imageUrl ? `url(${props.imageUrl})` : "none"};
// //   background-size: cover;
// //   background-position: center;
// //   border-radius: 8px;
// //   margin-top: -81px;
// // `;
// const FarmerPhotoPrview = styled.div`
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

// const FarmerPhotoText = styled.p`
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

// const FarmerPhotoSection = ({
//   handleOpenCamera,
//   handleFileUpload,
//   showCamera,
//   capturedImage,
//   location,
//   farmerPhoto,
//   CameraView,
//   handleCapture,
//   handleCameraClose,
//   fphoto,
// }) => {
//   console.log(fphoto);

//   // Correct usage of template literals
//   const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${fphoto}`;
//   console.log(defaultImageUrl);
//   return (
//     <FarmerPhotoContainer id="farmerPhotoContainer">
//       <Headp>Farmer Photo</Headp>
//       <ButtonContainer>
//         {/* Camera button */}
//         <CameraButton onClick={handleOpenCamera}>
//           <FaCamera />
//         </CameraButton>

//         {/* File upload button */}
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {/* Farmer Photo Preview or Empty Text */}
//       {showCamera && (
//         <CameraView onCapture={handleCapture} onClose={handleCameraClose} />
//       )}
//       {capturedImage && location && (
//         <FarmerPhotoPrview imageUrl={farmerPhoto}></FarmerPhotoPrview>
//       )}
//       {farmerPhoto ? null : (
//         <FarmerPhotoText>
//           <img
//             src={defaultImageUrl}
//             alt="Default"
//             style={{ width: "100%", height: "-webkit-fill-available" }}
//           />
//         </FarmerPhotoText>
//       )}
//     </FarmerPhotoContainer>
//   );
// };

// export default FarmerPhotoSection;
///////////////////////////////////////////////////old ok
// import React from "react";
// import styled from "styled-components";
// import { FaCamera, FaFile } from "react-icons/fa";

// const FarmerPhotoContainer = styled.div`
//   background-color: #f3f3f3ed; /* Set red background color */
//   padding: 10px;
//   border-bottom: 2px solid gray;
//   border-top: 2px solid gray;
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   right: -304px;
//   gap: 18px;
//   margin-top: 5px;
// `;

// const CameraButton = styled.button`
//   background-color: green; /* Set green button color */
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;

//   width: 70px;
//   font-size: 17px;
//   margin-bottom: 0; /* Remove bottom margin */
// `;

// const FileUploadButton = styled.label`
//   background-color: blue; /* Set blue button color */
//   color: white;
//   padding: 3px;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;

//   width: 64px;
//   text-align: center;
//   font-size: 18px;
// `;

// const FarmerPhotoPrview = styled.div`
//   max-width: 150px;
//   height: 130px;
//   background-color: #2ecc71;
// background-image: ${(props) =>
//   props.imageUrl ? `url(${props.imageUrl})` : "none"};
//   background-size: cover;
//   background-position: center;
//   border-radius: 8px;
//   margin-top: -81px;
// `;

// const FarmerPhotoText = styled.p`
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

// const FarmerPhotoSection = ({
//   handleOpenCamera,
//   handleFileUpload,
//   showCamera,
//   capturedImage,
//   location,
//   farmerPhoto,
//   CameraView,
//   handleCapture,
//   handleCameraClose,
// }) => {
//   return (
//     <FarmerPhotoContainer id="farmerPhotoContainer">
//       <Headp>Farmer Photo</Headp>
//       <ButtonContainer>
//         {/* Camera button */}
//         <CameraButton onClick={handleOpenCamera}>
//           <FaCamera />
//         </CameraButton>

//         {/* File upload button */}
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {/* Farmer Photo Preview or Empty Text */}
//       {showCamera && (
//         <CameraView onCapture={handleCapture} onClose={handleCameraClose} />
//       )}
//       {capturedImage && location && (
//         <FarmerPhotoPrview imageUrl={farmerPhoto}></FarmerPhotoPrview>
//       )}
//       {farmerPhoto ? null : <FarmerPhotoText>Empty</FarmerPhotoText>}
//     </FarmerPhotoContainer>
//   );
// };

// export default FarmerPhotoSection;
