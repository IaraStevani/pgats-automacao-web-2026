# Relatório resumido — seletores XPath

## Escopo

Adaptação da spec `cypress/e2e/2.2-test-cases-exercice-xpath.cy.js` para utilizar `cy.xpath()` em todos os elementos da interface.

## Percepções

- **Legibilidade:** XPath é mais verboso que CSS, sobretudo ao testar classes. Seletores baseados em `data-qa`, `id` e `href` continuam claros e expressam bem a intenção do teste.
- **Estabilidade:** foram eliminados seletores posicionais como `:nth-child(...)`. No checkout, os elementos passaram a ser localizados por texto funcional, atributo ou semântica, reduzindo acoplamento ao layout.
- **Velocidade:** XPath percorre o DOM por meio do plugin e tende a ter pequeno custo adicional em relação ao CSS nativo. Nesta suíte, o tempo total é dominado pela navegação, requisições e renderização do site remoto; não se espera impacto prático relevante.
- **Manutenção:** XPath é útil para relacionamentos e busca por texto, mas CSS com `data-*` permanece mais simples e geralmente mais rápido quando XPath não é uma exigência.

## Recomendações

1. Priorizar `data-qa`, `id` e atributos funcionais também nos XPath.
2. Evitar XPath absoluto e índices de posição.
3. Usar texto somente quando ele for parte estável da regra de negócio.
4. Não misturar CSS e XPath na mesma spec de demonstração.
