import React, { useEffect, useState } from 'react'
import Image from 'Utils/Image'
import Img from 'Components/Img/Img'
import HeaderCard from 'Components/Card/HeaderCard'
import './Stylesheet/Css/Home.css'
import ButtonComponent from 'Components/Button/Button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import { BsInfoSquareFill } from "react-icons/bs";



const Home = () => {

    const navigate = useNavigate();

    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const isFirstVisit = sessionStorage.getItem("isConsumeWiseFirstVisit");
        if (!isFirstVisit) {
            setModalShow(true);
            sessionStorage.setItem("isConsumeWiseFirstVisit", "true"); 
        }
    }, []);

    const handleNavigation = () => {
        navigate('/chat', { state: { buttonClickedFromHome: 'upload-image-button' } });
    };

    return (
        <>
            <Img
                className="body-top-bg-image d-none d-lg-block"
                src={Image.bodyTopImage}
                alt="body-top-bg-image"
            />

            <Img
                className="body-bottom-bg-image d-none d-lg-block"
                src={Image.bodyBottomImage}
                alt="body-bottom-bg-image"
            />

            <HeaderCard
                cardClassName='border-0 header-card'
                cardTitleClassName="justify-content-start mb-0"
                cardContent={<div className='d-flex justify-content-between align-items-center'>
                    <div onClick={() => navigate("/")}>
                        <Img
                            src={Image.CompanyLogo}
                            className="cup"
                            alt="peoplePlusAI-logo"
                        />
                    </div>
                    <div className='cup gap-2' onClick={() => setModalShow(true)}>
                        <BsInfoSquareFill size={45} style={{ color: '#005C75' }} />
                    </div>
                </div>}
            />


            <div className='text-center'>
                <Img
                    src={Image.consumerWise}
                    alt="peoplePlusAI-logo"
                    className="peoplePlusAI-logo"
                />
            </div>



            <div className='homepage-main-text text-center'>
                <p className='mb-0 px-3 px-md-5'>Upgrade your <span className='special-text'>Product Search</span> experience with smart <br />tools that do the work for you!</p>
            </div>

            <div className="d-flex flex-wrap justify-content-center w-100 homepage-button-container">
                <div onClick={() => navigate("/chat")}>
                    <ButtonComponent
                        className={'homepage-button'}
                        buttonName={<>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                <path d="M12.0212 21.1616C17.1028 21.1616 21.2222 17.0422 21.2222 11.9607C21.2222 6.87916 17.1028 2.75977 12.0212 2.75977C6.9397 2.75977 2.82031 6.87916 2.82031 11.9607C2.82031 17.0422 6.9397 21.1616 12.0212 21.1616Z" stroke="white" strokeWidth="1.75256" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20.1289 21.8676C20.6708 23.5033 21.9078 23.6669 22.8585 22.2356C23.7275 20.927 23.155 19.8536 21.5806 19.8536C20.4152 19.8434 19.7609 20.7532 20.1289 21.8676Z" stroke="white" strokeWidth="1.75256" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Search for products</>}
                    />
                </div>

                <ButtonComponent
                    className={'homepage-button'}
                    buttonName={<>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                            <path d="M6.72153 20.1394C4.30168 20.1394 2.33984 18.2011 2.33984 15.8099C2.33984 13.4187 4.30168 11.4793 6.72153 11.4793C7.01255 11.48 7.29539 11.5073 7.57006 11.5611M7.57006 11.5611C7.33042 10.9195 7.20784 10.2402 7.20815 9.55529C7.20815 6.36666 9.82326 3.78223 13.0497 3.78223C16.0553 3.78223 18.5304 6.02521 18.8565 8.90918M7.57006 11.5611C8.13563 11.6712 8.67404 11.8914 9.15466 12.2092M14.9972 8.92145C15.6235 8.70396 16.2818 8.59303 16.9448 8.59329C17.6134 8.59329 18.2564 8.70472 18.8565 8.90918M18.8565 8.90918C21.1424 9.69126 22.7863 11.8392 22.7863 14.3664C22.7863 17.1338 20.8163 19.4473 18.1859 20.0096" stroke="white" strokeWidth="1.75256" strokeLinecap="round" />
                            <path d="M12.5622 17.0723V23.2062M12.5622 17.0723L14.6069 19.1169M12.5622 17.0723L10.5176 19.1169" stroke="white" strokeWidth="1.75256" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Upload images/screenshots</>}
                    clickFunction={handleNavigation}
                />

            </div>

            <div className='disclaimer-container mx-auto '>
                <p className='mb-0 disclaimer-text'>Disclaimer</p>
                <ul>
                    <li>The solution provided herein is a prototype in the research phase, intended for informational and testing purposes only. We make no warranties, express or implied, regarding the completeness, accuracy, reliability, suitability, or availability of the prototype or the information it provides. Any reliance you place on such information is strictly at your own risk.</li>
                    <li>The information provided through this prototype may include data from third parties, which have not been independently verified. The inclusion of such information does not imply endorsement or accuracy. All statements are intended as fair commentary based on data available in the public domain at the time of research and are not intended to harm, disadvantage, or negatively impact any individual, organization, or product.</li>
                    <li>This prototype is developed as part of a fellowship program offered by EkStep Foundation through its People+ai initiative. EkStep Foundation disclaims all liability for any loss or damage arising from the use of this prototype. By using this prototype, you acknowledge and agree to these terms and release us from any and all related liability.</li>
                    <li>For queries, please contact us at <span ><a className="disclaimer-link-text" href="mailto:sonika@peopleplus.ai" target='_blank' >sonika@peopleplus.ai</a></span></li>
                </ul>
            </div>

            {/* Instructions Modal */}

            <Modal
                className='instruction-modal'
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >

                <Modal.Body >
                    <h2 className='my-3 mb-4 text-center ' style={{ color: '#005C75' }}>Welcome to ConsumeWise! </h2>

                    <p className='px-3 mb-4' style={{ fontWeight: '450', fontSize: '16px' }}>
                        ConsumeWise is your personal AI-powered assistant for evaluating consumer products instantly - just upload an image or search by name, and receive clear analyses on nutrition, ingredients, health risks, and claims accuracy.
                    </p>
                    <div>
                        <h5 className='px-3 mb-3'>How to Use ConsumeWise</h5>
                        <div className='px-3 px-md-4' style={{ color: '#666', fontSize: '15px' }}>
                            <p>Choose How You Search
                                Click "Search for products" to enter product names manually.
                                Or select "Upload images/screenshots" to analyze directly from images.
                                Upload Product Images</p>
                            <p>Browse or drag-and-drop images/screenshots (up to 5 files).
                                Wait for the quick AI analysis.
                                Review the AI Analysis</p>
                            <p>Get insights on product health, ingredients, nutrition, and potential risks.
                                Easily spot misleading claims or unhealthy ingredients.</p>
                            <p>Explore Suggested Products
                                View previously analyzed products or choose new ones from suggested options.</p>
                        </div>
                    </div>
                    <div className="mx-3">
                        <button className="btn close-button w-100 my-3 px-5" onClick={() => setModalShow(false)}>Close</button>
                    </div>
                </Modal.Body>

            </Modal>



        </>

    )
}

export default Home
