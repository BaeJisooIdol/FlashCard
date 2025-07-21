import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <Card className={`text-white bg-${color} mb-4 shadow`}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-uppercase mb-1">{title}</h6>
                        <h2 className="m-0">{value}</h2>
                    </div>
                    <div className="text-white opacity-75" style={{ fontSize: '2rem' }}>
                        {icon}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StatCard; 