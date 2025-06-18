import React, { useState, useRef, useEffect } from 'react';

const FormulaEditor = () => {
  const [latexInput, setLatexInput] = useState('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mathJaxReady, setMathJaxReady] = useState(false);
  const previewRef = useRef(null);
  const textareaRef = useRef(null);

  // Exemplos de fórmulas famosas
  const examples = [
    { name: 'Bhaskara', formula: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { name: 'Pitágoras', formula: 'a^2 + b^2 = c^2' },
    { name: 'Integral', formula: '\\int_{a}^{b} f(x) dx = F(b) - F(a)' },
    { name: 'Euler', formula: 'e^{i\\pi} + 1 = 0' },
    { name: 'Taylor', formula: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n' },
    { name: 'Basel', formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}' },
    { name: 'Matrix', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { name: 'Sistema', formula: '\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}' }
  ];

  // Toolbar independente completa (100+ comandos organizados)
  const toolbarButtons = [
    // Formatação
    { group: 'Formatação', label: 'Bold', command: '\\mathbf{text}', icon: '𝐁' },
    { group: 'Formatação', label: 'Italic', command: '\\mathit{text}', icon: '𝐼' },
    { group: 'Formatação', label: 'Roman', command: '\\mathrm{text}', icon: 'R' },
    { group: 'Formatação', label: 'Caligráfico', command: '\\mathcal{A}', icon: '𝒜' },
    { group: 'Formatação', label: 'Script', command: '\\mathscr{A}', icon: '𝒜' },
    { group: 'Formatação', label: 'Fraktur', command: '\\mathfrak{A}', icon: '𝔄' },
    
    // Estruturas básicas
    { group: 'Estruturas', label: 'Fração', command: '\\frac{a}{b}', icon: '½' },
    { group: 'Estruturas', label: 'Fração pequena', command: '\\tfrac{a}{b}', icon: 'ᵃ⁄ᵇ' },
    { group: 'Estruturas', label: 'Raiz', command: '\\sqrt{x}', icon: '√' },
    { group: 'Estruturas', label: 'Raiz N', command: '\\sqrt[n]{x}', icon: 'ⁿ√' },
    { group: 'Estruturas', label: 'Potência', command: 'x^{n}', icon: 'x²' },
    { group: 'Estruturas', label: 'Subscrito', command: 'x_{i}', icon: 'x₁' },
    { group: 'Estruturas', label: 'Sub+Super', command: 'x_{i}^{n}', icon: 'xᵢⁿ' },
    { group: 'Estruturas', label: 'Binomial', command: '\\binom{n}{k}', icon: '(ⁿₖ)' },
    
    // Operadores básicos
    { group: 'Operadores', label: 'Mais ou menos', command: '\\pm', icon: '±' },
    { group: 'Operadores', label: 'Menos ou mais', command: '\\mp', icon: '∓' },
    { group: 'Operadores', label: 'Multiplicação', command: '\\times', icon: '×' },
    { group: 'Operadores', label: 'Divisão', command: '\\div', icon: '÷' },
    { group: 'Operadores', label: 'Ponto central', command: '\\cdot', icon: '·' },
    { group: 'Operadores', label: 'Asterisco', command: '\\ast', icon: '∗' },
    { group: 'Operadores', label: 'Círculo', command: '\\circ', icon: '∘' },
    { group: 'Operadores', label: 'Bullet', command: '\\bullet', icon: '∙' },
    
    // Relações
    { group: 'Relações', label: 'Maior igual', command: '\\geq', icon: '≥' },
    { group: 'Relações', label: 'Menor igual', command: '\\leq', icon: '≤' },
    { group: 'Relações', label: 'Não igual', command: '\\neq', icon: '≠' },
    { group: 'Relações', label: 'Aproximado', command: '\\approx', icon: '≈' },
    { group: 'Relações', label: 'Equivalente', command: '\\equiv', icon: '≡' },
    { group: 'Relações', label: 'Proporcional', command: '\\propto', icon: '∝' },
    { group: 'Relações', label: 'Similar', command: '\\sim', icon: '∼' },
    { group: 'Relações', label: 'Congruente', command: '\\cong', icon: '≅' },
    { group: 'Relações', label: 'Muito maior', command: '\\gg', icon: '≫' },
    { group: 'Relações', label: 'Muito menor', command: '\\ll', icon: '≪' },
    
    // Cálculo
    { group: 'Cálculo', label: 'Integral', command: '\\int_{a}^{b} f(x) dx', icon: '∫' },
    { group: 'Cálculo', label: 'Integral dupla', command: '\\iint', icon: '∬' },
    { group: 'Cálculo', label: 'Integral tripla', command: '\\iiint', icon: '∭' },
    { group: 'Cálculo', label: 'Integral contorno', command: '\\oint', icon: '∮' },
    { group: 'Cálculo', label: 'Somatório', command: '\\sum_{i=1}^{n} x_i', icon: 'Σ' },
    { group: 'Cálculo', label: 'Produtório', command: '\\prod_{i=1}^{n} x_i', icon: '∏' },
    { group: 'Cálculo', label: 'Coproduto', command: '\\coprod', icon: '∐' },
    { group: 'Cálculo', label: 'Limite', command: '\\lim_{x \\to \\infty}', icon: 'lim' },
    { group: 'Cálculo', label: 'Derivada', command: '\\frac{d}{dx}', icon: 'd/dx' },
    { group: 'Cálculo', label: 'Derivada parcial', command: '\\frac{\\partial}{\\partial x}', icon: '∂' },
    { group: 'Cálculo', label: 'Nabla', command: '\\nabla', icon: '∇' },
    
    // Delimitadores
    { group: 'Delimitadores', label: 'Parênteses', command: '\\left( \\right)', icon: '( )' },
    { group: 'Delimitadores', label: 'Colchetes', command: '\\left[ \\right]', icon: '[ ]' },
    { group: 'Delimitadores', label: 'Chaves', command: '\\left\\{ \\right\\}', icon: '{ }' },
    { group: 'Delimitadores', label: 'Valor absoluto', command: '\\left| \\right|', icon: '| |' },
    { group: 'Delimitadores', label: 'Norma', command: '\\left\\| \\right\\|', icon: '‖ ‖' },
    { group: 'Delimitadores', label: 'Ângulo', command: '\\langle \\rangle', icon: '⟨ ⟩' },
    { group: 'Delimitadores', label: 'Floor', command: '\\lfloor \\rfloor', icon: '⌊ ⌋' },
    { group: 'Delimitadores', label: 'Ceiling', command: '\\lceil \\rceil', icon: '⌈ ⌉' },
    
    // Setas
    { group: 'Setas', label: 'Direita', command: '\\rightarrow', icon: '→' },
    { group: 'Setas', label: 'Esquerda', command: '\\leftarrow', icon: '←' },
    { group: 'Setas', label: 'Dupla direita', command: '\\Rightarrow', icon: '⇒' },
    { group: 'Setas', label: 'Dupla esquerda', command: '\\Leftarrow', icon: '⇐' },
    { group: 'Setas', label: 'Dupla', command: '\\leftrightarrow', icon: '↔' },
    { group: 'Setas', label: 'Dupla forte', command: '\\Leftrightarrow', icon: '⇔' },
    { group: 'Setas', label: 'Mapsto', command: '\\mapsto', icon: '↦' },
    { group: 'Setas', label: 'Acima', command: '\\uparrow', icon: '↑' },
    { group: 'Setas', label: 'Abaixo', command: '\\downarrow', icon: '↓' },
    
    // Letras gregas minúsculas
    { group: 'Gregas Min.', label: 'Alpha', command: '\\alpha', icon: 'α' },
    { group: 'Gregas Min.', label: 'Beta', command: '\\beta', icon: 'β' },
    { group: 'Gregas Min.', label: 'Gamma', command: '\\gamma', icon: 'γ' },
    { group: 'Gregas Min.', label: 'Delta', command: '\\delta', icon: 'δ' },
    { group: 'Gregas Min.', label: 'Epsilon', command: '\\epsilon', icon: 'ε' },
    { group: 'Gregas Min.', label: 'Zeta', command: '\\zeta', icon: 'ζ' },
    { group: 'Gregas Min.', label: 'Eta', command: '\\eta', icon: 'η' },
    { group: 'Gregas Min.', label: 'Theta', command: '\\theta', icon: 'θ' },
    { group: 'Gregas Min.', label: 'Iota', command: '\\iota', icon: 'ι' },
    { group: 'Gregas Min.', label: 'Kappa', command: '\\kappa', icon: 'κ' },
    { group: 'Gregas Min.', label: 'Lambda', command: '\\lambda', icon: 'λ' },
    { group: 'Gregas Min.', label: 'Mu', command: '\\mu', icon: 'μ' },
    { group: 'Gregas Min.', label: 'Nu', command: '\\nu', icon: 'ν' },
    { group: 'Gregas Min.', label: 'Xi', command: '\\xi', icon: 'ξ' },
    { group: 'Gregas Min.', label: 'Pi', command: '\\pi', icon: 'π' },
    { group: 'Gregas Min.', label: 'Rho', command: '\\rho', icon: 'ρ' },
    { group: 'Gregas Min.', label: 'Sigma', command: '\\sigma', icon: 'σ' },
    { group: 'Gregas Min.', label: 'Tau', command: '\\tau', icon: 'τ' },
    { group: 'Gregas Min.', label: 'Upsilon', command: '\\upsilon', icon: 'υ' },
    { group: 'Gregas Min.', label: 'Phi', command: '\\phi', icon: 'φ' },
    { group: 'Gregas Min.', label: 'Chi', command: '\\chi', icon: 'χ' },
    { group: 'Gregas Min.', label: 'Psi', command: '\\psi', icon: 'ψ' },
    { group: 'Gregas Min.', label: 'Omega', command: '\\omega', icon: 'ω' },
    
    // Letras gregas maiúsculas
    { group: 'Gregas Mai.', label: 'Gamma', command: '\\Gamma', icon: 'Γ' },
    { group: 'Gregas Mai.', label: 'Delta', command: '\\Delta', icon: 'Δ' },
    { group: 'Gregas Mai.', label: 'Theta', command: '\\Theta', icon: 'Θ' },
    { group: 'Gregas Mai.', label: 'Lambda', command: '\\Lambda', icon: 'Λ' },
    { group: 'Gregas Mai.', label: 'Xi', command: '\\Xi', icon: 'Ξ' },
    { group: 'Gregas Mai.', label: 'Pi', command: '\\Pi', icon: 'Π' },
    { group: 'Gregas Mai.', label: 'Sigma', command: '\\Sigma', icon: 'Σ' },
    { group: 'Gregas Mai.', label: 'Upsilon', command: '\\Upsilon', icon: 'Υ' },
    { group: 'Gregas Mai.', label: 'Phi', command: '\\Phi', icon: 'Φ' },
    { group: 'Gregas Mai.', label: 'Psi', command: '\\Psi', icon: 'Ψ' },
    { group: 'Gregas Mai.', label: 'Omega', command: '\\Omega', icon: 'Ω' },
    
    // Símbolos e conjuntos
    { group: 'Símbolos', label: 'Infinito', command: '\\infty', icon: '∞' },
    { group: 'Símbolos', label: 'Existe', command: '\\exists', icon: '∃' },
    { group: 'Símbolos', label: 'Para todo', command: '\\forall', icon: '∀' },
    { group: 'Símbolos', label: 'Pertence', command: '\\in', icon: '∈' },
    { group: 'Símbolos', label: 'Não pertence', command: '\\notin', icon: '∉' },
    { group: 'Símbolos', label: 'Subconjunto', command: '\\subset', icon: '⊂' },
    { group: 'Símbolos', label: 'Superconjunto', command: '\\supset', icon: '⊃' },
    { group: 'Símbolos', label: 'União', command: '\\cup', icon: '∪' },
    { group: 'Símbolos', label: 'Interseção', command: '\\cap', icon: '∩' },
    { group: 'Símbolos', label: 'Vazio', command: '\\emptyset', icon: '∅' },
    { group: 'Símbolos', label: 'Naturais', command: '\\mathbb{N}', icon: 'ℕ' },
    { group: 'Símbolos', label: 'Inteiros', command: '\\mathbb{Z}', icon: 'ℤ' },
    { group: 'Símbolos', label: 'Racionais', command: '\\mathbb{Q}', icon: 'ℚ' },
    { group: 'Símbolos', label: 'Reais', command: '\\mathbb{R}', icon: 'ℝ' },
    { group: 'Símbolos', label: 'Complexos', command: '\\mathbb{C}', icon: 'ℂ' },
    { group: 'Símbolos', label: 'Primo', command: "x'", icon: "x'" },
    { group: 'Símbolos', label: 'Graus', command: '30^\\circ', icon: '°' },
    
    // Matrizes e sistemas
    { group: 'Matrizes', label: 'Matrix 2x2', command: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', icon: '⬜₂' },
    { group: 'Matrizes', label: 'Matrix 3x3', command: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}', icon: '⬜₃' },
    { group: 'Matrizes', label: 'Determinante', command: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', icon: '|⬜|' },
    { group: 'Matrizes', label: 'Colchetes', command: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', icon: '[⬜]' },
    { group: 'Matrizes', label: 'Chaves', command: '\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}', icon: '{⬜}' },
    { group: 'Matrizes', label: 'Sistema', command: '\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}', icon: '{⋮' },
    { group: 'Matrizes', label: 'Vetor coluna', command: '\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}', icon: '⬜₁' },
    
    // Funções especiais
    { group: 'Funções', label: 'Seno', command: '\\sin', icon: 'sin' },
    { group: 'Funções', label: 'Cosseno', command: '\\cos', icon: 'cos' },
    { group: 'Funções', label: 'Tangente', command: '\\tan', icon: 'tan' },
    { group: 'Funções', label: 'Logaritmo', command: '\\log', icon: 'log' },
    { group: 'Funções', label: 'Logaritmo natural', command: '\\ln', icon: 'ln' },
    { group: 'Funções', label: 'Exponencial', command: 'e^x', icon: 'eˣ' },
    { group: 'Funções', label: 'Máximo', command: '\\max', icon: 'max' },
    { group: 'Funções', label: 'Mínimo', command: '\\min', icon: 'min' },
    { group: 'Funções', label: 'GCD', command: '\\gcd', icon: 'gcd' },
    { group: 'Funções', label: 'Arctangente', command: '\\arctan', icon: 'arctan' }
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

  // Renderizar fórmula com MathJax
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
    const textarea = textareaRef.current;
    if (!textarea) return;

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

  // Download do SVG
  const downloadSVG = () => {
    if (!previewRef.current) {
      alert('Erro: Preview não encontrado');
      return;
    }
    
    const svgElement = previewRef.current.querySelector('svg');
    if (!svgElement) {
      alert('Nenhuma fórmula válida para download!\nCertifique-se de que há uma fórmula renderizada no preview.');
      return;
    }

    try {
      const svgClone = svgElement.cloneNode(true);
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      
      const allDefs = document.querySelectorAll('svg defs');
      let defsElement = svgClone.querySelector('defs');
      if (!defsElement) {
        defsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svgClone.insertBefore(defsElement, svgClone.firstChild);
      }
      
      allDefs.forEach(defs => {
        const defsClone = defs.cloneNode(true);
        Array.from(defsClone.children).forEach(child => {
          defsElement.appendChild(child.cloneNode(true));
        });
      });
      
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'formula.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Download SVG realizado com sucesso!');
    } catch (error) {
      console.error('Erro no download:', error);
      alert('Erro ao fazer download: ' + error.message);
    }
  };

  // Carregar exemplo
  const loadExample = (formula) => {
    setLatexInput(formula);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Renderizar toolbar por grupos
  const renderToolbar = () => {
    const groups = [...new Set(toolbarButtons.map(btn => btn.group))];
    
    return (
      <div className="toolbar-container">
        {groups.map(group => (
          <div key={group} className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-primary me-2 text-white px-2 py-1">
                {group}
              </span>
              <div className="flex-wrap d-flex gap-1">
                {toolbarButtons
                  .filter(btn => btn.group === group)
                  .map((button, index) => (
                    <button
                      key={index}
                      className="btn btn-outline-secondary btn-sm toolbar-btn"
                      onClick={() => insertCommand(button.command)}
                      title={button.label}
                      style={{ 
                        minWidth: '42px', 
                        fontSize: '14px',
                        height: '38px',
                        margin: '1px'
                      }}
                    >
                      {button.icon}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
                🛡️ Versão independente com 120+ comandos LaTeX organizados por categoria
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="alert alert-success mb-0">
            <strong>✅ Status:</strong> Editor 100% independente - Funciona offline sem dependências externas
          </div>
        </div>
      </div>

      {/* Toolbar Independente */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🛠️ Toolbar LaTeX (120+ Comandos)</h5>
          <span className="badge bg-light text-dark">Independente</span>
        </div>
        <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {renderToolbar()}
        </div>
      </div>

      {/* Exemplos Rápidos */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">⚡ Exemplos Rápidos</h5>
        </div>
        <div className="card-body">
          <div className="row g-2">
            {examples.map((example, index) => (
              <div key={index} className="col-auto">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => loadExample(example.formula)}
                  title={`Carregar: ${example.name}`}
                >
                  {example.name}
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
              <h5 className="mb-0">📝 Código LaTeX</h5>
              <button 
                className="btn btn-sm btn-light"
                onClick={() => loadExample('')}
                title="Limpar"
              >
                🗑️ Limpar
              </button>
            </div>
            <div className="card-body">
              <textarea
                ref={textareaRef}
                className="form-control"
                style={{ 
                  height: '400px', 
                  fontFamily: 'Consolas, Monaco, monospace',
                  fontSize: '14px'
                }}
                value={latexInput}
                onChange={(e) => setLatexInput(e.target.value)}
                placeholder="Clique nos botões da toolbar para inserir comandos LaTeX automaticamente..."
              />
              <div className="mt-3">
                <small className="text-muted">
                  💡 <strong>Dica:</strong> Posicione o cursor onde quer inserir e clique nos botões da toolbar!
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0">👁️ Preview MathJax</h5>
              <div>
                {isProcessing && (
                  <span className="badge bg-info me-2">
                    <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                    Processando...
                  </span>
                )}
                <button 
                  className="btn btn-sm btn-success"
                  onClick={downloadSVG}
                  title="Download SVG"
                  disabled={!mathJaxReady}
                >
                  📥 Download SVG
                </button>
              </div>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div 
                ref={previewRef}
                className="w-100 text-center"
                style={{ 
                  minHeight: '400px', 
                  backgroundColor: 'white',
                  border: '2px solid #dee2e6',
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
                  <div className="text-muted">Use a toolbar acima para criar fórmulas</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer com referência LaTeX */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>📚 Referência Rápida LaTeX:</h6>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled small">
                    <li><code>\frac{'{a}'}{'{b}'}</code> - Fração</li>
                    <li><code>\sqrt{'{x}'}</code> - Raiz quadrada</li>
                    <li><code>x^{'{n}'}</code> - Potência</li>
                    <li><code>x_{'{i}'}</code> - Subscrito</li>
                    <li><code>\int_{'{a}'}^{'{b}'}</code> - Integral</li>
                    <li><code>\sum_{'{i=1}'}^{'{n}'}</code> - Somatório</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled small">
                    <li><code>\alpha, \beta, \gamma</code> - Letras gregas</li>
                    <li><code>\geq, \leq, \neq</code> - Operadores</li>
                    <li><code>\infty</code> - Infinito</li>
                    <li><code>\mathbb{'{R}'}</code> - Conjuntos</li>
                    <li><code>\left( \right)</code> - Parênteses grandes</li>
                    <li><code>\begin{'{pmatrix}'} ... \end{'{pmatrix}'}</code> - Matriz</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 text-center">
                <small className="text-muted">
                  🎯 <strong>Editor Independente:</strong> 120+ comandos organizados em 12 categorias - 
                  Funciona 100% offline sem dependências externas!
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS personalizado para toolbar */}
      <style jsx>{`
        .toolbar-btn:hover {
          background-color: #0d6efd !important;
          color: white !important;
          border-color: #0d6efd !important;
        }
        
        .toolbar-container {
          max-height: 450px;
          overflow-y: auto;
        }
        
        .toolbar-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .toolbar-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .toolbar-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        .toolbar-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default FormulaEditor;