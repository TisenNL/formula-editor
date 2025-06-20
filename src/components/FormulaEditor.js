import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react-dom';

const FormulaEditor = () => {
  const [latexInput, setLatexInput] = useState('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mathJaxReady, setMathJaxReady] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
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

  // Grupos do ribbon - organizados como você quer
  const ribbonGroups = [
    {
      name: 'Formatação',
      items: [
        { name: 'B', command: '\\mathbf{text}', tooltip: 'Negrito' },
        { name: 'I', command: '\\mathit{text}', tooltip: 'Itálico' },
        { name: 'R', command: '\\mathrm{text}', tooltip: 'Romano' },
        { name: '𝒜', command: '\\mathcal{A}', tooltip: 'Caligráfico' },
        { name: '𝔄', command: '\\mathfrak{A}', tooltip: 'Fraktur' },
        { name: '𝒜', command: '\\mathscr{A}', tooltip: 'Script' }
      ]
    },
    {
      name: 'Estruturas',
      items: [
        { name: '½', command: '\\frac{a}{b}', tooltip: 'Fração' },
        { name: 'ᵃ⁄ᵇ', command: '\\tfrac{a}{b}', tooltip: 'Fração pequena' },
        { name: '√', command: '\\sqrt{x}', tooltip: 'Raiz' },
        { name: 'ⁿ√', command: '\\sqrt[n]{x}', tooltip: 'Raiz n' },
        { name: 'x²', command: 'x^{n}', tooltip: 'Potência' },
        { name: 'x₁', command: 'x_{i}', tooltip: 'Subscrito' },
        { name: 'xᵢⁿ', command: 'x_{i}^{n}', tooltip: 'Sub+Super' },
        { name: '(ⁿₖ)', command: '\\binom{n}{k}', tooltip: 'Binomial' }
      ]
    },
    {
      name: 'Operadores',
      items: [
        { name: '±', command: '\\pm', tooltip: 'Mais ou menos' },
        { name: '∓', command: '\\mp', tooltip: 'Menos ou mais' },
        { name: '×', command: '\\times', tooltip: 'Multiplicação' },
        { name: '÷', command: '\\div', tooltip: 'Divisão' },
        { name: '·', command: '\\cdot', tooltip: 'Ponto central' },
        { name: '∗', command: '\\ast', tooltip: 'Asterisco' },
        { name: '∘', command: '\\circ', tooltip: 'Círculo' },
        { name: '∙', command: '\\bullet', tooltip: 'Bullet' }
      ]
    },
    {
      name: 'Relações',
      items: [
        { name: '≥', command: '\\geq', tooltip: 'Maior igual' },
        { name: '≤', command: '\\leq', tooltip: 'Menor igual' },
        { name: '≠', command: '\\neq', tooltip: 'Não igual' },
        { name: '≈', command: '\\approx', tooltip: 'Aproximado' },
        { name: '≡', command: '\\equiv', tooltip: 'Equivalente' },
        { name: '∝', command: '\\propto', tooltip: 'Proporcional' },
        { name: '∼', command: '\\sim', tooltip: 'Similar' },
        { name: '≅', command: '\\cong', tooltip: 'Congruente' },
        { name: '≫', command: '\\gg', tooltip: 'Muito maior' },
        { name: '≪', command: '\\ll', tooltip: 'Muito menor' }
      ]
    },
    {
      name: 'Cálculo',
      items: [
        { name: '∫', command: '\\int_{a}^{b} f(x) dx', tooltip: 'Integral' },
        { name: '∬', command: '\\iint', tooltip: 'Integral dupla' },
        { name: '∭', command: '\\iiint', tooltip: 'Integral tripla' },
        { name: '∮', command: '\\oint', tooltip: 'Integral contorno' },
        { name: 'Σ', command: '\\sum_{i=1}^{n} x_i', tooltip: 'Somatório' },
        { name: '∏', command: '\\prod_{i=1}^{n} x_i', tooltip: 'Produtório' },
        { name: 'lim', command: '\\lim_{x \\to \\infty}', tooltip: 'Limite' },
        { name: 'd/dx', command: '\\frac{d}{dx}', tooltip: 'Derivada' },
        { name: '∂', command: '\\frac{\\partial}{\\partial x}', tooltip: 'Derivada parcial' },
        { name: '∇', command: '\\nabla', tooltip: 'Nabla' }
      ]
    },
    {
      name: 'Delimitadores',
      items: [
        { name: '( )', command: '\\left( \\right)', tooltip: 'Parênteses' },
        { name: '[ ]', command: '\\left[ \\right]', tooltip: 'Colchetes' },
        { name: '{ }', command: '\\left\\{ \\right\\}', tooltip: 'Chaves' },
        { name: '| |', command: '\\left| \\right|', tooltip: 'Valor absoluto' },
        { name: '‖ ‖', command: '\\left\\| \\right\\|', tooltip: 'Norma' },
        { name: '⟨ ⟩', command: '\\langle \\rangle', tooltip: 'Ângulo' },
        { name: '⌊ ⌋', command: '\\lfloor \\rfloor', tooltip: 'Floor' },
        { name: '⌈ ⌉', command: '\\lceil \\rceil', tooltip: 'Ceiling' }
      ]
    },
    {
      name: 'Setas',
      items: [
        { name: '→', command: '\\rightarrow', tooltip: 'Direita' },
        { name: '←', command: '\\leftarrow', tooltip: 'Esquerda' },
        { name: '⇒', command: '\\Rightarrow', tooltip: 'Dupla direita' },
        { name: '⇐', command: '\\Leftarrow', tooltip: 'Dupla esquerda' },
        { name: '↔', command: '\\leftrightarrow', tooltip: 'Dupla' },
        { name: '⇔', command: '\\Leftrightarrow', tooltip: 'Dupla forte' },
        { name: '↦', command: '\\mapsto', tooltip: 'Mapsto' },
        { name: '↑', command: '\\uparrow', tooltip: 'Acima' },
        { name: '↓', command: '\\downarrow', tooltip: 'Abaixo' }
      ]
    },
    {
      name: 'Gregas Min.',
      items: [
        { name: 'α', command: '\\alpha', tooltip: 'Alpha' },
        { name: 'β', command: '\\beta', tooltip: 'Beta' },
        { name: 'γ', command: '\\gamma', tooltip: 'Gamma' },
        { name: 'δ', command: '\\delta', tooltip: 'Delta' },
        { name: 'ε', command: '\\epsilon', tooltip: 'Epsilon' },
        { name: 'ζ', command: '\\zeta', tooltip: 'Zeta' },
        { name: 'η', command: '\\eta', tooltip: 'Eta' },
        { name: 'θ', command: '\\theta', tooltip: 'Theta' },
        { name: 'ι', command: '\\iota', tooltip: 'Iota' },
        { name: 'κ', command: '\\kappa', tooltip: 'Kappa' },
        { name: 'λ', command: '\\lambda', tooltip: 'Lambda' },
        { name: 'μ', command: '\\mu', tooltip: 'Mu' },
        { name: 'ν', command: '\\nu', tooltip: 'Nu' },
        { name: 'ξ', command: '\\xi', tooltip: 'Xi' },
        { name: 'π', command: '\\pi', tooltip: 'Pi' },
        { name: 'ρ', command: '\\rho', tooltip: 'Rho' },
        { name: 'σ', command: '\\sigma', tooltip: 'Sigma' },
        { name: 'τ', command: '\\tau', tooltip: 'Tau' },
        { name: 'υ', command: '\\upsilon', tooltip: 'Upsilon' },
        { name: 'φ', command: '\\phi', tooltip: 'Phi' },
        { name: 'χ', command: '\\chi', tooltip: 'Chi' },
        { name: 'ψ', command: '\\psi', tooltip: 'Psi' },
        { name: 'ω', command: '\\omega', tooltip: 'Omega' }
      ]
    },
    {
      name: 'Gregas Mai.',
      items: [
        { name: 'Γ', command: '\\Gamma', tooltip: 'Gamma' },
        { name: 'Δ', command: '\\Delta', tooltip: 'Delta' },
        { name: 'Θ', command: '\\Theta', tooltip: 'Theta' },
        { name: 'Λ', command: '\\Lambda', tooltip: 'Lambda' },
        { name: 'Ξ', command: '\\Xi', tooltip: 'Xi' },
        { name: 'Π', command: '\\Pi', tooltip: 'Pi' },
        { name: 'Σ', command: '\\Sigma', tooltip: 'Sigma' },
        { name: 'Υ', command: '\\Upsilon', tooltip: 'Upsilon' },
        { name: 'Φ', command: '\\Phi', tooltip: 'Phi' },
        { name: 'Ψ', command: '\\Psi', tooltip: 'Psi' },
        { name: 'Ω', command: '\\Omega', tooltip: 'Omega' }
      ]
    },
    {
      name: 'Símbolos',
      items: [
        { name: '∞', command: '\\infty', tooltip: 'Infinito' },
        { name: '∃', command: '\\exists', tooltip: 'Existe' },
        { name: '∀', command: '\\forall', tooltip: 'Para todo' },
        { name: '∈', command: '\\in', tooltip: 'Pertence' },
        { name: '∉', command: '\\notin', tooltip: 'Não pertence' },
        { name: '⊂', command: '\\subset', tooltip: 'Subconjunto' },
        { name: '⊃', command: '\\supset', tooltip: 'Superconjunto' },
        { name: '∪', command: '\\cup', tooltip: 'União' },
        { name: '∩', command: '\\cap', tooltip: 'Interseção' },
        { name: '∅', command: '\\emptyset', tooltip: 'Vazio' },
        { name: 'ℕ', command: '\\mathbb{N}', tooltip: 'Naturais' },
        { name: 'ℤ', command: '\\mathbb{Z}', tooltip: 'Inteiros' },
        { name: 'ℚ', command: '\\mathbb{Q}', tooltip: 'Racionais' },
        { name: 'ℝ', command: '\\mathbb{R}', tooltip: 'Reais' },
        { name: 'ℂ', command: '\\mathbb{C}', tooltip: 'Complexos' },
        { name: "x'", command: "x'", tooltip: 'Primo' },
        { name: '°', command: '30^\\circ', tooltip: 'Graus' }
      ]
    },
    {
      name: 'Matrizes',
      items: [
        { name: '⬜₂', command: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', tooltip: 'Matrix 2x2' },
        { name: '⬜₃', command: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}', tooltip: 'Matrix 3x3' },
        { name: '|⬜|', command: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', tooltip: 'Determinante' },
        { name: '[⬜]', command: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', tooltip: 'Colchetes' },
        { name: '{⬜}', command: '\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}', tooltip: 'Chaves' },
        { name: '{⋮', command: '\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}', tooltip: 'Sistema' },
        { name: '⬜₁', command: '\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}', tooltip: 'Vetor coluna' }
      ]
    },
    {
      name: 'Funções',
      items: [
        { name: 'sin', command: '\\sin', tooltip: 'Seno' },
        { name: 'cos', command: '\\cos', tooltip: 'Cosseno' },
        { name: 'tan', command: '\\tan', tooltip: 'Tangente' },
        { name: 'log', command: '\\log', tooltip: 'Logaritmo' },
        { name: 'ln', command: '\\ln', tooltip: 'Logaritmo natural' },
        { name: 'eˣ', command: 'e^x', tooltip: 'Exponencial' },
        { name: 'max', command: '\\max', tooltip: 'Máximo' },
        { name: 'min', command: '\\min', tooltip: 'Mínimo' },
        { name: 'gcd', command: '\\gcd', tooltip: 'GCD' },
        { name: 'arctan', command: '\\arctan', tooltip: 'Arctangente' }
      ]
    }
  ];

  // Verificar se MathJax está carregado
  useEffect(() => {
    const checkMathJax = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        setMathJaxReady(true);
        renderFormula();
      } else {
        setTimeout(checkMathJax, 100);
      }
    };
    checkMathJax();
  }, []);

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

  // Inserir comando LaTeX na posição do cursor
  const insertCommand = (command) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = latexInput.substring(0, start) + command + latexInput.substring(end);
    
    setLatexInput(newValue);
    
    // Fechar popover após inserir
    setOpenPopover(null);
    
    setTimeout(() => {
      const newCursorPos = start + command.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 10);
  };

  // Download do SVG - Versão com tamanho corrigido
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
      // Clonar o SVG
      const svgClone = svgElement.cloneNode(true);
      
      // Definir atributos essenciais
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      
      // Obter dimensões originais do MathJax
      const bbox = svgElement.getBBox();
      const originalWidth = bbox.width || svgElement.width.baseVal.value || 100;
      const originalHeight = bbox.height || svgElement.height.baseVal.value || 50;
      
      // Calcular dimensões redimensionadas (similar ao preview)
      const maxWidth = 400;  // Largura máxima razoável
      const maxHeight = 200; // Altura máxima razoável
      
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      
      // Redimensionar proporcionalmente se muito grande
      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        const scaleX = maxWidth / originalWidth;
        const scaleY = maxHeight / originalHeight;
        const scale = Math.min(scaleX, scaleY);
        
        newWidth = originalWidth * scale;
        newHeight = originalHeight * scale;
      }
      
      // Se muito pequeno, aumentar um pouco
      if (newWidth < 50) {
        const scale = 50 / newWidth;
        newWidth = 50;
        newHeight = newHeight * scale;
      }
      
      // Arredondar valores
      newWidth = Math.round(newWidth);
      newHeight = Math.round(newHeight);
      
      // Definir viewBox baseado nas dimensões originais
      const viewBoxX = bbox.x || 0;
      const viewBoxY = bbox.y || 0;
      svgClone.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${originalWidth} ${originalHeight}`);
      
      // Definir as novas dimensões
      svgClone.setAttribute('width', newWidth + 'px');
      svgClone.setAttribute('height', newHeight + 'px');
      
      // Coletar todas as definições de estilo do MathJax
      const allDefs = document.querySelectorAll('svg defs, #MathJax_SVG_glyphs');
      let defsElement = svgClone.querySelector('defs');
      
      if (!defsElement) {
        defsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svgClone.insertBefore(defsElement, svgClone.firstChild);
      }
      
      // Adicionar todas as definições encontradas
      allDefs.forEach(defs => {
        if (defs.children.length > 0) {
          const defsClone = defs.cloneNode(true);
          Array.from(defsClone.children).forEach(child => {
            // Evitar duplicatas
            const existingId = child.getAttribute('id');
            if (!existingId || !defsElement.querySelector(`#${existingId}`)) {
              defsElement.appendChild(child.cloneNode(true));
            }
          });
        }
      });
      
      // Adicionar estilos CSS inline do MathJax
      const mathJaxStyles = `
        .MathJax_SVG { font-family: MathJax_Math; }
        .MathJax_SVG * { stroke-width: 0; }
        .MathJax_SVG_Display { text-align: center; margin: 1em 0em; }
        .MathJax_SVG_Left { text-align: left; }
        .MathJax_SVG_Right { text-align: right; }
        .MathJax_SVG g[data-mml-node="merror"] > g { fill: red; stroke: red; }
        .MathJax_SVG g[data-mml-node="merror"] > rect[data-background] { fill: yellow; stroke: none; }
        .MathJax_SVG text { fill: currentColor; stroke: none; }
        text { font-family: MathJax_Math, serif; }
      `;
      
      // Inserir estilos no início do SVG
      const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleElement.textContent = mathJaxStyles;
      defsElement.appendChild(styleElement);
      
      // Serializar o SVG
      const serializer = new XMLSerializer();
      let svgData = serializer.serializeToString(svgClone);
      
      // Adicionar declaração XML se não existir
      if (!svgData.startsWith('<?xml')) {
        svgData = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgData;
      }
      
      // Criar e baixar o arquivo
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `formula-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Download SVG realizado com sucesso!');
      console.log('Dimensões originais:', { width: originalWidth, height: originalHeight });
      console.log('Dimensões finais:', { width: newWidth, height: newHeight });
      console.log('ViewBox:', svgClone.getAttribute('viewBox'));
      
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

  // Componente Floating UI com Portal Manual
  const FloatingPopover = ({ groupName, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [
        offset(10),
        flip(),
        shift()
      ],
      whileElementsMounted: autoUpdate,
    });

    // Sincronizar com estado global
    useEffect(() => {
      if (openPopover !== groupName && isOpen) {
        setIsOpen(false);
      }
      if (openPopover === groupName && !isOpen) {
        setIsOpen(true);
      }
    }, [openPopover, groupName, isOpen]);

    // Fechar com ESC
    useEffect(() => {
      if (isOpen) {
        const handleEsc = (e) => {
          if (e.key === 'Escape') {
            setIsOpen(false);
            setOpenPopover(null);
          }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
      }
    }, [isOpen]);

    const handleClick = () => {
      if (isOpen) {
        setOpenPopover(null);
        setIsOpen(false);
      } else {
        setOpenPopover(groupName);
        setIsOpen(true);
      }
    };

    // Portal manual para garantir z-index máximo
    const portal = isOpen ? createPortal(
      <>
        {/* Overlay para capturar cliques fora */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999998,
            background: 'transparent'
          }}
          onClick={() => {
            setIsOpen(false);
            setOpenPopover(null);
          }}
        />
        
        {/* Popover */}
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 999999,
            position: 'fixed',
          }}
        >
          <div style={{
            background: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            minWidth: '350px',
            maxWidth: '450px',
            maxHeight: '400px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #dee2e6',
              background: '#f8f9fa',
              borderRadius: '8px 8px 0 0'
            }}>
              <h6 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
                {groupName} - Todos os itens
              </h6>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setOpenPopover(null);
                }} 
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: '#6c757d'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#fee2e2';
                  e.target.style.color = '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#6c757d';
                }}
              >
                ×
              </button>
            </div>
            <div style={{
              padding: '16px',
              overflowY: 'auto',
              maxHeight: '320px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px'
              }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </>,
      document.body
    ) : null;

    return (
      <>
        <button
          ref={refs.setReference}
          className="btn btn-sm btn-outline-primary"
          onClick={handleClick}
        >
          +
        </button>
        {portal}
      </>
    );
  };

  // Renderizar grupo com layout ribbon
  const renderGroup = (group, index) => {
    return (
      <div key={index} className="ribbon-group">
        <div className="group-header">
          <span className="badge bg-primary group-badge">{group.name}</span>
          {group.items.length > 6 && (
            <FloatingPopover groupName={group.name}>
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="btn btn-outline-secondary"
                  style={{
                    minWidth: '38px',
                    height: '35px',
                    fontSize: '13px',
                    padding: '2px 4px',
                    margin: 0
                  }}
                  onClick={() => insertCommand(item.command)}
                  title={item.tooltip}
                >
                  {item.name}
                </button>
              ))}
            </FloatingPopover>
          )}
        </div>
        
        <div className="group-content">
          {/* Grid 3x2 - Mostrar sempre os primeiros 6 itens */}
          {group.items.slice(0, 6).map((item, itemIndex) => (
            <button
              key={itemIndex}
              className="btn btn-outline-secondary ribbon-button"
              onClick={() => insertCommand(item.command)}
              title={item.tooltip}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white border-bottom p-3">
        <div className="d-flex align-items-center">
          <div className="me-3" style={{ fontSize: '2rem' }}>
            <i className="fas fa-calculator text-primary"></i>
          </div>
          <div>
            <h1 className="mb-1 h4" style={{ color: '#2c3e50' }}>
              Editor de Fórmulas Matemáticas
            </h1>
            <p className="text-muted mb-0 small">
              <i className="fas fa-shield-alt text-success me-1"></i>
              Interface Ribbon com Floating UI - 120 comandos LaTex
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar LaTeX Ribbon */}
      <div className="bg-primary text-white p-2">
        <h6 className="mb-0">
          <i className="fas fa-tools me-2"></i>
          Toolbar LaTeX (120 Comandos)
        </h6>
      </div>
      
      <div className="ribbon-container bg-white border-bottom p-3">
        {ribbonGroups.map((group, index) => renderGroup(group, index))}
      </div>

      {/* Exemplos Rápidos */}
      <div className="bg-light border-bottom p-2">
        <div className="d-flex align-items-center">
          <span className="text-muted me-3 small">
            <i className="fas fa-bolt text-warning me-1"></i>
            <strong>Exemplos Rápidos:</strong>
          </span>
          <div className="d-flex gap-2 flex-wrap">
            {examples.map((example, index) => (
              <button
                key={index}
                className="btn btn-sm btn-outline-primary"
                onClick={() => loadExample(example.formula)}
                title={`Carregar: ${example.name}`}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Principal */}
      <div className="container-fluid p-4">
        <div className="row">
          {/* Input LaTeX */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-code me-2"></i>
                  Código LaTeX
                </h5>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={() => loadExample('')}
                  title="Limpar"
                >
                  <i className="fas fa-trash me-1"></i>
                  Limpar
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
                  placeholder="Use a toolbar acima para inserir comandos LaTeX automaticamente..."
                />
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="fas fa-lightbulb text-warning me-1"></i>
                    <strong>Dica:</strong> Clique nos botões da toolbar para inserir comandos!
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-eye me-2"></i>
                  Preview MathJax
                </h5>
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
                    <i className="fas fa-download me-1"></i>
                    Download SVG
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
      </div>

      {/* CSS inline para layout ribbon simples */}
      <style jsx>{`
        .ribbon-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          max-height: 400px;
          overflow-y: auto;
          position: relative;
          padding-bottom: 20px;
        }

        .ribbon-group {
          min-width: 250px;
          margin-bottom: 20px;
          position: static;
        }

        .group-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          position: static;
        }

        .group-badge {
          font-size: 12px;
          padding: 4px 12px;
          margin-right: 8px;
          white-space: nowrap;
        }

        .group-content {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          position: static;
        }

        .ribbon-button {
          min-width: 45px;
          height: 35px;
          font-size: 14px;
          padding: 2px 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: static;
        }

        .ribbon-button:hover {
          background-color: #e9ecef;
          border-color: #0d6efd;
        }

        /* Scroll personalizado para ribbon */
        .ribbon-container::-webkit-scrollbar {
          width: 8px;
        }

        .ribbon-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .ribbon-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .ribbon-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .ribbon-container {
            flex-direction: column;
            max-height: 500px;
          }
          
          .ribbon-group {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default FormulaEditor;