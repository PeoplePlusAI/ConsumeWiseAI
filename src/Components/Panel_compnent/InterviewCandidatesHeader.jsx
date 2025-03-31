import React from 'react'
import { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks';

import Img from 'Components/Img/Img'
import ButtonComponent from 'Components/Button/Button';
import Image from 'Utils/Image'
import Icons from 'Utils/Icons';
import { Card } from 'react-bootstrap';
// import { handleLogout } from '../../Redux/Actions/Common_actions/Common_action';

const InterviewCandidatesHeader = ({
  logoRedirect,
  showLogOut
}) => {
  const navigate = useCustomNavigate();
  const dispatch = useDispatch();

  return (
    <header>
      <Card className='shadow-sm border-0 h-100'>
        <Card.Body className='h-100'>
          <div className="container-fluid h-100 p-0">
            <div className='d-flex flex-wrap align-items-center h-100 px-2 px-sm-4 px-md-5'>
              <div className="col">
                <Img
                  src={Image?.CompanyLogo}
                  className="cursor-pointer"
                  width="60rem"
                  height="37rem"
                  clickFunction={logoRedirect ? ()=>navigate(logoRedirect) : null}
                />
              </div>

              {
                showLogOut ?
                  <div className="col d-inline-flex justify-content-end">
                    <ButtonComponent
                      type="button"
                      className="px-3 me-xl-2"
                      // clickFunction={() => dispatch(handleLogout())}
                      buttonName={
                        <span>
                          {Icons.logoutLocon}
                          <span className='ms-2 d-none d-sm-inline-block'>Logout</span>
                        </span>
                      }
                    />
                  </div>
                  :
                  null
              }
            </div>
          </div>
        </Card.Body>
      </Card>
    </header>
  )
}

export default InterviewCandidatesHeader