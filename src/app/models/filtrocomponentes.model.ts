export class FiltroComponentes {
    constructor(
        public lei: Filtro,
        public fundo_cultura: Filtro,
        public orgao_gestor: Filtro,
        public plano: Filtro,
        public conselho: Filtro,
        public adesao: Filtro
    ) {
        this.lei = new Filtro(),
        this.fundo_cultura = new Filtro(),
        this.orgao_gestor = new Filtro(),
        this.plano = new Filtro(),
        this.conselho = new Filtro(),
        this.adesao = new Filtro()
    }
}

export class Filtro {
    constructor(
        public filtrar: boolean
    ) {
        this.filtrar = false;
    }
}