import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'ResuableFunctions/CustomHooks';
import { updateToast } from 'Views/Common/Slice/Common_slice';

const InterviewCandidatesAuth = () => {
    const { user_role, token } = useSelector((state) => state?.commonState);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user_role !== "interview_candidate" || !token) {
            dispatch(updateToast({ message: "Access Denied", type: "error" }))
        }
    }, [])

    return user_role === "interview_candidate" && token ? <Outlet /> : <Navigate to="/" />
}

export default InterviewCandidatesAuth