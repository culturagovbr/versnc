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

    it('Apresenta título ENTE FEDERADO na tabela da Página Inicial após pesquisa', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-sort-header-button').contains('ENTE FEDERADO');
    });

    it('Apresenta título MUNICÍPIO para pesquisa de somente Municípios', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('mat-checkbox').eq(0).click();
      cy.get('input').eq(1).type('{enter}');

      cy.get('.mat-sort-header-button').contains('MUNICÍPIO');
    });

    it('Apresenta título ESTADO para pesquisa de somente Estados', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('mat-checkbox').eq(1).click();
      cy.get('input').eq(1).type('{enter}');

      cy.get('.mat-sort-header-button').contains('ESTADO');
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

    it('Apresenta 10 elementos referentes aos municipios e a linha expansível', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row').should('have.length', 10);
    });

    it('Criação de uma nova linha após o click em alguma das linhas da tabela', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('mat-table mat-row').eq(0).click();
      cy.get('mat-table div.mat-row');
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
      cy.api_df();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('Distrito Federal{enter}');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Brasília - DF ');
      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(3).contains(' Distrito Federal ');
    });


    it('Testa pesquisa da Sigla do Estado na Busca Simples', () => {
      cy.api_busca_uf_simples();
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
      cy.api_municipio_avancada();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('input').eq(1).type('Malhada{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Malhada - BA ');
    });

    it('Testa input da sigla do Estado - Busca Avançada', () => {
      cy.api_busca_uf_avancada();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('input').eq(0).type('DF{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Brasília - DF ');
    });

    it('Testa a pesquisa do nome do Estado por extenso - Busca Avançada ', () => {
      cy.api_busca_estado_avancada();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('input').eq(0).type('Distrito Federal{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row mat-cell').eq(0).contains(' Brasília - DF ');
    });

    it('Testa retorno de SOMENTE MUNÌCIPIOS na busca Avançada', () => {
      cy.api_somente_municipios();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('mat-checkbox').eq(0).click();

      cy.get('input').eq(0).type('BA{enter}');

      cy.get('app-root snc-table mat-card mat-table mat-row').eq(0).contains(' Arataca - BA ');
      cy.get('app-root snc-table mat-card mat-table mat-row').eq(1).contains(' Aporá - BA ');
    });

    it('Testa retorno de SOMENTE ESTADOS na busca Avançada', () => {
      cy.api_somente_estados();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();
      cy.get('mat-checkbox').eq(1).click();

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

    it('Testa ordenação alfabética ASC da tabela ao clicar no titulo ENTE FEDERADO', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-sort-header-button').eq(0).contains('ENTE FEDERADO').click();

      cy.get('mat-cell').eq(0).contains(' Antonina do Norte - CE ');
    });

    it('Testa ordenação alfabética DESC da tabela ao clicar no titulo ENTE FEDERADO', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('.mat-sort-header-button').eq(0).contains('ENTE FEDERADO').click().click();

      cy.get('mat-cell').eq(0).contains(' São Sebastião da Amoreira - PR ');
    });

    it('Testa se a quantidade de municípios retornados pela busca está correto na descrição acima da tabela', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');

      cy.get('div h3.total').eq(1).contains('Municípios: 3018');
    });

    it('Testa se a quantidade de estados retornados pela busca está correto na descrição acima da tabela', () => {
      cy.api();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');

      cy.get('div h3.total').eq(0).contains('Estados: 24');
    });

    it('Testa linha expansível com situações positivas', () => {
      cy.api_linha_expansivel();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('mat-row').eq(0).click();

      cy.get('.detail-row').should('be.visible');
      cy.get('.detail-row').contains('Lei Sistema').contains('check');
      cy.get('.detail-row').contains('Orgao Gestor').contains('check');
      cy.get('.detail-row').contains('Conselho Cultural').contains('check');
      cy.get('.detail-row').contains('Fundo Cultura').contains('check');
      cy.get('.detail-row').contains('Plano Cultura').contains('check');
      cy.get('.detail-row p').should('not.be.empty');

      cy.get('mat-row').eq(0).click();
      cy.get('.detail-row').should('not.be.visible');
    });

    it('Testa linha expansível com situações negativas', () => {
      cy.api_linha_expansivel();
      cy.visit('http://localhost:4200/');
      cy.get('input').type('{enter}');
      cy.get('mat-row').eq(1).click();

      cy.get('.detail-row').should('be.visible');
      cy.get('.detail-row').contains('Lei Sistema').contains('close');
      cy.get('.detail-row').contains('Orgao Gestor').contains('close');
      cy.get('.detail-row').contains('Conselho Cultural').contains('close');
      cy.get('.detail-row').contains('Fundo Cultura').contains('close');
      cy.get('.detail-row').contains('Plano Cultura').contains('close');
      cy.get('.detail-row p').should('not.be.empty');

      cy.get('mat-row').eq(1).click();
      cy.get('.detail-row').should('not.be.visible');
    });    

    it('Testa filtro de componentes com checkboxs ativos', () => {
      cy.api_componentes();
      cy.visit('http://localhost:4200/');
      cy.get('.alinhamento').eq(1).click();

      cy.get('.mat-checkbox-input').eq(2).click({ force: true });
      cy.get('.mat-checkbox-input').eq(3).click({ force: true });
      cy.get('.mat-checkbox-input').eq(4).click({ force: true });
      cy.get('.mat-checkbox-input').eq(5).click({ force: true });
      cy.get('.mat-checkbox-input').eq(6).click({ force: true });

      cy.get('input').eq(1).type('{enter}');

      cy.get('mat-table').children('mat-row').each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.get('.detail-row').contains('Lei Sistema').contains('check');
        cy.get('.detail-row').contains('Orgao Gestor').contains('check');
        cy.get('.detail-row').contains('Conselho Cultural').contains('check');
        cy.get('.detail-row').contains('Fundo Cultura').contains('check');
        cy.get('.detail-row').contains('Plano Cultura').contains('check');
      });
    });

});
