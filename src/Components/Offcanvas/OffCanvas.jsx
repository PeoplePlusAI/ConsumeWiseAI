import React from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';

const OffCanvas = ({
    componentFrom,

    offcanvasClassname,
    offcanvasPlacement,
    offcanvasHeaderClassname,
    canvasHeader,
    offcanvasHeaderTitleClassname,

    offcanvasBodyClassname,
    canvasBody,

    offCanvasShow,
    handleCanvasOpenOrClose,
    offcanvasResponsive,

    canvasFooter
}) => {

    return (

        <Offcanvas
            show={offCanvasShow}
            onHide={handleCanvasOpenOrClose}
            responsive={offcanvasResponsive}
            backdrop="static"
            className={offcanvasClassname}
            placement={offcanvasPlacement}>

            <Offcanvas.Header
                closeButton
                className={offcanvasHeaderClassname}>
                <Offcanvas.Title className={offcanvasHeaderTitleClassname}>
                    {canvasHeader}
                </Offcanvas.Title>
            </Offcanvas.Header>


            <Offcanvas.Body className={offcanvasBodyClassname}>
                {canvasBody}
            </Offcanvas.Body>

            {canvasFooter}
        </Offcanvas>
    )
}

export default OffCanvas;


//how to use offcanvas EXAMPLE:

// const [offCanvasShow, setoffCanvasShow] = useState(false)
//   const handleCanvasOpenOrClose = () => setoffCanvasShow(!offCanvasShow)
//   const canvasBody = () => {
//     return (
//       <>
//         hii
//       </>
//     )
//   }

//   return (
//     <>
//       <ButtonComponent
//         type={"button"}
//         className={"btn"}
//         clickFunction={handleCanvasOpenOrClose}
//         title="Launch"
//         buttonName="Launch"
//       />

//       <OffCanvas
//         offCanvasShow={offCanvasShow}

//         offcanvasClassname={"rounded-end-4 border-0"}
//         // offcanvasResponsive={"lg"}

//         handleCanvasOpenOrClose={handleCanvasOpenOrClose}
//         canvasBody={canvasBody()}
//       />
//     </>
//   );