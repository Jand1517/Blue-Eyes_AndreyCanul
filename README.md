# Blue-Eyes Card Explorer

Aplicación Angular para buscar cartas de Yu-Gi-Oh!, consultar sus características y recorrer las cartas del arquetipo Blue-Eyes con información de YGOPRODeck.

## Requisitos

- Node.js compatible con Angular 21.
- npm.

## Desarrollo

```bash
npm install
npm start
```

Abre `http://localhost:4200/`. La aplicación consulta la API pública desde el navegador; se requiere conexión a internet.

## Funciones

- Búsqueda parcial por nombre con RxJS: espera 350 ms tras escribir, elimina términos repetidos y cancela solicitudes anteriores.
- Resultados en tarjetas reutilizables con imagen y características disponibles.
- Detalle con descripción, tipo, atributo, nivel, ATK, DEF y arquetipo.
- Impresiones Blue-Eyes con expansión, código, rareza y precio de cada set.
- Colección del arquetipo consultada con `archetype=Blue-Eyes`; el selector de expansiones se genera y deduplica desde `card_sets` de la respuesta.
- Estados visibles de carga, resultados, lista vacía y error, con opción de reintento.
- Propiedades opcionales de las cartas tratadas sin asumir campos que la API omite.

## API

Servicio base: `https://db.ygoprodeck.com/api/v7/cardinfo.php`

- Búsqueda: `fname`, con `num=30` y `offset=0`.
- Colección: `archetype=Blue-Eyes`.

La estructura de los datos está definida en `src/app/models/card.model.ts` y las peticiones se centralizan en `src/app/services/yugioh.service.ts`.

## Comprobaciones

```bash
npm run build
npm test -- --watch=false
```

La interfaz separa la búsqueda, las tarjetas, el detalle de carta y la colección Blue-Eyes en componentes independientes.
