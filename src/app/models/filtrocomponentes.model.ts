export class FiltroComponentes {
    constructor(
        public lei: Filtro,
        public fundo_cultura: Filtro,
        public orgao_gestor: Filtro,
        public plano: Filtro,
        public conselho: Filtro,
        public adesao: Filtro
    ) {
        this.lei = new Filtro(false),
        this.fundo_cultura = new Filtro(false),
        this.orgao_gestor = new Filtro(false),
        this.plano = new Filtro(false),
        this.conselho = new Filtro(false),
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