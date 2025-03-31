import React, { useEffect } from 'react'
import LoginForm from 'Components/Form/LoginForm'
import Img from 'Components/Img/Img'
import Image from 'Utils/Image'

const Login = () => {

  return (
    <div className="bg-light">
      <div className="row justify-content-center vh-100 align-items-center">
        <div className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 login-large-screen-width">
          <div className="card border border-light-subtle rounded-4 shadow-sm">
            <div className="card-body p-3 p-md-4 p-xl-5 py-5">
              <div className="text-center mb-3">
                <Img
                  src={Image.CompanyLogo}
                  alt="modelrocket-logo"
                  width="90rem"
                  height="60rem"
                />

                <p>Adra Product Studio</p>
              </div>

              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login