# 📐 Editor de Fórmulas Matemáticas

Editor moderno de fórmulas LaTeX com toolbar completa de 120+ comandos organizados em categorias.

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm 8+

### 1. Clonar e instalar
```bash
git clone <url-do-repositorio>
cd formula-editor
npm install
```

### 2. Executar em desenvolvimento
```bash
npm start
```

A aplicação estará disponível em **http://localhost:3000**

### 3. Build para produção
```bash
npm run build
```

## ✨ Funcionalidades

- **🛠️ Toolbar Completa:** 120+ comandos LaTeX organizados em 12 categorias
- **👁️ Preview em tempo real** com MathJax
- **📥 Download SVG** das fórmulas renderizadas
- **⚡ Exemplos rápidos** de fórmulas famosas
- **🖋️ Fonte sans-serif** para melhor integração em textos
- **📱 Interface responsiva** com Bootstrap

## 🎯 Como Usar

1. **Use a toolbar** para inserir comandos LaTeX
2. **Digite LaTeX** diretamente no editor
3. **Veja o preview** em tempo real no painel direito
4. **Baixe em SVG** quando a fórmula estiver pronta
5. **Carregue exemplos** para começar rapidamente

## 📚 Categorias da Toolbar

- **Formatação:** Bold, Italic, Caligráfico, Fraktur
- **Estruturas:** Frações, raízes, potências, subscritos
- **Operadores:** ±, ×, ÷, ·, ∗, ∘, ∙
- **Relações:** ≥, ≤, ≠, ≈, ≡, ∝, ∼, ≅
- **Cálculo:** ∫, ∬, ∭, ∮, Σ, ∏, lim, ∂, ∇
- **Delimitadores:** ( ), [ ], { }, | |, ‖ ‖, ⟨ ⟩
- **Setas:** →, ←, ⇒, ⇐, ↔, ⇔, ↦, ↑, ↓
- **Gregas Min.:** α, β, γ, δ, ε, ζ, η, θ, ι, κ, λ, μ...
- **Gregas Mai.:** Γ, Δ, Θ, Λ, Ξ, Π, Σ, Υ, Φ, Ψ, Ω
- **Símbolos:** ∞, ∃, ∀, ∈, ∉, ⊂, ⊃, ∪, ∩, ∅, ℕ, ℤ, ℚ, ℝ, ℂ
- **Matrizes:** 2x2, 3x3, determinantes, sistemas, vetores
- **Funções:** sin, cos, tan, log, ln, max, min, gcd

## 📁 Estrutura do Projeto

```
formula-editor/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── FormulaEditor.js # Componente principal
│   ├── App.js
│   └── index.js
└── package.json
```

## 🛠️ Tecnologias

- **React 18** - Interface moderna e componentes
- **Bootstrap 5.3** - Estilização responsiva  
- **MathJax 3** - Renderização matemática SVG
- **JavaScript ES6+** - Lógica da aplicação

## 🏆 Vantagens

- ✅ **100% independente** - Funciona offline
- ✅ **120+ comandos** organizados logicamente
- ✅ **Interface moderna** e intuitiva
- ✅ **Preview instantâneo** com MathJax
- ✅ **Download SVG** de alta qualidade
- ✅ **Zero dependências** externas
- ✅ **Código limpo** e bem documentado

## 💡 Exemplos de LaTeX

```latex
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}           # Fórmula de Bhaskara
\int_{a}^{b} f(x) dx = F(b) - F(a)          # Teorema Fundamental do Cálculo
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}  # Série de Basel
\begin{pmatrix} a & b \\ c & d \end{pmatrix}  # Matriz 2x2
```
