import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useSelector } from 'react-redux';
import InputGroup from 'Components/Input/InputGroup';
import ButtonComponent from 'Components/Button/Button';
import { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks';
import SpinnerComponent from 'Components/Spinner/Spinner';
import { handleEyeFunction, handleLogin, handleLoginCredentials, handleValidation } from 'Views/Common/Action/Common_action';
import sha256 from 'sha256';

const LoginForm = () => {
    const { usernamee, passwordd, eyeOpen, buttonSpinner, validated } = useSelector((state) => state.commonState);
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();

    const handlSubmitOnEnter = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (usernamee && passwordd) {
            let username = usernamee
            let password = passwordd
            
            const basicAuth = btoa(`${username}:${sha256(password)}`);
            dispatch(handleLogin(basicAuth, navigate))
        } else {
            dispatch(handleValidation)
        }
    };

    return (
        <Form noValidate validated={validated} className='pb-3'>
            <Row className="mb-3">
                <InputGroup
                    controlId="validationLoginUsername"
                    gropuClassName="col-12 py-2 text-secondary mb-2"
                    inputHeading="Username"
                    inputType="text"
                    placeholder="Username"
                    inputError="Username required"
                    change={(e) => dispatch(handleLoginCredentials({ username: e.target.value }))}
                    value={usernamee}
                />

                <InputGroup
                    controlId="validationLoginPassword"
                    gropuClassName="col-12 py-2 text-secondary"
                    inputHeading="Password"
                    inputType="password"
                    placeholder="Password"
                    inputError="Password required"
                    value={passwordd}
                    eyeState={!eyeOpen}
                    change={(e) => dispatch(handleLoginCredentials({ password: e.target.value }))}
                    eyeFunctionClick={() => dispatch(handleEyeFunction())}
                    keyDown={handlSubmitOnEnter}
                />
            </Row>

            <ButtonComponent
                type="button"
                className="btn-md btn-dark w-100"
                clickFunction={handleSubmit}
                title="Login"
                buttonName={buttonSpinner ?
                    <SpinnerComponent />
                    :
                    "Login"
                }
                btnDisable={buttonSpinner}
            />
        </Form>
    )
}

export default LoginForm