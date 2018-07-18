describe('' +
  'Teste E2E Versnc Frontend', function () {

    beforeEach(function () {
      // cy.api();
    });

    it('Retorna 200 OK ao acessar a raiz', () => {
      cy.visit('http://localhost:4200/');
    });

    it('Apresenta descrição Consulte seu Estado ou Município', () => {
      cy.visit('http://localhost:4200/home');
      cy.get('app-root snc-busca h4').contains('Consulte seu Estado ou Município');
    });

    it('Apresenta Tabela na Pagina Inicial', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('app-root snc-table mat-card');
    });

    it('Apresenta título MUNICÍPIO na tabela da Página Inicial após pesquisa', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-sort-header-button').contains('MUNICÍPIO');
    });

    it('Apresenta título DATA DA ADESÃO na tabela da Página Inicial após pesquisa', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-sort-header-button').eq(1).contains('DATA DA ADESÃO');
    });

    it('Apresenta título DETALHAR na tabela da Página Inicial após pesquisa', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-header-cell').eq(2).contains('DETALHAR');
    });

    it('Apresenta 10 elementos referentes aos municipios', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row').should('have.length', 10);
    });

    it('Apresenta o componente de paginação', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('app-root snc-table mat-card mat-paginator');
    });

    it('Apresenta dados nas linhas da tabela', () => {
      cy.api();
      cy.visit('http://localhost:4200/tabela-uf-municipio');
      cy.get('app-root snc-table mat-card mat-table mat-row').should('not.be.empty');
    });

    it('Testa pesquisa do Nome do Município na Busca Simples', () => {
      cy.apiSimples();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('Malhada{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Malhada - BA ');
    });

    it('Testa pesquisa do Nome do Estado por extenso na Busca Simples', () => {
      cy.api_busca_uf();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('Distrito Federal{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Brasília - DF ');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(3).contains(' Distrito Federal ');
    });


    it('Testa pesquisa da Sigla do Estado por extenso na Busca Simples', () => {
      cy.api_busca_uf();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('DF{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Brasília - DF ');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(3).contains(' Distrito Federal ');
    });


    it('Testa mudança da Busca Simples p/ Busca Avançada após click no botão de Abrir Filtros', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).contains('Abrir Filtros');
    });

    it('Testa input Municipio - Busca Avançada', () => {
      cy.apiSimples();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('input').eq(1).type('Malhada{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Malhada - BA ');
    });

    it('Testa input da sigla do Estado - Busca Avançada', () => {
      cy.api_busca_uf();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('input').eq(0).type('DF{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Brasília - DF ');
    });

    it('Testa a pesquisa do nome do Estado por extenso ', () => {
      cy.api_somente_municipios();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('input').eq(0).type('Distrito Federal{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Brasília - DF ');
    });

    it('Testa retorno de SOMENTE MUNÌCIPIOS na busca Avançada', () => {
      cy.api_somente_municipios();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('section mat-checkbox').eq(0).click();

      cy.get('input').eq(0).type('BA{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row').eq(0).contains(' Arataca - BA ');
      cy.get('app-root snc-table mat-card mat-table mat-row').eq(1).contains(' Aporá - BA ');
    });

    it('Testa retorno de SOMENTE ESTADOS na busca Avançada', () => {
      cy.api_somente_estados();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('section mat-checkbox').eq(1).click();

      cy.get('input').eq(0).type('{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row').eq(0).contains(' São Paulo ');
      cy.get('app-root snc-table mat-card mat-table mat-row').eq(1).contains(' Minas Gerais ');
    });


    it('Testa a opção de ADESÃO A PARTIR DE, na Busca Avançada', () => {
      cy.api_data_adesao_min();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();

      cy.get('input').eq(2).type('11/10/2017{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Morada Nova de Minas - MG ');
    });

    it('Testa a opção de ADESÃO ATÉ A DATA, na Busca Avançada', () => {
      cy.api_data_adesao_max();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();

      cy.get('input').eq(3).type('1/1/2016{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Aparecida de Goiânia - GO ');
    });

    it('Testa ordenação alfabética ASC da tabela ao clicar no titulo MUNICÍPIO', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-sort-header-button').eq(0).contains('MUNICÍPIO').click();

      cy.get('mat-cell').eq(0).contains(' Aporá - BA ');
      // cy.get('mat-cell').eq(0).contains(/^A\w+\s-\s\w+/);
    });

    it('Testa ordenação alfabética DESC da tabela ao clicar no titulo MUNICÍPIO', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-sort-header-button').eq(0).contains('MUNICÍPIO').click().click();

      cy.get('mat-cell').eq(0).contains(' Porto do Mangue - RN ');
    });

    it('Testa se a quantidade de municípios retornados pela busca está correto na descrição acima da tabela', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');

      cy.get('div h3.total.ng-star-inserted').contains('Municípios: 2967');
    });

  });
