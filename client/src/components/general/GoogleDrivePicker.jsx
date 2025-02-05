import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useSelector } from "react-redux";
const GoogleDrivePicker = ({ onFileSelect, odRequestId, eventDate }) => {
  const [loaded, setLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // Create folder paths for each level
  const departmentPath = currentUser.departmentAcronym;
  const batchPath = `${departmentPath}/${currentUser.batchName}`;
  const sectionPath = `${batchPath}/${currentUser.section_name}`;
  const studentPath = `${sectionPath}/${currentUser.roll_no}`;

  useEffect(() => {
    const loadGoogleLibraries = () => {
      const script1 = document.createElement("script");
      script1.src = "https://apis.google.com/js/api.js";
      script1.onload = () => {
        window.gapi.load("client:auth2", () => {
          window.gapi.load("picker", () => {
            window.gapi.client
              .init({
                apiKey: "AIzaSyBvggifFzrK3j4Ob35ySkX5wznWg5TCJcw",
                discoveryDocs: [
                  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
                ],
              })
              .then(() => {
                setLoaded(true);
              });
          });
        });
      };
      document.body.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://accounts.google.com/gsi/client";
      document.body.appendChild(script2);
    };

    loadGoogleLibraries();
    return () => {
      const scripts = document.querySelectorAll(
        'script[src*="googleapis.com"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, []);

  const getAccessToken = async () => {
    if (accessToken) return accessToken;

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id:
          "1044430415293-97k0pmtkunmnjdj95nsjcv3284tk4all.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: () => {},
      });

      return new Promise((resolve, reject) => {
        tokenClient.callback = (response) => {
          if (response.error) reject(response);
          setAccessToken(response.access_token);
          resolve(response.access_token);
        };
        tokenClient.requestAccessToken();
      });
    } catch (err) {
      console.error("Error getting access token:", err);
      return null;
    }
  };

  const createPicker = async () => {
    const token = await getAccessToken();
    if (!token) return;

    window.gapi.client.setToken({
      access_token: token,
    });

    const view = new window.google.picker.View(
      window.google.picker.ViewId.DOCS
    );
    view.setMimeTypes("image/png,image/jpeg,image/jpg,application/pdf");

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId("1044430415293")
      .setOAuthToken(token)
      .addView(view)
      .addView(new window.google.picker.DocsUploadView())
      .setTitle("Select or Upload Files for OD Request Verification")
      .setCallback(handlePickerCallback)
      .build();

    picker.setVisible(true);
  };

  const handlePickerCallback = async (data) => {
    if (data.action === "picked") {
      const file = data.docs[0];
      const mimeType = file.mimeType;
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];

      if (!allowedTypes.includes(mimeType)) {
        alert("Please select only image or PDF files");
        return;
      }

      const fileId = file.id;
      const rootFolderId = "14bcVGEI9FmbvgmDJGmWgSoxqJRXfUIAb";

      try {
        const newFileName = `${currentUser.roll_no}_${eventDate}_${file.name}`;
        await window.gapi.client.drive.files.update({
          fileId: fileId,
          addParents: rootFolderId,
          resource: {
            name: newFileName,
          },
          fields: "id, name",
        });

        const fileUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

        const response = await fetch(`/api/od/${odRequestId}/update-proof`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completionProof: fileUrl,
            mimeType: mimeType,
            fileId: fileId,
            folderPath: rootFolderId, // Now just storing the root folder ID
          }),
        });

        if (!response.ok) throw new Error("Failed to update completion proof");
        onFileSelect(fileUrl);
      } catch (error) {
        console.error("Error handling file:", error);
        alert("An error occurred while processing the file. Please try again.");
      }
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={createPicker}
        disabled={!loaded}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
          loaded
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-300 cursor-not-allowed text-gray-600"
        }`}
      >
        <Upload size={18} />
        <span>{loaded ? "Upload Completion Proof" : "Loading..."}</span>
      </button>
      <p className="mt-2 text-xs text-gray-500 text-center">
        Allowed file types: Images (PNG, JPEG) and PDF • Max size: 10MB
      </p>
    </div>
  );
};

export default GoogleDrivePicker;
