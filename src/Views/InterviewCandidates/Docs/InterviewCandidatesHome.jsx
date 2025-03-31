import React, { Fragment, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CalculateTestTime } from 'ResuableFunctions/CalculateTestTime';
import { initializeDB, useDispatch } from 'ResuableFunctions/CustomHooks';
import { handleCloseTestAutomatic, handleCloseTestManual, handleGetQuestions, handleUpdateAnswer } from 'Views/InterviewCandidates/Action/interviewAction';
import { getQuestionFromDb, updateRemainingTestTiming, updateSelectedQuestionIndex } from 'Views/InterviewCandidates/Slice/interviewSlice';
import ProgressBarComp from 'Components/Progress/ProgressBar';
import ButtonComponent from 'Components/Button/Button';
import Checkbox from 'Components/Input/Checkbox';
import InterviewCandidatesHeader from 'Components/Panel_compnent/InterviewCandidatesHeader'
import Icons from 'Utils/Icons';

const InterviewCandidatesHome = () => {
    const { interviewState } = useSelector((state) => state);
    // const { interviewRound } = JsonData()?.jsonOnly;
    const dispatch = useDispatch()

    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
            alert("Tab switch is not allowed during the session!");
        }
    };

    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        initializeDB(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME, process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION, process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME)
            .then((db) => {
                const transaction = db.transaction(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME, "readonly");
                const store = transaction.objectStore(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME);

                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = function () {
                    dispatch(getQuestionFromDb(getAllRequest.result))
                };
                getAllRequest.onerror = function (event) {
                    console.error("Error fetching data from object store:", event.target.error);
                };
            })
            .catch((error) => {
                console.error("Database initialization failed:", error);
            });
    }, []);

    useEffect(() => {
        if (!interviewState?.isDataPresentInIndexedDb) {
            dispatch(handleGetQuestions)
        }
    }, [interviewState?.isDataPresentInIndexedDb])

    useEffect(() => {
        if (interviewState?.test_end_timeStamp) {
            const timer = setInterval(() => {
                const updatedTimeLeft = CalculateTestTime(interviewState?.test_end_timeStamp);
                dispatch(updateRemainingTestTiming(updatedTimeLeft))

                if (!updatedTimeLeft) {
                    initializeDB(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME, process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION, process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME)
                        .then((db) => {
                            const transaction = db.transaction(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME, "readonly");
                            const store = transaction.objectStore(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME);
                            const getAllRequest = store.getAll();
                            getAllRequest.onsuccess = function () {
                                dispatch(handleCloseTestAutomatic(getAllRequest.result));
                            };
                            getAllRequest.onerror = function (event) {
                                console.error("Error fetching data from object store:", event.target.error);
                            };
                        })
                        .catch((error) => {
                            console.error("Database initialization failed:", error);
                        });
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [interviewState?.test_end_timeStamp])

    return (
        <div className='overflow-hidden'>
            <InterviewCandidatesHeader />

            <section className='main'>
                <div className="h-100 d-flex flex-wrap p-5">
                    <div className="col-3 d-flex flex-column">
                        <Card className='h-100 border-0 shadow-sm rounded-3'>
                            <Card.Header>
                                <h5 className='mb-0 py-2'>Number of Questions</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="col-12 d-flex flex-wrap">
                                    {interviewState?.generatedQuestions?.map((question, questionInd) => (
                                        <div className="col-2 my-2" key={questionInd}>
                                            <ButtonComponent
                                                className={`question_number_btn p-1 ${question?.candidate_answer ? "questions_answerd" : questionInd === interviewState?.selectedQuestionIndex ? "active" : ""}`}
                                                buttonName={questionInd + 1}
                                                clickFunction={() => dispatch(updateSelectedQuestionIndex(questionInd))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-9 px-2">
                        <Card className='h-100 border-0 shadow-sm rounded-3'>
                            <Card.Header>
                                <h5 className='mb-0 py-2'>Questions</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className='mb-4'>
                                    <ProgressBarComp progressNow={interviewState?.answeredQuestionPercentage} animated={false} className="question-progress-bar" />
                                </div>
                                <div className="w-100 d-flex flex-wrap mb-3">
                                    <div className="col">
                                        <h5>
                                            <strong>Question No:</strong>
                                            <span>{interviewState?.selectedQuestionIndex + 1}</span>
                                        </h5>
                                    </div>
                                    <div className="col text-end me-3">
                                        {
                                            interviewState?.calculate_remaining_time ?
                                                <Fragment>
                                                    <span className='pe-2'>
                                                        {Icons?.timerIcon}
                                                    </span>

                                                    <span className='text-secondary pt-2'>
                                                        {interviewState?.calculate_remaining_time?.minutes} : {interviewState?.calculate_remaining_time?.seconds}
                                                    </span>
                                                </Fragment>
                                                :
                                                null
                                        }
                                    </div>
                                </div>

                                <p>{interviewState?.generatedQuestions[interviewState?.selectedQuestionIndex]?.question}</p>
                                <div className='w-100'>
                                    {interviewState?.generatedQuestions[interviewState?.selectedQuestionIndex]?.options?.map((val, ind) => (
                                        <div className='border p-3 my-2 rounded-2 cursor-pointer' onClick={() => document.getElementById(val + ind)?.click()}>
                                            <Checkbox
                                                formType="radio"
                                                formLabel={val}
                                                name={val}
                                                formClassName="ps-4 test_radio_btn"
                                                formId={val + ind}
                                                formName={"options"}
                                                change={() => dispatch(handleUpdateAnswer({ questionsArray: interviewState?.generatedQuestions, updationInd: interviewState?.selectedQuestionIndex, ans: val }))}
                                                formChecked={interviewState?.generatedQuestions[interviewState?.selectedQuestionIndex]?.candidate_answer === val}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                            <Card.Footer className='py-4 bg-transparent border-0 d-flex flex-wrap'>
                                <div className="col">
                                    <ButtonComponent
                                        className="btn-secondary px-5"
                                        buttonName="Previous"
                                        clickFunction={() => dispatch(updateSelectedQuestionIndex(interviewState?.selectedQuestionIndex - 1))}
                                        btnDisable={interviewState?.selectedQuestionIndex === 0}
                                    />
                                </div>
                                <div className="col text-end">
                                    <ButtonComponent
                                        className="btn-secondary px-5"
                                        buttonName={interviewState?.generatedQuestions?.length - 1 <= interviewState?.selectedQuestionIndex ? "Submit" : "Next"}
                                        clickFunction={interviewState?.generatedQuestions?.length - 1 <= interviewState?.selectedQuestionIndex ?
                                            () => dispatch(handleCloseTestManual)
                                            :
                                            () => dispatch(updateSelectedQuestionIndex(interviewState?.selectedQuestionIndex + 1))
                                        }
                                    />
                                </div>
                            </Card.Footer>
                        </Card>
                    </div>

                    {/* <div className="col-2 d-flex flex-column">
                        <Card className='h-100 border-0 shadow-sm rounded-3'>
                            <Card.Header>
                                <h5 className='mb-0 py-2'>Rounds</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="col-12">
                                    {interviewRound?.map((round, roundInd) => (
                                        <div className="d-flex align-items-center px-2 w-100 mb-5 rounds_icon_line_relative" key={roundInd}>
                                            <div className="me-5">
                                                {Icons?.interviewRoundNonActiveIcon}
                                            </div>
                                            <div className={`col ${interviewRound?.length - 1 <= roundInd ? "rounds_icon_line_last" : "rounds_icon_line"}`}>{round}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </div> */}
                </div>
            </section>
        </div>
    )
}

export default InterviewCandidatesHome