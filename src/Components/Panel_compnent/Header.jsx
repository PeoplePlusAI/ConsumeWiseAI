import React, { Fragment } from 'react';
import ButtonComponent from 'Components/Button/Button';
import HeaderCard from 'Components/Card/HeaderCard';
import Icons from 'Utils/Icons';

const Header = ({
  offcanvasOn,
  offcanvasOnButton,
  dispatch,
  navigate
}) => {


  const headerContentFunc = () => {
    return <Fragment>
      <div className="col-sm-8 d-flex flex-wrap align-items-center justify-content-end">
        <div className="header-icon-tag-width">
          <ButtonComponent
            type="button"
            clickFunction={offcanvasOnButton}
            className={'header-icon-width'}
            buttonName={Icons?.notificationIcon}
          />
        </div>

        <div className="header-icon-tag-width">
          <ButtonComponent
            type="button"
            clickFunction={offcanvasOnButton}
            className={'header-icon-width'}
            buttonName={Icons?.profileDefautUserIcon}
          />
        </div>

        {
          offcanvasOn ?
            <div className={`d-inline-block header-icon-tag-width ${offcanvasOn !== '' ? `d-${offcanvasOn}-none` : 'd-none'}`}>
              <ButtonComponent
                type="button"
                clickFunction={offcanvasOnButton}
                buttonName={Icons?.profileDefautUserIcon}
              />
            </div>
            :
            null
        }
      </div>
    </Fragment>
  }

  return (
    <HeaderCard
      cardClassName='w-100 border-0 header-card'
      cardTitleClassName="row justify-content-end mb-0"
      cardContent={headerContentFunc()}
    />
  )
}

export default Header