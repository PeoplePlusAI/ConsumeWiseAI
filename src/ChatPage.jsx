import React, { useEffect, useState, useCallback, useRef } from 'react'
import HeaderCard from 'Components/Card/HeaderCard'
import './Stylesheet/Css/ChatPage.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Image from 'Utils/Image'
import Img from 'Components/Img/Img'
import Modal from 'react-bootstrap/Modal';
import ButtonComponent from 'Components/Button/Button'
import axiosInstance from 'Services/axiosInstance'
import { useDropzone } from "react-dropzone";
import { toast } from 'react-toastify'



const ChatPage = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { buttonClickedFromHome } = location.state || {};

    const [show, setShow] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState("")
    const [selectedFileURL, setSelectedFileURL] = useState("")
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [messages, setMessages] = useState([])
    const [userInputMessage, setUserInputMessage] = useState("");
    const [selectedFileErrorMsg, setSelectedFileErrorMsg] = useState("")
    const [loading, setLoading] = useState(false)

    const [resReceived, setResReceived] = useState(false)

    const timeouts = useRef([]);



    useEffect(() => {
        if (buttonClickedFromHome === "upload-image-button") {
            handleShow()
        }
    }, [])



    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            handleFileUploadChange(acceptedFiles, "dragAndDrop");
        } else {
            setSelectedFileErrorMsg("No files selected.");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const handleClose = () => {
        setSelectedFileErrorMsg("")
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const handleFileUploadClick = (e) => {
        document.getElementById("upload-file").click()
    }

    const handleFileUploadChange = async (e, type) => {
        try {
            if (!navigator.onLine) {
                setSelectedFileErrorMsg("No internet connection. Please check your network and try again");
                return;
            }

            let files = type === "fileUpload" ? Array.from(e.target.files) : Array.from(e);
            const MAX_FILE_SIZE = 25 * 1024 * 1024;
            const MAX_FILES = 5;
            const validExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

            if (!files.length) return;

            if (files.length > 5) {
                toast.warn(<>
                    <p className='mb-0' style={{ fontFamily: "Inter" }}>Please upload up to 5 images</p>
                </>)
                return
            }

            files = files.slice(0, MAX_FILES);

            let validFiles = [];
            let errorMessages = [];

            files.forEach(file => {
                if (file.size > MAX_FILE_SIZE) {
                    errorMessages.push(`${file.name} exceeds 25MB limit`);
                    return;
                }
                if (!validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
                    errorMessages.push(`${file.name} is an unsupported format \n`);
                    return;
                }
                validFiles.push(file);
            });

            if (errorMessages.length > 0) {
                setSelectedFileErrorMsg(errorMessages.join("\n"));
                return;
            }

            setSelectedFileErrorMsg("");
            setSelectedFiles(Number(files.length))
            setIsFileSelected(true);

            const formData = new FormData();
            let uploadedFiles = [];

            validFiles.forEach(file => {
                formData.append("file", file);
                const fileURL = URL.createObjectURL(file);
                uploadedFiles.push({ name: file.name, url: fileURL });
            });

            const config = {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 99) / progressEvent.total);
                    setProgressPercentage(percentCompleted);
                },
            };

            try {
                const response = await axiosInstance.post("/upload_image", formData, config,);
                if (response.data.status_code === 201) {
                    let messages = uploadedFiles.map(file => ({
                        text: file.name,
                        url: file.url,
                        user: true,
                        time: currentTime(new Date()),
                    }));

                    setMessages(prev => [...prev, ...messages]);

                    const loadingText = { text: "Loading...", user: false, time: currentTime(new Date()) };
                    setMessages(prev => [...prev, loadingText]);

                    const responseMessage = response.data.data.response;
                    const formattedHTML = responseMessage.split("\n\n")
                        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
                        .join("");

                    const botMessage = { text: formattedHTML, user: false, time: currentTime(new Date()) };
                    setMessages(prev => [...prev.slice(0, -1), botMessage]);

                } else {
                    uploadedFiles.forEach(file => handleUploadFailure(file.name, file.url, response.data.message));
                }
            } catch (error) {
                if (!navigator.onLine) {
                    setSelectedFileErrorMsg("Upload interrupted. Please try again");
                } else {
                    uploadedFiles.forEach(file => handleUploadFailure(file.name, file.url, "Upload interrupted. Please try again"));
                }
            }
            setSelectedFiles("")
            setIsFileSelected(false);
            handleClose();

            setTimeout(() => {
                const scrollView = document.querySelector("#scrollView");
                if (scrollView) {
                    scrollView.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1);
        } catch (err) {
            console.log(err);
            setSelectedFileErrorMsg("An unexpected error occurred. Please try again");
        }
    };

    const handleUploadFailure = (fileName, fileUrl, errorMessage) => {
        setMessages(prev => [
            ...prev,
            { text: fileName, url: fileUrl, user: true, time: currentTime(new Date()) },
            { text: errorMessage, user: false, time: currentTime(new Date()) },
        ]);
        setSelectedFiles("")
        setIsFileSelected(false);
        handleClose();
    };




    const handleSendMessage = async (text, value) => {
        if (!text.trim()) return

        if (text !== "") {
            try {
                setLoading(true)
                let payload;

                if (value === "suggestionResponseText") {
                    setSelectedFileURL("")
                    payload = {
                        "message": text,
                        "flag": "True"
                    }
                    const userMessage = { text: text, user: true, time: currentTime(new Date()) }
                    setMessages((prevMessages) => [...prevMessages, userMessage])
                    setUserInputMessage("")



                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: "Analyzing product using data from 3,000+ peer-reviewed journal papers...", user: false, time: currentTime(new Date()) }
                    ]);

                    // Setup timeouts for loading message 

                    timeouts.current.push(setTimeout(() => {
                        setMessages((prevMessages) => [
                            ...prevMessages.slice(0, -1),
                            { text: "This may take a few minutes...", user: false, time: currentTime(new Date()) }
                        ]);
                    }, 6000));

                    timeouts.current.push(setTimeout(() => {
                        setMessages((prevMessages) => [
                            ...prevMessages.slice(0, -1),
                            { text: "Please wait ...", user: false, time: currentTime(new Date()) }
                        ]);
                    }, 10000));


                    setTimeout(() => {
                        const scrollView = document.querySelector("#scrollView");
                        if (scrollView) {
                            scrollView.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1);
                } else {
                    payload = {
                        "message": text,
                        "flag": "False"
                    }
                    setSelectedFileURL("")

                    const userMessage = { text: text, user: true, time: currentTime(new Date()) }
                    setMessages((prevMessages) => [...prevMessages, userMessage])
                    setUserInputMessage("")

                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: "Analyzing product using data from 3,000+ peer-reviewed journal papers...", user: false, time: currentTime(new Date()) }
                    ]);

                    // Setup timeouts for loading message 

                    timeouts.current.push(setTimeout(() => {
                        setMessages((prevMessages) => [
                            ...prevMessages.slice(0, -1),
                            { text: "This may take a few minutes...", user: false, time: currentTime(new Date()) }
                        ]);
                    }, 6000));

                    timeouts.current.push(setTimeout(() => {
                        setMessages((prevMessages) => [
                            ...prevMessages.slice(0, -1),
                            { text: "Please wait ...", user: false, time: currentTime(new Date()) }
                        ]);
                    }, 10000));

                    setTimeout(() => {
                        const scrollView = document.querySelector("#scrollView");
                        if (scrollView) {
                            scrollView.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1);
                }

                const response = await axiosInstance.post("/chat", payload);

                timeouts.current.forEach(clearTimeout);
                timeouts.current = [];

                if (response.data.status_code === 200) {
                    setLoading(false)
                    setResReceived(true)
                    const responseArray = response.data.data.response;
                    const botMessage = { text: responseArray, user: false, time: currentTime(new Date()) };
                    setMessages((prevMessages) => [
                        ...prevMessages.slice(0, -1),
                        botMessage,

                    ]);
                    setTimeout(() => {
                        const scrollView = document.querySelector("#scrollView");
                        if (scrollView) {
                            scrollView.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1);

                } else if (response.data.status_code === 201) {
                    setLoading(false)
                    const responseMessage = response.data.data.response;
                    const formattedHTML = responseMessage
                        .split("\n\n")
                        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`) // Replace single \n with <br>
                        .join("");

                    const botMessage = { text: formattedHTML, user: false, time: currentTime(new Date()) };
                    setMessages((prevMessages) => [
                        ...prevMessages.slice(0, -1),
                        botMessage,
                    ]);
                    setTimeout(() => {
                        const scrollView = document.querySelector("#scrollView");
                        if (scrollView) {
                            scrollView.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1);
                } else {
                    setLoading(false)

                    const responseMessage = response.data.message;
                    const botMessage = { text: responseMessage, user: false, time: currentTime(new Date()) };
                    setMessages((prevMessages) => [
                        ...prevMessages.slice(0, -1),
                        botMessage,
                    ]);
                    setTimeout(() => {
                        const scrollView = document.querySelector("#scrollView");
                        if (scrollView) {
                            scrollView.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1);
                }
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSendMessage(userInputMessage, "userInputMessage")
        }
    }

    const currentTime = (date) => {
        let hours = date.getHours()
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        hours = hours < 10 ? `0${hours}` : hours
        let minutes = date.getMinutes()
        minutes = minutes < 10 ? `0${minutes}` : minutes
        const time = `${hours}:${minutes} ${ampm}`
        return time
    }



    return (
        <section className='chatpage-component'>

            <Img
                className="body-top-bg-image d-none d-md-block"
                src={Image.bodyTopImage}
                alt="body-top-bg-image"
            />

            <Img
                className="body-bottom-bg-image d-none d-md-block"
                src={Image.bodyBottomImage}
                alt="body-bottom-bg-image"
            />

            <HeaderCard
                cardClassName='border-0 header-card'
                cardTitleClassName="justify-content-start mb-0"
                cardContent={<div onClick={() => navigate("/")}>
                    <Img
                        src={Image.CompanyLogo}
                        className="cup"
                        alt="peoplePlusAI-logo"
                    />
                </div>
                }
            />

            <div className="chat-container">
                <Link to="/" title='Back' className="back-icon cup"  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <path d="M29.0711 21.9992L14.9289 21.9992M14.9289 21.9992L20.2322 27.3025M14.9289 21.9992L20.2322 16.6959" stroke="#005C75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>

                {/* Sending-Receiving messages-container */}
                <div className='sending-receiving-message-container'>
                    {
                        messages.length === 0 &&
                        <div className='d-flex justify-content-center align-items-center gap-2 h-100 start-searching-text'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                <path d="M12.0212 21.1616C17.1028 21.1616 21.2222 17.0422 21.2222 11.9607C21.2222 6.87916 17.1028 2.75977 12.0212 2.75977C6.9397 2.75977 2.82031 6.87916 2.82031 11.9607C2.82031 17.0422 6.9397 21.1616 12.0212 21.1616Z" stroke="#969696" strokeWidth="1.75256" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20.1289 21.8676C20.6708 23.5033 21.9078 23.6669 22.8585 22.2356C23.7275 20.927 23.155 19.8536 21.5806 19.8536C20.4152 19.8434 19.7609 20.7532 20.1289 21.8676Z" stroke="#969696" strokeWidth="1.75256" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Start searching..</span>

                        </div>
                    }
                    {
                        messages?.map((message, index) => {
                            return (
                                <React.Fragment key={index}>
                                    {message?.user === true ? (
                                        <>
                                            <div className="sending-message-container">
                                                <div className="mb-0 sending-message">
                                                    {Array.isArray(message.url) ? (
                                                        message.url.map((url, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={url}
                                                                alt={`selected-media-file-${idx}`}
                                                                width="100%"
                                                                height="150"
                                                            />
                                                        ))
                                                    ) : message.url ? (
                                                        <img
                                                            src={message.url}
                                                            alt="selected-media-file"
                                                            width="100%"
                                                            height="150"
                                                        />
                                                    ) : (
                                                        message.text
                                                    )}
                                                </div>
                                                <p className="mb-0 sending-message-time">{message?.time}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="receiving-message-container" key={index}>
                                            {Array.isArray(message.text) ? (
                                                message.text.map((item, idx) => (
                                                    <div className="default-receiving-suggestions-container" key={idx}>
                                                        <p
                                                            className="mb-0 cup default-receiving-suggestion"
                                                            onClick={() => handleSendMessage(item, "suggestionResponseText")


                                                            }
                                                        >
                                                            {item}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <div className="mb-0 receiving-message">
                                                        {Array.isArray(message.url) ? (
                                                            message.url.map((url, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={url}
                                                                    alt={`received-media-file-${idx}`}
                                                                    width="150"
                                                                    height="150"
                                                                />
                                                            ))
                                                        ) : message.url ? (
                                                            <img
                                                                src={message.url}
                                                                alt="received-media-file"
                                                                width="150"
                                                                height="150"
                                                            />
                                                        ) : (
                                                            <p
                                                                className="mb-0 recommendation-text"
                                                                dangerouslySetInnerHTML={{ __html: message.text }}
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            <p className="mb-0 receiving-message-time">{message?.time}</p>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })
                    }
                    <div id="scrollView"></div>
                </div>

                {/* Text area field */}
                <div className="chat-textarea-section position-absolute d-flex align-items-center ">
                    <div className='chat-textarea-container d-flex align-items-center '>
                        <div className='position-relative w-100 me-3 me-md-4 d-flex align-items-center'>
                            <textarea
                                className={`chat-textarea-field ${loading ? "disabled" : ""}`}
                                type="text"
                                placeholder='Type here..'
                                value={userInputMessage}
                                onChange={(e) => setUserInputMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className={`d-flex align-items-center ${loading ? "disabled " : ""}`} onClick={handleShow} title='Upload file'>
                            <svg className="cup" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <mask id="mask0_230_1393" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect x="0.0957031" y="0.408203" width="23.1844" height="23.1844" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_230_1393)">
                                    <path d="M5.03733 20.2117C4.55706 20.2117 4.14594 20.0407 3.80397 19.6987C3.462 19.3568 3.29102 18.9456 3.29102 18.4654V5.53572C3.29102 5.05545 3.462 4.64433 3.80397 4.30236C4.14594 3.96039 4.55706 3.7894 5.03733 3.7894H13.4342V5.23843H5.03733C4.95055 5.23843 4.87931 5.26628 4.8236 5.32199C4.76789 5.37769 4.74004 5.44894 4.74004 5.53572V18.4654C4.74004 18.5521 4.76789 18.6234 4.8236 18.6791C4.87931 18.7348 4.95055 18.7627 5.03733 18.7627H17.967C18.0536 18.7627 18.1248 18.7348 18.1807 18.6791C18.2364 18.6234 18.2643 18.5521 18.2643 18.4654V10.0685H19.7133V18.4654C19.7133 18.9456 19.5423 19.3568 19.2003 19.6987C18.8584 20.0407 18.4472 20.2117 17.967 20.2117H5.03733ZM16.7037 8.73082V6.79878H14.7716V5.35H16.7037V3.41797H18.1527V5.35H20.0847V6.79878H18.1527V8.73082H16.7037ZM6.43057 16.5891H16.6479L13.4711 12.3536L10.759 15.8832L8.82701 13.4124L6.43057 16.5891Z" fill="#232323" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div title='Send' className={`send-btn-container  ${loading ? "disabled" : ""} ${userInputMessage === "" ? "pe-none" : "cup"}`} onClick={() => handleSendMessage(userInputMessage, "userInputMessage")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <g clipPath="url(#clip0_230_1404)">
                                <path d="M17.3392 0.661053C17.0703 0.388898 16.7358 0.190694 16.3679 0.08559C16 -0.0195141 15.6113 -0.0279654 15.2392 0.0610527L3.2392 2.58855C2.54813 2.68333 1.89725 2.96916 1.35985 3.41386C0.82245 3.85856 0.419881 4.44447 0.197478 5.1056C-0.0249258 5.76673 -0.0583304 6.47683 0.101026 7.15592C0.260382 7.835 0.606169 8.45612 1.09945 8.9493L2.38795 10.2371C2.45768 10.3068 2.51299 10.3896 2.5507 10.4807C2.5884 10.5718 2.60777 10.6694 2.6077 10.7681V13.1441C2.60935 13.4781 2.68626 13.8075 2.8327 14.1078L2.8267 14.1131L2.8462 14.1326C3.06596 14.5744 3.42488 14.9317 3.8677 15.1496L3.8872 15.1691L3.89245 15.1631C4.19272 15.3095 4.52212 15.3864 4.8562 15.3881H7.2322C7.43098 15.3879 7.62171 15.4667 7.76245 15.6071L9.0502 16.8948C9.39559 17.244 9.80668 17.5214 10.2598 17.711C10.7129 17.9006 11.199 17.9987 11.6902 17.9996C12.0995 17.999 12.506 17.9322 12.8939 17.8016C13.549 17.5864 14.131 17.1926 14.5741 16.6643C15.0173 16.1361 15.304 15.4946 15.4019 14.8121L17.9332 2.7858C18.0268 2.41053 18.0213 2.01737 17.9172 1.64488C17.813 1.27238 17.6139 0.933355 17.3392 0.661053ZM3.44995 9.17805L2.1607 7.8903C1.86049 7.59732 1.65008 7.22479 1.55416 6.81642C1.45825 6.40805 1.48081 5.9808 1.6192 5.5848C1.75337 5.17855 2.0014 4.81937 2.33379 4.55C2.66619 4.28063 3.06896 4.11239 3.4942 4.0653L15.3749 1.56405L4.1062 12.8343V10.7681C4.10733 10.4728 4.04992 10.1803 3.93728 9.90734C3.82463 9.63443 3.659 9.38655 3.44995 9.17805ZM13.9282 14.5556C13.8706 14.9698 13.6987 15.3598 13.4318 15.6818C13.1648 16.0038 12.8134 16.245 12.417 16.3783C12.0206 16.5117 11.5949 16.5319 11.1876 16.4367C10.7804 16.3416 10.4077 16.1348 10.1114 15.8396L8.82145 14.5496C8.61322 14.3402 8.36555 14.1742 8.09276 14.0612C7.81997 13.9481 7.52748 13.8903 7.2322 13.8911H5.16595L16.4362 2.62455L13.9282 14.5556Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_230_1404">
                                    <rect width="18" height="18" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Upload media Modal */}
            <Modal
                className='chatpage-component-modal '
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Upload Media</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-3 px-md-5 py-3 py-md-5 my-3 my-md-0 '>

                    <div className='media-upload-container p-4 p-md-5 pt-4'>
                        {selectedFileErrorMsg && <p className='selected-media-file text-danger text-center'>{selectedFileErrorMsg}</p>}
                        <div {...getRootProps()}
                            className={`mb-4 drop-file-container text-center cup p-3 ${isDragActive && 'drag-active'} ${isFileSelected && 'pe-none opacity-50'}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleFileUploadClick();
                            }}>
                            <input {...getInputProps()} type="file" hidden id='upload-file' onChange={(e) => handleFileUploadChange(e, "fileUpload")} />
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14.4405 6.72852L14.3348 6.74216L12.7321 6.94676L10.7849 7.19228C9.59847 7.33123 8.49724 7.87836 7.66983 8.73998C6.84243 9.6016 6.34034 10.7241 6.24956 11.9152C5.54214 21.7678 5.54214 31.6585 6.24956 41.5111C6.33318 42.711 6.84319 43.8415 7.68746 44.6982C8.53172 45.555 9.65456 46.0816 10.8531 46.1828C19.9784 46.9467 28.3331 46.9467 37.455 46.1828C38.6535 46.0816 39.7764 45.555 40.6206 44.6982C41.4649 43.8415 41.9749 42.711 42.0585 41.5111C42.7658 31.6585 42.7658 21.7678 42.0585 11.9152C41.9679 10.7246 41.4663 9.60253 40.6396 8.74098C39.8128 7.87942 38.7124 7.33196 37.5266 7.19228L35.5828 6.94676L33.9801 6.74216L33.871 6.72852H14.4405Z" fill="#E7F1F3" />
                                    <path d="M15.6348 7.37585C15.6339 6.78835 15.7489 6.20644 15.9732 5.66345C16.1975 5.12046 16.5267 4.62705 16.942 4.21146C17.3572 3.79588 17.8504 3.46629 18.3932 3.24157C18.936 3.01685 19.5178 2.90141 20.1053 2.90186H28.2076C29.3947 2.90186 30.5331 3.3734 31.3724 4.21276C32.2118 5.05211 32.6833 6.19052 32.6833 7.37755C32.6833 8.56458 32.2118 9.70299 31.3724 10.5423C30.5331 11.3817 29.3947 11.8532 28.2076 11.8532H20.1087C19.5206 11.8537 18.9382 11.7382 18.3948 11.5133C17.8514 11.2885 17.3576 10.9587 16.9417 10.5428C16.5259 10.127 16.1961 9.63323 15.9713 9.0898C15.7464 8.54638 15.6343 7.96395 15.6348 7.37585Z" fill="#005C75" />
                                </svg>
                            </div>
                            <p className='my-2 drop-file-text'>
                                {isDragActive ? "Drop here..." : "Browse or Drag & Drop  up to 5 files"}
                            </p>
                            <p className='mb-0 drop-file-sub-text'>Formats : png, jpg, jpeg, gif, webp <br /> & Max file size : 25 MB</p>
                        </div>
                    </div>
                    {
                        isFileSelected === true &&
                        <div className='upload-progress-container mx-auto'>
                            <div className='d-flex align-items-center' >
                                <div className='upload-text-container' >
                                    <p className='mb-2 uploading-text'>Uploading {selectedFiles} {Number(selectedFiles) === 1 ? "file" : "files"}...</p>
                                    <p className='mb-0 in-progress-text'>{progressPercentage}% </p>
                                </div>
                            </div>

                            <div className="progress-bar-container">
                                <div
                                    className="progress"
                                    role="progressbar"
                                    aria-label="Basic example"
                                    aria-valuenow={progressPercentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </section>
    )
}

export default ChatPage