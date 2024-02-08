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
  const [farmerPhoto, setFarmerPhoto] = useState(null);

  //passbook states
  const [bankPassbookImage, setBankPassbookImage] = useState(null);
  //bank challen states
  const [challanImage, setChallanImage] = useState(null);

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
  //load page
  const [reloadPage, setReloadPage] = useState(false);
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

  ///////////////////////////////server connection
  console.log(farmerId);
  console.log(farmerFieldId);
  // console.log(token);

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
      window.location.reload();
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
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            farmerPhoto={farmerPhoto}
            setFarmerPhoto={setFarmerPhoto}
            farmerCode={farmerCode}
            fphoto={fphoto} // Pass the fetched data
          />

          {/*farmer Bank Passbook Section */}

          <BankPassbookSection
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            bankPassbookImage={bankPassbookImage}
            setBankPassbookImage={setBankPassbookImage}
            farmerCode={farmerCode}
            passPoto={passPoto}
          />

          {/*farmer Bank Passbook Section End */}
          {/* Farmer Challan Section */}

          <FarmerChallanSection
            onClose={onClose}
            farmerId={farmerId}
            farmerFieldId={farmerFieldId}
            device_uuid={device_uuid}
            token={token}
            farmerNameTitle={farmerNameTitle}
            farmerFather={farmerFather}
            farmerName={farmerName}
            challanImage={challanImage}
            challanpic={challanpic}
            farmerCode={farmerCode}
            setChallanImage={setChallanImage}
          />

          {/* Farmer SubsidyCts Section */}

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
            sbsidypic={sbsidypic}
            farmerCode={farmerCode}
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
