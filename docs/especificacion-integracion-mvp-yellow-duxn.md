# Especificación de integración modular y MVP

**Producto:** Yellow Duxn  
**Propósito:** Transformar el diseño de la Suite Nativa en unidades de implementación independientes, integrables en una sola aplicación.  
**Estado:** Propuesta técnica; no presupone un marco, lenguaje ni proveedor de infraestructura.

## 1. Resultado de implementación esperado

La aplicación de Yellow Duxn debe cargar herramientas nativas como módulos registrados, no como aplicaciones separadas. La navegación, sesión, perfil, accesibilidad y notificaciones permanecen en el shell principal. Cada módulo aporta sus rutas, componentes, permisos, datos, eventos y pruebas, y puede activarse de forma gradual mediante una bandera de funcionalidad.

| Criterio | Decisión de implementación |
|---|---|
| Experiencia de una sola aplicación | Un solo shell web/móvil y una navegación centralizada; los módulos renderizan rutas internas. |
| Separación de código | Paquetes o dominios independientes con dependencias declaradas y sin importaciones directas entre datos privados. |
| Seguridad | Autorización en servidor por permiso; los controles de interfaz solo mejoran la experiencia, no conceden acceso. |
| Interoperabilidad | Eventos versionados y APIs internas contractuales; no se comparten tablas entre módulos. |
| Operación gradual | Banderas de funcionalidad por módulo, usuario, organización, región y entorno. |
| Sin descargas adicionales | Edición, analítica, vitrinas y billetera se resuelven mediante vistas y servicios propios de Yellow Duxn. |

## 2. Estructura recomendada del proyecto

La siguiente estructura separa herramientas sin convertirlas en productos aislados. Si el equipo adopta un monorepositorio, los directorios pueden ser paquetes; si adopta servicios separados, cada módulo conserva la misma frontera de dominio y contrato.

```text
/apps
  /yellow-duxn-shell                 # Navegación, sesión, perfil, feed y registro de módulos
/packages
  /design-system                     # Componentes, tokens, accesibilidad e iconos
  /module-contracts                  # Tipos, manifiestos, permisos y clientes de eventos
  /shared-ui                         # Componentes no específicos de dominio
/modules
  /studio                            # STUDIO: contenido y adjuntos de oferta
  /market                            # MARKET: ofertas, elegibilidad y solicitudes
  /links                             # LINKS: vínculos, códigos y atribución
  /showcase                          # SHOWCASE: vitrinas y colecciones
  /campaigns                         # CAMPAIGNS: campañas, tareas y participantes
  /pulse                             # PULSE: consultas y visualizaciones analíticas
  /wallet                            # WALLET: libro mayor, comisiones y retiros
  /community                         # COMMUNITY: grupos, retos y recursos
/services
  /identity-adapter                  # Adaptador al sistema de sesión/perfil existente
  /event-gateway                     # Validación, publicación y consumo de eventos
  /audit                             # Auditoría inmutable de acciones sensibles
  /feature-flags                     # Banderas y segmentación de despliegues
  /trust                             # Moderación, riesgo, disputas y cumplimiento
/docs
  arquitectura-herramientas-nativas-yellow-duxn.md
  diseno-modulos-y-flujos-yellow-duxn.md
  especificacion-integracion-mvp-yellow-duxn.md
```

Cada módulo expone una única puerta de entrada, por ejemplo `registerModule(context)`. El shell proporciona el contexto con identidad, permisos evaluados, navegación, tema, telemetría, cliente de eventos y servicios compartidos; el módulo no accede de forma directa a la implementación del shell.

## 3. Manifiesto de integración

El manifiesto es el contrato mínimo para integrar una herramienta. El contenido siguiente es pseudocódigo de tipo y no depende de TypeScript; representa las propiedades que cualquier tecnología debe cumplir.

```ts
interface NativeModuleManifest {
  id: string;                         // Ejemplo: "market"
  version: string;                    // Ejemplo: "1.0.0"
  displayName: string;
  featureFlag: string;
  navigation: Array<{
    label: string;
    route: string;
    icon: string;
    requiredPermissions: string[];
  }>;
  routes: Array<{
    path: string;
    page: string;
    requiredPermissions: string[];
  }>;
  permissions: string[];
  eventsPublished: string[];
  eventsConsumed: string[];
  ownership: {
    dataDomains: string[];
    apiPrefix: string;
  };
}
```

| Módulo | Bandera inicial | Prefijo de API | Rutas principales | Permisos base |
|---|---|---|---|---|
| STUDIO | `native_studio_v1` | `/api/studio` | `/crear`, `/borradores/:id` | `content.create`, `content.publish` |
| MARKET | `native_market_v1` | `/api/market` | `/ofertas`, `/ofertas/:id` | `offers.read`, `offers.create` |
| LINKS | `native_links_v1` | `/api/links` | `/mis-enlaces`, `/mis-enlaces/:id` | `attribution.create`, `attribution.read.own` |
| SHOWCASE | `native_showcase_v1` | `/api/showcase` | `/vitrina/:alias`, `/mi-vitrina` | `showcase.manage.own` |
| CAMPAIGNS | `native_campaigns_v1` | `/api/campaigns` | `/campanas`, `/campanas/:id` | `campaigns.create`, `campaigns.manage` |
| PULSE | `native_pulse_v1` | `/api/pulse` | `/resultados` | `analytics.read.own`, `analytics.read.organization` |
| WALLET | `native_wallet_v1` | `/api/wallet` | `/billetera`, `/billetera/movimientos/:id` | `wallet.read.own`, `wallet.withdraw` |
| COMMUNITY | `native_community_v1` | `/api/community` | `/comunidades`, `/comunidades/:id` | `community.join`, `community.manage` |

## 4. Fronteras de datos y modelos mínimos

Cada módulo es propietario de sus entidades. Toda referencia a información externa debe realizarse mediante un identificador estable, nunca duplicando datos financieros o de identidad que otra herramienta controla.

| Módulo | Entidades propias | Referencias permitidas | Restricción esencial |
|---|---|---|---|
| STUDIO | `draft`, `content_item`, `content_offer_attachment` | `user_id`, `offer_id`, `campaign_id`, `attribution_link_id` | No confirma comisiones ni modifica condiciones de oferta. |
| MARKET | `offer`, `offer_terms_version`, `affiliate_application`, `offer_asset` | `organization_id`, `user_id`, `campaign_id` | Toda condición publicada se versiona; una edición no reescribe las condiciones aceptadas. |
| LINKS | `attribution_link`, `attribution_touch`, `promo_code` | `offer_id`, `user_id`, `campaign_id`, `showcase_id` | No decide una comisión; registra el contexto de atribución. |
| SHOWCASE | `showcase`, `collection`, `showcase_item` | `user_id`, `offer_id`, `attribution_link_id` | Solo puede incluir ofertas autorizadas y activas. |
| CAMPAIGNS | `campaign`, `campaign_member`, `campaign_task`, `campaign_invitation` | `offer_id`, `organization_id`, `user_id` | Un gestor no obtiene acceso a la billetera personal de miembros. |
| PULSE | `metric_snapshot`, `analytics_query_cache` | Identificadores de todos los dominios | Es un modelo de lectura; no modifica transacciones de origen. |
| WALLET | `ledger_account`, `ledger_entry`, `commission_case`, `withdrawal_request` | `user_id`, `offer_id`, `conversion_id`, `campaign_id` | Movimientos inmutables y balance derivado del libro mayor. |
| COMMUNITY | `community`, `membership`, `challenge`, `resource` | `user_id`, `campaign_id` | No puede crear recompensas económicas directamente. |

### 4.1 Estados críticos

Las entidades con impacto económico o de reputación deben usar estados explícitos. El diseño prohíbe transiciones implícitas y cambios silenciosos.

| Entidad | Estados MVP | Transiciones autorizadas |
|---|---|---|
| Oferta | `draft`, `review`, `active`, `paused`, `closed`, `archived` | Solo la marca autorizada u operaciones, con auditoría. |
| Solicitud de afiliado | `draft`, `submitted`, `approved`, `rejected`, `withdrawn`, `expired` | MARKET registra autor, fecha y motivo cuando se rechaza. |
| Enlace atribuido | `active`, `paused`, `expired`, `revoked` | LINKS conserva histórico y no reutiliza identificadores. |
| Contenido comercial | `draft`, `scheduled`, `review`, `published`, `rejected`, `archived` | STUDIO y TRUST aplican reglas de publicación. |
| Comisión | `created`, `pending`, `available`, `on_hold`, `reversed`, `paid`, `disputed` | WALLET registra la razón de cada cambio mediante entradas compensatorias. |
| Retiro | `draft`, `submitted`, `requires_action`, `processing`, `paid`, `failed`, `cancelled` | WALLET controla idempotencia y aprobación requerida. |

## 5. APIs internas MVP

El API debe autenticar la sesión y autorizar cada acción en el servidor. Las respuestas de recursos sensibles se limitan al alcance del usuario autenticado o a su organización autorizada. Estos endpoints son propuestas de contrato, no una obligación de estilo REST; pueden implementarse con REST, RPC o GraphQL manteniendo el mismo comportamiento.

| Módulo | Operación | Contrato mínimo |
|---|---|---|
| MARKET | `GET /offers` | Devuelve catálogo filtrado y elegibilidad calculada para el usuario actual. |
| MARKET | `POST /offers/:offerId/applications` | Crea una solicitud idempotente con aceptación de condiciones versionadas. |
| MARKET | `POST /offers` | Crea borrador de oferta para una organización autorizada. |
| LINKS | `POST /links` | Crea un enlace atribuido para una oferta elegible; devuelve destino y estado. |
| LINKS | `GET /links/:id` | Devuelve detalle y rendimiento permitido para el dueño. |
| STUDIO | `POST /drafts` | Crea o actualiza un borrador con referencias de oferta verificadas. |
| STUDIO | `POST /content/:id/publish` | Comprueba elegibilidad, divulgación y estado de moderación antes de publicar. |
| SHOWCASE | `PUT /showcases/:id/items` | Añade, ordena o elimina ofertas elegibles mediante validación atómica. |
| CAMPAIGNS | `POST /campaigns` | Crea campaña en borrador y asocia una versión de condiciones de oferta. |
| PULSE | `GET /analytics/summary` | Devuelve métricas agregadas para filtro, periodo y alcance autorizados. |
| WALLET | `GET /wallet/ledger` | Devuelve movimientos paginados de la cuenta propia; nunca saldo editable. |
| WALLET | `POST /withdrawals` | Crea una solicitud idempotente después de validar requisitos y saldo disponible. |
| COMMUNITY | `POST /communities/:id/join` | Crea membresía conforme a reglas de admisión y control anti-spam. |

### 5.1 Reglas de idempotencia y concurrencia

Las acciones `POST` que crean enlaces, aplicaciones, publicaciones, comisiones o retiros aceptan una clave de idempotencia generada por el cliente. Si el usuario reintenta por una mala conexión, el servidor devuelve el resultado de la primera operación en lugar de duplicar un enlace o una solicitud de retiro. Las ediciones llevan una versión de recurso o fecha de actualización para evitar que una persona sobrescriba cambios recientes de otra.

## 6. Eventos de dominio

Los módulos se comunican con un sobre de evento uniforme. PUBLICAR un evento no da permiso para cambiar la información de otro módulo: el receptor aplica sus propias reglas y puede ignorar el evento si es inválido o no corresponde a una versión soportada.

```json
{
  "id": "evt_01J...",
  "type": "offer.published.v1",
  "occurredAt": "2026-08-11T12:00:00Z",
  "actor": { "userId": "usr_...", "organizationId": "org_..." },
  "subject": { "type": "offer", "id": "off_..." },
  "correlationId": "req_...",
  "payload": { "termsVersionId": "terms_..." }
}
```

| Evento | Emisor | Consumidores | Efecto permitido |
|---|---|---|---|
| `offer.published.v1` | MARKET | STUDIO, SHOWCASE, PULSE | Permite descubrir la oferta y crear vistas de lectura. |
| `affiliate.application_approved.v1` | MARKET | LINKS, STUDIO, CAMPAIGNS | Habilita promoción bajo la versión aprobada de condiciones. |
| `attribution.link_created.v1` | LINKS | STUDIO, SHOWCASE, PULSE | Permite asociar el enlace con una pieza, vitrina o consulta. |
| `content.published.v1` | STUDIO | PULSE, TRUST | Actualiza medición y aplica reglas de monitoreo. |
| `conversion.confirmed.v1` | Servicio de conversión | WALLET, PULSE | WALLET genera movimiento pendiente; PULSE actualiza métricas. |
| `commission.available.v1` | WALLET | PULSE, notificaciones | Refresca datos de resultado y avisa al usuario. |
| `offer.paused.v1` | MARKET | LINKS, STUDIO, SHOWCASE, PULSE | Detiene nuevas promociones y comunica alcance del cambio. |
| `content.reported.v1` | COMMUNITY/STUDIO | TRUST | Abre un caso de moderación auditable. |

## 7. Dependencias compartidas y reglas de acoplamiento

| Servicio compartido | Puede ofrecer | No debe hacer |
|---|---|---|
| Identidad y permisos | Sesión, usuario, organización, permisos evaluados y preferencias de idioma. | Entregar datos personales innecesarios a cada módulo. |
| Archivos y medios | Subida segura, transcodificación, metadatos, URLs firmadas y borrado. | Publicar contenido sin que STUDIO aplique reglas de visibilidad. |
| Notificaciones | Alertas internas y preferencias por canal. | Exponer información de ingresos a destinatarios no autorizados. |
| Búsqueda | Índices de ofertas, vitrinas, campañas y comunidades con controles de visibilidad. | Indexar borradores privados o movimientos de billetera. |
| Auditoría | Actor, acción, recurso, motivo, contexto y resultado de operaciones sensibles. | Convertirse en una fuente editable de saldo o datos de negocio. |
| TRUST | Moderación, riesgo, disputas, requisitos y colas operativas. | Alterar una comisión sin crear el movimiento de WALLET correspondiente. |

La regla operativa es sencilla: **un módulo escribe únicamente su propio dominio; los demás reaccionan por evento o consulta autorizada**. Este límite reduce errores de cálculo, facilita pruebas y permite reemplazar herramientas sin desestabilizar toda la red.

## 8. Plan de entrega por fases

La prioridad no es construir ocho módulos completos de inmediato. El MVP se centra en el ciclo mínimo de una oferta, una publicación con atribución y una comisión visible en estado no pagado. Las capacidades de mayor riesgo económico se habilitan después de validar reglas, auditoría y operación.

| Fase | Capacidades a entregar | Criterio de salida |
|---|---|---|
| **0. Fundaciones** | Shell, registro de módulos, identidad, permisos, banderas, diseño común, auditoría y bus de eventos. | Se puede activar un módulo por organización sin afectar el feed principal. |
| **1. Crear y descubrir** | MARKET de lectura, solicitud de afiliación, LINKS, STUDIO básico y divulgación comercial. | Un afiliado elegible puede elegir una oferta, crear contenido y publicar con enlace válido. |
| **2. Medir y explicar** | SHOWCASE, PULSE personal, eventos de clic y conversión, estados de atribución. | El creador ve métricas y entiende qué se contabiliza, con filtros y definiciones. |
| **3. Comisiones seguras** | WALLET con libro mayor, comisiones pendientes/disponibles, reversos y soporte de casos. | Ningún saldo se modifica sin un movimiento auditable y trazable. |
| **4. Coordinación** | CAMPAIGNS, COMMUNITY, tareas, recursos y controles anti-spam. | Una marca puede coordinar una campaña sin depender de hojas de cálculo externas. |
| **5. Pagos y expansión** | Retiros, verificación, integraciones de pago y requisitos territoriales, tras revisión especializada. | La operación de pagos cumple las políticas y requisitos aplicables del lanzamiento. |

## 9. Pruebas y criterios de aceptación técnicos

| Área | Prueba de aceptación |
|---|---|
| Registro de módulos | Al desactivar `native_market_v1`, desaparecen sus rutas y acciones sin fallar el shell ni otros módulos. |
| Autorización | Una persona sin `wallet.read.organization` no puede consultar movimientos de otra cuenta mediante interfaz ni API. |
| Atribución | No se crea un enlace para una oferta pausada, expirada o no aprobada para el usuario. |
| Contenido | No se publica contenido comercial si falta divulgación o el enlace relacionado está inválido. |
| Integridad financiera | Dos reintentos del mismo retiro con igual clave de idempotencia producen una única solicitud. |
| Auditoría | Pausar una oferta, aprobar un afiliado y registrar un ajuste generan actor, fecha, razón y referencia. |
| Estados de interfaz | Cada ruta dispone de vistas de carga, vacío, acceso denegado, error y éxito revisadas. |
| Accesibilidad | Los recorridos críticos se pueden completar con teclado y los campos tienen etiquetas comprensibles. |

## 10. Riesgos que se deben resolver antes de pagos reales

El diseño está preparado para presentar comisiones y solicitudes de retiro, pero la implementación de pagos reales requiere validar territorio de lanzamiento, entidad responsable, tratamiento fiscal, protección de datos, reglas de devolución, verificación de identidad y proveedor de pagos. Estas decisiones no se sustituyen con una pantalla de “retirar”; deben definirse y revisarse antes de activar la bandera de pago.

| Riesgo | Mitigación de diseño inicial |
|---|---|
| Cálculo incorrecto de comisión | Condiciones versionadas, eventos inmutables y entradas compensatorias en el libro mayor. |
| Fraude de clics o conversiones | Señales de riesgo, límites, revisión y estados `on_hold` sin prometer disponibilidad inmediata. |
| Contenido engañoso | Divulgación contextual, moderación, reportes y restricciones por oferta/campaña. |
| Uso indebido de datos | Permisos de mínimo privilegio, consultas agregadas y separación de datos por dominio. |
| Dependencia de proveedor | Adaptadores de servidor e interfaces internas; la interfaz Yellow Duxn permanece estable. |

## 11. Entregables de desarrollo sugeridos

Cuando se inicie la construcción, cada módulo debe entregar su manifiesto, esquema de datos, migraciones aisladas, rutas, pruebas de permisos, catálogo de eventos, estados de interfaz y guía de soporte. Esta lista permite que un módulo se revise e integre sin obligar al equipo a completar el resto de la suite.

| Entregable | Obligatorio antes de integrar |
|---|---|
| Manifiesto registrado y bandera de funcionalidad | Sí |
| Propiedad de datos y migraciones del módulo | Sí |
| Matriz de permisos del módulo | Sí |
| Contratos API y eventos versionados | Sí |
| Pruebas de autorización, idempotencia y estados | Sí para acciones críticas |
| Vistas de carga, vacío, error y sin acceso | Sí |
| Auditoría de operaciones sensibles | Sí |
| Analítica de producto no sensible | Sí |

---

**Conclusión de diseño:** Yellow Duxn puede ofrecer herramientas completas de afiliación, creación, atribución, analítica y recompensas como un solo ecosistema. La separación ocurre en la arquitectura, los permisos y las fronteras de datos; la experiencia para la persona usuaria sigue siendo una aplicación coherente y sin descargas adicionales.
