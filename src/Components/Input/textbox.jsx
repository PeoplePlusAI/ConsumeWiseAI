import React from 'react'
import { Form } from 'react-bootstrap'

const Textbox = ({
    componentFrom,
    className,
    controlId,
    label,
    labelClassName,
    mandatory,
    rows,
    cols,
    change,
    value,
    disabled
}) => {

    return (
        <Form.Group className={`${className ? className : ''}`} controlId={controlId}>
            <Form.Label className={labelClassName}>
                {label}
                {
                    mandatory ?
                        <span className='text-danger ms-1'>*</span>
                        :
                        null
                }
            </Form.Label>
            <Form.Control as="textarea" rows={rows} cols={cols} onChange={change} value={value} disabled={disabled}/>
        </Form.Group>
    )
}

export default Textbox