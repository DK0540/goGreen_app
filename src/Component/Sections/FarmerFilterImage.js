import React, { useState, useEffect, useRef } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import styled from "styled-components";
import { FaCamera, FaFile } from "react-icons/fa";
import FilterCameraView from "../CamStore/FilterCameraView";

const FilterImageContainer = styled.div`
  background-color: #f3f3f3ed;
  padding: 10px;
  border-bottom: 2px solid gray;
`;

const FarmerFilterPreview = styled.div`
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

const FilterPhotoText = styled.p`
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

const FarmerFilterImage = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  setFarmerFilterImage,
  farmerFilterImage,
  farmerNameTitle,
  farmerFather,
  farmerName,
  postpic,
  farmerCode,
}) => {
  const [showFilterCamera, setShowFilterCamera] = useState(false);
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterCapturedDateTime, setFilterCapturedDateTime] = useState(null);
  const isFirstRender = useRef(true);
  const tableAttached = useRef(false);

  const handleOpenFilterCamera = () => {
    setShowFilterCamera(true);
  };

  const handleFilterCameraClose = () => {
    setShowFilterCamera(false);
  };

  /////////////////////
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
      setFarmerFilterImage(dataURL);
    };

    image.src = imageSrc;
  };

  const handleCaptureFilter = (dataUri) => {
    setFarmerFilterImage(dataUri);
    setShowFilterCamera(false);
    getFilterLocation();
    drawTable(dataUri);
  };

  const handleFilterFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmerFilterImage(reader.result);
        getFilterLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setFilterLocation({ latitude, longitude });
          setFilterCapturedDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting filter location:", error.message);
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
    if (farmerFilterImage && filterLocation && !tableAttached.current) {
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
          { label: "Latitude", value: filterLocation?.latitude.toFixed(7) },
          { label: "Longitude", value: filterLocation?.longitude.toFixed(7) },
          { label: "Captured on", value: filterCapturedDateTime },
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
        setFarmerFilterImage(dataURL);
        tableAttached.current = true;
      };

      image.src = farmerFilterImage;
    }
  }, [
    farmerFilterImage,
    filterLocation,
    farmerFieldId,
    filterCapturedDateTime,
    farmerCode,
  ]);

  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${postpic}`;
  return (
    <FilterImageContainer id="filterImageContainer">
      <Headp>Filter</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleOpenFilterCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handleFilterFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showFilterCamera && (
        <FilterCameraView
          onCapture={handleCaptureFilter}
          onClose={handleFilterCameraClose}
        />
      )}

      {farmerFilterImage && filterLocation ? (
        <FarmerFilterPreview imageUrl={farmerFilterImage} />
      ) : (
        <FilterPhotoText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </FilterPhotoText>
      )}
    </FilterImageContainer>
  );
};

export default FarmerFilterImage;
////////////////////////////////////////////////////////////old is good
// import React, { useState, useEffect } from "react";
// import Camera from "react-html5-camera-photo";
// import "react-html5-camera-photo/build/css/index.css";
// import styled from "styled-components";
// import { FaCamera, FaFile } from "react-icons/fa";
// import FilterCameraView from "../CamStore/FilterCameraView";

// const FilterImageContainer = styled.div`
//   background-color: #f3f3f3ed;
//   padding: 10px;
//   border-bottom: 2px solid gray;
// `;

// const FarmerFilterPreview = styled.div`
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

// const FilterPhotoText = styled.p`
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

// const FarmerFilterImage = ({
//   onClose,
//   farmerId,
//   farmerFieldId,
//   device_uuid,
//   token,
//   setFarmerFilterImage,
//   farmerFilterImage,
//   farmerNameTitle,
//   farmerFather,
//   farmerName,
//   postpic,
// }) => {
//   const [showFilterCamera, setShowFilterCamera] = useState(false);
//   const [filterLocation, setFilterLocation] = useState(null);
//   const [filterCapturedDateTime, setFilterCapturedDateTime] = useState(null);

//   const handleOpenFilterCamera = () => {
//     setShowFilterCamera(true);
//   };

//   const handleFilterCameraClose = () => {
//     setShowFilterCamera(false);
//   };

//   const handleCaptureFilter = (dataUri) => {
//     setFarmerFilterImage(dataUri);
//     setShowFilterCamera(false);
//     getFilterLocation();
//   };

//   const handleFilterFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFarmerFilterImage(reader.result);
//         getFilterLocation();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getFilterLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setFilterLocation({ latitude, longitude });
//           console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

//           // Set filter capturedDateTime to the current date and time
//           setFilterCapturedDateTime(new Date().toLocaleString());
//         },
//         (error) => {
//           console.error("Error getting filter location:", error.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     // Combine the captured image and table into a single image
//     if (farmerFilterImage && filterLocation) {
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
//         const latitudeText = `Latitude   : ${filterLocation?.latitude.toFixed(
//           7
//         )}`;
//         const longitudeText = `Longitude : ${filterLocation?.longitude.toFixed(
//           7
//         )}`;
//         const farmerNameText = `Farmer :  ${farmerName}`;
//         const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
//         const dateTimeText = `Captured on: ${filterCapturedDateTime}`;

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
//         setFarmerFilterImage(dataURL);
//       };

//       image.src = farmerFilterImage;
//     }
//   }, [
//     farmerFilterImage,
//     filterLocation,
//     farmerFieldId,
//     filterCapturedDateTime,
//   ]);
//   const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${postpic}`;
//   return (
//     <FilterImageContainer id="filterImageContainer">
//       <Headp>Filter</Headp>
//       <ButtonContainer>
//         <CameraButton onClick={handleOpenFilterCamera}>
//           <FaCamera />
//         </CameraButton>
//         <FileUploadButton>
//           <FaFile />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFilterFileUpload}
//             style={{ display: "none" }}
//           />
//         </FileUploadButton>
//       </ButtonContainer>

//       {showFilterCamera && (
//         <FilterCameraView
//           onCapture={handleCaptureFilter}
//           onClose={handleFilterCameraClose}
//         />
//       )}

//       {farmerFilterImage && filterLocation ? (
//         <FarmerFilterPreview imageUrl={farmerFilterImage} />
//       ) : (
//         <FilterPhotoText>
//           <img
//             src={defaultImageUrl}
//             alt="Default"
//             style={{ width: "100%", height: "-webkit-fill-available" }}
//           />
//         </FilterPhotoText>
//       )}
//     </FilterImageContainer>
//   );
// };

// export default FarmerFilterImage;
