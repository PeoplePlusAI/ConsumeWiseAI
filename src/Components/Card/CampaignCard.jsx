import React from 'react';
import Card from 'react-bootstrap/Card';


const CampaignCard = ({
    componentFrom,
    cardClassName,
    cardTitleClassName,
    cardTitle,
    cardBodyClassName,
    cardTextClassName,
    cardBody,
    clickFunction
}) => {

    return (
        <Card className={cardClassName} >
            <Card.Body className={cardBodyClassName}>
                <Card.Title className={cardTitleClassName}>
                    {cardTitle}
                </Card.Title>

                <div className={`${cardTextClassName} cursor-pointer`} onClick={clickFunction}>
                    {cardBody}
                </div>
            </Card.Body>
        </Card>
    )
}

export default CampaignCard