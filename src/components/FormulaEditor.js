import React, { useState, useRef } from 'react';

const FormulaEditor = () => {
  const [latexInput, setLatexInput] = useState('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
  const inputRef = useRef(null);

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

      {/* Editor Principal */}
      <div className="row">
        {/* Input LaTeX */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Código LaTeX</h5>
              <button 
                className="btn btn-sm btn-light"
                onClick={() => setLatexInput('')}
                title="Limpar"
              >
                🗑️ Limpar
              </button>
            </div>
            <div className="card-body">
              <textarea
                ref={inputRef}
                className="form-control"
                style={{ height: '400px', fontFamily: 'monospace' }}
                value={latexInput}
                onChange={(e) => setLatexInput(e.target.value)}
                placeholder="Digite sua fórmula LaTeX aqui..."
              />
              <div className="mt-3">
                <small className="text-muted">
                  💡 Dica: Use comandos LaTeX como \frac{'{a}'}{'{b}'} para frações
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Placeholder */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div 
                className="w-100 text-center p-4"
                style={{ 
                  minHeight: '400px', 
                  backgroundColor: 'white',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <h6>🔮 Preview em breve!</h6>
                <p className="text-muted mb-2">Conteúdo LaTeX atual:</p>
                <code className="bg-light p-2 rounded">{latexInput}</code>
                <small className="text-muted mt-2">
                  O MathJax será integrado no próximo passo!
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaEditor;