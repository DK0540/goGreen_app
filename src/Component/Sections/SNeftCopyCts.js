import React, { useState, useEffect, useRef } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import styled from "styled-components";
import { FaCamera, FaFile } from "react-icons/fa";
import SNeftCopyCameraView from "../CamStore/SNeftCopyCameraView";

const SNeftCopyContainer = styled.div`
  background-color: #f3f3f3ed;
  padding: 10px;
  border-bottom: 2px solid gray;
`;

const FarmerSNeftCopyPreview = styled.div`
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

const SNeftCopyPhotoText = styled.p`
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

const SNeftCopyCts = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  setSNeftCopyImage,
  setNeftCopyImage,
  sbsidypic,
  farmerCode,
}) => {
  const [farmerSNeftCopyImage, setFarmerSNeftCopyImage] = useState(null);
  const [showSNeftCopyCamera, setShowSNeftCopyCamera] = useState(false);
  const [sNeftCopyLocation, setSNeftCopyLocation] = useState(null);
  const [sNeftCopyCapturedDateTime, setSNeftCopyCapturedDateTime] =
    useState(null);

  const isFirstRender = useRef(true);
  const tableAttached = useRef(false);

  const handleOpenSNeftCopyCamera = () => {
    setShowSNeftCopyCamera(true);
  };

  const handleSNeftCopyCameraClose = () => {
    setShowSNeftCopyCamera(false);
  };

  ///////////////
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
      setFarmerSNeftCopyImage(dataURL);
    };

    image.src = imageSrc;
  };

  const handleSNeftCopyCapture = (dataUri) => {
    setFarmerSNeftCopyImage(dataUri);
    setShowSNeftCopyCamera(false);
    getSNeftCopyLocation();
    drawTable(dataUri);
  };

  const handleSNeftCopyFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmerSNeftCopyImage(reader.result);
        getSNeftCopyLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  const getSNeftCopyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setSNeftCopyLocation({ latitude, longitude });
          setSNeftCopyCapturedDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting SNeftCopy location:", error.message);
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
    if (farmerSNeftCopyImage && sNeftCopyLocation && !tableAttached.current) {
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
          { label: "Latitude", value: sNeftCopyLocation?.latitude.toFixed(7) },
          {
            label: "Longitude",
            value: sNeftCopyLocation?.longitude.toFixed(7),
          },
          { label: "Captured on", value: sNeftCopyCapturedDateTime },
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
        setNeftCopyImage(dataURL);
        tableAttached.current = true;
      };

      image.src = farmerSNeftCopyImage;
    }
  }, [
    farmerSNeftCopyImage,
    sNeftCopyLocation,
    farmerFieldId,
    sNeftCopyCapturedDateTime,
    farmerCode,
    farmerName,
  ]);

  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${sbsidypic}`;
  console.log(defaultImageUrl);
  return (
    <SNeftCopyContainer id="sNeftCopyContainer">
      <Headp>Subsidy Neft Copy</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleOpenSNeftCopyCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handleSNeftCopyFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showSNeftCopyCamera && (
        <SNeftCopyCameraView
          onCapture={handleSNeftCopyCapture}
          onClose={handleSNeftCopyCameraClose}
        />
      )}
      {farmerSNeftCopyImage && sNeftCopyLocation && (
        <FarmerSNeftCopyPreview
          imageUrl={farmerSNeftCopyImage}
        ></FarmerSNeftCopyPreview>
      )}
      {farmerSNeftCopyImage ? null : (
        <SNeftCopyPhotoText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </SNeftCopyPhotoText>
      )}
    </SNeftCopyContainer>
  );
};

export default SNeftCopyCts;
