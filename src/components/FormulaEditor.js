import React from 'react';

const FormulaEditor = () => {
  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-3">
            <div className="me-3" style={{ fontSize: '2rem' }}>📐</div>
            <div>
              <h1 className="mb-1" style={{ color: '#2c3e50' }}>
                Editor de Fórmulas Matemáticas
              </h1>
              <p className="text-muted mb-0">
                Crie fórmulas matemáticas usando LaTeX com preview em tempo real
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder para próximas funcionalidades */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h5>🚧 Em construção...</h5>
              <p>O editor será implementado nos próximos passos!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaEditor;