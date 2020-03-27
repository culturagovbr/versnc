export class FiltroComponentes {
  constructor(
    public lei: Filtro,
    public fundo_cultura: Filtro,
    public fundo_cultura_cnpj: Filtro,
    public orgao_gestor: Filtro,
    public plano: Filtro,
    public plano_meta: Filtro,
    public conselho: Filtro,
    public conselho_lei: Filtro,
    public adesao: Filtro
  ) {
    this.lei = new Filtro(false),
      this.fundo_cultura = new Filtro(false),
      this.fundo_cultura_cnpj = new Filtro(false),
      this.orgao_gestor = new Filtro(false),
      this.plano = new Filtro(false),
      this.plano_meta = new Filtro(false),
      this.conselho = new Filtro(false),
      this.conselho_lei = new Filtro(false),
      this.adesao = new Filtro(false)
  }
}

export class Filtro {
  constructor(
    public filtrar: boolean
  ) {
    this.filtrar = false;
  }
}
