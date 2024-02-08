import React, { useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { MdCameraswitch } from "react-icons/md";
import styled from "styled-components";

const Button = styled.button`
  background-color: #1a1b1b;
  color: white;
  padding: 15px;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  margin-right: 10px;
`;

const CameraViewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const CapturedImageContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 100%;
  text-align: center;
  padding: 10px;
`;

const CapturedImage = styled.img`
  max-width: 100%;
`;

const CaptureOptions = styled.div`
  margin-top: 10px;
`;

const CameraView = ({ onCapture, onClose }) => {
  const [facingMode, setFacingMode] = useState("environment");
  const [capturedImage, setCapturedImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  const handleTakePhoto = (dataUri) => {
    setPhotoTaken(true);
    setCapturedImage(dataUri);
    setShowOptions(true);
  };

  const handleRetake = () => {
    setPhotoTaken(false);
    setCapturedImage(null);
    setShowOptions(false);
  };

  const handleSave = () => {
    onCapture(capturedImage);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  return (
    <CameraViewContainer>
      {photoTaken && (
        <CapturedImageContainer>
          <CapturedImage src={capturedImage} alt="Captured" />
          {showOptions && (
            <CaptureOptions>
              <Button onClick={handleRetake}>Retake</Button>
              <Button onClick={handleSave}>Save</Button>
            </CaptureOptions>
          )}
        </CapturedImageContainer>
      )}
      {!photoTaken && (
        <>
          <Camera
            isImageMirror={false}
            onTakePhoto={handleTakePhoto}
            idealFacingMode={facingMode}
          />
          <ButtonContainer>
            <Button onClick={toggleFacingMode}>
              <MdCameraswitch />
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ButtonContainer>
        </>
      )}
    </CameraViewContainer>
  );
};

export default CameraView;

////////////////////////////////////////////////////old
// import React, { useState } from "react";
// import Camera from "react-html5-camera-photo";
// import "react-html5-camera-photo/build/css/index.css";
// import { MdCameraswitch } from "react-icons/md";
// import styled from "styled-components";

// const Button = styled.button`
//   background-color: #3498db;
//   color: white;
//   padding: 8px;
//   border: none;
//   border-radius: 3px;
//   margin-top: 10px;
//   cursor: pointer;
// `;

// const CameraViewContainer = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: #000;
//   z-index: 1000;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: flex-end;
// `;

// const CapturedImageContainer = styled.div`
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   max-width: 100%;
//   text-align: right;
//   padding: 10px;
//   bottom: 218px;
// `;

// const CapturedImage = styled.img`
//   max-width: 100%;
// `;

// const CaptureOptions = styled.div`
//   margin-top: 10px;
// `;

// const CameraView = ({ onCapture, onClose }) => {
//   const [facingMode, setFacingMode] = useState("environment");
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [showOptions, setShowOptions] = useState(false);
//   const [photoTaken, setPhotoTaken] = useState(false);

//   const handleTakePhoto = (dataUri) => {
//     setPhotoTaken(true);
//     setCapturedImage(dataUri);
//     setShowOptions(true);
//   };

//   const handleRetake = () => {
//     setPhotoTaken(false);
//     setCapturedImage(null);
//     setShowOptions(false);
//   };

//   const handleSave = () => {
//     onCapture(capturedImage);
//     onClose();
//   };

//   const toggleFacingMode = () => {
//     setFacingMode((prevMode) =>
//       prevMode === "environment" ? "user" : "environment"
//     );
//   };

//   return (
//     <CameraViewContainer>
//       {photoTaken && (
//         <CapturedImageContainer>
//           <CapturedImage src={capturedImage} alt="Captured" />
//           {showOptions && (
//             <CaptureOptions>
//               <Button onClick={handleRetake}>Retake</Button>
//               <Button onClick={handleSave}>Save</Button>
//             </CaptureOptions>
//           )}
//         </CapturedImageContainer>
//       )}
//       {!photoTaken && (
//         <>
//           <Camera
//             isImageMirror={false}
//             onTakePhoto={handleTakePhoto}
//             idealFacingMode={facingMode}
//           />
//           <Button className="cambtn1" onClick={toggleFacingMode}>
//             <MdCameraswitch />
//           </Button>
//           <Button className="closeBtn" onClick={onClose}>
//             Close
//           </Button>
//         </>
//       )}
//     </CameraViewContainer>
//   );
// };

// export default CameraView;
