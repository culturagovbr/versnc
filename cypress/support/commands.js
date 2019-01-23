// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// PARA ABRIR NO MODO WEB O CYPRESS EXECUTE O COMANDO
//
// node_modules/.bin/cypress open
//
//************************************************
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('api', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=&ente_federado=&situacao_adesao=6',    
    response: 'fixture:entidadeResponse'        // and force the response to be: []
  })
 });

Cypress.Commands.add('api_linha_expansivel', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=&ente_federado=&situacao_adesao=6',
    response: 'fixture:componentesExpand'        // and force the response to be: []
  })
 });

Cypress.Commands.add('api_componentes', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=true&municipal=true&ente_federado=&situacao_adesao=6&' +
    'situacao_lei_sistema=2&situacao_lei_sistema=3&situacao_plano_cultura=2&situacao_plano_cultura=3&situacao_orgao_gestor=2&situacao_orgao_gestor=3&situacao_fundo_cultura=2&situacao_fundo_cultura=3&' +
    'situacao_conselho_cultural=2&situacao_conselho_cultural=3'
  }).as('componentes')
 });

Cypress.Commands.add('apiSimples', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&nome_municipio=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=&ente_federado=Malhada&situacao_adesao=6',
    response: 'fixture:entidade.json'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_municipio_avancada', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&nome_municipio=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=&ente_federado=Malhada&situacao_adesao=6',
    response: 'fixture:entidade.json'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_busca_uf_avancada', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&nome_municipio=&estado_sigla=DF&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=&ente_federado=&situacao_adesao=6',
    response: 'fixture:DistritoFederal'        // and force the response to be: []
  })
 });

Cypress.Commands.add('api_data_adesao_min', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=11/10/2017&data_adesao_max=' +
    '&nome_uf=&estadual=true&municipal=true&ente_federado=&situacao_adesao=6',    
    response: 'fixture:adesao_11-10-2017'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_data_adesao_max', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=' +
    '1/1/2016&nome_uf=&estadual=true&municipal=true&ente_federado=&situacao_adesao=6',    
    response: 'fixture:adesao_ate_1-1-2016'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_df', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=&ente_federado=Distrito%20Federal&situacao_adesao=6',    // that have a URL that matches '/users/*'
    response: 'fixture:DistritoFederal'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_busca_estado_avancada', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=&ente_federado=Distrito%20Federal&situacao_adesao=6',    // that have a URL that matches '/users/*'
    response: 'fixture:DistritoFederal'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_somente_municipios', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=&municipal=true&ente_federado=&situacao_adesao=6',    
    response: 'fixture:municipalResponse'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_somente_estados', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?limit=&offset=&estado_sigla=&data_adesao_min=&data_adesao_max=&nome_uf=&estadual=true&municipal=&ente_federado=&situacao_adesao=6',    
    response: 'fixture:estadualResponse'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_count_estados', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/?estadual=true',
    response: 'fixture:countEstados'        // and force the response to be: []
  })
});

Cypress.Commands.add('api_count_municipios', () => {
  cy.server()           // enable response stubbing
  cy.route({
    method: 'GET',      // Route all GET requests
    url: 'http://hmg.snc.cultura.gov.br/api/v1/sistemadeculturalocal/?municipal=true',
    response: 'fixture:countMunicipios'        // and force the response to be: []
  })
});

