import React, { useEffect, useState } from 'react';

function Cards() {
  const [animatedValues, setAnimatedValues] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    revenue: 0,
  });

  const cardData = [
    {
      title: 'Total Patients',
      value: 1250,
      icon: '👥',
      gradient: 'linear-gradient(135deg, #1a5f7a 0%, #2c7a9e 100%)',
    },
    {
      title: 'Total Doctors',
      value: 45,
      icon: '👨‍⚕️',
      gradient: 'linear-gradient(135deg, #4a7c59 0%, #5a8a6f 100%)',
    },
    {
      title: 'Appointments',
      value: 320,
      icon: '📅',
      gradient: 'linear-gradient(135deg, #5a8a9f 0%, #6ba0b5 100%)',
    },
    {
      title: 'Revenue',
      value: 125000,
      icon: '💰',
      gradient: 'linear-gradient(135deg, #d97757 0%, #e68a6f 100%)',
      isCurrency: true,
    },
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedValues({
        patients: Math.floor(1250 * easeOut),
        doctors: Math.floor(45 * easeOut),
        appointments: Math.floor(320 * easeOut),
        revenue: Math.floor(125000 * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          patients: 1250,
          doctors: 45,
          appointments: 320,
          revenue: 125000,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatValue = (value, isCurrency = false) => {
    if (isCurrency) {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="row">
      {cardData.map((card, index) => {
        const valueKey = card.title.toLowerCase().replace(/\s+/g, '');
        const displayValue =
          valueKey === 'totalpatients'
            ? animatedValues.patients
            : valueKey === 'totaldoctors'
            ? animatedValues.doctors
            : valueKey === 'appointments'
            ? animatedValues.appointments
            : animatedValues.revenue;

        return (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div
              className="card border-0 shadow-sm"
              style={{
                background: card.gradient,
                color: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                    }}
                  >
                    {card.title}
                  </h6>
                  <span style={{ fontSize: '24px', opacity: 0.9 }}>
                    {card.icon}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {formatValue(displayValue, card.isCurrency)}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Cards;
