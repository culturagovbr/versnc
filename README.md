# Versnc
[![Maintainability](https://api.codeclimate.com/v1/badges/7eafd90c059488f7a7b4/maintainability)](https://codeclimate.com/github/culturagovbr/versnc/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7eafd90c059488f7a7b4/test_coverage)](https://codeclimate.com/github/culturagovbr/versnc/test_coverage)
[![Build Status](https://travis-ci.org/culturagovbr/versnc.svg?branch=master)](https://travis-ci.org/culturagovbr/versnc)

VerSNC é um projeto que utiliza a API do SNC para exibir dados em outros formatos que não estão planejados na primeira plataforma. Utiliza Angular 5, Angular Material e outras tecnologias para desenvolver uma interface web de fácil utilização.

Este projeto foi gerado usando [Angular CLI](https://github.com/angular/angular-cli) versão 1.6.4.

## Backend
O código fonte da plataforma original e da API podem ser encontrados em [https://github.com/culturagovbr/sistema-nacional-cultura](https://github.com/culturagovbr/sistema-nacional-cultura)

## Servidor de Desenvolvimento

Execute um `npm install` para instalar todas as dependências.

Execute `ng serve` para usar o servidor de desenvolvimento. Navegue para `http://localhost:4200/`. A aplicação será recarregada automaticamente cada vez que algum arquivo for alterado.

## Code scaffolding

Execute `ng generate component component-name` para gerar um novo componente. Você também pode usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Construção

Execute `ng build` para construir o projeto. Artefatos gerados durante a construção estarão armazenados no diretório `dist/`. Use o parametro `-prod` para uma construção pronta para produção.

Em caso de ambiente que não detenha as configurações necessárias, pode se usar o conteiner docker para efetuar  build do projeto através do comando `docker-compose up`.

## Executar testes unitários

Execute `yarn test` para executar os testes unitários através de [Jest](http://facebook.github.io/jest).
Você pode ainda usar `yarn test:partial` para executar apenas os ultimos testes adicionados desde o ultimo commit.
E também `yarn test:coverage` para gerar os relatório de cobertura dos testes unitários.

## Executar os testes E2E

Execute `yarn e2e` para executar os testes end-to-end(aceitação) através do [Cypress](https://cypress.io).

## Maiores informações

Para obter mais ajuda com o Angular CLI, use `ng help` ou verifique o [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
