import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client"
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { Plus, Mic, Send, EmojiSmile, FileEarmark, Image, Camera,Fullscreen,FullscreenExit } from "react-bootstrap-icons";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Avatar from "./avatar";
import dummyImmage from "../assets/reconnect.jpg"

const backgroundStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "#f0f2f5",
};

// type TextMessage = {
//   type: "text";
//   content: string;
//   sentByMe: boolean;
// };

// type ImageMessage = {
//   type: "image";
//   content: string; // image data URL
//   caption?: string;
//   sentByMe: boolean;
// };

// type FileMessage = {
//   type: "file";
//   content: File;
//   caption?: string;
//   sentByMe: boolean;
// };

type BaseMessage = {
  id: string;
  senderEmail: string; // Could be a username or unique user ID
  timestamp: number; // Unix timestamp (milliseconds)
  room?:string
};

type TextMessage = BaseMessage & {
  type: "text";
  content: string;
};

type ImageMessage = BaseMessage & {
  type: "image";
  content: string; // image data URL or URL after upload
  caption?: string;
};

type FileMessage = BaseMessage & {
  type: "file";
  content: string; // Use a string for file URL or base64 encoded data
  caption?: string;
};

type Message = TextMessage | ImageMessage | FileMessage;


interface DummyUser {
  email:string
  id: string;
  name: string;
  lastMessage: string;
  imageUrl?: string; 
}


const MessagingPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewFileType, setPreviewFileType] = useState<"image" | "video" | "document" | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [textOverlay, setTextOverlay] = useState("");
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>({}); // Store messages by room
  const [dummyUsers, setDummyUsers] = useState<DummyUser[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<DummyUser | null>(null);
    // Modal viewer state
    const [viewerModalVisible, setViewerModalVisible] = useState(false);
    const [viewerContent, setViewerContent] = useState<string | null>(null);
    const [viewerType, setViewerType] = useState<"image" | "video" | "document" | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
  
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const attachmentMenuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);


    // Create a ref to store the socket instance
  const socketRef = useRef<any>(null);

    // Get the current logged in user from Redux store
    const currentUser = useSelector((state: RootState) => state.auth.user);

// Simulate fetching dummy users (replace with your API call)
useEffect(() => {
  setTimeout(() => {
    const fetchedUsers: DummyUser[] = [
      { 
        id: "1", 
        name: "Alice Johnson", 
        lastMessage: "Hey, how are you?", 
        email:"textt12@123",
        imageUrl: `${dummyImmage}` 
      },
      { 
        id: "2", 
        name: "Bob Smith", 
        lastMessage: "Let's catch up later.", 
        email:"testttt123@123",
        imageUrl: `${dummyImmage}` 
      },
      { 
        id: "3", 
        name: "John Doe", 
        lastMessage: "See you tomorrow!", 
        email:"testing@1234",
        // imageUrl: `${dummyImmage}` 
      },
    ];
    setDummyUsers(fetchedUsers);
  }, 1000);
}, []);


  // Filter out the current logged in user from the conversation list
  const conversationUsers = dummyUsers.filter(
    (user) => user.email !== currentUser?.email
  );

// Socket connection and message handling
useEffect(() => {
  socketRef.current = io("http://localhost:4000");

  socketRef.current.on("connect", () => {
    console.log("Connected to socket server!");
  });

  socketRef.current.on("newMessage", (incomingMessage: Message) => {
    setMessagesByRoom((prevMessagesByRoom) => {
      const room = incomingMessage.room || "default";
      const updatedMessages = [...(prevMessagesByRoom[room] || []), incomingMessage];
      return { ...prevMessagesByRoom, [room]: updatedMessages };
    });
  });

  return () => {
    socketRef.current.disconnect();
  };
}, []);

// Join room when activeChatUser changes
useEffect(() => {
  if (activeChatUser && currentUser) {
    const roomName = [currentUser.email, activeChatUser.email].sort().join("_");

    // Retrieve messages for the room or initialize an empty array
    setMessagesByRoom((prevMessagesByRoom) => ({
      ...prevMessagesByRoom,
      [roomName]: prevMessagesByRoom[roomName] || [],
    }));

    socketRef.current.emit("joinRoom", roomName);

    return () => {
      socketRef.current.emit("leaveRoom", roomName);
    };
  }
}, [activeChatUser, currentUser]);

  


 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.trim() !== "");
  };

 

  const handleSendMessage = () => {
    let newMsg: Message | null = null;
    const senderEmail = currentUser?.email;
    const timestamp = Date.now();
    const id = uuidv4();
  
    if (!senderEmail) return;
  
    if (editedImage) {
      // Handle edited image
      newMsg = {
        id,
        senderEmail,
        timestamp,
        type: "image",
        content: editedImage,
      };
      setEditedImage(null); // Clear the edited image state
    } else if (previewFile) {
      // Handle file upload
      const reader = new FileReader();
      reader.onload = () => {
        const fileDataUrl = reader.result as string;
        newMsg = {
          id,
          senderEmail,
          timestamp,
          type: previewFileType === "image" ? "image" : "file",
          content: fileDataUrl,
        };
        setPreviewFile(null); // Clear the preview file state
        setPreviewFileType(null); // Clear the file type state
  
        // Emit the message to the server
        if (newMsg !== null && activeChatUser && currentUser) {
          const roomName = [currentUser.email, activeChatUser.email].sort().join("_");
          newMsg = { ...newMsg, room: roomName };
          socketRef.current.emit("sendMessage", newMsg);
        }
      };
      reader.readAsDataURL(previewFile); // Convert file to data URL
      return; // Exit early since the rest of the logic is handled in reader.onload
    } else if (message.trim() !== "") {
      // Handle text message
      newMsg = {
        id,
        senderEmail,
        timestamp,
        type: "text",
        content: message,
      };
      setMessage("");
      setIsTyping(false);
    }
  
    if (newMsg !== null && activeChatUser && currentUser) {
      const roomName = [currentUser.email, activeChatUser.email].sort().join("_");
      newMsg = { ...newMsg, room: roomName };
  
      // Emit the message to the server
      socketRef.current.emit("sendMessage", newMsg);
    }
  };
  // Get messages for the current room
  const currentRoom = activeChatUser && currentUser ? [currentUser.email, activeChatUser.email].sort().join("_") : null;
  const messages = currentRoom ? messagesByRoom[currentRoom] || [] : [];
  
  

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPreviewFile(file);
      
      if (file.type.startsWith("image/")) {
        setPreviewFileType("image");
      } else if (file.type.startsWith("video/")) {
        setPreviewFileType("video");
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
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access the camera. Please ensure you have granted permission.");
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
        setIsEditingImage(true);
        closeCamera();
      }
    }
  };

  const handleSaveEditedImage = () => {
    if (capturedImage) {
      const canvas = document.createElement("canvas");
      const img = document.createElement("img");
      img.src = capturedImage;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(img, 0, 0);
          context.font = "24px Arial";
          context.fillStyle = "white";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(textOverlay, canvas.width / 2, canvas.height / 2);
          const editedImageDataUrl = canvas.toDataURL("image/png");
          setEditedImage(editedImageDataUrl);
          setIsEditingImage(false);
          setTextOverlay("");
        }
      };
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
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
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
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Left Sidebar: Conversation List */}
        <Col md={4} style={{ backgroundColor: "#ffffff", borderRight: "1px solid #ddd" }}>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#075e54",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <h5 style={{ margin: 0 }}>OLD-PALS</h5>
          </div>
          <div style={{ height: "calc(100% - 60px)", overflowY: "auto", backgroundColor: "#ffffff" }}>
          {conversationUsers.length === 0 ? (
              <p style={{ padding: "10px" }}>
                {dummyUsers.length === 0 ? "Loading users..." : "No other users"}
              </p>
            ) : (
              conversationUsers.map((user) => (
                <Card
                key={user.id}
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
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => setActiveChatUser(user)}
              >
                <Card.Body>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={user.imageUrl} size={40} />
                    <div style={{ marginLeft: "10px" }}>
                      <h6 style={{ margin: 0 }}>{user.name}</h6>
                      <small style={{ color: "#666" }}>{user.lastMessage}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              
              ))
            )}
          </div>
        </Col>

        {/* Right Chat Window */}
        <Col md={8} style={{ position: "relative", backgroundColor: "#e5ddd5" }}>
          <div style={{ padding: "10px", backgroundColor: "#075e54", borderBottom: "1px solid #ddd", color: "#fff" }}>
            <h6 style={{ margin: 0 }}><div style={{ padding: "10px", backgroundColor: "#075e54", borderBottom: "1px solid #ddd", color: "#fff" }}>
  {activeChatUser ? `Chat with ${activeChatUser.name}` : "Select a conversation"}
 
</div>
</h6>
          </div>
          <div style={{ padding: "10px", height: "calc(100% - 120px)", overflowY: "auto", backgroundColor: "#ece5dd" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: "10px", textAlign:msg.senderEmail=== currentUser?.email? "right" : "left" }}>
                {msg.type === "text" && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      backgroundColor: "#dcf8c6",
                      borderRadius: "10px 10px 0 10px",
                      maxWidth: "60%",
                      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <p style={{ margin: 0 }}>{msg.content}</p>
                  </div>
                )}
                {msg.type === "image" && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px 10px 10px 0",
                      maxWidth: "60%",
                      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <img
                      src={msg.content}
                      alt="Sent"
                      style={{ maxWidth: "100%", borderRadius: "5px", cursor: "pointer" }}
                      onClick={() => openViewer(msg.content, "image")}
                    />
                    {msg.caption && (
                      <p style={{ margin: "10px 0 0", fontSize: "0.875rem", color: "#666" }}>
                        {msg.caption}
                      </p>
                    )}
                  </div>
                )}
                {msg.type === "file" && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px 10px 10px 0",
                      maxWidth: "60%",
                      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer"
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
        <p style={{ margin: "0 0 0 10px", fontSize: "0.875rem", color: "#666" }}>
          File Attachment
        </p>
      </div>
    )}
    {msg.caption && (
      <p style={{ margin: "10px 0 0", fontSize: "0.875rem", color: "#666" }}>
        {msg.caption}
      </p>
    )}
                  </div>
                )}
                <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "4px" }}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            ))}
            {cameraStream && (
              <div style={{ marginBottom: "10px", textAlign: "center" }}>
                <video ref={videoRef} autoPlay style={{ maxWidth: "100%", borderRadius: "10px" }} />
                <Button variant="danger" onClick={closeCamera} style={{ marginTop: "10px" }}>
                  Close Camera
                </Button>
                <Button variant="primary" onClick={capturePhoto} style={{ marginTop: "10px", marginLeft: "10px" }}>
                  Capture Photo
                </Button>
              </div>
            )}
            {isEditingImage && capturedImage && (
              <div style={{ marginBottom: "10px", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={capturedImage} alt="Captured" style={{ maxWidth: "100%", borderRadius: "10px" }} />
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
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)"
                      }}
                    >
                      {textOverlay}
                    </div>
                  )}
                </div>
                <Form.Control
                  type="text"
                  placeholder="Add text to image"
                  value={textOverlay}
                  onChange={(e) => setTextOverlay(e.target.value)}
                  style={{ marginTop: "10px", width: "80%" }}
                />
                <Button variant="success" onClick={handleSaveEditedImage} style={{ marginTop: "10px" }}>
                  Save and Send
                </Button>
                <Button variant="danger" onClick={() => setIsEditingImage(false)} style={{ marginTop: "10px", marginLeft: "10px" }}>
                  Cancel
                </Button>
              </div>
            )}
            
          </div>

          
          <div style={{ padding: "10px", backgroundColor: "#f0f0f0", borderTop: "1px solid #ddd", position: "absolute", bottom: 0, width: "100%" }}>
          
          {previewFile && (
              <div style={{ marginBottom: "10px", textAlign: "center" }}>
                {previewFileType === "image" && (
                  <img src={URL.createObjectURL(previewFile)} alt="Preview" style={{ maxWidth: "100%", borderRadius: "10px" }} />
                )}
                {previewFileType === "video" && (
                  <video controls src={URL.createObjectURL(previewFile)} style={{ maxWidth: "100%", borderRadius: "10px" }} />
                )}
                {previewFileType === "document" && (
                  <div style={{ padding: "10px", backgroundColor: "#ffffff", borderRadius: "10px" }}>
                    <FileEarmark size={48} />
                    <p>{previewFile.name}</p>
                  </div>
                )}
                 <Button
      variant="close"
      size="sm"
      onClick={closePreview}
      style={{ position: "absolute", top: "5px", right: "5px" }}
    >
     
    </Button>
            
              </div>
            )}
            <Form>
              <Form.Group className="d-flex align-items-center">
                <Button variant="light" style={{ borderRadius: "50%", marginRight: "10px" }} onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}>
                  <Plus size={20} />
                </Button>
                {showAttachmentMenu && (
                  <div
                    ref={attachmentMenuRef}
                    style={{
                      position: "absolute",
                      bottom: "60px",
                      left: "10px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      padding: "10px",
                      width: "200px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" }} onClick={() => handleAttachmentClick("document")}>
                      <FileEarmark size={18} style={{ marginRight: "10px" }} />
                      <span>Document</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" }} onClick={() => handleAttachmentClick("image")}>
                      <Image size={18} style={{ marginRight: "10px" }} />
                      <span>Photos & Videos</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" }} onClick={() => handleAttachmentClick("camera")}>
                      <Camera size={18} style={{ marginRight: "10px" }} />
                      <span>Camera</span>
                    </div>
                  </div>
                )}
                <Button variant="light" style={{ borderRadius: "50%", marginRight: "10px" }} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <EmojiSmile size={20} />
                </Button>
                <Form.Control
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={handleInputChange}
                  style={{ flex: 1, borderRadius: "20px", border: "none", marginRight: "10px" }}
                />
                {(isTyping || previewFile || editedImage) ? (
                  <Button variant="success" onClick={handleSendMessage} style={{ borderRadius: "50%" }}>
                    <Send size={20} />
                  </Button>
                ) : (
                  <Button variant="light" style={{ borderRadius: "50%" }}>
                    <Mic size={20} />
                  </Button>
                )}
              </Form.Group>
            </Form>
            {showEmojiPicker && (
              <div ref={emojiPickerRef} style={{ position: "absolute", bottom: "60px", right: "10px" }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </Col>
      </Row>
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileInputChange} />

      {/* Viewer Modal */}
      <Modal show={viewerModalVisible} onHide={closeViewer} fullscreen={isFullScreen ? true : undefined} size="lg" centered>
        <Modal.Header>
        
          <Button variant="secondary" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <FullscreenExit/> : <Fullscreen/>}
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
