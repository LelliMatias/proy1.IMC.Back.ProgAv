
# Proyecto NestJS + React con Vite

Las tecnologias que utilizamos brindadas por la catedra son: **NestJS** en el backend y **React con Vite** en el frontend. Este documento es una guia para poder poner en funcionamiento el **backend**
---

## Tecnologías utilizadas

- **Backend:** NestJS, TypeScript
- **Testing:** Jest (para pruebas unitarias)
- **Gestión de dependencias:** npm / yarn
- **Base de datos:** (Postgres 1era parte)

---

## Estructura del proyecto

```text
.
├── 2025_proyecto1_back_imc/          # BACKEND
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── module/imc/
│   │   └── app.controller.spec.ts
│   │   └── app.service.spec.ts

```

# Configuración del Proyecto NestJS + React (Vite)

Instrucciones para la configuracion del proyecto
---

## Backend (NestJS)

### 1. Instalar dependencias

```bash
cd backend
npm install
# o
yarn install


```
### 2. Ejecutar en modo desarrollador
```bash
npm run start:dev
# o
yarn start:dev

```
El backend correrá en http://localhost:3000.
### 3. Ejecutar pruebas unitarias
```bash
npm run test
# o
yarn test
```

## Despliegue
### 1. Construimos el backend
```bash
cd backend
npm run build
# o
yarn build
```
### 2. Desplegamos el backend
```bash
npm run start
# o
yarn start
```

### Posibles Issues
| Issue                                               | Causa                                            | Solución                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Error: EADDRINUSE al iniciar servidor**           | El puerto 3000 ya está en uso                    | Cambiar el puerto en `main.ts` (`app.listen(otroPuerto)`) o cerrar el proceso que ocupa el puerto: `lsof -i :3000` y `kill -9 <PID>` |
| **Error de CORS al conectar con frontend**          | Frontend intenta hacer requests a otro puerto    | Habilitar CORS en `main.ts`: `app.enableCors()` o configurar dominios específicos                                                    |
| **Pruebas unitarias fallan**                        | Jest mal configurado o imports incorrectos       | Revisar que `jest` y `ts-jest` estén instalados; verificar paths de imports; usar `npm run test:debug` para más info                 |
| **Métodos de prueba no detectan errores esperados** | Jest `toThrow()` no detecta la excepción         | Usar `jest.spyOn()` para simular el error y probar manejo de excepciones                                                             |

