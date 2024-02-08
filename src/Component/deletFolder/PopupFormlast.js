import React, { useState, useEffect } from "react";
import "react-html5-camera-photo/build/css/index.css";
import styled from "styled-components";
import CameraView from "./CamStore/CameraView";
import axios from "axios";
import "./PopupForm.css";
import FarmerSubsidyCts from "./Sections/FarmerSubsidyCts";
import SNeftCopyCts from "./Sections/SNeftCopyCts";
import FarmerInspectionImageCts from "./Sections/FarmerInspectionImageCts";
import FarmerFilterImage from "./Sections/FarmerFilterImage";
import FarmerPipeImageCts from "./Sections/FarmerPipeImageCts";
import FarmerStatementCapture from "./Sections/FarmerStatementvcaptre";
import FarmerPhotoSection from "./Sections/FarmerPhotoSection";
import BankPassbookSection from "./Sections/BankPassbookSection";
import FarmerChallanSection from "./Sections/FarmerChallanSection";
const PopupFormContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto; /* Enable vertical scrolling */
`;

const PopupFormContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  color: black;
  margin-top: 1656px;
  margin-bottom: 200px;
`;

const Button = styled.button`
  background-color: #17acef;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 3px;
  margin-top: 10px;
  cursor: pointer;
`;

const CloseButton = styled(Button)`
  background-color: #e74c3c;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const PopupForm = ({
  onClose,
  farmerId,
  farmerFieldId,
  device_uuid,
  token,
  farmerNameTitle,
  farmerFather,
  farmerName,
  farmerDocId,
  farmerCode,
}) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState(null);
  const [farmerPhoto, setFarmerPhoto] = useState(null);
  const [capturedDateTime, setCapturedDateTime] = useState(null);

  //passbook states
  const [bankPassbookImage, setBankPassbookImage] = useState(null);
  const [showBankPassbookCamera, setShowBankPassbookCamera] = useState(false);
  const [bankPassbookLocation, setBankPassbookLocation] = useState(null);
  const [bankPassbookCapturedDateTime, setBankPassbookCapturedDateTime] =
    useState(null);

  //bank challen states
  const [challanImage, setChallanImage] = useState(null);
  const [showChallanCamera, setShowChallanCamera] = useState(false);
  const [challanLocation, setChallanLocation] = useState(null);
  const [capturedChallanDateTime, setCapturedChallanDateTime] = useState(null);
  //external states images
  const [subsidyImage, setSubsidyImage] = useState(null);
  const [neftCopyImage, setNeftCopyImage] = useState(null);
  const [fInspectionImage, setFInspectionImage] = useState(null);
  const [farmerFilterImage, setFarmerFilterImage] = useState(null);
  const [farmerPipeImage, setFarmerPipeImage] = useState(null);
  const [statementImage, setStatementImage] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);

  //updated pic
  const [fphoto, setFphoto] = useState(null);
  const [passPoto, setPassPhoto] = useState(null);
  const [challanpic, setChallanPic] = useState(null);
  const [sbsidypic, setSubsidyPic] = useState(null);
  const [inspectpic, setInspectPic] = useState(null);
  const [postpic, setPostpic] = useState(null);
  const [postpipepic, setPostPipPic] = useState(null);
  const [farmervid, setFarmerVid] = useState(null);

  //main farmer_bank_challan_copy,farmer_subsidy_neft_copy,farmer_pre_inspection_photo,
  //farmer_post_inspection_photo_with_filter,farmer_post_inspection_photo_with_pipe,farmer_statement_video
  const [fetchedFarmerPhotoData, setFetchedFarmerPhotoData] = useState(null);
  ////////////////////////////////////////////////////////////getting uploaded data

  // ...

  useEffect(() => {
    // Set fphoto when fetchedFarmerPhotoData changes
    setFphoto(fetchedFarmerPhotoData?.farmer_photo);
    setPassPhoto(fetchedFarmerPhotoData?.farmer_bank_passbook);
    setChallanPic(fetchedFarmerPhotoData?.farmer_bank_challan_copy);
    setSubsidyPic(fetchedFarmerPhotoData?.farmer_subsidy_neft_copy);
    setInspectPic(fetchedFarmerPhotoData?.farmer_pre_inspection_photo);
    setPostpic(
      fetchedFarmerPhotoData?.farmer_post_inspection_photo_with_filter
    );
    setPostPipPic(
      fetchedFarmerPhotoData?.farmer_post_inspection_photo_with_pipe
    );
    setFarmerVid(fetchedFarmerPhotoData?.farmer_statement_video);
  }, [fetchedFarmerPhotoData]);

  //////////////////////////////////////////////////////////getting uploaded data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrlBase = "/api/pwa/list";
        const defaultParams = "&sort=status&page=0&limit=5";

        const response = await fetch(`${apiUrlBase}?${defaultParams}`, {
          headers: {
            "Content-Type": "application/json",
            device_uuid: device_uuid,
            token: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const imageDataList = data.items;

          // Filter the images based on existing farmer user data
          const filteredImages = imageDataList.filter(
            (imageData) =>
              imageData.farmer_id === farmerId &&
              imageData.farmer_field_id === farmerFieldId
          );

          // Log filtered image URLs to the console
          filteredImages.forEach((imageData) => {
            // console.log("Farmer name:", imageData.farmer_name);
            // console.log("Farmer Field ID:", imageData.farmer_field_id);
            // console.log("Farmer Photo URL:", imageData.farmer_photo);
            // console.log(
            //   "Bank Passbook Image URL:",
            //   imageData.farmer_bank_passbook
            // );
            // console.log(
            //   "Challan Image URL:",
            //   imageData.farmer_bank_challan_copy
            // );
          });
          setFetchedFarmerPhotoData(filteredImages[0]);
          // Rest of your code to set states based on the fetched data
        } else {
          console.error(
            "Failed to fetch data. Server returned non-200 status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [device_uuid, token, farmerId, farmerFieldId]);

  // console.log("Farmer Photo URL:", fetchedFarmerPhotoData?.farmer_photo);
  // console.log("passbook image:", fetchedFarmerPhotoData?.farmer_bank_passbook);

  //old
  // let fphoto = fetchedFarmerPhotoData?.farmer_photo;
  //new update get exist data

  // alert(`token:${token},  device_uuid:${device_uuid}`);
  //===================================>>>functions related to farmer photo sections
  const handleCapture = (dataUri) => {
    setCapturedImage(dataUri);
    setShowCamera(false);

    // Get current location after capturing the image
    getCurrentLocation();
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
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
    // Combine the captured image and table into a single image
    if (capturedImage && location) {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions to match the captured image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the captured image onto the canvas
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw the table onto the canvas
        context.font = "14px Arial";
        context.fillStyle = "white";

        const sNoText = `Farmer S/No : ${farmerFieldId}`;
        const latitudeText = `Latitude   : ${location?.latitude.toFixed(7)}`;
        const longitudeText = `Longitude : ${location?.longitude.toFixed(7)}`;
        const farmerNameText = `Farmer :  ${farmerName}`;
        const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
        const dateTimeText = `Captured on: ${capturedDateTime}`;

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
        setFarmerPhoto(dataURL);
      };

      image.src = capturedImage;
    }
  }, [
    capturedImage,
    location,
    farmerName,
    farmerFather,
    farmerNameTitle,
    capturedDateTime,
  ]);

  //=================end farmer photo section functions
  //=====================================================>>functions related to bank passbook section
  const handleBankPassbookCapture = (dataUri) => {
    setBankPassbookImage(dataUri);
    setShowBankPassbookCamera(false);
    getBankPassbookLocation();
  };

  const handleBankPassbookOpenCamera = () => {
    setShowBankPassbookCamera(true);
  };

  const handleBankPassbookCameraClose = () => {
    setShowBankPassbookCamera(false);
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
    // Combine the captured image and table into a single image
    if (bankPassbookImage && bankPassbookLocation) {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions to match the captured image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the captured image onto the canvas
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw the table onto the canvas
        context.font = "14px Arial";
        context.fillStyle = "white";

        const sNoText = `Farmer S/No : ${farmerFieldId}`;
        const latitudeText = `Latitude   : ${bankPassbookLocation?.latitude.toFixed(
          7
        )}`;
        const longitudeText = `Longitude : ${bankPassbookLocation?.longitude.toFixed(
          7
        )}`;
        const farmerNameText = `Farmer :  ${farmerName}`;
        const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
        const dateTimeText = `Captured on: ${bankPassbookCapturedDateTime}`;

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
        setBankPassbookImage(dataURL);
      };

      image.src = bankPassbookImage;
    }
  }, [
    bankPassbookImage,
    bankPassbookLocation,
    farmerName,
    farmerFather,
    farmerNameTitle,
    bankPassbookCapturedDateTime,
  ]);

  // Add these functions for the Bank Challan section
  const handleCaptureChallan = (dataUri) => {
    setChallanImage(dataUri);
    setShowChallanCamera(false);
    getCurrentChallanLocation();
  };

  const handleOpenChallanCamera = () => {
    setShowChallanCamera(true);
  };

  const handleChallanCameraClose = () => {
    setShowChallanCamera(false);
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
    // Combine the captured image and table into a single image
    if (challanImage && challanLocation) {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions to match the captured image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the captured image onto the canvas
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw the table onto the canvas
        context.font = "14px Arial";
        context.fillStyle = "white";

        const sNoText = `Farmer S/No : ${farmerFieldId}`;
        const latitudeText = `Latitude   : ${challanLocation?.latitude.toFixed(
          7
        )}`;
        const longitudeText = `Longitude : ${challanLocation?.longitude.toFixed(
          7
        )}`;
        const farmerNameText = `Farmer :  ${farmerName}`;
        const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
        const dateTimeText = `Captured on: ${capturedChallanDateTime}`;

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
        setChallanImage(dataURL);
      };

      image.src = challanImage;
    }
  }, [
    challanImage,
    challanLocation,
    farmerName,
    farmerFather,
    farmerNameTitle,
    capturedChallanDateTime,
  ]);

  ///////////////////////////////server connection
  console.log(farmerId);
  console.log(farmerFieldId);
  // console.log(token);
  //////////////////////////////////test
  //server connection
  /////////////////////////////////////////////////////////////image packahe testing 2

  const VIDEO_FILE_NAME = "farmer_statement_video.mp4";

  const saveFormData = async (formData) => {
    try {
      const response = await axios.post("/api/pwa/save", formData, {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Images and video uploaded successfully");
      } else {
        console.error(
          "Failed to upload. Server returned non-200 status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error uploading images and video:", error.message);
    } finally {
      onClose();
    }
  };
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("farmer_id", farmerId);
      formData.append("farmer_field_id", farmerFieldId);

      if (farmerPhoto) {
        const base64Data = farmerPhoto.split(",")[1];
        const photoBlob = b64toBlob(base64Data);
        formData.append("farmer_photo", photoBlob, "farmer_photo.jpg");
      }

      if (bankPassbookImage) {
        const bankPassbookBase64 = bankPassbookImage.split(",")[1];
        const bankPassbookBlob = b64toBlob(bankPassbookBase64);
        formData.append(
          "farmer_bank_passbook",
          bankPassbookBlob,
          "farmer_bank_passbook.jpg"
        );
      }

      if (challanImage) {
        const base64Data = challanImage.split(",")[1];
        const blobChallan = b64toBlob(base64Data);
        formData.append(
          "farmer_bank_challan_copy",
          blobChallan,
          "farmer_bank_challan_copy.jpg"
        );
      }

      if (subsidyImage) {
        const base64Data = subsidyImage.split(",")[1];
        const blob = b64toBlob(base64Data);
        formData.append("farmer_subsidy_cts", blob, "farmer_subsidy_cts.jpg");
      }

      if (neftCopyImage) {
        const base64Data = neftCopyImage.split(",")[1];
        const blob = b64toBlob(base64Data);
        formData.append(
          "farmer_subsidy_neft_copy",
          blob,
          "farmer_subsidy_neft_copy.jpg"
        );
      }

      if (fInspectionImage) {
        const base64Data = fInspectionImage.split(",")[1];
        const blob = b64toBlob(base64Data);
        formData.append(
          "farmer_pre_inspection_photo",
          blob,
          "farmer_pre_inspection_photo.jpg"
        );
      }

      if (farmerFilterImage) {
        const base64Data = farmerFilterImage.split(",")[1];
        const blob = b64toBlob(base64Data);
        formData.append(
          "farmer_post_inspection_photo_with_filter",
          blob,
          "farmer_post_inspection_photo_with_filter.jpg"
        );
      }

      if (farmerPipeImage) {
        const base64Data = farmerPipeImage.split(",")[1];
        const blob = b64toBlob(base64Data);
        formData.append(
          "farmer_post_inspection_photo_with_pipe",
          blob,
          "farmer_post_inspection_photo_with_pipe.jpg"
        );
      }

      // ... (rest of the formData logic)

      // Handle video if captured
      if (capturedVideo) {
        try {
          // Convert the captured video to a Blob
          const response = await fetch(capturedVideo);

          if (!response.ok) {
            throw new Error(
              `Failed to fetch video. Status: ${response.status}`
            );
          }

          const videoBlob = await response.blob();

          // Log the size of the original video in kilobytes
          const originalVideoSizeKB = videoBlob.size / 1024;
          console.log(
            "Original Video Size:",
            originalVideoSizeKB.toFixed(2),
            "KB"
          );

          // Append the original video Blob to the formData
          formData.append("farmer_statement_video", videoBlob, VIDEO_FILE_NAME);
        } catch (error) {
          console.error("Error handling video:", error.message);
        }
      }

      // Call the saveFormData function
      await saveFormData(formData);
    } catch (error) {
      console.error("Error uploading images and video:", error.message);
    } finally {
      onClose();
    }
  };

  // Helper function to convert base64 to Blob
  const b64toBlob = (base64Data) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: "image/jpeg" });
  };
  return (
    <>
      <PopupFormContainer>
        <PopupFormContent>
          <div style={{ marginBottom: 10 }}>
            <CloseButton onClick={onClose}>Close</CloseButton>
          </div>
          <FarmerPhotoSection
            handleOpenCamera={handleOpenCamera}
            handleFileUpload={handleFileUpload}
            showCamera={showCamera}
            capturedImage={capturedImage}
            location={location}
            farmerPhoto={farmerPhoto}
            CameraView={CameraView}
            handleCapture={handleCapture}
            handleCameraClose={handleCameraClose}
            TableContainer={TableContainer}
            fetchedFarmerPhotoData={fetchedFarmerPhotoData}
            fphoto={fphoto} // Pass the fetched data
          />

          {/*farmer Bank Passbook Section */}

          <BankPassbookSection
            handleBankPassbookOpenCamera={handleBankPassbookOpenCamera}
            handleBankPassbookFileUpload={handleBankPassbookFileUpload}
            showBankPassbookCamera={showBankPassbookCamera}
            handleBankPassbookCapture={handleBankPassbookCapture}
            handleBankPassbookCameraClose={handleBankPassbookCameraClose}
            bankPassbookImage={bankPassbookImage}
            TableContainer={TableContainer}
            bankPassbookLocation={bankPassbookLocation}
            passPoto={passPoto}
          />

          {/*farmer Bank Passbook Section End */}
          {/* Farmer Challan Section */}

          <FarmerChallanSection
            handleOpenChallanCamera={handleOpenChallanCamera}
            handleChallanFileUpload={handleChallanFileUpload}
            showChallanCamera={showChallanCamera}
            capturedImage={capturedImage}
            challanImage={challanImage}
            handleCaptureChallan={handleCaptureChallan}
            handleChallanCameraClose={handleChallanCameraClose}
            challanLocation={challanLocation}
            challanpic={challanpic}
          />

          {/* Farmer SubsidyCts Section */}
          {/* Farmer Subsidy Section */}
          <FarmerSubsidyCts
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            setSubsidyImage={setSubsidyImage}
            subsidyImage={subsidyImage}
            sbsidypic={sbsidypic}
          />
          {/* SNeftCopy Section */}
          <SNeftCopyCts
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            setNeftCopyImage={setNeftCopyImage}
          />

          {/* Farmer Inspection section*/}

          <FarmerInspectionImageCts
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            setFInspectionImage={setFInspectionImage}
            inspectpic={inspectpic}
            farmerCode={farmerCode}
          />

          {/* Farmer filter Image section*/}
          <FarmerFilterImage
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            setFarmerFilterImage={setFarmerFilterImage}
            farmerFilterImage={farmerFilterImage}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            postpic={postpic}
          />

          {/* Farmer Pipe Image section*/}
          <FarmerPipeImageCts
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            farmerPipeImage={farmerPipeImage}
            setFarmerPipeImage={setFarmerPipeImage}
            postpipepic={postpipepic}
            farmerCode={farmerCode}
          />
          {/* Farmer Video Image section*/}
          <FarmerStatementCapture
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            statementImage={statementImage}
            setStatementImage={setStatementImage}
            capturedVideo={capturedVideo}
            setCapturedVideo={setCapturedVideo}
            farmervid={farmervid}
          />

          <>
            <Button onClick={handleSave}>Submit</Button>
          </>
        </PopupFormContent>
      </PopupFormContainer>
    </>
  );
};

export default PopupForm;

/////////////////////////////////old one good ------------------------>>>>>>>>>>>>>
// import React, { useState, useEffect } from "react";
// import "react-html5-camera-photo/build/css/index.css";
// import styled from "styled-components";
// import CameraView from "./CamStore/CameraView";
// import axios from "axios";
// import "./PopupForm.css";
// import FarmerSubsidyCts from "./Sections/FarmerSubsidyCts";
// import SNeftCopyCts from "./Sections/SNeftCopyCts";
// import FarmerInspectionImageCts from "./Sections/FarmerInspectionImageCts";
// import FarmerFilterImage from "./Sections/FarmerFilterImage";
// import FarmerPipeImageCts from "./Sections/FarmerPipeImageCts";
// import FarmerStatementCapture from "./Sections/FarmerStatementvcaptre";
// import FarmerPhotoSection from "./Sections/FarmerPhotoSection";
// import BankPassbookSection from "./Sections/BankPassbookSection";
// import FarmerChallanSection from "./Sections/FarmerChallanSection";
// const PopupFormContainer = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow-y: auto; /* Enable vertical scrolling */
// `;

// const PopupFormContent = styled.div`
//   background-color: white;
//   padding: 20px;
//   border-radius: 8px;
//   width: 400px;
//   color: black;
//   margin-top: 1656px;
//   margin-bottom: 200px;
// `;

// const Button = styled.button`
//   background-color: #17acef;
//   color: white;
//   padding: 8px;
//   border: none;
//   border-radius: 3px;
//   margin-top: 10px;
//   cursor: pointer;
// `;

// const CloseButton = styled(Button)`
//   background-color: #e74c3c;
// `;

// const TableContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-top: 20px;
// `;

// const PopupForm = ({
//   onClose,
//   farmerId,
//   farmerFieldId,
//   device_uuid,
//   token,
//   farmerNameTitle,
//   farmerFather,
//   farmerName,
//   farmerDocId,
// }) => {
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [showCamera, setShowCamera] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [farmerPhoto, setFarmerPhoto] = useState(null);
//   const [capturedDateTime, setCapturedDateTime] = useState(null);

//   //passbook states
//   const [bankPassbookImage, setBankPassbookImage] = useState(null);
//   const [showBankPassbookCamera, setShowBankPassbookCamera] = useState(false);
//   const [bankPassbookLocation, setBankPassbookLocation] = useState(null);
//   const [bankPassbookCapturedDateTime, setBankPassbookCapturedDateTime] =
//     useState(null);

//   //bank challen states
//   const [challanImage, setChallanImage] = useState(null);
//   const [showChallanCamera, setShowChallanCamera] = useState(false);
//   const [challanLocation, setChallanLocation] = useState(null);
//   const [capturedChallanDateTime, setCapturedChallanDateTime] = useState(null);
//   //external states images
//   const [subsidyImage, setSubsidyImage] = useState(null);
//   const [neftCopyImage, setNeftCopyImage] = useState(null);
//   const [fInspectionImage, setFInspectionImage] = useState(null);
//   const [farmerFilterImage, setFarmerFilterImage] = useState(null);
//   const [farmerPipeImage, setFarmerPipeImage] = useState(null);
//   const [statementImage, setStatementImage] = useState(null);
//   const [capturedVideo, setCapturedVideo] = useState(null);

//   // alert(`token:${token},  device_uuid:${device_uuid}`);
//   //===================================>>>functions related to farmer photo sections
//   const handleCapture = (dataUri) => {
//     setCapturedImage(dataUri);
//     setShowCamera(false);

//     // Get current location after capturing the image
//     getCurrentLocation();
//   };

//   const handleOpenCamera = () => {
//     setShowCamera(true);
//   };

//   const handleCameraClose = () => {
//     setShowCamera(false);
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setCapturedImage(reader.result);
//         getCurrentLocation();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setLocation({ latitude, longitude });
//           console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

//           // Set capturedDateTime to the current date and time
//           setCapturedDateTime(new Date().toLocaleString());
//         },
//         (error) => {
//           console.error("Error getting location:", error.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     // Combine the captured image and table into a single image
//     if (capturedImage && location) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         // Set canvas dimensions to match the captured image
//         canvas.width = image.width;
//         canvas.height = image.height;

//         // Draw the captured image onto the canvas
//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         // Draw the table onto the canvas
//         context.font = "14px Arial";
//         context.fillStyle = "white";

//         const sNoText = `Farmer S/No : ${farmerFieldId}`;
//         const latitudeText = `Latitude   : ${location?.latitude.toFixed(7)}`;
//         const longitudeText = `Longitude : ${location?.longitude.toFixed(7)}`;
//         const farmerNameText = `Farmer :  ${farmerName}`;
//         const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
//         const dateTimeText = `Captured on: ${capturedDateTime}`;

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
//         setFarmerPhoto(dataURL);
//       };

//       image.src = capturedImage;
//     }
//   }, [
//     capturedImage,
//     location,
//     farmerName,
//     farmerFather,
//     farmerNameTitle,
//     capturedDateTime,
//   ]);

//   //=================end farmer photo section functions
//   //=====================================================>>functions related to bank passbook section
//   const handleBankPassbookCapture = (dataUri) => {
//     setBankPassbookImage(dataUri);
//     setShowBankPassbookCamera(false);
//     getBankPassbookLocation();
//   };

//   const handleBankPassbookOpenCamera = () => {
//     setShowBankPassbookCamera(true);
//   };

//   const handleBankPassbookCameraClose = () => {
//     setShowBankPassbookCamera(false);
//   };

//   const handleBankPassbookFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBankPassbookImage(reader.result);
//         getBankPassbookLocation();
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getBankPassbookLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setBankPassbookLocation({ latitude, longitude });
//           console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

//           // Set bank passbook capturedDateTime to the current date and time
//           setBankPassbookCapturedDateTime(new Date().toLocaleString());
//         },
//         (error) => {
//           console.error("Error getting bank passbook location:", error.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     // Combine the captured image and table into a single image
//     if (bankPassbookImage && bankPassbookLocation) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         // Set canvas dimensions to match the captured image
//         canvas.width = image.width;
//         canvas.height = image.height;

//         // Draw the captured image onto the canvas
//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         // Draw the table onto the canvas
//         context.font = "14px Arial";
//         context.fillStyle = "white";

//         const sNoText = `Farmer S/No : ${farmerFieldId}`;
//         const latitudeText = `Latitude   : ${bankPassbookLocation?.latitude.toFixed(
//           7
//         )}`;
//         const longitudeText = `Longitude : ${bankPassbookLocation?.longitude.toFixed(
//           7
//         )}`;
//         const farmerNameText = `Farmer :  ${farmerName}`;
//         const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
//         const dateTimeText = `Captured on: ${bankPassbookCapturedDateTime}`;

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
//         setBankPassbookImage(dataURL);
//       };

//       image.src = bankPassbookImage;
//     }
//   }, [
//     bankPassbookImage,
//     bankPassbookLocation,
//     farmerName,
//     farmerFather,
//     farmerNameTitle,
//     bankPassbookCapturedDateTime,
//   ]);

//   // Add these functions for the Bank Challan section
//   const handleCaptureChallan = (dataUri) => {
//     setChallanImage(dataUri);
//     setShowChallanCamera(false);
//     getCurrentChallanLocation();
//   };

//   const handleOpenChallanCamera = () => {
//     setShowChallanCamera(true);
//   };

//   const handleChallanCameraClose = () => {
//     setShowChallanCamera(false);
//   };

//   const handleChallanFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setChallanImage(reader.result);
//         getCurrentChallanLocation(); // Update to the function for Challan location
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getCurrentChallanLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           setChallanLocation({ latitude, longitude });
//           console.log(`Challan Latitude: ${latitude}, Longitude: ${longitude}`);

//           // Set capturedChallanDateTime to the current date and time
//           setCapturedChallanDateTime(new Date().toLocaleString());
//         },
//         (error) => {
//           console.error("Error getting challan location:", error.message);
//         }
//       );
//     } else {
//       console.error(
//         "Geolocation is not supported for challan by this browser."
//       );
//     }
//   };

//   useEffect(() => {
//     // Combine the captured image and table into a single image
//     if (challanImage && challanLocation) {
//       const image = new Image();

//       image.onload = () => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         // Set canvas dimensions to match the captured image
//         canvas.width = image.width;
//         canvas.height = image.height;

//         // Draw the captured image onto the canvas
//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         // Draw the table onto the canvas
//         context.font = "14px Arial";
//         context.fillStyle = "white";

//         const sNoText = `Farmer S/No : ${farmerFieldId}`;
//         const latitudeText = `Latitude   : ${challanLocation?.latitude.toFixed(
//           7
//         )}`;
//         const longitudeText = `Longitude : ${challanLocation?.longitude.toFixed(
//           7
//         )}`;
//         const farmerNameText = `Farmer :  ${farmerName}`;
//         const farmerNameTitleText = `${farmerNameTitle} : ${farmerFather}`;
//         const dateTimeText = `Captured on: ${capturedChallanDateTime}`;

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
//         setChallanImage(dataURL);
//       };

//       image.src = challanImage;
//     }
//   }, [
//     challanImage,
//     challanLocation,
//     farmerName,
//     farmerFather,
//     farmerNameTitle,
//     capturedChallanDateTime,
//   ]);

//   ///////////////////////////////server connection
//   console.log(farmerId);
//   console.log(farmerFieldId);
//   // console.log(token);
//   //////////////////////////////////test
//   //server connection

//   /////////////////////////////////////////////////////////////image packahe testing 2

//   const VIDEO_FILE_NAME = "farmer_statement_video.mp4";

//   const saveFormData = async (formData) => {
//     try {
//       const response = await axios.post("/api/pwa/save", formData, {
//         headers: {
//           token: token,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200) {
//         console.log("Images and video uploaded successfully");
//       } else {
//         console.error(
//           "Failed to upload. Server returned non-200 status:",
//           response.status
//         );
//       }
//     } catch (error) {
//       console.error("Error uploading images and video:", error.message);
//     } finally {
//       onClose();
//     }
//   };
//   const handleSave = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("farmer_id", farmerId);
//       formData.append("farmer_field_id", farmerFieldId);

//       if (farmerPhoto) {
//         const base64Data = farmerPhoto.split(",")[1];
//         const photoBlob = b64toBlob(base64Data);
//         formData.append("farmer_photo", photoBlob, "farmer_photo.jpg");
//       }

//       if (bankPassbookImage) {
//         const bankPassbookBase64 = bankPassbookImage.split(",")[1];
//         const bankPassbookBlob = b64toBlob(bankPassbookBase64);
//         formData.append(
//           "farmer_bank_passbook",
//           bankPassbookBlob,
//           "farmer_bank_passbook.jpg"
//         );
//       }

//       if (challanImage) {
//         const base64Data = challanImage.split(",")[1];
//         const blobChallan = b64toBlob(base64Data);
//         formData.append(
//           "farmer_bank_challan_copy",
//           blobChallan,
//           "farmer_bank_challan_copy.jpg"
//         );
//       }

//       if (subsidyImage) {
//         const base64Data = subsidyImage.split(",")[1];
//         const blob = b64toBlob(base64Data);
//         formData.append("farmer_subsidy_cts", blob, "farmer_subsidy_cts.jpg");
//       }

//       if (neftCopyImage) {
//         const base64Data = neftCopyImage.split(",")[1];
//         const blob = b64toBlob(base64Data);
//         formData.append(
//           "farmer_subsidy_neft_copy",
//           blob,
//           "farmer_subsidy_neft_copy.jpg"
//         );
//       }

//       if (fInspectionImage) {
//         const base64Data = fInspectionImage.split(",")[1];
//         const blob = b64toBlob(base64Data);
//         formData.append(
//           "farmer_pre_inspection_photo",
//           blob,
//           "farmer_pre_inspection_photo.jpg"
//         );
//       }

//       if (farmerFilterImage) {
//         const base64Data = farmerFilterImage.split(",")[1];
//         const blob = b64toBlob(base64Data);
//         formData.append(
//           "farmer_post_inspection_photo_with_filter",
//           blob,
//           "farmer_post_inspection_photo_with_filter.jpg"
//         );
//       }

//       if (farmerPipeImage) {
//         const base64Data = farmerPipeImage.split(",")[1];
//         const blob = b64toBlob(base64Data);
//         formData.append(
//           "farmer_post_inspection_photo_with_pipe",
//           blob,
//           "farmer_post_inspection_photo_with_pipe.jpg"
//         );
//       }

//       // ... (rest of the formData logic)

//       // Handle video if captured
//       if (capturedVideo) {
//         try {
//           // Convert the captured video to a Blob
//           const response = await fetch(capturedVideo);

//           if (!response.ok) {
//             throw new Error(
//               `Failed to fetch video. Status: ${response.status}`
//             );
//           }

//           const videoBlob = await response.blob();

//           // Log the size of the original video in kilobytes
//           const originalVideoSizeKB = videoBlob.size / 1024;
//           console.log(
//             "Original Video Size:",
//             originalVideoSizeKB.toFixed(2),
//             "KB"
//           );

//           // Append the original video Blob to the formData
//           formData.append("farmer_statement_video", videoBlob, VIDEO_FILE_NAME);
//         } catch (error) {
//           console.error("Error handling video:", error.message);
//         }
//       }

//       // Call the saveFormData function
//       await saveFormData(formData);
//     } catch (error) {
//       console.error("Error uploading images and video:", error.message);
//     } finally {
//       onClose();
//     }
//   };

//   // Helper function to convert base64 to Blob
//   const b64toBlob = (base64Data) => {
//     const byteCharacters = atob(base64Data);
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);

//       const byteNumbers = new Array(slice.length);
//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }

//     return new Blob(byteArrays, { type: "image/jpeg" });
//   };
//   return (
//     <>
//       <PopupFormContainer>
//         <PopupFormContent>
//           <div style={{ marginBottom: 10 }}>
//             <CloseButton onClick={onClose}>Close</CloseButton>
//           </div>
//           <FarmerPhotoSection
//             handleOpenCamera={handleOpenCamera}
//             handleFileUpload={handleFileUpload}
//             showCamera={showCamera}
//             capturedImage={capturedImage}
//             location={location}
//             farmerPhoto={farmerPhoto}
//             CameraView={CameraView}
//             handleCapture={handleCapture}
//             handleCameraClose={handleCameraClose}
//             TableContainer={TableContainer}
//           />

//           {/*farmer Bank Passbook Section */}

//           <BankPassbookSection
//             handleBankPassbookOpenCamera={handleBankPassbookOpenCamera}
//             handleBankPassbookFileUpload={handleBankPassbookFileUpload}
//             showBankPassbookCamera={showBankPassbookCamera}
//             handleBankPassbookCapture={handleBankPassbookCapture}
//             handleBankPassbookCameraClose={handleBankPassbookCameraClose}
//             bankPassbookImage={bankPassbookImage}
//             TableContainer={TableContainer}
//             bankPassbookLocation={bankPassbookLocation}
//           />

//           {/*farmer Bank Passbook Section End */}
//           {/* Farmer Challan Section */}

//           <FarmerChallanSection
//             handleOpenChallanCamera={handleOpenChallanCamera}
//             handleChallanFileUpload={handleChallanFileUpload}
//             showChallanCamera={showChallanCamera}
//             capturedImage={capturedImage}
//             challanImage={challanImage}
//             handleCaptureChallan={handleCaptureChallan}
//             handleChallanCameraClose={handleChallanCameraClose}
//             challanLocation={challanLocation}
//           />

//           {/* Farmer SubsidyCts Section */}
//           {/* Farmer Subsidy Section */}
//           <FarmerSubsidyCts
//             onClose={onClose}
//             farmerId={farmerId}
//             farmerFieldId={farmerFieldId}
//             device_uuid={device_uuid}
//             token={token}
//             farmerNameTitle={farmerNameTitle}
//             farmerFather={farmerFather}
//             farmerName={farmerName}
//             setSubsidyImage={setSubsidyImage}
//           />
//           {/* SNeftCopy Section */}
//           <SNeftCopyCts
//             onClose={onClose}
//             farmerId={farmerId}
//             farmerFieldId={farmerFieldId}
//             device_uuid={device_uuid}
//             token={token}
//             farmerNameTitle={farmerNameTitle}
//             farmerFather={farmerFather}
//             farmerName={farmerName}
//             setNeftCopyImage={setNeftCopyImage}
//           />

//           {/* Farmer Inspection section*/}

//           <FarmerInspectionImageCts
//             onClose={onClose}
//             farmerId={farmerId}
//             farmerFieldId={farmerFieldId}
//             device_uuid={device_uuid}
//             token={token}
//             farmerNameTitle={farmerNameTitle}
//             farmerFather={farmerFather}
//             farmerName={farmerName}
//             setFInspectionImage={setFInspectionImage}
//           />

//           {/* Farmer filter Image section*/}
//           <FarmerFilterImage
//             onClose={onClose}
//             farmerId={farmerId}
//             farmerFieldId={farmerFieldId}
//             device_uuid={device_uuid}
//             token={token}
//             setFarmerFilterImage={setFarmerFilterImage}
//             farmerFilterImage={farmerFilterImage}
//             farmerNameTitle={farmerNameTitle}
//             farmerFather={farmerFather}
//             farmerName={farmerName}
//           />

//           {/* Farmer Pipe Image section*/}
//           <FarmerPipeImageCts
//             onClose={onClose}
//             farmerId={farmerId}
//             farmerFieldId={farmerFieldId}
//             device_uuid={device_uuid}
//             token={token}
//             farmerNameTitle={farmerNameTitle}
//             farmerFather={farmerFather}
//             farmerName={farmerName}
//             farmerPipeImage={farmerPipeImage}
//             setFarmerPipeImage={setFarmerPipeImage}
//           />
//           {/* Farmer Video Image section*/}
//           <FarmerStatementCapture
//             onClose={onClose}
//             farmerId={farmerId}
//             farmerFieldId={farmerFieldId}
//             device_uuid={device_uuid}
//             token={token}
//             farmerNameTitle={farmerNameTitle}
//             farmerFather={farmerFather}
//             farmerName={farmerName}
//             statementImage={statementImage}
//             setStatementImage={setStatementImage}
//             capturedVideo={capturedVideo}
//             setCapturedVideo={setCapturedVideo}
//           />

//           <>
//             <Button onClick={handleSave}>Submit</Button>
//           </>
//         </PopupFormContent>
//       </PopupFormContainer>
//     </>
//   );
// };

// export default PopupForm;
