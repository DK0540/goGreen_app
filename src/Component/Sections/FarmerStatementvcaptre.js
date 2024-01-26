import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StatementCameraView from "../CamStore/StatementCameraView ";
import { FaCamera, FaFile } from "react-icons/fa";

const StatementCaptureContainer = styled.div`
  background-color: #f3f3f3ed;
  padding: 10px;
  border-bottom: 2px solid gray;
`;

const FarmerStatementPreview = styled.div`
  max-width: 150px;
  height: 130px;
  background-color: #2ecc71;
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

const StatementPhotoText = styled.p`
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

const FarmerStatementCapture = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  capturedVideo,
  setCapturedVideo,
}) => {
  const [showStatementCamera, setShowStatementCamera] = useState(false);
  const [statementLocation, setStatementLocation] = useState(null);
  const [statementCapturedDateTime, setStatementCapturedDateTime] =
    useState(null);

  const handleOpenStatementCamera = () => {
    setShowStatementCamera(true);
  };

  const handleStatementCameraClose = () => {
    setShowStatementCamera(false);
  };

  const handleCaptureStatement = (videoUrl) => {
    console.log("Captured Video in Child:", videoUrl);
    setCapturedVideo(videoUrl);
    setShowStatementCamera(false);
  };

  const handleStatementFileUpload = (event) => {};

  const getStatementLocation = () => {};

  return (
    <StatementCaptureContainer id="statementCaptureContainer">
      <Headp>Statement Video</Headp>
      <ButtonContainer>
        <CameraButton onClick={handleOpenStatementCamera}>
          <FaCamera />
        </CameraButton>
        <FileUploadButton>
          <FaFile />
          <input
            type="file"
            accept="video/*"
            onChange={handleStatementFileUpload}
            style={{ display: "none" }}
          />
        </FileUploadButton>
      </ButtonContainer>

      {showStatementCamera && (
        <StatementCameraView
          onCapture={handleCaptureStatement}
          onClose={handleStatementCameraClose}
        />
      )}

      {capturedVideo ? (
        <FarmerStatementPreview>
          <video controls width="100%" height="100%" src={capturedVideo} />
        </FarmerStatementPreview>
      ) : (
        <StatementPhotoText>Empty</StatementPhotoText>
      )}
    </StatementCaptureContainer>
  );
};

export default FarmerStatementCapture;
