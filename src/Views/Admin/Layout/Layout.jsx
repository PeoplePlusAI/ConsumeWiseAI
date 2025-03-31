import React from 'react';
import Header from 'Components/Panel_compnent/Header';
import Sidebar from 'Components/Panel_compnent/Sidebar'
import Images from 'Utils/Image';
import { Outlet } from 'react-router-dom';
import JsonData from 'Utils/JsonData';
import { useSelector } from 'react-redux';
import { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks';
import { handleUpdateCanvasShow } from 'Views/Common/Action/Common_action';

const Layout = () => {
    const { commonState } = useSelector((state) => state);
    const { adminSidebarMenus } = JsonData()?.jsonOnly;
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();

    return (
        <div className="d-flex flex-wrap main_rendering_contents_height">
            {/* sidebar  */}
            <Sidebar
                responsiveOn={"xl"}
                offCanvasShow={commonState?.innerWidth <= 1199 ? commonState?.canvasShow : false}
                handleCanvasOpenOrClose={() => dispatch(handleUpdateCanvasShow)}
                menuOptions={adminSidebarMenus}
                header={true}
                companyLogo={Images.CompanyLogo}
            />

            <div className="col">
                <main className="w-100">
                    {/* header  */}
                    <header className='d-flex align-items-center'>
                        <div className="container-fluid">
                            <Header
                                offcanvasOn={"xl"}
                                offcanvasOnButton={() => dispatch(handleUpdateCanvasShow)}
                                dispatch={dispatch}
                                navigate={navigate}
                            />
                        </div>
                    </header>

                    {/* main content */}
                    <div className="main">
                        <div className="container-fluid">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout