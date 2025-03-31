import ButtonComponent from "Components/Button/Button";
import { useCustomNavigate, useDispatch } from "ResuableFunctions/CustomHooks";
import ModalComponent from "Components/Modal/Modal";
import SpinnerComponent from "Components/Spinner/Spinner";
import { useSelector } from "react-redux";
import JsonData from "Utils/JsonData";
import Icons from "Utils/Icons";
import { resetModalBox, updateModalShow } from "Views/Common/Slice/Common_slice";
import { handleCloseTestAndNavigate, handleCloseTestEndpoint } from "Views/InterviewCandidates/Action/interviewAction";
import Img from "Components/Img/Img";
import Image from "Utils/Image";

export function OverallModel() {
    const { commonState, interviewState } = useSelector((state) => state);
    const dispatch = useDispatch();
    const JsonJsx = JsonData()?.jsxJson;
    const navigate = useCustomNavigate();

    function modalHeaderFun() {
        switch (commonState?.modal_from) {
            case "interview_candidate":
                switch (commonState?.modal_type) {
                    case "test_completed":   
                        // return <h6 className='mb-0'>Test completed</h6>;
                        return

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    function dynamicInput() {
        let funBy = null

        // if (servicesState?.modal_from === "Load") {
        //     if (["Edit", "Create"].includes(servicesState?.modal_type)) {
        //         funBy = JsonJsx?.loadAddEditInputs
        //     } else {
        //         let restrictDate = JsonJsx?.loadFilterInputs?.filter((v) => v?.name !== "From Date" && v?.name !== "To Date")

        //         if (window.location.pathname === "/dashboard/analytics" || window.location.pathname === "/dashboard/analytics/") {
        //             funBy = JsonJsx?.loadFilterInputs
        //         } else {
        //             funBy = restrictDate
        //         }
        //     }
        // }

        // if (servicesState?.modal_from === "Truck") {
        //     if (["Edit", "Create"].includes(servicesState?.modal_type)) {
        //         funBy = JsonJsx?.truckAddEditInputs
        //     } else {
        //         let restrictDate = JsonJsx?.truckFilterInputs?.filter((v) => v.name !== "From Date" && v.name !== "To Date")
        //         if (window.location.pathname === "/dashboard/analytics" || window.location.pathname === "/dashboard/analytics/") {
        //             funBy = JsonJsx?.truckFilterInputs
        //         } else {
        //             funBy = restrictDate
        //         }
        //     }
        // }

        // if (servicesState?.modal_from === "Driver") {
        //     if (["Edit", "Create"].includes(servicesState?.modal_type)) {
        //         funBy = JsonJsx?.driverAddEditInputs
        //     } else {
        //         let restrictDate = JsonJsx?.driverFilterInputs?.filter((v) => v.name !== "From Date" && v.name !== "To Date")
        //         if (window.location.pathname === "/dashboard/analytics" || window.location.pathname === "/dashboard/analytics/") {
        //             funBy = JsonJsx?.driverFilterInputs
        //         } else {
        //             funBy = restrictDate
        //         }
        //     }
        // }

        // if (servicesState?.modal_from === "BuyAndSell") {
        //     if (["Edit", "Create"].includes(servicesState?.modal_type)) {
        //         funBy = JsonJsx?.buyAndSellAddEdit
        //     } else {
        //         let restrictDate = JsonJsx?.buyAndSellFilterInputs?.filter((v) => v.name !== "From Date" && v.name !== "To Date" && v.name !== "State list")
        //         if (window.location.pathname === "/dashboard/analytics" || window.location.pathname === "/dashboard/analytics/") {
        //             funBy = JsonJsx?.buyAndSellFilterInputs
        //         } else {
        //             funBy = restrictDate
        //         }
        //     }
        // }

        // if (servicesState?.modal_from === "Blog") {
        //     funBy = JsonJsx?.blogInputs
        // }

        // if (servicesState?.modal_from === "Feedback") {
        //     if (["", "not solved"].includes(servicesState?.modal_type)) {
        //         const removeSolvedDate = JsonJsx?.feebbackUpdateOrWatchStatus?.filter((v) => v?.name !== "solved_date")
        //         funBy = removeSolvedDate
        //     } else {
        //         funBy = JsonJsx?.feebbackUpdateOrWatchStatus
        //     }
        // }

        // if (servicesState?.modal_from === "Overall") {
        //     funBy = JsonJsx?.analyticsOverallLineChartFilter
        // }

        // if (servicesState?.modal_from === "CRM") {
        //     if (servicesState?.modal_type === "Edit") {
        //         funBy = JsonJsx?.crmStatusModal
        //     } else {
        //         funBy = JsonJsx?.crmStatusBeforeSaleEntryModal
        //     }
        // }

    }

    function modalBodyFun() {
        switch (commonState?.modal_from) {
            case "interview_candidate":
                switch (commonState?.modal_type) {
                    case "registration_completed":
                        return <div className="w-100">
                            <div className="row py-5 align-items-center justify-content-center h-100 w-100">
                                <div className="col-12 text-center">
                                    {Icons.testSucccess}
                                    <h5 className="text-center my-3">Registration successfull</h5>
                                    <p className="text-secondary">Your Login credentials</p>

                                    <div className="py-3 border rounded-4">
                                        <h5 className="text-center my-3 fs-17">Username : <span>{commonState?.usernamee}</span></h5>
                                        <h5 className="text-center my-3 fs-17">Password : <span>{commonState?.passwordd}</span></h5>

                                        <ButtonComponent
                                            buttonName="Click to login"
                                            className="btn-outline-secondary px-5"
                                            clickFunction={() => {
                                                dispatch(resetModalBox())
                                                navigate("/")
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    case "test_completed":
                        return <div className="w-100 interview_candidate_height">
                            <div className="row py-5 align-items-center justify-content-center h-100 w-100">
                                <div className="col-6 text-center">
                                    <Img
                                        src={Image?.CompanyLogo}
                                        className="cursor-pointer"
                                        width="100rem"
                                        height="67rem"
                                    />

                                    <h5 className="text-center my-3">Test completed</h5>
                                    <p className="text-secondary">Thank you for your commitment, and best of luck with your next steps!....</p>
                                    <ButtonComponent
                                        buttonName="Close"
                                        className="btn-outline-secondary px-5"
                                        clickFunction={() => dispatch(handleCloseTestAndNavigate)}
                                    />
                                </div>
                            </div>
                        </div>

                    case "time_finished":
                        return <div className="w-100 interview_candidate_height">
                            <div className="row py-5 align-items-center justify-content-center h-100 w-100">
                                <div className="col-6 text-center">
                                    <h5 className="text-center my-3">Time up</h5>
                                    <p className="text-secondary">Submitting your response....</p>
                                    <SpinnerComponent />
                                </div>
                            </div>
                        </div>

                    case "submit_confirmation":
                        return <div className="w-100 submit_confirmation_height">
                            <div className="row py-5 align-items-center justify-content-center h-100 w-100">
                                <div className="col-6 text-center">
                                    {Icons?.closeTestIcon}
                                    <h5 className="text-center my-3">Are you sure do you want to submit the test</h5>
                                </div>
                            </div>
                        </div>

                    default:
                        break;
                }
        }
    }

    function modalFooterFun() {
        switch (commonState?.modal_from) {
            case "interview_candidate":
                switch (commonState?.modal_type) {
                    case "submit_confirmation":
                        return <div className='col-12 d-flex flex-wrap px-2'>
                            <div className="col-6 p-1 pb-0">
                                <ButtonComponent
                                    className="btn-secondary w-100 py-2"
                                    buttonName="Close"
                                    clickFunction={() => dispatch(updateModalShow())}
                                    btnDisable={interviewState?.submit_test}
                                />
                            </div>
                            <div className="col-6 p-1 pb-0">
                                <ButtonComponent
                                    buttonName={
                                        interviewState?.submit_test ?
                                            <SpinnerComponent />
                                            :
                                            "Submit test"
                                    }
                                    className="btn-outline-secondary w-100"
                                    clickFunction={() => dispatch(handleCloseTestEndpoint(interviewState?.generatedQuestions))}
                                />
                            </div>
                        </div>

                    default:
                        break;
                }

            default:
                break;
        }
    }

    return (
        <ModalComponent
            show={commonState?.modalShow}
            modalSize={commonState?.moalSize}
            modalCentered={true}
            modalCloseButton={commonState?.modal_close_btn}
            showModalHeader={true}
            modalHeaderClassname="border-0"
            modalHeader={modalHeaderFun()}
            modalBodyClassname="py-2"
            modalBody={<div className='d-flex flex-wrap p-3 py-0'>{modalBodyFun()}</div>}
            showModalFooter={true}
            modalFooterClassname="border-0"
            modalFooter={modalFooterFun()}
            modalClassname={["lg", "xl"].includes(commonState?.moalSize) ? "model_height_lg" : ''}
        />
    )
}