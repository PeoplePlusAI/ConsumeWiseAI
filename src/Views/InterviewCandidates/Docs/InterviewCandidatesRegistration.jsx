import InterviewCandidatesHeader from 'Components/Panel_compnent/InterviewCandidatesHeader'
import React from 'react'
import { Card } from 'react-bootstrap'
import ButtonComponent from "Components/Button/Button";
import { useDispatch } from 'ResuableFunctions/CustomHooks';
import JsonData from 'Utils/JsonData';
import { Inputfunctions } from 'ResuableFunctions/Inputfunctions';
import { useSelector } from 'react-redux';
import { handleRegisterCandidate } from '../Action/interviewAction';
import SpinnerComponent from 'Components/Spinner/Spinner';

const InterviewCandidatesRegistration = () => {
    const { interviewState } = useSelector((state) => state)
    const { candidateRegistration } = JsonData()?.jsxJson;
    const dispatch = useDispatch()

    return (
        <div className='overflow-hidden'>
            <InterviewCandidatesHeader />

            <section className='main'>
                <div className="h-100 d-flex flex-wrap align-items-center justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <Card className='w-100'>
                            <Card.Header className='py-3'>
                                <h5 className='mb-0'>Candidate Registration</h5>
                            </Card.Header>
                            <Card.Body className='py-3 registration-form-height d-flex flex-wrap'>
                                {Inputfunctions(candidateRegistration)}
                            </Card.Body>
                        </Card>

                        <div className='d-flex justify-content-end bg-transparent border-0 mt-3'>
                            <ButtonComponent
                                type="button"
                                className="btn btn-dark w-25"
                                buttonName={interviewState?.buttonSpinner ?
                                    <SpinnerComponent />
                                    :
                                    "Continue"
                                }
                                clickFunction={() => dispatch(handleRegisterCandidate(interviewState))}
                                btnDisable={interviewState?.buttonSpinner}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div >
    )
}

export default InterviewCandidatesRegistration