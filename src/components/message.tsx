import React, { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import {
  Plus,
  Send,
  EmojiSmile,
  FileEarmark,
  Image,
  Camera,
  Fullscreen,
  FullscreenExit,
} from "react-bootstrap-icons";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Avatar from "./avatar";;
import { VoiceRecorder } from "./voice-recorder";
import { useDeleteMessagesMutation, useLazyGetFriendsQuery, useLazyGetMessagesQuery, useSendMessageMutation } from "../api/public";
import { DummyUser, Message } from "../utils/types";
import { groupMessagesByDate } from "../utils/date";
import NoChatsMessage from "./no-chats";
import DeleteMessage from "./delete";
import { getLastMessagePreview } from "../utils/last-message";


const backgroundStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "#76abdf",
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}

const dataURLtoBlob = (dataURL: string) => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};




const MessagingPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [updatedMessages, setUpdatedMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewFileType, setPreviewFileType] = useState<
    "image" | "video" | "document" | "audio"|null
  >(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [textOverlay, setTextOverlay] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [friends, setFriends] = useState<DummyUser []>([]);
  const [activeChatUser, setActiveChatUser] = useState<DummyUser | null>(null);
  // Modal viewer state
  const [viewerModalVisible, setViewerModalVisible] = useState(false);
  const [viewerContent, setViewerContent] = useState<string | null>(null);
  const [viewerType, setViewerType] = useState<
    "image" | "video" | "document" | null
  >(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
    const [fetchFriends,{isError:isFriendsError}]=useLazyGetFriendsQuery()
    const[sendMessage]=useSendMessageMutation()
    const[fetchMessages,{isLoading,isError}]=useLazyGetMessagesQuery()
    const [deleteMessages] = useDeleteMessagesMutation();
    const [isFetchingUser, setIsFetchingUser] = useState(false);
  // Create a ref to store the socket instanceF
  const socketRef = useRef<Socket | null>(null);

 

  // Get the current logged in user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);
  console.log("current users",currentUser)

  

  // Fetch friends when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
  
      setIsFetchingUser(true); // Start loading
  
      try {
        const { data, error } = await fetchFriends(currentUser.uid);
  
        if (error) {
          console.error("Error fetching friends:", error);
        } else {
          const friendsList = data?.friends || [];
  
          const friendsWithLastMessages = await Promise.all(
            friendsList.map(async (friend: DummyUser) => {
              try {
                const roomName = [currentUser.uid, friend._id].sort().join("_");
                const messagesResponse = await fetchMessages(roomName);
  
                const lastMessage =
                  messagesResponse.data?.length > 0
                    ? messagesResponse.data[messagesResponse.data.length - 1]
                    : null;

             
  
                return {
                  ...friend,
                  lastMessage: {
                    preview: lastMessage
                      ? getLastMessagePreview(lastMessage)
                      : "No messages yet",
                    timestamp: lastMessage ? new Date(lastMessage.timestamp) : null,
                  },
                  unread:0
                  
                };
              } catch (err) {
                return {
                  ...friend,
                  lastMessage: {
                    preview: "Error loading messages",
                    timestamp: null,
                  },
                };
              }
            })
          );
  
          setFriends(friendsWithLastMessages);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsFetchingUser(false); // Stop loading
      }
    };
  
    fetchData();
  }, [currentUser, fetchFriends]);
  

  
  // Filter out the current logged in user from the conversation list
  const conversationUsers = friends.filter(
    (user) => user.email !== currentUser ?.email
  );


useEffect(() => {
  if (activeChatUser  && currentUser ) {
    console.log("Current User ID:", currentUser?.uid);
console.log("Active Chat User ID:", activeChatUser?._id);

    const roomName = [currentUser.uid, activeChatUser._id].sort().join("_");
    console.log(roomName,"roomname")

    // Fetch messages for the room when it changes
    const loadMessages = async () => {
      try {
        const response = await fetchMessages(roomName);
        
        if ("data" in response && response.data) {
          // Always check if messages exist before accessing
          const hasMessages = response.data.length > 0;
          
          setUpdatedMessages(hasMessages ? response.data : []);
    
          // Only update last message if messages exist
          if (hasMessages) {
            const lastMessage = response.data[response.data.length - 1];
            setFriends(prevFriends => prevFriends.map(friend => 
              friend._id === activeChatUser?._id ? { 
                ...friend, 
                lastMessage: {
                  preview: getLastMessagePreview(lastMessage),
                  timestamp: new Date(lastMessage.timestamp)
                }
              } : friend
            ));
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    

    loadMessages();

    // Join the room
    socketRef.current = io("http://localhost:4000");
    socketRef.current.on("connect", () => {
          console.log("Connected to socket server!");
        });
    socketRef.current!.emit("joinRoom", roomName);

    // Listen for new messages
    socketRef.current!.on("newMessage", (incomingMessage: Message) => {
      setUpdatedMessages((prevMessages) => [...prevMessages, incomingMessage]);
        // Update unread count if message is from another user and chat is not active
        if (
          incomingMessage.senderId !== currentUser.uid &&
          activeChatUser._id !== incomingMessage.senderId
        ) {
          setFriends(prevFriends => prevFriends.map(friend => 
            friend._id === incomingMessage.senderId ? 
              { ...friend, unread: (friend.unread|| 0) + 1 } : 
              friend
          ));
        }
    });

    return () => {
      socketRef.current!.emit("leaveRoom", roomName);
      socketRef.current!.off("newMessage");
    };
  }
}, [activeChatUser , currentUser ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.trim() !== "");
  };

  
  const handleSendMessage = async () => {
    console.log("sending message")
    let newMsg: Message | null = null;
    const senderEmail = currentUser?.email;
    const senderId=currentUser?.uid
    const timestamp = new Date();
    const id = uuidv4();
    
  
    if (!senderEmail || !senderId||!activeChatUser) return;
    console.log("Authenticated User UID:", currentUser?.uid);
    const roomName = [currentUser.uid, activeChatUser._id].sort().join("_");

    console.log("Current User:", currentUser );
    console.log("Active Chat User:", activeChatUser?._id );
    console.log("Message State:", message);
    console.log("Trimmed Message:", message.trim());
    console.log("Captured Image:", capturedImage);
    console.log("Edited Image:", editedImage);
    console.log("Preview File:", previewFile);
    console.log("Audio Blob:", audioBlob);
    
  
    if (editedImage) {
      console.log("Handling edited image");
      // Handle edited image
      newMsg = {
        id,
        // senderEmail,
        senderId,
        timestamp,
        type: "image",
        content: editedImage,
        caption: message, 
        room:roomName as string
      };
      setEditedImage(null); // Clear the edited image state
      setTextOverlay(""); // Clear the text overlay
    } else if (capturedImage) {
      console.log("Handling captured image");
      // Handle captured image
      newMsg = {
        id,
        // senderEmail,
        senderId,
        timestamp,
        type: "image",
        content: capturedImage,
        caption: message,
        room:roomName as string
      };
      setCapturedImage(null); // Clear the captured image state
    }
    else if (previewFile) {
      console.log("Handling preview file");
      const captionText = message.trim() 
      ? `${previewFile.name}\n${message}` 
      : previewFile.name;
      

      // Upload the file using FormData instead of converting to Data URL
      const formData = new FormData();
      formData.append("file", previewFile);
  
      try {
        // Replace '/upload' with your actual upload endpoint URL
        const response = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("File upload failed");
        }
        const { fileUrl } = await response.json();
        newMsg = {
          id,
          // senderEmail,
          senderId,
          timestamp,
          type: previewFileType === "image" ? "image" : "file",
          content: fileUrl, // Use the file URL returned from the server
          caption: captionText, // Use the file name as the caption
          room:roomName as string
        };
  
        // Clear states
        setMessage("");
        setIsTyping(false);
        setPreviewFile(null);
        setPreviewFileType(null);
        setTextOverlay("");
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }else if (audioBlob) {
      console.log("Handling audio blob");
      // Handle audio message
      const base64Audio = await blobToBase64(audioBlob);
      newMsg = {
        id,
        // senderEmail,
        senderId,
        timestamp,
        type: "audio",
        content: base64Audio,
        room:roomName as string
      };
      setAudioBlob(null);
    setPreviewFile(null);
    setPreviewFileType(null);
     
    }else if (message.trim() !== "") {
      console.log("Message before sending:", message);
      // Handle text message
      newMsg = {
        id,
        // senderEmail,
        senderId,
        timestamp,
        type: "text",
        content: message,
        room:roomName as string
      };
      console.log("Text message constructed:", newMsg)
      setMessage("");
      setIsTyping(false);
    }else {
      console.log("Message is empty or only whitespace."); // Log if the message is empty
  }

  socketRef.current?.emit("sendMessage",newMsg)
  
  try {
    if (newMsg && newMsg.room) {
      await sendMessage(newMsg);

      setFriends(prevFriends => prevFriends.map(friend => 
        friend._id === activeChatUser._id ? { 
          ...friend, 
          lastMessage: {
            preview: getLastMessagePreview(newMsg),
            timestamp: newMsg.timestamp
          }
        } : friend
      ));

    } else {
      console.error("Message object is missing required fields:", newMsg);
    }
    
    
    setMessage(""); // Clear the input field
  } catch (error) {
    console.error("Error sending message:", error);
  }
  };
  
  
  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
    setPreviewFileType("audio")
   };

   const handleSelectFriend = (user: DummyUser) => {
    setActiveChatUser(user);
    setFriends(prevFriends => prevFriends.map(friend => 
      friend._id === user._id ? { ...friend, unread: 0 } : friend
    ));
  };
  

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

       // Optional: File size validation (example: 5MB max)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      alert("File size is too large. Please select a file smaller than 5MB.");
      return;
    }

    console.log("File selected:", file); // Debugging

      setPreviewFile(file);

      if (file.type.startsWith("image/")) {
        setPreviewFileType("image");
      } else if (file.type.startsWith("video/")) {
        setPreviewFileType("video");
      } else if (file.type.startsWith("audio/")) {
        setPreviewFileType("audio");
      } else {
        setPreviewFileType("document");
      }
    }
  };

  const closePreview = () => {
    setPreviewFile(null);
    setPreviewFileType(null);
    setTextOverlay("");
  };

  const handleAttachmentClick = (type: string) => {
    setShowAttachmentMenu(false);
    if (fileInputRef.current) {
      switch (type) {
        case "document":
          fileInputRef.current.accept = ".pdf,.doc,.docx,.txt";
          fileInputRef.current.capture = "";
          fileInputRef.current.click();
          break;
        case "image":
          fileInputRef.current.accept = "image/*";
          fileInputRef.current.capture = "";
          fileInputRef.current.click();
          break;
        case "camera":
          openCamera();
          break;
        case "contact":
          fileInputRef.current.accept = ".vcf";
          fileInputRef.current.capture = "";
          fileInputRef.current.click();
          break;
        default:
          fileInputRef.current.accept = "*";
          fileInputRef.current.capture = "";
          fileInputRef.current.click();
      }
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true)
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Unable to access the camera. Please ensure you have granted permission."
      );
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
  
        // Convert data URL to a File and set preview in the chat
        const file = new File([dataURLtoBlob(dataUrl)], "captured_image.png", {
          type: "image/png",
        });
        setPreviewFile(file);
        setPreviewFileType("image");
  
        // Close or hide the inline camera preview
        closeCamera();
      }
    }
  };
  
  

  // Modal viewer functions
  const openViewer = (url: string, type: "image" | "video" | "document") => {
    setViewerContent(url);
    setViewerType(type);
    setViewerModalVisible(true);
  };

  const closeViewer = () => {
    setViewerModalVisible(false);
    setViewerContent(null);
    setViewerType(null);
    setIsFullScreen(false); // reset full screen state when closing
  };

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target as Node)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    if (showEmojiPicker || showAttachmentMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, showAttachmentMenu]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessages(messageId).unwrap(); 
      setUpdatedMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId)); 
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  console.log(isFetchingUser,"loading user")

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
      style={backgroundStyle}
    >
      <Row
        noGutters
        style={{
          height: "90%",
          width: "90%",
          maxWidth: "1200px",
          borderRadius: "10px",
          // overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Sidebar: Conversation List */}
        <Col
          md={4}
          style={{ backgroundColor: "#ffffff ", borderRight: "1px solid #ddd" }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "#3E7BE7",
              color: "#fff",
              display: "flex",             
              alignItems: "center", 
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ margin: 0 }}>OLD-PALS</h5>
          </div>
          <div
            style={{
              height: "calc(100% - 60px)",
              overflowY: "auto",
              backgroundColor: "#ffffff",
            }}
          >
            {
            isFetchingUser?(
              <p style={{ padding: "10px" }}>Loading users...</p>
            ):(!isFetchingUser&&isFriendsError)?(
              <p style={{ padding: "10px", color: "red" }}>Error fetching users.</p>
            ):(!isFetchingUser&&conversationUsers.length === 0 )? (
              <div style={{ 
                padding: "20px", 
                textAlign: "center",
                color: "#666"
              }}>
              <p style={{ padding: "10px" }}>
                {friends.length === 0
                  ?  "No other users" : "No friends found"}
              </p>
              </div>
            ) : (
              conversationUsers.sort((a,b)=>{
                const aTime = a.lastMessage?.timestamp?.getTime() || 0;
                const bTime = b.lastMessage?.timestamp?.getTime() || 0;
                
                // Descending order (newest first)
                return bTime - aTime;
              }).map((user) => (
                <Card
                  key={user._id}
                  style={{
                    margin: "10px",
                    cursor: "pointer",
                    border: "none",
                    borderRadius: "10px",
                    borderBottom: "1px solid #ddd",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => handleSelectFriend(user)}
                >
                  <Card.Body>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar src={user.profilePhoto} size={40} />
                      <div style={{ marginLeft: "10px",flexGrow:1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h6 style={{ margin: 0 }}>{user.fullName}</h6>
            {(user.unread ?? 0)> 0 && (
              <span style={{
                backgroundColor: "#3E7BE7",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                marginLeft: "8px"
              }}>
                {user.unread??0}
              </span>
            )}
          </div>
                        
                        <small style={{ color: "#666" }}>
                          {user.lastMessage?.preview||"No Message yet"}
                          {user.lastMessage?.timestamp && (
                <span style={{ marginLeft: "8px", fontSize: "0.75em" }}>
                  {new Date(user.lastMessage.timestamp).toLocaleTimeString([],{
                     hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>

        {/* Right Chat Window */}
        <Col
          md={8}
          style={{ position: "relative", backgroundColor: "#e5ddd5", height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "#3E7BE7",
              borderBottom: "1px solid #ddd",
              color: "#fff",
            }}
          >
            <h6 style={{ margin: 0 }}>
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#3E7BE7",
                  borderBottom: "1px solid #ddd",
                  color: "#fff",
                }}
              >
{activeChatUser ? (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Avatar src={activeChatUser.profilePhoto} size={40} />
    <span style={{ marginLeft: "10px" }}>Chat with {activeChatUser.fullName}</span>
  </div>
) : (
  "Select a conversation"
)}

              </div>
            </h6>
          </div>
          <div
            style={{
              padding: "10px",
      flex: 1,
      overflowY: "auto",
      backgroundColor: "#ece5dd",
      
  }}
  >
    {isLoading ?(
       <p style={{ padding: "10px" }}>Loading messages...</p>
    ):isError ?(
      <p style={{ padding: "10px", color: "red" }}>Failed to load messages.</p>
    ):updatedMessages.length === 0 ? (
      <NoChatsMessage activeChatUser={activeChatUser}/>
    ) :
    (Object.entries(groupMessagesByDate(updatedMessages)).map(([dateKey, messages]) => (
    <div key={dateKey}>
      {/* Date separator */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        margin: '20px 0',
        padding: '0 10px'
      }}>
        <div style={{ flex: 1, borderBottom: '1px solid #dcdcdc' }} />
        <span style={{ 
          margin: '0 10px', 
          color: '#666',
          fontSize: '0.75rem',
          fontWeight: 500,
          textTransform: 'uppercase'
        }}>
          {dateKey}
        </span>
        <div style={{ flex: 1, borderBottom: '1px solid #dcdcdc' }} />
      </div>    
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  textAlign:
                    msg.senderId === currentUser?.uid ? "right" : "left",
                }}
              >
  {msg.type === "text" && (
  <div
    style={{
      display: "inline-block",
      padding: "8px 12px",
      backgroundColor: msg.senderId === currentUser!.uid ? "#3E7BE7" : "#D6E6FF", // Sender: Blue, Receiver: Pastel Blue
      color: msg.senderId === currentUser!.uid ? "white" : "black", // Text color
      borderRadius: msg.senderId === currentUser!.uid ? "10px 10px 0 10px" : "10px 10px 10px 0",
      maxWidth: "60%",
      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
      alignSelf: msg.senderId === currentUser!.uid ? "flex-end" : "flex-start",
    }}
  >
    <p style={{ margin: 0 }}>{msg.content}</p>
    <DeleteMessage messageId={msg.id} onDelete={handleDeleteMessage} />
  </div>
)}


                {msg.type === "image" && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px 10px 10px 0",
                      border: "1px solid #ddd",
                      maxWidth: "200px",
                      width:"auto",
                      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      src={msg.content}
                      alt="Sent"
                      style={{
                        maxWidth: "100%",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => openViewer(msg.content, "image")}
                    />
                   {msg.caption && msg.caption.split("\n").length > 1 && (
      <div
        style={{
          marginTop: "0px",
          padding: "8px",
          backgroundColor: "#f0f0f0", // Light background for the text
          borderRadius: "5px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "#666",
            whiteSpace: "pre-line", // Preserve line breaks in the caption
          }}
        >
          {msg.caption.split("\n").slice(1).join("\n")} {/* Display the additional text */}
        </p>
      </div>
      
    )}
    <DeleteMessage messageId={msg.id} onDelete={handleDeleteMessage} />
                  </div>
                )}
                {msg.type === "audio" && (
  <div
    style={{
      display: "inline-block",
      padding: "8px 12px",
      backgroundColor: "#ffffff",
      borderRadius: "10px 10px 10px 0",
      border: "1px solid #ddd",
      maxWidth: "300px",
      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
    }}
  > 
    <audio controls src={msg.content}    style={{
        maxWidth: "100%",      
        display: "block",      
        boxSizing: "border-box",
      }}/>
      <DeleteMessage messageId={msg.id} onDelete={handleDeleteMessage} />
  </div>
)}

                {msg.type === "file" && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px 10px 10px 0",
                      border: "1px solid #ddd",
                      maxWidth: "300px",
                      width:"auto",
                      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const type = msg.content.startsWith("data:image/")
                        ? "image"
                        : msg.content.startsWith("data:video/")
                        ? "video"
                        : "document";
                      openViewer(msg.content, type);
                    }}
                  >
                    {msg.content.startsWith("data:image/") ? (
                      <img
                        src={msg.content}
                        alt="File Preview"
                        style={{ maxWidth: "100%", borderRadius: "5px" }}
                      />
                    ) : msg.content.startsWith("data:video/") ? (
                      <video
                        controls
                        src={msg.content}
                        style={{ maxWidth: "100%", borderRadius: "5px" }}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FileEarmark size={48} />
                        <p
                          style={{
                            margin: "0 0 0 10px",
                            fontSize: "0.875rem",
                            color: "#666",
                            whiteSpace:"pre-line"
                          }}
                        >
                         {msg.caption ? msg.caption.split("\n")[0] : "File Attachment"}
                        </p>
                      </div>
                      
                    )}
      {/* Additional Text (Caption) */}
    {msg.caption && msg.caption.split("\n").length > 1 && (
      <div
        style={{
          marginTop: "10px",
          padding: "8px",
          backgroundColor: "#f0f0f0", // Light background for the text
          borderRadius: "5px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "#666",
            whiteSpace: "pre-line", // Preserve line breaks in the caption
          }}
        >
          {msg.caption.split("\n").slice(1).join("\n")} {/* Display the additional text */}
        </p>
      </div>
    )}
    <DeleteMessage messageId={msg.id} onDelete={handleDeleteMessage} />
                  </div>
                )}
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#666",
                    marginTop: "4px",
                  }}
                >
                 {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </div>
              </div>
            ))}
            </div>
    ))
            )}
          
            {isEditingImage && capturedImage && (
              <div style={{ marginBottom: "10px", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{ maxWidth: "100%", borderRadius: "10px" }}
                  />
                  {textOverlay && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "bold",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      {textOverlay}
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>

          
          <div
  style={{
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderTop: "1px solid #ddd",
    position: "sticky",
    bottom: 0,
    width: "100%",
  }}
>
{cameraStream && (
  <div style={{ marginBottom: "10px", textAlign: "center" }}>
    <video
      ref={videoRef}
      autoPlay
      style={{ maxWidth: "100%", borderRadius: "10px" }}
    />
    <Button variant="danger" onClick={closeCamera} style={{ marginTop: "10px" }}>
      Close Camera
    </Button>
    <Button
      variant="primary"
      onClick={capturePhoto}
      style={{ marginTop: "10px", marginLeft: "10px" }}
    >
      Capture Photo
    </Button>
  </div>
)}


  {/* Preview File Section */}
  {(previewFile )&& (
    <div
      style={{
        marginBottom: "10px",
        textAlign: "center",
        position: "relative",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      {previewFileType === "image" && previewFile && (
        <img
          src={URL.createObjectURL(previewFile)}
          alt="Preview"
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      )}
      {previewFileType === "video" && (
        <video
          controls
          src={URL.createObjectURL(previewFile)}
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      )}
      {previewFileType === "document" && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            maxWidth: "90%",
            margin: "0 auto",
          }}
        >
          <FileEarmark size={48} />
          <p>{previewFile.name}</p>
        </div>
      )}
      {/* Close Button */}
      <Button
        variant="close"
        size="sm"
        onClick={closePreview}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "50%",
          padding: "5px",
        }}
      >
        ×
      </Button>
    </div>
  )}

  {/* Input Field and Attachment Menu */}
 {activeChatUser && (<Form>
    <Form.Group className="d-flex align-items-center">
      {/* Attachment Button */}
      <Button
        variant="light"
        style={{ borderRadius: "50%", marginRight: "10px" }}
        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
      >
        <Plus size={20} />
      </Button>

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div
          ref={attachmentMenuRef}
          style={{
            position: "absolute",
            bottom: "60px", // Adjust this value if needed
            left: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            width: "200px",
            zIndex: 1000, // Ensure the menu is above other elements
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" }}
            onClick={() => handleAttachmentClick("document")}
          >
            <FileEarmark size={18} style={{ marginRight: "10px" }} />
            <span>Document</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" }}
            onClick={() => handleAttachmentClick("image")}
          >
            <Image size={18} style={{ marginRight: "10px" }} />
            <span>Photos & Videos</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" }}
            onClick={() => handleAttachmentClick("camera")}
          >
            <Camera size={18} style={{ marginRight: "10px" }} />
            <span>Camera</span>
          </div>
        </div>
      )}

      {/* Emoji Button */}
      <Button
        variant="light"
        style={{ borderRadius: "50%", marginRight: "10px" }}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <EmojiSmile size={20} />
      </Button>

      {/* Message Input */}
       {previewFileType !== "audio" && (
    <Form.Control
      type="text"
      placeholder="Type a message"
      value={message}
      onChange={handleInputChange}
      style={{ flex: 1, borderRadius: "20px", border: "none", marginRight: "10px" }}
    />
  )}


      {/* Send/Record Button */}
      {(isTyping || previewFile || editedImage) ? (
        <Button variant="success" onClick={handleSendMessage} style={{ borderRadius: "50%" }}>
          <Send size={20} />
        </Button>
      ) : (
        // <Button variant="light" style={{ borderRadius: "50%" }}>
        //   <Mic size={20} />
        // </Button>
        <VoiceRecorder onRecorded={handleAudioRecorded} onSend={handleSendMessage}/>
      )}
    </Form.Group>
  </Form>)}

  {/* Emoji Picker */}
  {showEmojiPicker && (
    <div ref={emojiPickerRef} style={{ position: "absolute", bottom: "60px", right: "10px" }}>
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  )}
</div>
        </Col>
      </Row>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />

      {/* Viewer Modal */}
      <Modal
        show={viewerModalVisible}
        onHide={closeViewer}
        fullscreen={isFullScreen ? true : undefined}
        size="lg"
        centered
      >
        <Modal.Header>
          <Button
            variant="secondary"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          </Button>
          <Button variant="close" onClick={closeViewer}></Button>
        </Modal.Header>
        <Modal.Body>
          {viewerType === "image" && viewerContent && (
            <img src={viewerContent} alt="View" style={{ width: "100%" }} />
          )}
          {viewerType === "video" && viewerContent && (
            <video controls src={viewerContent} style={{ width: "100%" }} />
          )}
          {viewerType === "document" && viewerContent && (
            <iframe
              src={viewerContent}
              title="Document Viewer"
              style={{ width: "100%", height: "500px", border: "none" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MessagingPage;
