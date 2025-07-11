window.MathJax = {
  loader: {load: ['ui/safe']},
  tex: {
    tags: 'ams',
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    macros: {
      real: "{\\mathbb{R}}",
      rat: "{\\mathbb{Q}}",
      N: "{\\mathbb{N}}",
      lin: "{\\mathcal{L}}",
      eps: "{\\varepsilon}",
      veps: "{\\varepsilon}",
      tr: "{\\text{tr}}",
      diam: "{\\text{diam}}",
      aut: "{\\text{Aut}}",
      ecc: "{\\text{ecc}}",
      spec: "{\\text{spec}}",
      cof: "{\\text{Cof}}",
      rank: "{\\text{rank}}",
      img: "{\\text{img}}",
      spn: "{\\text{span}}",
      limi: "{\\lim_{n\\rightarrow\\infty}}",
      sumo: "{\\sum_{n=1}^{\\infty}}",
      sumz: "{\\sum_{n=0}^{\\infty}}",
      bold: ["{\\bf #1}", 1],
      bs: ["{\\mathbf{#1}}", 1],
      ms: ["{\\mathsf{#1}}", 1],
      dprt: "{\\dot{\\mathcal{P}}}",
      dqrt: "{\\dot{\\mathcal{Q}}}",
      prt: "{\\mathcal{P}}",
      norm: ["{\\left\\| #1\\right\\|}", 1],
      mat: ["{\\mathbb{R}^{#1 \\times #1}}", 1],
      pfrac: ["{\\frac{\\partial #1}{\\partial #2}}",2],    
      dotprod: ["{\\left\\langle #1 \\right\\rangle}",1],    
      ds: "{\\displaystyle}",
      arcsec: "{\\text{arcsec}}",      
      limik: "{\\lim_{k\\rightarrow\\infty}}"      
    }
  }  
};
