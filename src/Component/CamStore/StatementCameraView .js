import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { MdCameraswitch } from "react-icons/md";

const StatementCameraViewContainer = styled.div`
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

const Timer = styled.span`
  font-size: ${(props) => (props.recording ? "20px" : "16px")};
  margin-top: ${(props) => (props.isWhite ? "20px" : "10px")};
  color: ${(props) => (props.isWhite ? "white" : "red")};
  text-align: center; /* Center text */
  margin-bottom: -11px; /* Add margin bottom for spacing */
`;

///////////
const CaptureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%; /* Set width to 100% to fill the container */
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap to the next line if needed */
  justify-content: center; /* Center the buttons horizontally */
  margin-top: 10px;
  width: 100%;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: #1a1b1b;
  color: #fff;
  border: none;
  border-radius: 3px; /* Add border radius */
  cursor: pointer;
  width: calc(
    45% - 10px
  ); /* Adjusted button width with spacing between buttons */
  max-width: 200px; /* Set maximum width for better responsiveness */

  /* Media query for laptop-sized screens */
  @media screen and (min-width: 768px) {
    width: 100%; /* Set width to 100% for buttons to occupy full width */
  }
`;

const VideoPreview = styled.video`
  margin-top: 10px;
  width: 100vw; /* Set width to 100% of the viewport width */
  max-height: 100vh; /* Set maximum height to 100% of the viewport height */
  object-fit: cover; /* Ensure the video fills the container */
`;

const StatementCameraView = ({ onCapture, onClose }) => {
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(60);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: true, // Request access to the microphone
      });
      setMediaStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  useEffect(() => {
    initializeCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    let interval;

    if (recording) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime - 1);

        if (elapsedTime <= 0) {
          stopRecording();
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [recording, elapsedTime]);

  const startRecording = () => {
    if (mediaStream) {
      mediaRecorderRef.current = new MediaRecorder(mediaStream, {
        mimeType: "video/webm;codecs=vp9,opus",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setCapturedVideo(URL.createObjectURL(blob));
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      const blob = new Blob(chunksRef.current, { type: "video/mp4" });
      setCapturedVideo(URL.createObjectURL(blob));
      chunksRef.current = [];
    }
  };

  if (elapsedTime < 1) {
    stopRecording();
  }

  const saveVideo = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }

    if (chunksRef.current.length > 0) {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" });
      setCapturedVideo(URL.createObjectURL(blob));
      chunksRef.current = [];
    }

    if (capturedVideo) {
      onCapture(capturedVideo);
      onClose();
      console.log("Captured Video URL (after onCapture):", capturedVideo);
    }
  };

  const retakeVideo = () => {
    setCapturedVideo(null);
    setElapsedTime(60);
    initializeCamera();
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  return (
    <StatementCameraViewContainer>
      {capturedVideo ? (
        <CaptureSection>
          <VideoPreview controls src={capturedVideo} />
          <ButtonsContainer>
            <Button onClick={retakeVideo}>Retake</Button>
            <Button onClick={saveVideo}>Save</Button>
          </ButtonsContainer>
        </CaptureSection>
      ) : (
        <CaptureSection>
          {recording && (
            <>
              <Timer
                recording={recording}
                isWhite={elapsedTime >= 10}
              >{`${elapsedTime}`}</Timer>

              <ButtonsContainer>
                <Button onClick={stopRecording}>Stop Recording</Button>
              </ButtonsContainer>
            </>
          )}
          {!recording && (
            <Button onClick={startRecording} disabled={!mediaStream}>
              Start Recording
            </Button>
          )}
          <VideoPreview ref={videoRef} autoPlay playsInline muted />
          <Button className="cambtn1" onClick={toggleFacingMode}>
            <MdCameraswitch />
          </Button>
        </CaptureSection>
      )}
      <Button className="closeBtn" onClick={onClose}>
        Close
      </Button>
    </StatementCameraViewContainer>
  );
};

export default StatementCameraView;

//////////////////////////////////////////////audio fixing in the below code a[rt from all are good]
// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import { MdCameraswitch } from "react-icons/md";

// const StatementCameraViewContainer = styled.div`
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
//   justify-content: center;
// `;

// const Timer = styled.span`
//   font-size: ${(props) => (props.recording ? "20px" : "16px")};
//   margin-top: ${(props) => (props.isWhite ? "20px" : "10px")};
//   color: ${(props) => (props.isWhite ? "white" : "red")};
//   text-align: center; /* Center text */
//   margin-bottom: -11px; /* Add margin bottom for spacing */
// `;

// ///////////
// const CaptureSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: 20px;
//   width: 100%; /* Set width to 100% to fill the container */
// `;

// const ButtonsContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap; /* Allow buttons to wrap to the next line if needed */
//   justify-content: center; /* Center the buttons horizontally */
//   margin-top: 10px;
//   width: 100%;
// `;

// const Button = styled.button`
//   margin: 5px;
//   padding: 10px;
//   background-color: #1a1b1b;
//   color: #fff;
//   border: none;
//   border-radius: 3px; /* Add border radius */
//   cursor: pointer;
//   width: calc(
//     45% - 10px
//   ); /* Adjusted button width with spacing between buttons */
//   max-width: 200px; /* Set maximum width for better responsiveness */

//   /* Media query for laptop-sized screens */
//   @media screen and (min-width: 768px) {
//     width: 100%; /* Set width to 100% for buttons to occupy full width */
//   }
// `;

// const VideoPreview = styled.video`
//   margin-top: 10px;
//   width: 100vw; /* Set width to 100% of the viewport width */
//   max-height: 100vh; /* Set maximum height to 100% of the viewport height */
//   object-fit: cover; /* Ensure the video fills the container */
// `;

// const StatementCameraView = ({ onCapture, onClose }) => {
//   const [recording, setRecording] = useState(false);
//   const [mediaStream, setMediaStream] = useState(null);
//   const [capturedVideo, setCapturedVideo] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(60);
//   const [facingMode, setFacingMode] = useState("environment");
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const initializeCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: facingMode },
//       });
//       setMediaStream(stream);
//       videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//     }
//   };

//   useEffect(() => {
//     initializeCamera();

//     return () => {
//       if (mediaStream) {
//         mediaStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [facingMode]);

//   useEffect(() => {
//     let interval;

//     if (recording) {
//       interval = setInterval(() => {
//         setElapsedTime((prevTime) => prevTime - 1);

//         if (elapsedTime <= 0) {
//           stopRecording();
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [recording, elapsedTime]);

//   const startRecording = () => {
//     if (mediaStream) {
//       mediaRecorderRef.current = new MediaRecorder(mediaStream);

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//         setCapturedVideo(URL.createObjectURL(blob));
//         chunksRef.current = [];
//       };

//       mediaRecorderRef.current.start();
//       setRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);

//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }
//   };

//   if (elapsedTime < 1) {
//     stopRecording();
//   }

//   const saveVideo = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state === "recording"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//     }

//     if (chunksRef.current.length > 0) {
//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }

//     if (capturedVideo) {
//       onCapture(capturedVideo);
//       onClose();
//       console.log("Captured Video URL (after onCapture):", capturedVideo);
//     }
//   };

//   const retakeVideo = () => {
//     setCapturedVideo(null);
//     setElapsedTime(60);
//     initializeCamera();
//   };

//   const toggleFacingMode = () => {
//     setFacingMode((prevMode) =>
//       prevMode === "environment" ? "user" : "environment"
//     );
//   };

//   return (
//     <StatementCameraViewContainer>
//       {capturedVideo ? (
//         <CaptureSection>
//           <VideoPreview controls src={capturedVideo} />
//           <ButtonsContainer>
//             <Button onClick={retakeVideo}>Retake</Button>
//             <Button onClick={saveVideo}>Save</Button>
//           </ButtonsContainer>
//         </CaptureSection>
//       ) : (
//         <CaptureSection>
//           {recording && (
//             <>
//               <Timer
//                 recording={recording}
//                 isWhite={elapsedTime >= 10}
//               >{`${elapsedTime}`}</Timer>

//               <ButtonsContainer>
//                 <Button onClick={stopRecording}>Stop Recording</Button>
//               </ButtonsContainer>
//             </>
//           )}
//           {!recording && (
//             <Button onClick={startRecording} disabled={!mediaStream}>
//               Start Recording
//             </Button>
//           )}
//           <VideoPreview ref={videoRef} autoPlay playsInline muted />
//           <Button className="cambtn1" onClick={toggleFacingMode}>
//             <MdCameraswitch />
//           </Button>
//         </CaptureSection>
//       )}
//       <Button className="closeBtn" onClick={onClose}>
//         Close
//       </Button>
//     </StatementCameraViewContainer>
//   );
// };

// export default StatementCameraView;

//////////////////////////==============================================?good
// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import { MdCameraswitch } from "react-icons/md";

// const StatementCameraViewContainer = styled.div`
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
//   justify-content: center;
// `;

// const Timer = styled.span`
//   font-size: ${(props) => (props.recording ? "20px" : "16px")};
//   margin-top: ${(props) => (props.isWhite ? "20px" : "10px")};
//   color: ${(props) => (props.isWhite ? "white" : "red")};
//   text-align: center; /* Center text */
//   margin-bottom: 20px; /* Add margin bottom for spacing */
// `;

// ///////////
// const CaptureSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: 20px;
//   width: 80%; /* Adjusted width to fit laptop screens */
//   max-width: 600px; /* Set maximum width for better responsiveness */

//   /* Media query for laptop-sized screens */
//   @media screen and (min-width: 768px) {
//     width: 60%; /* Adjusted width for larger screens */
//   }
// `;

// const ButtonsContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap; /* Allow buttons to wrap to the next line if needed */
//   justify-content: center; /* Center the buttons horizontally */
//   margin-top: 10px;
//   width: 100%;

//   /* Media query for laptop-sized screens */
//   @media screen and (min-width: 768px) {
//     flex-direction: column; /* Adjusted to column layout for larger screens */
//     align-items: center; /* Center the buttons vertically */
//   }
// `;

// const Button = styled.button`
//   margin: 5px;
//   padding: 10px;
//   background-color: #1a1b1b;
//   color: #fff;
//   border: none;
//   border-radius: 3px; /* Add border radius */
//   cursor: pointer;
//   width: calc(
//     45% - 10px
//   ); /* Adjusted button width with spacing between buttons */
//   max-width: 200px; /* Set maximum width for better responsiveness */

//   /* Media query for laptop-sized screens */
//   @media screen and (min-width: 768px) {
//     width: 100%; /* Set width to 100% for buttons to occupy full width */
//   }
// `;

// const VideoPreview = styled.video`
//   margin-top: 10px;
//   width: 100%;
// `;
// const StatementCameraView = ({ onCapture, onClose }) => {
//   const [recording, setRecording] = useState(false);
//   const [mediaStream, setMediaStream] = useState(null);
//   const [capturedVideo, setCapturedVideo] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(60);
//   const [facingMode, setFacingMode] = useState("environment");
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const initializeCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: facingMode },
//       });
//       setMediaStream(stream);
//       videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//     }
//   };

//   useEffect(() => {
//     initializeCamera();

//     return () => {
//       if (mediaStream) {
//         mediaStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [facingMode]);

//   useEffect(() => {
//     let interval;

//     if (recording) {
//       interval = setInterval(() => {
//         setElapsedTime((prevTime) => prevTime - 1);

//         if (elapsedTime <= 0) {
//           stopRecording();
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [recording, elapsedTime]);

//   const startRecording = () => {
//     if (mediaStream) {
//       mediaRecorderRef.current = new MediaRecorder(mediaStream);

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//         setCapturedVideo(URL.createObjectURL(blob));
//         chunksRef.current = [];
//       };

//       mediaRecorderRef.current.start();
//       setRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);

//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }
//   };

//   if (elapsedTime < 1) {
//     stopRecording();
//   }

//   const saveVideo = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state === "recording"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//     }

//     if (chunksRef.current.length > 0) {
//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }

//     if (capturedVideo) {
//       onCapture(capturedVideo);
//       onClose();
//       console.log("Captured Video URL (after onCapture):", capturedVideo);
//     }
//   };

//   const retakeVideo = () => {
//     setCapturedVideo(null);
//     setElapsedTime(60);
//     initializeCamera();
//   };

//   const toggleFacingMode = () => {
//     setFacingMode((prevMode) =>
//       prevMode === "environment" ? "user" : "environment"
//     );
//   };

//   return (
//     <StatementCameraViewContainer>
//       {capturedVideo ? (
//         <CaptureSection>
//           <VideoPreview controls src={capturedVideo} />
//           <ButtonsContainer>
//             <Button onClick={retakeVideo}>Retake</Button>
//             <Button onClick={saveVideo}>Save</Button>
//           </ButtonsContainer>
//         </CaptureSection>
//       ) : (
//         <CaptureSection>
//           {recording && (
//             <>
//               <Timer
//                 recording={recording}
//                 isWhite={elapsedTime >= 10}
//               >{`${elapsedTime}`}</Timer>

//               <ButtonsContainer>
//                 <Button onClick={stopRecording}>Stop Recording</Button>
//               </ButtonsContainer>
//             </>
//           )}
//           {!recording && (
//             <Button onClick={startRecording} disabled={!mediaStream}>
//               Start Recording
//             </Button>
//           )}
//           <VideoPreview ref={videoRef} autoPlay playsInline muted />
//           <Button className="cambtn1" onClick={toggleFacingMode}>
//             <MdCameraswitch />
//           </Button>
//         </CaptureSection>
//       )}
//       <Button className="closeBtn" onClick={onClose}>
//         Close
//       </Button>
//     </StatementCameraViewContainer>
//   );
// };

// export default StatementCameraView;
///////////////////////////////////////////////////////==============================>>>>
// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import { MdCameraswitch } from "react-icons/md";
// const StatementCameraViewContainer = styled.div`
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
//   justify-content: flex-end; /* Center content vertically and align it to the bottom */
// `;

// const CaptureSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: 20px;
// `;

// const Timer = styled.span`
//   font-size: ${(props) => (props.recording ? "30px" : "18px")};
//   margin-top: ${(props) => (props.isWhite ? "20px" : "10px")};
//   color: ${(props) => (props.isWhite ? "white" : "red")};
//   position: absolute;
//   right: 76px;
//   top: 117px;
// `;

// const ButtonsContainer = styled.div`
//   display: flex;
//   margin-top: 10px;
// `;

// const Button = styled.button`
//   margin: 5px;
//   padding: 10px;
//   background-color: #3498db;
//   color: #fff;
//   border: none;
//   cursor: pointer;
// `;

// const VideoPreview = styled.video`
//   margin-top: 10px;
// `;

// const StatementCameraView = ({ onCapture, onClose }) => {
//   const [recording, setRecording] = useState(false);
//   const [mediaStream, setMediaStream] = useState(null);
//   const [capturedVideo, setCapturedVideo] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(60);
//   const [facingMode, setFacingMode] = useState("environment");
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const initializeCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: facingMode },
//       });
//       setMediaStream(stream);
//       videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//     }
//   };

//   useEffect(() => {
//     initializeCamera();

//     return () => {
//       if (mediaStream) {
//         mediaStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [facingMode]);

//   useEffect(() => {
//     let interval;

//     if (recording) {
//       interval = setInterval(() => {
//         setElapsedTime((prevTime) => prevTime - 1);

//         if (elapsedTime <= 0) {
//           stopRecording();
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [recording, elapsedTime]);

//   const startRecording = () => {
//     if (mediaStream) {
//       mediaRecorderRef.current = new MediaRecorder(mediaStream);

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//         setCapturedVideo(URL.createObjectURL(blob));
//         chunksRef.current = [];
//       };

//       mediaRecorderRef.current.start();
//       setRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);

//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }
//   };

//   if (elapsedTime < 1) {
//     stopRecording();
//   }

//   const saveVideo = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state === "recording"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//     }

//     if (chunksRef.current.length > 0) {
//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }

//     if (capturedVideo) {
//       onCapture(capturedVideo);
//       onClose();
//       console.log("Captured Video URL (after onCapture):", capturedVideo);
//     }
//   };

//   const retakeVideo = () => {
//     setCapturedVideo(null);
//     setElapsedTime(60);
//     initializeCamera();
//   };

//   const toggleFacingMode = () => {
//     setFacingMode((prevMode) =>
//       prevMode === "environment" ? "user" : "environment"
//     );
//   };

//   return (
//     <StatementCameraViewContainer>
//       {capturedVideo ? (
//         <CaptureSection>
//           <VideoPreview controls src={capturedVideo} />
//           <ButtonsContainer>
//             <Button onClick={retakeVideo}>Retake</Button>
//             <Button onClick={saveVideo}>Save</Button>
//           </ButtonsContainer>
//         </CaptureSection>
//       ) : (
//         <CaptureSection>
//           {recording && (
//             <>
//               <Timer
//                 recording={recording}
//                 isWhite={elapsedTime >= 10}
//               >{`${elapsedTime}`}</Timer>

//               <ButtonsContainer>
//                 <Button onClick={stopRecording}>Stop Recording</Button>
//               </ButtonsContainer>
//             </>
//           )}
//           {!recording && (
//             <Button onClick={startRecording} disabled={!mediaStream}>
//               Start Recording
//             </Button>
//           )}
//           <VideoPreview ref={videoRef} autoPlay playsInline muted />
//           <Button className="cambtn1" onClick={toggleFacingMode}>
//             <MdCameraswitch />
//           </Button>
//         </CaptureSection>
//       )}
//       <Button className="closeBtn" onClick={onClose}>
//         Close
//       </Button>
//     </StatementCameraViewContainer>
//   );
// };

// export default StatementCameraView;

////////////////////////////////////////////////////////////////////////===================old
// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import { MdCameraswitch } from "react-icons/md";
// const StatementCameraViewContainer = styled.div`
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
//   justify-content: flex-end; /* Center content vertically and align it to the bottom */
// `;

// const CaptureSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: 20px;
// `;

// const Timer = styled.span`
//   font-size: ${(props) => (props.recording ? "30px" : "18px")};
//   margin-top: ${(props) => (props.isWhite ? "20px" : "10px")};
//   color: ${(props) => (props.isWhite ? "white" : "red")};
//   position: absolute;
//   right: 76px;
//   top: 117px;
// `;

// const ButtonsContainer = styled.div`
//   display: flex;
//   margin-top: 10px;
// `;

// const Button = styled.button`
//   margin: 5px;
//   padding: 10px;
//   background-color: #3498db;
//   color: #fff;
//   border: none;
//   cursor: pointer;
// `;

// const VideoPreview = styled.video`
//   margin-top: 10px;
// `;

// const StatementCameraView = ({ onCapture, onClose }) => {
//   const [recording, setRecording] = useState(false);
//   const [mediaStream, setMediaStream] = useState(null);
//   const [capturedVideo, setCapturedVideo] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(60);
//   const [facingMode, setFacingMode] = useState("environment");
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const initializeCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: facingMode },
//       });
//       setMediaStream(stream);
//       videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//     }
//   };

//   useEffect(() => {
//     initializeCamera();

//     return () => {
//       if (mediaStream) {
//         mediaStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [facingMode]);

//   useEffect(() => {
//     let interval;

//     if (recording) {
//       interval = setInterval(() => {
//         setElapsedTime((prevTime) => prevTime - 1);

//         if (elapsedTime <= 0) {
//           stopRecording();
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [recording, elapsedTime]);

//   const startRecording = () => {
//     if (mediaStream) {
//       mediaRecorderRef.current = new MediaRecorder(mediaStream);

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//         setCapturedVideo(URL.createObjectURL(blob));
//         chunksRef.current = [];
//       };

//       mediaRecorderRef.current.start();
//       setRecording(true);
//     }
//   };

//   // const stopRecording = () => {
//   //   if (
//   //     mediaRecorderRef.current &&
//   //     mediaRecorderRef.current.state !== "inactive"
//   //   ) {
//   //     mediaRecorderRef.current.stop();
//   //     setRecording(false);
//   //   }
//   // };

//   const stopRecording = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);

//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }
//   };

//   if (elapsedTime < 1) {
//     stopRecording();
//   }

//   const saveVideo = () => {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state === "recording"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//     }

//     if (chunksRef.current.length > 0) {
//       const blob = new Blob(chunksRef.current, { type: "video/mp4" });
//       setCapturedVideo(URL.createObjectURL(blob));
//       chunksRef.current = [];
//     }

//     if (capturedVideo) {
//       onCapture(capturedVideo);
//       onClose();
//       console.log("Captured Video URL (after onCapture):", capturedVideo);
//     }
//   };

//   const retakeVideo = () => {
//     setCapturedVideo(null);
//     setElapsedTime(60);
//     initializeCamera();
//   };

//   const toggleFacingMode = () => {
//     setFacingMode((prevMode) =>
//       prevMode === "environment" ? "user" : "environment"
//     );
//   };

//   return (
//     <StatementCameraViewContainer>
//       {capturedVideo ? (
//         <CaptureSection>
//           <VideoPreview controls src={capturedVideo} />
//           <ButtonsContainer>
//             <Button onClick={retakeVideo}>Retake</Button>
//             <Button onClick={saveVideo}>Save</Button>
//           </ButtonsContainer>
//         </CaptureSection>
//       ) : (
//         <CaptureSection>
//           {recording && (
//             <>
//               <Timer
//                 recording={recording}
//                 isWhite={elapsedTime >= 10}
//               >{`${elapsedTime}`}</Timer>

//               <ButtonsContainer>
//                 <Button onClick={stopRecording}>Stop Recording</Button>
//               </ButtonsContainer>
//             </>
//           )}
//           {!recording && (
//             <Button onClick={startRecording} disabled={!mediaStream}>
//               Start Recording
//             </Button>
//           )}
//           <VideoPreview ref={videoRef} autoPlay playsInline muted />
//           <Button className="cambtn1" onClick={toggleFacingMode}>
//             <MdCameraswitch />
//           </Button>
//         </CaptureSection>
//       )}
//       <Button className="closeBtn" onClick={onClose}>
//         Close
//       </Button>
//     </StatementCameraViewContainer>
//   );
// };

// export default StatementCameraView;
