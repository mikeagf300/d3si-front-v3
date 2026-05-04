### 2026-04-30

- Transferencias:
    - `ITransfer` y la normalización quedaron alineadas con el contrato del backend al incorporar `completedAt`.
    - La página de detalle de transferencias dejó de depender de `window.location.reload()` y ahora agrega items al estado local.
    - Se corrigió el `params` del page server component para seguir el patrón real de App Router.
    - Se reemplazó el `Label` importado desde `recharts` por el `Label` de UI del proyecto.

### 2026-04-06

- Auth y sesión:
    - El login ahora setea la cookie desde `server actions`.
    - El logout limpia la cookie y el navbar ya no depende del flujo anterior.
    - `/`, `/login` y `/home` quedaron protegidos/redirigidos desde servidor.

- Capa de datos:
    - `fetcher` dejó de depender del store de auth como fuente principal.
    - La cookie pasó a ser la referencia común para SSR y cliente.

- `home`:
    - Se extrajo la lógica pesada de `src/app/home/page.tsx` a un view-model.
    - Se separó la composición visual en `HomeDashboard`.
    - Se ordenaron filtros y agregaciones por tienda/fecha.

- Infraestructura:
    - Se eliminó `next/font/google` del layout raíz para evitar dependencia externa en build.

### 2026-04-08

- Usuarios y tiendas:
    - Se normalizaron las relaciones `userStores` como contrato base.
    - Las acciones de `users` y `stores` ahora devuelven datos ya normalizados.
    - Los formularios y tablas administrativas dejaron de depender del nombre viejo `Stores`/`Users`.

### 2026-04-09

- Inventario y transferencias:
    - `storeproduct` e `inventory` quedaron alineados al backend real (`/inventory/store/{storeID}` y `/inventory/movements`).
    - Se centralizó la normalización de `StoreProduct` y productos para no duplicar mapeos.
    - El helper viejo `transferStock` quedó deprecado porque el backend ya no expone ese endpoint.

### 2026-04-12

- Ventas:
    - Se corrigió el contrato de alta para que `variationID` salga de la variación real del producto.
    - Se agregó un normalizador de ventas para soportar respuestas crudas con shapes mixtos y dejar el UI estable.
    - `getResume` ahora construye `from`/`to` para ajustarse al contrato documentado de `/reports/sales`.
    - La anulación de ventas cayó al contrato documentado de estado (`PATCH /sales/{id}/status`) porque el backend JSON no expone un flujo de devoluciones.

- Transferencias:
    - Se normalizó la respuesta de `/transfers` y `/transfers/{id}` para soportar `originStore` y `destinationStore` anidados.
    - `addTransferItem` ahora procesa la respuesta correcta del backend en lugar de asumir una transferencia completa.

- Pricing:
    - Se revisó el modal de precios y se preservaron `scope` y `exclusive` al actualizar ofertas existentes.

### 2026-04-13

- Órdenes de compra:
    - `purchase-orders` quedó normalizado al shape documentado por backend (`store`, `items`, `paymentStatus`, `issueDate`).
    - Las actions de listado, detalle, creación, edición, verificación y estado ya devuelven datos normalizados.
    - Se amplió el item de OC para conservar `purchaseOrderItemID`, `subtotal` y cantidades recibidas/solicitadas.
    - La verificación quedó como operación sin retorno porque el backend JSON la documenta como respuesta vacía.

- Limpieza:
    - Se eliminó el flujo muerto `deleteOrder` porque no tenía respaldo en el backend JSON ni UI activa.
    - Se quitó la reasignación de props en `PurchaseOrderTable` y el `restOrder` sin uso del hook de inicialización.
    - Se removieron `console.log` de debug y tipos exportados que no se consumían en el área de órdenes.
    - Se retiró un bloque WooCommerce huérfano que ya no tenía consumidores en el repo.

### 2026-04-14

- Inventario:
    - Se retiraron imports, comentarios y ramas muertas en `InventoryTable`.
    - Se simplificó el `rowSpan` de variaciones para eliminar un `any` innecesario.
    - Se limpió la página de inventario de restos de integración WooCommerce que ya no tenían uso.

- Pricing:
    - Se mantuvo el bloque estable, revisando solo residuos sin tocar el contrato con backend.

### 2026-04-15

- Pricing:
    - Se retiró `console.error` del modal de descuentos porque el flujo ya queda cubierto con `toast`.
    - Se corrigió un check falso sobre `priceList` para no ocultar un precio válido en cero.
    - Se ajustó el `useEffect` del modal de pricing para depender de `storeProduct`, `storeID` y `variationID`, y así volver a consultar cuando cambia el contexto real.
    - Se simplificaron las actions de pricing quitando `await` redundantes frente a `fetcher`.

### 2026-04-16

- Pricing:
    - El modal de pricing ahora precarga la oferta activa cuando entra en modo edición, para no abrir un formulario vacío con datos ya existentes.
    - Se eliminó la aserción no nula sobre `activeOffer` y se redujo la repetición de acceso al estado.
    - Se dejó el bloque sin `console.*` y sin residuos visibles en las actions de pricing.

### 2026-04-17

- Ventas:
    - Se quitó el refetch del detalle dentro de `getSales` para las ventas anuladas, porque el listado ya trae la información necesaria y ese segundo llamado podía provocar un 404 innecesario con `Venta con ID ... no encontrada`.

### 2026-04-20

- Ventas:
    - Se compactó el store del carrito para guardar solo identidad, tienda, stock, precios y estado mínimo de oferta, evitando persistir objetos completos de producto/tienda.
    - `SaleForm` ahora valida que la tienda de la venta sea una tienda real, rechaza carritos mezclados entre tiendas y usa el `saleID` devuelto por el backend para navegar.
    - `createNewSale` dejó de tragarse el error para exponer el mensaje real del backend durante el alta.

### 2026-04-21

- UI:
    - Se rediseñó el modal de descuentos con una cabecera más clara, bloques visuales por sección y un CTA más fuerte.
    - El formulario ahora muestra un resumen del producto seleccionado, el alcance, el estado y la vigencia de forma más legible.
    - Se mantuvo intacta la lógica de creación y solo se cambió la presentación.

### 2026-04-22

- Pricing UI:
    - Se formateó el precio catálogo del modal de descuentos para mostrar moneda local en vez de un número plano.
    - Se mantuvo el flujo de guardado intacto y solo se afinó la lectura visual de los datos.
- Terminología:
    - En el modal de descuentos se corrigió `Precio catálogo` por `Precio lista` para dejar explícito que el valor mostrado es el de venta al público, no el costo.
- Pricing / inventario:
    - Se corrigió la normalización de producto para que `priceList` salga de `priceList` real del backend y no de `priceCost`.
    - Se extendió `IStoreProduct` con `priceListStore` para mantener separados el precio lista y el costo en el modelo frontend.

### 2026-04-24

- Ventas:
    - `DailyResumeCards` se alineó al contrato real de `ISalesResume` y ahora muestra el resumen del día con `today`, `debitoCredito` y `efectivo`.
    - Se eliminó la referencia rota a `todaySales` y se dejó el componente con métricas claras para caja.
- Ventas / tipos:
    - Se corrigió el nombre del tipo público del resumen: `DailyResumeCards` volvió a usar `IResume`.
    - Se agregaron alias de compatibilidad internos `ISalesResume` e `ICountAmountResume` para no romper los helpers viejos de resumen que todavía trabajan con `today/yesterday/last7/month`.
    - `saleToResume` y `totalsDebitoCredito` quedaron alineados con ese contrato interno.

### 2026-04-25

- Limpieza de duplicación:
    - `getStoreInventory` quedó como alias de `getStoreStock` porque ambos llamaban el mismo endpoint y usaban la misma normalización.
    - Se redujo una ruta duplicada de inventario por tienda sin cambiar el contrato consumido por la UI.
- Utilidades de fecha:
    - Se centralizó la lógica de fecha de Chile en `src/utils/chile-date.ts`.
    - `home-view-model`, `getSalesForResume` y `saleToResume` dejaron de duplicar el `Intl.DateTimeFormat` y el cálculo de metadatos diarios.
    - La extracción no cambió el comportamiento, solo quitó repetición entre capas.

### 2026-04-27

- Normalización y anulaciones:
    - Se agregó `src/lib/normalize-helpers.ts` para centralizar `pickFirst`, `pickArray`, `toNumber` y `toStringValue`.
    - `normalize-product`, `normalize-sale` y `normalize-purchase-order` quedaron más compactos y con menos cadenas repetidas de `??`.
    - `getAnulatedProducts` se simplificó para hacer una sola agregación sobre los items de devolución y eliminar pasos intermedios innecesarios.
    - Se eliminó `src/utils/totalsDebitoCredito.ts` porque no tenía consumidores en el repo.

### 2026-04-28

- Relaciones usuario-tienda:
    - `normalize-user-store.ts` quedó compacto usando los mismos helpers de normalización.
    - Se mantuvo la compatibilidad con alias legacy (`Store`, `User`, `Stores`, `Users`) pero sin repetir la lógica de selección en cada normalizador.

### 2026-04-29

- Home y resumen:
    - `home-view-model` dejó de buscar tiendas con `find` repetido y pasó a usar un índice por `storeID`.
    - Se eliminó `resumeSales` del modelo público porque era un intermediario interno sin consumo externo.
    - `getSalesForResume` reutiliza `toChileMiddayUTC` y ya no construye la fecha de referencia manualmente.
- Selección inicial de tienda:
    - `LoginForm` ahora usa `/users/{id}/stores` para resolver las tiendas del usuario autenticado.
    - `HomePage` resuelve el `storeID` inicial desde la lista del usuario cuando no llega por `searchParams`, evitando caer al fallback global de `stores[0]`.
    - La selección manual por `FilterControls` se mantiene intacta; solo cambió la fuente del default.

### 2026-04-30

- Auth y shape de usuario:
    - `login` y `checkStatus` ahora normalizan el usuario antes de devolverlo, para aceptar respuestas crudas con `id` o `userID`.
    - `normalizeUser` quedó tolerante a `id` además de `userID`.
    - `getUserStores` dejó de llamar al backend con un id vacío y retorna `[]` en ese caso.
- Login:
    - `LoginForm` dejó de hacer doble fetch a `getAllUsers()` y `getAllStores()`.
    - La selección inicial de tienda ahora depende solo de `/users/{id}/stores`, que es la fuente correcta del usuario autenticado.
    - Se eliminó la rama de compatibilidad que caía a todas las tiendas cuando no había datos del usuario.
- Home:
    - La resolución del `storeID` por defecto salió del `buildHomeViewModel` y pasó a `HomePage`.
    - El view-model ahora solo construye datos con el `storeID` ya resuelto por la página.
    - Si no llega `storeID` por URL, la página usa la primera tienda del usuario autenticado como default.
