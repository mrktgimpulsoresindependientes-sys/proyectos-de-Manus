# Activación de integraciones de Ducktors

Ducktors ya incluye los flujos internos de sincronización, disponibilidad, reserva atómica, confirmación, agenda, cola de notificaciones y ejecución programada de recordatorios. **No se debe activar ningún conector con datos ficticios**: la puesta en marcha requiere credenciales autorizadas y pruebas sobre servicios reales.

## Credenciales requeridas

| Integración | Variables requeridas | Finalidad |
|---|---|---|
| Yellow Duxn | `YELLOW_DUXN_CATALOG_BASE_URL`, `YELLOW_DUXN_CATALOG_PATH`, `YELLOW_DUXN_CATALOG_API_KEY` | Consultar profesionales, datos de contacto y disponibilidades reales. |
| Yellow Duxn | `YELLOW_DUXN_AUTH_HEADER`, `YELLOW_DUXN_AUTH_SCHEME` | Opcionales; permiten adaptar el encabezado de autenticación al contrato oficial. Por defecto se usa `Authorization: Bearer <token>`. |
| Correo | `EMAIL_PROVIDER`, `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM_ADDRESS` | Enviar confirmaciones y recordatorios. El adaptador preparado admite `EMAIL_PROVIDER=resend`. |

> La fuente Yellow Duxn debe devolver un objeto con `professionals` y `slots`. Cada profesional requiere identificador, nombre, tipo, especialidades y ciudad. Para que se envíen confirmaciones al profesional, el registro debe incluir `contactEmail`.

## Secuencia de activación

1. Cargar las credenciales de Yellow Duxn y del proveedor de correo mediante la configuración segura del proyecto.
2. Confirmar el contrato de respuesta de Yellow Duxn contra un entorno autorizado y ejecutar la sincronización administrativa del directorio.
3. Revisar perfiles, zonas horarias, modalidades y horarios importados. Sólo perfiles publicados y horarios futuros con estado `available` quedan reservables.
4. Cargar un proveedor de correo real y realizar una reserva de prueba con una cuenta de paciente y una cuenta profesional autorizadas.
5. Desplegar Ducktors. Desde una cuenta administradora, activar el trabajo **appointment-reminders**; su callback protegido procesará la cola cada hora en UTC.
6. Verificar la entrega de una confirmación y un recordatorio en el proveedor de correo. Las entregas quedan registradas de forma idempotente por cita, destinatario y tipo.

## Pruebas externas pendientes

| Prueba | Resultado esperado |
|---|---|
| Sincronización Yellow Duxn | Perfiles y horarios autorizados se crean o actualizan sin duplicados. |
| Reserva concurrente | Sólo una persona consigue confirmar un mismo horario. |
| Confirmación por correo | Paciente y profesional reciben un aviso no clínico tras confirmar la cita. |
| Recordatorio programado | El trabajo protegido procesa únicamente citas confirmadas y entregas vencidas. |
| Fallo de proveedor | La cola registra el fallo y no marca la entrega como enviada. |

El asistente de Ducktors continúa limitado a orientación operativa y no ofrece diagnósticos, atención de urgencias ni indicaciones clínicas.
