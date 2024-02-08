import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "react-html5-camera-photo/build/css/index.css";
import BankPassbookCameraView from "../CamStore/BankPassbookCameraView";
import { FaCamera, FaFile } from "react-icons/fa";

const BankPassbookContainer = styled.div`
  background-color: #dfdfdf;
  padding: 10px;
  border-bottom: 2px solid gray;
`;

const FarmerBankPassbookPreview = styled.div`
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

const BankPassbookPhotoText = styled.p`
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

const BankPassbookSection = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  bankPassbookImage,
  setBankPassbookImage,
  passPoto,
  farmerCode,
}) => {
  const [showBankPassbookCamera, setShowBankPassbookCamera] = useState(false);
  const [bankPassbookLocation, setBankPassbookLocation] = useState(null);
  const [bankPassbookCapturedDateTime, setBankPassbookCapturedDateTime] =
    useState(null);

  const isFirstRender = useRef(true);
  const tableAttached = useRef(false);

  const handleBankPassbookOpenCamera = () => {
    setShowBankPassbookCamera(true);
  };

  const handleBankPassbookCameraClose = () => {
    setShowBankPassbookCamera(false);
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
      setBankPassbookImage(dataURL);
    };

    image.src = imageSrc;
  };

  const handleBankPassbookCapture = (dataUri) => {
    setBankPassbookImage(dataUri);
    setShowBankPassbookCamera(false);
    getBankPassbookLocation();
    drawTable(dataUri);
  };

  const handleBankPassbookFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankPassbookImage(reader.result);
        getBankPassbookLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  const getBankPassbookLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setBankPassbookLocation({ latitude, longitude });
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          // Set bank passbook capturedDateTime to the current date and time
          setBankPassbookCapturedDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting bank passbook location:", error.message);
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

    if (bankPassbookImage && bankPassbookLocation && !tableAttached.current) {
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
            value: bankPassbookLocation?.latitude.toFixed(7),
          },
          {
            label: "Longitude",
            value: bankPassbookLocation?.longitude.toFixed(7),
          },
          { label: "Captured on", value: bankPassbookCapturedDateTime },
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
        setBankPassbookImage(dataURL);
        tableAttached.current = true;
      };

      image.src = bankPassbookImage;
    }
  }, [
    bankPassbookImage,
    bankPassbookLocation,
    farmerFieldId,
    bankPassbookCapturedDateTime,
    farmerCode,
  ]);

  // Correct usage of template literals
  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${passPoto}`;
  return (
    <BankPassbookContainer id="bankPassbookContainer">
      <Headp>Bank Passbook</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleBankPassbookOpenCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handleBankPassbookFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showBankPassbookCamera && (
        <BankPassbookCameraView
          onCapture={handleBankPassbookCapture}
          onClose={handleBankPassbookCameraClose}
        />
      )}
      {bankPassbookImage && bankPassbookLocation && (
        <FarmerBankPassbookPreview
          imageUrl={bankPassbookImage}
        ></FarmerBankPassbookPreview>
      )}
      {bankPassbookImage ? null : (
        <BankPassbookPhotoText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </BankPassbookPhotoText>
      )}
    </BankPassbookContainer>
  );
};

export default BankPassbookSection;
/////////////////////////////////old good working
// import React from "react";
// import styled from "styled-components";

// import BankPassbookCameraView from "../CamStore/BankPassbookCameraView";
// import { FaCamera, FaFile } from "react-icons/fa";

// const BankPassbookContainer = styled.div`
//   background-color: #dfdfdf;
//   padding: 10px;
//   border-bottom: 2px solid gray;
// `;

// const FarmerBankPassbookPreview = styled.div`
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

// const BankPassbookPhotoText = styled.p`
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

// const BankPassbookSection = ({
//   handleBankPassbookOpenCamera,
//   handleBankPassbookFileUpload,
//   handleBankPassbookCapture,
//   bankPassbookLocation,
//   showBankPassbookCamera,
//   handleBankPassbookCameraClose,

//   bankPassbookImage,

//   TableContainer,
//   passPoto,
// }) => {
//   // Correct usage of template literals
//   const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${passPoto}`;
//   return (
//     <BankPassbookContainer id="bankPassbookContainer">
//       <Headp>Bank Passbook</Headp>
//       <ButtonContainer>
//         <CameraButton onClick={handleBankPassbookOpenCamera}>
//           <FaCamera />
//         </CameraButton>
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleBankPassbookFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {showBankPassbookCamera && (
//         <BankPassbookCameraView
//           onCapture={handleBankPassbookCapture}
//           onClose={handleBankPassbookCameraClose}
//         />
//       )}
//       {bankPassbookImage && bankPassbookLocation && (
//         <FarmerBankPassbookPreview
//           imageUrl={bankPassbookImage}
//         ></FarmerBankPassbookPreview>
//       )}
//       {bankPassbookImage ? null : (
//         <BankPassbookPhotoText>
//           <img
//             src={defaultImageUrl}
//             alt="Default"
//             style={{ width: "100%", height: "-webkit-fill-available" }}
//           />
//         </BankPassbookPhotoText>
//       )}
//     </BankPassbookContainer>
//   );
// };

// export default BankPassbookSection;

///////////////////////////////////////////////////////////////okay
// import React from "react";
// import styled from "styled-components";

// import BankPassbookCameraView from "../CamStore/BankPassbookCameraView";
// import { FaCamera, FaFile } from "react-icons/fa";

// const BankPassbookContainer = styled.div`
//   background-color: #dfdfdf;
//   padding: 10px;
//   border-bottom: 2px solid gray;
// `;

// const FarmerBankPassbookPreview = styled.div`
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
//   right: -304px;
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

// const BankPassbookPhotoText = styled.p`
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

// const BankPassbookSection = ({
//   handleBankPassbookOpenCamera,
//   handleBankPassbookFileUpload,
//   handleBankPassbookCapture,
//   bankPassbookLocation,
//   showBankPassbookCamera,
//   handleBankPassbookCameraClose,

//   bankPassbookImage,

//   TableContainer,
// }) => {
//   return (
//     <BankPassbookContainer id="bankPassbookContainer">
//       <Headp>Bank Passbook</Headp>
//       <ButtonContainer>
//         <CameraButton onClick={handleBankPassbookOpenCamera}>
//           <FaCamera />
//         </CameraButton>
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleBankPassbookFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {showBankPassbookCamera && (
//         <BankPassbookCameraView
//           onCapture={handleBankPassbookCapture}
//           onClose={handleBankPassbookCameraClose}
//         />
//       )}
//       {bankPassbookImage && bankPassbookLocation && (
//         <FarmerBankPassbookPreview
//           imageUrl={bankPassbookImage}
//         ></FarmerBankPassbookPreview>
//       )}
//       {bankPassbookImage ? null : (
//         <BankPassbookPhotoText>Empty</BankPassbookPhotoText>
//       )}
//     </BankPassbookContainer>
//   );
// };

// export default BankPassbookSection;
