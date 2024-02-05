import React, { useState, useEffect } from "react";
import styled from "styled-components";

import SubsidyCameraView from "../CamStore/SubsidyCameraView";
import { FaCamera, FaFile } from "react-icons/fa";

const SubsidyContainer = styled.div`
  background-color: #dfdfdf;
  padding: 10px;
  border-bottom: 2px solid gray;
`;

const FarmerSubsidyPreview = styled.div`
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
  right: -304px;
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

const SubsidyPhotoText = styled.p`
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

const FarmerSubsidySection = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  setSubsidyImage,
  sbsidypic,
}) => {
  const [farmerSubsidyImage, setFarmerSubsidyImage] = useState(null);
  const [showSubsidyCamera, setShowSubsidyCamera] = useState(false);
  const [subsidyLocation, setSubsidyLocation] = useState(null);
  const [subsidyCapturedDateTime, setSubsidyCapturedDateTime] = useState(null);

  const handleOpenSubsidyCamera = () => {
    setShowSubsidyCamera(true);
  };

  const handleSubsidyCameraClose = () => {
    setShowSubsidyCamera(false);
  };

  const handleCaptureSubsidy = (dataUri) => {
    setFarmerSubsidyImage(dataUri);
    setShowSubsidyCamera(false);
    getSubsidyLocation();
  };

  const handleSubsidyFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmerSubsidyImage(reader.result);
        getSubsidyLocation();
      };
      reader.readAsDataURL(file);
    }
  };

  const getSubsidyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setSubsidyLocation({ latitude, longitude });
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          setSubsidyCapturedDateTime(new Date().toLocaleString());
        },
        (error) => {
          console.error("Error getting subsidy location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (farmerSubsidyImage && subsidyLocation) {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        context.font = "14px Arial";
        context.fillStyle = "white";

        const sNoText = `Farmer S/No : ${farmerFieldId}`;
        const latitudeText = `Latitude   : ${subsidyLocation?.latitude.toFixed(
          7
        )}`;
        const longitudeText = `Longitude : ${subsidyLocation?.longitude.toFixed(
          7
        )}`;
        const farmerNameText = `Farmer :  ${farmerName}`;
        const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
        const dateTimeText = `Captured on: ${subsidyCapturedDateTime}`;

        context.font = "bold 14px Arial"; // Set bold font
        context.fillText(sNoText, 20, image.height - 140); // Place at the top
        context.font = "14px Arial"; // Reset font

        context.fillText(latitudeText, 10, image.height - 120);
        context.fillText(longitudeText, 10, image.height - 100);
        context.fillText(farmerNameText, 10, image.height - 80);
        context.fillText(farmerNameTitleText, 10, image.height - 60);
        context.fillText(dateTimeText, 10, image.height - 40);

        // Convert the canvas content to a data URL
        const dataURL = canvas.toDataURL("image/jpeg");
        setFarmerSubsidyImage(dataURL);
        setSubsidyImage(dataURL);
      };

      image.src = farmerSubsidyImage;
    }
  }, [
    farmerSubsidyImage,
    subsidyLocation,
    farmerName,
    farmerFather,
    farmerNameTitle,
    subsidyCapturedDateTime,
  ]);
  const defaultImageUrl = `https://sfamsserver.in/uploads/docs/${sbsidypic}`;
  return (
    <SubsidyContainer id="subsidyContainer">
      <Headp>Farmer Subsidy Copy</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleOpenSubsidyCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="image/*"
            onChange={handleSubsidyFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showSubsidyCamera && (
        <SubsidyCameraView
          onCapture={handleCaptureSubsidy}
          onClose={handleSubsidyCameraClose}
        />
      )}
      {farmerSubsidyImage && subsidyLocation && (
        <FarmerSubsidyPreview
          imageUrl={farmerSubsidyImage}
        ></FarmerSubsidyPreview>
      )}
      {farmerSubsidyImage ? null : (
        <SubsidyPhotoText>
          <img
            src={defaultImageUrl}
            alt="Default"
            style={{ width: "100%", height: "-webkit-fill-available" }}
          />
        </SubsidyPhotoText>
      )}
    </SubsidyContainer>
  );
};

export default FarmerSubsidySection;
