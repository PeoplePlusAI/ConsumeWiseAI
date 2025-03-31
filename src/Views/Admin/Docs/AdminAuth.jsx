import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useCustomNavigate } from 'ResuableFunctions/CustomHooks';
import { updateToast } from 'Views/Common/Slice/Common_slice';

const AdminAuth = () => {
    const { user_role, token, currentMenuName } = useSelector((state) => state?.commonState);
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();

    useEffect(() => {
        if (user_role !== "admin" || !token) {
            dispatch(updateToast({ message: "Access Denied", type: "error" }))
        }

        if (["dashboard"]?.includes(currentMenuName)) {
            console.log(currentMenuName)
            navigate("/dashboard/home")
        }
    }, [currentMenuName, user_role, token])

    return user_role === "admin" && token ? <Outlet /> : <Navigate to="/" />
}

export default AdminAuth