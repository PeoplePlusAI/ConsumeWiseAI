import React from 'react'; 
import Form from 'react-bootstrap/Form';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const InputGroup = ({
    componentFrom,
    initialGlow,
    inputType,
    labelClassName,
    inputControlId,
    className,
    change,
    gropuClassName,
    placeholder,
    value,
    inputHeading,
    inputError,
    inputSuccess,
    eyeState,
    eyeFunctionClick,
    inputId,
    inputAccept,
    inputHidden,
    inputPattern,
    keyDown,
    disableRequiredStar,
    btnDisable,
    readOnly,
    required
}) => {

    return (
        <Form.Group className={
            inputType === "password" ?
                `position-relative ${gropuClassName ? gropuClassName : ''}`
                :
                gropuClassName
        } controlId={inputControlId}>
            <Form.Label className={`${labelClassName} `}>
                {inputHeading}
                {
                    disableRequiredStar ?
                        null
                        :
                        <span className='text-danger'>*</span>
                }
            </Form.Label>
            <Form.Control
                required={required}
                className={className}
                type={
                    inputType === "password" ?
                        eyeState ? "password" : "text"
                        :
                        inputType
                }
                placeholder={placeholder}
                value={value}
                name={inputHeading}
                onChange={change}
                onKeyDown={keyDown}
                id={inputId}
                accept={inputAccept}
                hidden={inputHidden}
                pattern={inputPattern}
                readOnly={readOnly}
                disabled={!initialGlow ? btnDisable : null}
            />
            <Form.Control.Feedback type="valid">
                {inputSuccess}
            </Form.Control.Feedback>

            <Form.Control.Feedback type="invalid">
                {inputError}
            </Form.Control.Feedback>
            {
                inputType === "password" ?
                    eyeState ?
                        <IoEyeOffOutline className='fs-4 eye-absolute cursor-pointer' onClick={eyeFunctionClick} />
                        :
                        <IoEyeOutline className='fs-4 eye-absolute cursor-pointer' onClick={eyeFunctionClick} />
                    :
                    null
            }
        </Form.Group>
    );
}

export default InputGroup;
