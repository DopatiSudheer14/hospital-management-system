import React from 'react';

function Tables() {
  return (
    <div
      className="card"
      style={{
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      }}
    >
      <div className="card-body p-0">
        <div className="table-responsive">
          <table
            className="table table-hover mb-0"
            style={{
              margin: 0,
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <th
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: 'var(--text-primary, #2c2c2c)',
                    padding: '16px',
                    borderBottom: '2px solid var(--border-light, #e5e7eb)',
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: 'var(--text-primary, #2c2c2c)',
                    padding: '16px',
                    borderBottom: '2px solid var(--border-light, #e5e7eb)',
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: 'var(--text-primary, #2c2c2c)',
                    padding: '16px',
                    borderBottom: '2px solid var(--border-light, #e5e7eb)',
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: 'var(--text-primary, #2c2c2c)',
                    padding: '16px',
                    borderBottom: '2px solid var(--border-light, #e5e7eb)',
                  }}
                >
                  Phone
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: 'var(--text-primary, #2c2c2c)',
                    padding: '16px',
                    borderBottom: '2px solid var(--border-light, #e5e7eb)',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: 'var(--text-primary, #2c2c2c)',
                    padding: '16px',
                    borderBottom: '2px solid var(--border-light, #e5e7eb)',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{
                  transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <td
                  colSpan="6"
                  className="text-center text-muted py-5"
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary, #6c757d)',
                  }}
                >
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tables;
