import React, { useState, useRef, useEffect } from 'react';

const FormulaEditor = () => {
  const [latexInput, setLatexInput] = useState('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mathJaxReady, setMathJaxReady] = useState(false);
  const previewRef = useRef(null);
  const inputRef = useRef(null);

  // Botões da toolbar com comandos LaTeX comuns
  const toolbarButtons = [
    { label: 'Fração', command: '\\frac{a}{b}', icon: '½' },
    { label: 'Raiz Quadrada', command: '\\sqrt{x}', icon: '√' },
    { label: 'Potência', command: 'x^{n}', icon: 'x²' },
    { label: 'Subscrito', command: 'x_{i}', icon: 'x₁' },
    { label: 'Integral', command: '\\int_{a}^{b} f(x) dx', icon: '∫' },
    { label: 'Somatório', command: '\\sum_{i=1}^{n} x_i', icon: 'Σ' },
    { label: 'Limite', command: '\\lim_{x \\to \\infty}', icon: 'lim' },
    { label: 'Derivada', command: '\\frac{d}{dx}', icon: 'd/dx' },
    { label: 'Parênteses', command: '\\left( \\right)', icon: '( )' },
    { label: 'Colchetes', command: '\\left[ \\right]', icon: '[ ]' },
    { label: 'Chaves', command: '\\left\\{ \\right\\}', icon: '{ }' },
    { label: 'Matrix', command: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', icon: '⬜' },
    { label: 'Alpha', command: '\\alpha', icon: 'α' },
    { label: 'Beta', command: '\\beta', icon: 'β' },
    { label: 'Gamma', command: '\\gamma', icon: 'γ' },
    { label: 'Delta', command: '\\delta', icon: 'δ' },
    { label: 'Pi', command: '\\pi', icon: 'π' },
    { label: 'Theta', command: '\\theta', icon: 'θ' },
    { label: 'Lambda', command: '\\lambda', icon: 'λ' },
    { label: 'Infinito', command: '\\infty', icon: '∞' },
    { label: 'Maior ou igual', command: '\\geq', icon: '≥' },
    { label: 'Menor ou igual', command: '\\leq', icon: '≤' },
    { label: 'Não igual', command: '\\neq', icon: '≠' },
    { label: 'Aproximadamente', command: '\\approx', icon: '≈' }
  ];

  // Verificar se MathJax está carregado
  useEffect(() => {
    const checkMathJax = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        console.log('MathJax carregado!');
        setMathJaxReady(true);
        renderFormula();
      } else {
        setTimeout(checkMathJax, 100);
      }
    };
    checkMathJax();
  }, []);

  // Renderizar fórmula
  const renderFormula = async () => {
    if (!window.MathJax || !window.MathJax.typesetPromise || !previewRef.current) {
      return;
    }
    
    setIsProcessing(true);
    try {
      previewRef.current.innerHTML = '';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `$$${latexInput}$$`;
      previewRef.current.appendChild(tempDiv);
      await window.MathJax.typesetPromise([previewRef.current]);
    } catch (error) {
      console.error('Erro ao renderizar:', error);
      previewRef.current.innerHTML = `
        <div class="alert alert-danger">
          <strong>Erro na sintaxe LaTeX</strong><br>
          Verifique se a fórmula está correta
        </div>
      `;
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-renderizar quando input muda
  useEffect(() => {
    if (!latexInput.trim()) {
      if (previewRef.current) {
        previewRef.current.innerHTML = '<div class="text-muted">Digite uma fórmula LaTeX para ver o preview</div>';
      }
      return;
    }

    if (mathJaxReady) {
      const timeoutId = setTimeout(() => {
        renderFormula();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [latexInput, mathJaxReady]);

  // Inserir comando LaTeX na posição do cursor
  const insertCommand = (command) => {
    const textarea = inputRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = latexInput.substring(0, start) + command + latexInput.substring(end);
    
    setLatexInput(newValue);
    
    // Reposiciona o cursor
    setTimeout(() => {
      const newCursorPos = start + command.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

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

      {/* Toolbar */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">🛠️ Ferramentas LaTeX</h5>
        </div>
        <div className="card-body">
          <div className="row g-2">
            {toolbarButtons.map((button, index) => (
              <div key={index} className="col-auto">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => insertCommand(button.command)}
                  title={button.label}
                  style={{ minWidth: '50px' }}
                >
                  {button.icon}
                </button>
              </div>
            ))}
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
                  💡 Dica: Use os botões da toolbar para inserir comandos rapidamente
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Preview</h5>
              {isProcessing && (
                <span className="badge bg-info">
                  <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                  Processando...
                </span>
              )}
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div 
                ref={previewRef}
                className="w-100 text-center"
                style={{ 
                  minHeight: '400px', 
                  backgroundColor: 'white',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2em'
                }}
              >
                {!mathJaxReady ? (
                  <div className="text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Carregando MathJax...
                  </div>
                ) : (
                  <div className="text-muted">Digite uma fórmula LaTeX para ver o preview</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaEditor;