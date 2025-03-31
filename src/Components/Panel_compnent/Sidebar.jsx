import React from 'react'
import Img from 'Components/Img/Img';
import OffCanvas from 'Components/Offcanvas/OffCanvas';
import ButtonComponent from 'Components/Button/Button';
import { CiLogout } from "react-icons/ci";
import NavLinkComp from 'Components/Router_components/NavLink';

const Sidebar = ({
    menuOptions,
    responsiveOn,
    offCanvasShow,
    handleCanvasOpenOrClose,

    header,
    companyLogo,

    footer,
    footerClickFunction
}) => {

    const hanldeButton = (v) => {
        return <>
            <div className="col-3 pb-1 text-center">
                {v.icon}
            </div>
            <div className="col text-start">
                <p className='mb-0'>{v.name}</p>
            </div>
        </>
    }

    const headerFun = (width, height, image) => {
        return <Img
            src={image}
            alt='company logo'
            width={width}
            height={height}
        />
    }

    const bodyContent = () => {
        return menuOptions.map((v, i) => (
            <React.Fragment key={i}>
                <NavLinkComp
                    componentFrom="sidebar menus"
                    className='w-100 btn-dark d-flex flex-wrap align-items-center mb-2 navlink-sidebar rounded p-2 text-decoration-none text-secondary'
                    title={hanldeButton(v)}
                    to={v.route}
                />
            </React.Fragment>
        ))
    }

    const bodyFun = (ifOffcanvas) => {
        return ifOffcanvas ?
            <div className="row justify-content-center">
                <div className="col-11">
                    {bodyContent()}
                </div>
            </div>
            :
            bodyContent()
    }

    const footerContent = (type) => {
        return <div className="sidebar-footer">
            <div className={`row h-100 ${type === "offcanvas" ? "align-items-center" : "align-items-end"}`}>
                <ButtonComponent
                    componentFrom="sidebar menus"
                    className={`w-100 border-dark sign-out-button text-dark d-flex flex-wrap align-items-end mb-2 rounded p-2`}
                    title={"log"}
                    buttonName={hanldeButton({
                        icon: <CiLogout className='fs-4' />,
                        name: "Log out"
                    })}
                    clickFunction={footerClickFunction}
                />
            </div>
        </div>
    }

    const footerFun = (ifOffcanvas) => {
        return ifOffcanvas ?
            <div className="row justify-content-center">
                <div className="col-10 ">
                    {footerContent("offcanvas")}
                </div>
            </div>
            :
            footerContent("sidebar")
    }

    return (
        <>
            <div className={`sidebar d-none ${responsiveOn !== '' ? `d-${responsiveOn}-block` : 'd-block'}`}>
                <div className="container-fluid">
                    {/* header */}
                    {
                        header ?
                            <>
                                <div className="sidebar-header">
                                    <div className="row h-100 align-items-center justify-content-center">
                                        <div className="col text-center">
                                            {headerFun('80rem', '50rem', companyLogo)}
                                        </div>
                                    </div>
                                </div>
                                <hr className='' />
                            </>
                            :
                            null
                    }

                    {/* body */}
                    <div className={footer ? "sidebar-body-with-footer" : "sidebar-body-without-footer"}>
                        {bodyFun()}
                    </div>

                    {/* footer */}
                    {
                        footer ?
                            footerFun()
                            :
                            null
                    }
                </div>
            </div>

            <OffCanvas
                offCanvasShow={offCanvasShow}
                offcanvasPlacement="start"
                offcanvasClassname="rounded border-0"
                handleCanvasOpenOrClose={handleCanvasOpenOrClose}
                canvasHeader={headerFun('24%', '45px', companyLogo)}
                offcanvasHeaderClassname="sidebar-header ms-5"
                offcanvasHeaderTitleClassname="col-11"
                offcanvasBodyClassname={footer ? "sidebar-body-with-footer py-3" : "sidebar-body-without-footer"}
                canvasBody={bodyFun("offcanvas")}
            // canvasFooter={footerFun("offcanvas")}
            />
        </>
    )
}

export default Sidebar