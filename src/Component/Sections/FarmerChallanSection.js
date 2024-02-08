import React, { useState, useEffect, useRef } from "react";
import "react-html5-camera-photo/build/css/index.css";
import styled from "styled-components";
import { FaCamera, FaFile } from "react-icons/fa";
import ChallanCameraView from "../CamStore/ChallanCameraView";

const FarmerChallanContainer = styled.div`
  background-color: #f3f3f3ed;
  padding: 10px;
  border-bottom: 2px solid gray;
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

const FarmerChallanPreview = styled.div`
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

const FarmerChallanText = styled.p`
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

const FarmerChallanSection = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,

  capturedImage,
  location,
  challanImage,
  setChallanImage,
  CameraView,

  challanpic,
  farmerCode,
}) => {
  const [showChallanCamera, setShowChallanCamera] = useState(false);
  const [challanLocation, setChallanLocation] = useState(null);
  const [capturedChallanDateTime, setCapturedChallanDateTime] = useState(null);
  const isFirstRender = useRef(true);
  const tableAttached = useRef(false);

  const handleOpenChallanCamera = () => {
    setShowChallanCamera(true);
  };

  const handleChallanCameraClose = () => {
    setShowChallanCamera(false);
  };

  ///////

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
      setChallanImage(dataURL);
    };

    image.src = imageSrc;
  };

  const handleCaptureChallan = (dataUri) => {
    setChallanImage(dataUri);
    setShowChallanCamera(false);
    getCurrentChallanLocation();
    drawTable(dataUri);
  };

  const handleChallanFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChallanImage(reader.result);
        getCurrentChallanLocation(); // Update to the function for Challan location
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentChallanLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setChallanLocation({ latitude, longitude });
          console.log(`Challan Latitude: ${latitude}, Longitude: ${longitude}`);

          // Set capturedChallanDateTime to the current date and time
          setCapturedChallanDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting challan location:", error.message);
        }
      );
    } else {
      console.error(
        "Geolocation is not supported for challan by this browser."
      );
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (challanImage && challanLocation && !tableAttached.current) {
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
          { label: "Latitude", value: challanLocation?.latitude.toFixed(7) },
          { label: "Longitude", value: challanLocation?.longitude.toFixed(7) },
          { label: "Captured on", value: capturedChallanDateTime },
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
        setChallanImage(dataURL);
        tableAttached.current = true;
      };

      image.src = challanImage;
    }
  }, [
    challanImage,
    challanLocation,
    farmerFieldId,
    capturedChallanDateTime,
    farmerCode,
  ]);

  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${challanpic}`;
  console.log(defaultImageUrl);
  return (
    <FarmerChallanContainer id="farmerChallanContainer">
      <Headp>Challan</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleOpenChallanCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handleChallanFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showChallanCamera && (
        <ChallanCameraView
          onCapture={handleCaptureChallan}
          onClose={handleChallanCameraClose}
        />
      )}
      {challanImage && challanLocation ? (
        <FarmerChallanPreview imageUrl={challanImage} />
      ) : (
        <FarmerChallanText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </FarmerChallanText>
      )}
    </FarmerChallanContainer>
  );
};

export default FarmerChallanSection;

//////////////////////////////////old one
// import React from "react";
// import styled from "styled-components";
// import { FaCamera, FaFile } from "react-icons/fa";
// import ChallanCameraView from "../CamStore/ChallanCameraView";

// const FarmerChallanContainer = styled.div`
//   background-color: #f3f3f3ed;
//   padding: 10px;
//   border-bottom: 2px solid gray;
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

// const FarmerChallanPreview = styled.div`
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

// const FarmerChallanText = styled.p`
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

// const FarmerChallanSection = ({
//   handleOpenChallanCamera,
//   handleChallanFileUpload,
//   showChallanCamera,
//   challanLocation,
//   capturedImage,
//   location,
//   challanImage,
//   CameraView,
//   handleCaptureChallan,
//   handleChallanCameraClose,
//   challanpic,
// }) => {
//   const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${challanpic}`;
//   console.log(defaultImageUrl);
//   return (
//     <FarmerChallanContainer id="farmerChallanContainer">
//       <Headp>Challan</Headp>
//       <ButtonContainer>
//         <CameraButton onClick={handleOpenChallanCamera}>
//           <FaCamera />
//         </CameraButton>
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleChallanFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {showChallanCamera && (
//         <ChallanCameraView
//           onCapture={handleCaptureChallan}
//           onClose={handleChallanCameraClose}
//         />
//       )}
//       {challanImage && challanLocation && (
//         <FarmerChallanPreview imageUrl={challanImage}></FarmerChallanPreview>
//       )}
//       {challanImage ? null : (
//         <FarmerChallanText>
//           <img
//             src={defaultImageUrl}
//             alt="Default"
//             style={{ width: "100%", height: "-webkit-fill-available" }}
//           />
//         </FarmerChallanText>
//       )}
//     </FarmerChallanContainer>
//   );
// };

// export default FarmerChallanSection;
