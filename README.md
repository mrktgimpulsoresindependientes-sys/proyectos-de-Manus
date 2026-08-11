# Yellow Duxn — Suite Nativa de Afiliación

Este repositorio contiene el diseño separado de las herramientas nativas para **Yellow Duxn**, la evolución de Yellow Duck. La propuesta mantiene todas las capacidades dentro de una sola aplicación: los usuarios pueden crear contenido, descubrir ofertas, generar atribución, administrar vitrinas, coordinar campañas, analizar resultados y revisar sus comisiones sin instalar aplicaciones adicionales.

> La separación propuesta es **arquitectónica y funcional**, no una separación de experiencia: los módulos se integran en el shell principal de Yellow Duxn con sesión, navegación, permisos, notificaciones y sistema de diseño compartidos.

| Documento | Contenido |
|---|---|
| [Arquitectura funcional](docs/arquitectura-herramientas-nativas-yellow-duxn.md) | Alcance, módulos, roles, límites, eventos y arquitectura integrada. |
| [Diseño de módulos y flujos](docs/diseno-modulos-y-flujos-yellow-duxn.md) | Pantallas, navegación, estados, acciones y recorridos de usuario por herramienta. |
| [Especificación de integración MVP](docs/especificacion-integracion-mvp-yellow-duxn.md) | Estructura de paquetes, modelos, APIs, eventos, banderas y plan de entrega. |
| [Flujo UX/UI detallado de STUDIO](docs/ux-ui-flujo-studio-yellow-duxn.md) | Arquitectura de información, pantallas, recorridos, accesibilidad y criterios de aceptación del editor nativo. |

## Herramientas diseñadas

| Módulo | Capacidad nativa |
|---|---|
| **STUDIO** | Creación y publicación de contenido comercial responsable. |
| **MARKET** | Catálogo de ofertas, condiciones y solicitudes de afiliación. |
| **LINKS** | Enlaces, códigos y atribución de recomendaciones. |
| **SHOWCASE** | Vitrinas y colecciones nativas compartibles. |
| **CAMPAIGNS** | Coordinación de campañas, materiales y tareas. |
| **PULSE** | Métricas de alcance, clics, conversiones y atribución. |
| **WALLET** | Movimientos, comisiones y retiros con trazabilidad. |
| **COMMUNITY** | Comunidades, retos, recursos y colaboración. |

## Orden de implementación propuesto

El MVP empieza por los cimientos compartidos y el recorrido básico de oferta, enlace y contenido. Después añade medición, billetera con libro mayor, campañas y comunidades. Las integraciones de pagos reales quedan al final, tras definir el territorio y los requisitos operativos correspondientes.

La hoja de ruta completa y los criterios de aceptación se encuentran en la [especificación de integración MVP](docs/especificacion-integracion-mvp-yellow-duxn.md).
